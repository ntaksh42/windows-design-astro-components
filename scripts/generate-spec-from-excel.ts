#!/usr/bin/env node
/**
 * Excelメモから PC アプリ風の外部仕様書を生成するスクリプト
 *
 * 使い方:
 *   npm run spec:from-excel <Excelファイルパス>
 *
 * 例:
 *   npm run spec:from-excel ./specs/DatePicker.xlsx
 *   npm run spec:from-excel ./specs/components.xlsx DatePicker
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数からAPIキーを取得（Claude API使用を想定）
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface ExcelComponentSpec {
  componentName: string;
  description: string;
  category?: string;
  properties?: Array<{
    name: string;
    type: string;
    default?: string;
    description?: string;
  }>;
  features?: string[];
  examples?: string[];
  notes?: string;
  rawData?: any; // Excelの生データ
}

/**
 * Excelファイルを読み込んで仕様情報を抽出
 */
function readExcelSpec(filePath: string, sheetName?: string): ExcelComponentSpec {
  if (!fs.existsSync(filePath)) {
    throw new Error(`ファイルが見つかりません: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const targetSheet = sheetName || workbook.SheetNames[0];

  if (!workbook.Sheets[targetSheet]) {
    throw new Error(`シート "${targetSheet}" が見つかりません`);
  }

  const worksheet = workbook.Sheets[targetSheet];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

  // Excelの構造を解析
  const spec: ExcelComponentSpec = {
    componentName: '',
    description: '',
    rawData: data
  };

  // パターン1: 縦型フォーマット（項目名, 値）
  let currentSection = '';
  const properties: any[] = [];
  const features: string[] = [];
  const examples: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const key = String(row[0] || '').trim();
    const value = row[1];

    // セクションヘッダーの検出
    if (key.includes('##') || key.includes('【')) {
      currentSection = key;
      continue;
    }

    // 基本情報の抽出
    if (key.match(/コンポーネント名|名前|Name/i) && value) {
      spec.componentName = String(value).trim();
    } else if (key.match(/説明|概要|Description/i) && value) {
      spec.description = String(value).trim();
    } else if (key.match(/カテゴリ|Category/i) && value) {
      spec.category = String(value).trim();
    } else if (key.match(/機能|Features?/i) && value) {
      features.push(String(value).trim());
    } else if (key.match(/例|Example/i) && value) {
      examples.push(String(value).trim());
    } else if (key.match(/備考|Note/i) && value) {
      spec.notes = String(value).trim();
    }

    // プロパティの抽出（プロパティセクション内）
    if (currentSection.match(/プロパティ|Property|Props/i)) {
      if (row.length >= 3 && key && !key.match(/^(プロパティ|Property)/i)) {
        properties.push({
          name: key,
          type: String(row[1] || 'string').trim(),
          default: row[2] ? String(row[2]).trim() : undefined,
          description: row[3] ? String(row[3]).trim() : undefined
        });
      }
    }
  }

  if (properties.length > 0) spec.properties = properties;
  if (features.length > 0) spec.features = features;
  if (examples.length > 0) spec.examples = examples;

  // パターン2: 横型フォーマット（テーブル形式）の検出
  if (!spec.componentName) {
    // ヘッダー行を探す
    for (let i = 0; i < Math.min(data.length, 10); i++) {
      const row = data[i];
      if (row && row.some((cell: any) => String(cell).match(/コンポーネント|Component|Name/i))) {
        // ヘッダー行が見つかった
        const headers = row.map((h: any) => String(h || '').trim());
        const nameIdx = headers.findIndex(h => h.match(/コンポーネント|Component|Name/i));
        const descIdx = headers.findIndex(h => h.match(/説明|Description/i));
        const categoryIdx = headers.findIndex(h => h.match(/カテゴリ|Category/i));

        // 次の行からデータを読む
        if (i + 1 < data.length) {
          const dataRow = data[i + 1];
          if (nameIdx >= 0 && dataRow[nameIdx]) {
            spec.componentName = String(dataRow[nameIdx]).trim();
          }
          if (descIdx >= 0 && dataRow[descIdx]) {
            spec.description = String(dataRow[descIdx]).trim();
          }
          if (categoryIdx >= 0 && dataRow[categoryIdx]) {
            spec.category = String(dataRow[categoryIdx]).trim();
          }
        }
        break;
      }
    }
  }

  return spec;
}

/**
 * Excel仕様からPC アプリ風仕様書を生成
 */
async function generateSpecFromExcel(excelSpec: ExcelComponentSpec): Promise<string> {
  const { componentName, description, category, properties, features, examples, notes, rawData } = excelSpec;

  // Excelデータをテキスト化
  const excelContent = `
## Excelメモの内容

### 基本情報
- コンポーネント名: ${componentName}
- 説明: ${description}
- カテゴリー: ${category || 'ui'}

${properties && properties.length > 0 ? `
### プロパティ
${properties.map(p => `- ${p.name} (${p.type})${p.default ? ` = ${p.default}` : ''}: ${p.description || ''}`).join('\n')}
` : ''}

${features && features.length > 0 ? `
### 機能
${features.map(f => `- ${f}`).join('\n')}
` : ''}

${examples && examples.length > 0 ? `
### 使用例
${examples.map(e => `- ${e}`).join('\n')}
` : ''}

${notes ? `
### 備考
${notes}
` : ''}

### 生データ（参考）
\`\`\`
${JSON.stringify(rawData?.slice(0, 20), null, 2)}
\`\`\`
  `.trim();

  const prompt = `
あなたはWindows Forms風UIコンポーネントの外部仕様書を作成する技術文書ライターです。

# 指示

以下のExcelメモをもとに、詳細なPC アプリケーション外部仕様書を作成してください。

${excelContent}

## 出力フォーマット

以下のJSON形式で、各セクションの内容を生成してください。
Excelメモに記載されていない情報は、コンポーネントの性質から推測して補完してください。

\`\`\`json
{
  "componentTitle": "Windows風コンポーネント名",
  "componentSlug": "component-demo",
  "purpose": "このコンポーネントの目的と役割（2-3文）",
  "targetUsers": "想定ユーザー（箇条書き）",
  "keyFeatures": "主要機能（箇条書き、Excelの機能欄を活用）",
  "visualDescription": "外観の説明（Windows Forms風デザイン）",
  "basicExample": "基本的な使用例のAstroコード",
  "designTokens": "使用する色・サイズなどのデザイントークン（表形式）",
  "propertiesTable": "プロパティ一覧のMarkdownテーブル行（Excelのプロパティ欄を活用）",
  "propertiesDetail": "各プロパティの詳細説明",
  "variations": "バリエーション（variant等）の説明とコード例",
  "stateTransitions": "状態遷移図または説明",
  "stateVisuals": "各状態（hover, active, disabled等）の外観とコード例",
  "userInteractions": "マウス操作時の動作仕様",
  "keyboardInteractions": "キーボード操作の仕様",
  "events": "発生するイベント一覧",
  "basicUsage": "基本的な使用例（Excelの使用例を活用）",
  "practicalExamples": "実用的な使用例（2-3パターン）",
  "commonPatterns": "よくある組み合わせパターン",
  "ariaAttributes": "ARIA属性の使用方法",
  "a11yKeyboard": "アクセシビリティ観点のキーボード操作",
  "a11yScreenReader": "スクリーンリーダー対応",
  "technicalConstraints": "技術的制約事項",
  "usageNotes": "使用上の注意点（Excelの備考欄を活用）",
  "knownIssues": "既知の問題",
  "relatedComponents": "関連コンポーネント",
  "references": "参考リンク",
  "cssImplementation": "CSS実装のポイント",
  "typescriptImplementation": "TypeScript実装のポイント"
}
\`\`\`

## 重要な指示

1. Windows Forms風のデザインシステムに従ってください
2. Excelメモの内容を最大限活用してください
3. 不足している情報は、コンポーネントの性質から合理的に推測して補完
4. 具体的で実用的な内容にしてください
5. 日本語で記述してください

JSONのみを出力し、それ以外の説明は含めないでください。
`;

  // Claude APIを呼び出し
  if (!ANTHROPIC_API_KEY) {
    console.log('⚠️  ANTHROPIC_API_KEY未設定のため、簡易テンプレートを使用します');
    return generateSimpleSpec(excelSpec);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const apiData = await response.json();
    const content = apiData.content[0].text;

    // JSONを抽出
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error('APIレスポンスからJSONを抽出できませんでした');
    }

    const specData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    return fillTemplate(specData);

  } catch (error) {
    console.error('AI生成エラー:', error);
    console.log('\n代替として、簡易テンプレートを使用します...\n');
    return generateSimpleSpec(excelSpec);
  }
}

/**
 * 簡易テンプレート生成（APIキーがない場合）
 */
function generateSimpleSpec(excelSpec: ExcelComponentSpec): string {
  const { componentName, description, category, properties, features, examples, notes } = excelSpec;

  // 既存のgenerate-spec.tsのテンプレート構造を利用
  const specData = {
    componentTitle: `Windows風${componentName}`,
    componentSlug: `${componentName.toLowerCase()}-demo`,
    purpose: description || `${componentName}を実現するコンポーネントです。`,
    targetUsers: '- デスクトップアプリケーション開発者\n- Windows Forms風UIを求めるWeb開発者',
    keyFeatures: (features && features.length > 0)
      ? features.map(f => `- ${f}`).join('\n')
      : `- ${description}\n- Windows Forms風の視覚デザイン\n- アクセシビリティ対応`,
    visualDescription: `Windows Forms アプリケーションの${componentName}と同様の外観を持ちます。`,
    basicExample: `<${componentName} />`,
    designTokens: '| 要素 | 値 | 説明 |\n|------|-----|------|\n| フォント | Segoe UI | Windows標準フォント |',
    propertiesTable: properties && properties.length > 0
      ? properties.map(p => `| \`${p.name}\` | ${p.type} | ${p.default || '-'} | ✗ | ${p.description || ''} |`).join('\n')
      : '| `variant` | string | "default" | ✗ | コンポーネントのバリエーション |',
    propertiesDetail: properties && properties.length > 0
      ? properties.map(p => `#### ${p.name}\n${p.description || `${p.name}を指定します。`}\n`).join('\n')
      : '各プロパティの詳細説明',
    variations: '### デフォルト\n<div style="margin: 2rem 0; padding: 2rem; background: #f0f0f0;">\n  <' + componentName + ' />\n</div>',
    stateTransitions: '```\n通常 → ホバー → アクティブ\n  ↓\n無効化\n```',
    stateVisuals: '### 通常状態\nデフォルトの外観\n\n### ホバー状態\nマウスカーソルを重ねると変化\n\n### 無効化状態\nグレーアウト',
    userInteractions: '- **マウスオーバー**: ホバー状態に遷移\n- **クリック**: アクティブ状態を経て、イベント発火',
    keyboardInteractions: 'Tabキー、Enterキーなどで操作可能',
    events: 'クリックイベント等',
    basicUsage: (examples && examples.length > 0)
      ? examples.map(e => `\`\`\`astro\n${e}\n\`\`\``).join('\n\n')
      : `\`\`\`astro\n<${componentName} />\n\`\`\``,
    practicalExamples: '実用的な使用例を記載',
    commonPatterns: 'よくある組み合わせパターン',
    ariaAttributes: 'ARIA属性の使用方法',
    a11yKeyboard: 'キーボードのみで操作可能',
    a11yScreenReader: 'スクリーンリーダー対応',
    technicalConstraints: '- Astro 5.x以上が必要',
    usageNotes: notes || '使用上の注意点',
    knownIssues: '既知の問題はありません',
    relatedComponents: '関連コンポーネント',
    references: '- [Windows Forms デザインガイドライン](https://learn.microsoft.com/ja-jp/dotnet/desktop/winforms/)',
    cssImplementation: 'CSS実装のポイント',
    typescriptImplementation: 'TypeScript実装のポイント'
  };

  return fillTemplate(specData);
}

/**
 * テンプレートにデータを埋め込む（generate-spec.tsと同じ）
 */
function fillTemplate(data: any): string {
  const SPEC_TEMPLATE = `---
layout: ../layouts/BaseLayout.astro
title: {COMPONENT_TITLE}
slug: {COMPONENT_SLUG}
---
import {COMPONENT_NAME} from '../components/ui/{COMPONENT_NAME}.astro';

# {COMPONENT_TITLE}

## 1. 概要

### 1.1 目的
{PURPOSE}

### 1.2 対象ユーザー
{TARGET_USERS}

### 1.3 主要機能
{KEY_FEATURES}

---

## 2. 外観仕様

### 2.1 基本デザイン

{VISUAL_DESCRIPTION}

<div style="margin: 2rem 0; padding: 2rem; background: #f0f0f0; display: flex; gap: 1rem; flex-wrap: wrap;">
  {BASIC_EXAMPLE}
</div>

\`\`\`astro
{BASIC_EXAMPLE}
\`\`\`

### 2.2 デザイントークン

{DESIGN_TOKENS}

---

## 3. プロパティ仕様

### 3.1 プロパティ一覧

| プロパティ | 型 | デフォルト値 | 必須 | 説明 |
|-----------|-----|------------|------|------|
{PROPERTIES_TABLE}

### 3.2 プロパティ詳細

{PROPERTIES_DETAIL}

---

## 4. バリエーション仕様

{VARIATIONS}

---

## 5. 状態仕様

### 5.1 状態遷移

{STATE_TRANSITIONS}

### 5.2 各状態の外観

{STATE_VISUALS}

---

## 6. 動作仕様

### 6.1 ユーザー操作

{USER_INTERACTIONS}

### 6.2 キーボード操作

{KEYBOARD_INTERACTIONS}

### 6.3 イベント仕様

{EVENTS}

---

## 7. 実装例

### 7.1 基本的な使用例

{BASIC_USAGE}

### 7.2 実用例

{PRACTICAL_EXAMPLES}

### 7.3 よくある組み合わせ

{COMMON_PATTERNS}

---

## 8. アクセシビリティ

### 8.1 ARIA属性

{ARIA_ATTRIBUTES}

### 8.2 キーボードナビゲーション

{A11Y_KEYBOARD}

### 8.3 スクリーンリーダー対応

{A11Y_SCREEN_READER}

---

## 9. 制約事項・注意事項

### 9.1 技術的制約

{TECHNICAL_CONSTRAINTS}

### 9.2 使用上の注意

{USAGE_NOTES}

### 9.3 既知の問題

{KNOWN_ISSUES}

---

## 10. 参考情報

### 10.1 関連コンポーネント

{RELATED_COMPONENTS}

### 10.2 参考リンク

{REFERENCES}

---

## 付録: 実装メモ

### CSS実装のポイント

{CSS_IMPLEMENTATION}

### TypeScript実装のポイント

{TYPESCRIPT_IMPLEMENTATION}
`;

  let result = SPEC_TEMPLATE;

  const replacements: Record<string, string> = {
    '{COMPONENT_NAME}': data.componentTitle.replace('Windows風', ''),
    '{COMPONENT_TITLE}': data.componentTitle,
    '{COMPONENT_SLUG}': data.componentSlug,
    '{PURPOSE}': data.purpose,
    '{TARGET_USERS}': data.targetUsers,
    '{KEY_FEATURES}': data.keyFeatures,
    '{VISUAL_DESCRIPTION}': data.visualDescription,
    '{BASIC_EXAMPLE}': data.basicExample,
    '{DESIGN_TOKENS}': data.designTokens,
    '{PROPERTIES_TABLE}': data.propertiesTable,
    '{PROPERTIES_DETAIL}': data.propertiesDetail,
    '{VARIATIONS}': data.variations,
    '{STATE_TRANSITIONS}': data.stateTransitions,
    '{STATE_VISUALS}': data.stateVisuals,
    '{USER_INTERACTIONS}': data.userInteractions,
    '{KEYBOARD_INTERACTIONS}': data.keyboardInteractions,
    '{EVENTS}': data.events,
    '{BASIC_USAGE}': data.basicUsage,
    '{PRACTICAL_EXAMPLES}': data.practicalExamples,
    '{COMMON_PATTERNS}': data.commonPatterns,
    '{ARIA_ATTRIBUTES}': data.ariaAttributes,
    '{A11Y_KEYBOARD}': data.a11yKeyboard,
    '{A11Y_SCREEN_READER}': data.a11yScreenReader,
    '{TECHNICAL_CONSTRAINTS}': data.technicalConstraints,
    '{USAGE_NOTES}': data.usageNotes,
    '{KNOWN_ISSUES}': data.knownIssues,
    '{RELATED_COMPONENTS}': data.relatedComponents,
    '{REFERENCES}': data.references,
    '{CSS_IMPLEMENTATION}': data.cssImplementation,
    '{TYPESCRIPT_IMPLEMENTATION}': data.typescriptImplementation
  };

  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(key, 'g'), value);
  }

  return result;
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log(`
使用法:
  npm run spec:from-excel <Excelファイルパス> [シート名]

例:
  npm run spec:from-excel ./specs/DatePicker.xlsx
  npm run spec:from-excel ./specs/components.xlsx "DatePicker"
  npm run spec:from-excel ./specs/requirements.csv

サポートファイル形式:
  - Excel (.xlsx, .xls)
  - CSV (.csv)

環境変数:
  ANTHROPIC_API_KEY: Claude APIキー（設定すると高品質な仕様書を生成）

Excelフォーマット例:

【縦型フォーマット】
| コンポーネント名 | DatePicker |
| 説明 | 日付選択コンポーネント |
| カテゴリー | form |
| ## プロパティ | |
| minDate | Date | 2000-01-01 | 最小日付 |
| maxDate | Date | 2100-12-31 | 最大日付 |

【横型フォーマット】
| コンポーネント名 | 説明 | カテゴリー |
| DatePicker | 日付選択 | form |
    `);
    process.exit(1);
  }

  const [excelPath, sheetName] = args;

  console.log('📊 Excelメモから仕様書を生成します...\n');
  console.log(`ファイル: ${excelPath}`);
  if (sheetName) console.log(`シート: ${sheetName}`);
  console.log('');

  try {
    // Excelを読み込み
    const excelSpec = readExcelSpec(excelPath, sheetName);

    if (!excelSpec.componentName) {
      console.error('❌ コンポーネント名が見つかりませんでした');
      console.log('\nExcelファイルに以下のいずれかを含めてください:');
      console.log('- "コンポーネント名" または "Name" という項目');
      console.log('- "Component" という列名');
      process.exit(1);
    }

    console.log(`✅ Excelメモを解析しました`);
    console.log(`   コンポーネント: ${excelSpec.componentName}`);
    console.log(`   説明: ${excelSpec.description || '(なし)'}`);
    if (excelSpec.properties) {
      console.log(`   プロパティ数: ${excelSpec.properties.length}`);
    }
    console.log('');

    // 仕様書を生成
    const spec = await generateSpecFromExcel(excelSpec);

    // ファイルに保存
    const outputPath = path.join(
      __dirname,
      '../src/pages',
      `${excelSpec.componentName.toLowerCase()}-demo.mdx`
    );

    fs.writeFileSync(outputPath, spec, 'utf-8');

    console.log(`✅ 仕様書を生成しました: ${outputPath}`);
    console.log('\n次のステップ:');
    console.log('1. 生成された仕様書をレビュー');
    console.log('2. 必要に応じて修正・追記');
    console.log(`3. 実装: src/components/ui/${excelSpec.componentName}.astro`);
    console.log(`4. 開発サーバーで確認: npm run dev`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

main().catch(console.error);
