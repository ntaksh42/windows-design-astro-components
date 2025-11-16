#!/usr/bin/env node
/**
 * 自然言語からPC アプリ風の外部仕様書を生成するスクリプト
 *
 * 使い方:
 *   npm run spec:generate "コンポーネント名" "簡単な説明"
 *
 * 例:
 *   npm run spec:generate "ScrollBar" "縦横両対応のスクロールバー、マウスホイールにも対応"
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数からAPIキーを取得（Claude API使用を想定）
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface SpecGenerationOptions {
  componentName: string;
  description: string;
  category?: 'ui' | 'layout' | 'form' | 'feedback';
  baseOn?: string; // 参考にする既存コンポーネント名
}

/**
 * PC アプリ外部仕様書のテンプレート構造
 */
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

/**
 * Claude APIを使用して仕様書を生成
 */
async function generateSpecWithAI(options: SpecGenerationOptions): Promise<string> {
  const { componentName, description, category = 'ui', baseOn } = options;

  // 既存コンポーネントを参考にする場合、そのファイルを読み込む
  let referenceContent = '';
  if (baseOn) {
    const refDemoPath = path.join(__dirname, `../src/pages/${baseOn}-demo.mdx`);
    const refComponentPath = path.join(__dirname, `../src/components/ui/${baseOn}.astro`);

    if (fs.existsSync(refDemoPath)) {
      referenceContent += `\n参考デモページ:\n${fs.readFileSync(refDemoPath, 'utf-8')}\n`;
    }
    if (fs.existsSync(refComponentPath)) {
      referenceContent += `\n参考コンポーネント:\n${fs.readFileSync(refComponentPath, 'utf-8')}\n`;
    }
  }

  const prompt = `
あなたはWindows Forms風UIコンポーネントの外部仕様書を作成する技術文書ライターです。

# 指示

以下の情報をもとに、詳細なPC アプリケーション外部仕様書を作成してください。

## コンポーネント情報
- コンポーネント名: ${componentName}
- 説明: ${description}
- カテゴリー: ${category}

${referenceContent ? `## 参考にする既存仕様書・コンポーネント\n${referenceContent}` : ''}

## 出力フォーマット

以下のJSON形式で、各セクションの内容を生成してください：

\`\`\`json
{
  "componentTitle": "Windows風コンポーネント名",
  "componentSlug": "component-demo",
  "purpose": "このコンポーネントの目的と役割（2-3文）",
  "targetUsers": "想定ユーザー（箇条書き）",
  "keyFeatures": "主要機能（箇条書き）",
  "visualDescription": "外観の説明（Windows Forms風デザイン）",
  "basicExample": "基本的な使用例のAstroコード",
  "designTokens": "使用する色・サイズなどのデザイントークン（表形式）",
  "propertiesTable": "プロパティ一覧のMarkdownテーブル行",
  "propertiesDetail": "各プロパティの詳細説明",
  "variations": "バリエーション（variant等）の説明とコード例",
  "stateTransitions": "状態遷移図または説明",
  "stateVisuals": "各状態（hover, active, disabled等）の外観とコード例",
  "userInteractions": "マウス操作時の動作仕様",
  "keyboardInteractions": "キーボード操作の仕様（該当する場合）",
  "events": "発生するイベント一覧（該当する場合）",
  "basicUsage": "基本的な使用例のコードと説明",
  "practicalExamples": "実用的な使用例（2-3パターン）",
  "commonPatterns": "よくある組み合わせパターン",
  "ariaAttributes": "ARIA属性の使用方法",
  "a11yKeyboard": "アクセシビリティ観点のキーボード操作",
  "a11yScreenReader": "スクリーンリーダー対応",
  "technicalConstraints": "技術的制約事項",
  "usageNotes": "使用上の注意点",
  "knownIssues": "既知の問題（あれば）",
  "relatedComponents": "関連コンポーネント",
  "references": "参考リンク",
  "cssImplementation": "CSS実装のポイント",
  "typescriptImplementation": "TypeScript実装のポイント"
}
\`\`\`

## 重要な指示

1. Windows Forms風のデザインシステムに従ってください：
   - グラデーション背景とボーダーによる立体的な外観
   - ホバー・アクティブ・無効化状態の視覚的フィードバック
   - Segoe UIフォントファミリーの使用

2. Astroコンポーネントの記法に従ってください：
   - Props定義はTypeScriptインターフェース
   - スロットで子要素を受け取る
   - スコープ付きCSS

3. 具体的で実用的な内容にしてください：
   - 抽象的な説明は避け、具体例を豊富に
   - コード例はそのまま動作するもの
   - 実際のWindows Formsアプリケーションを想起させる使用例

4. 日本語で記述してください

JSONのみを出力し、それ以外の説明は含めないでください。
`;

  // Claude APIを呼び出し（実際の実装）
  if (!ANTHROPIC_API_KEY) {
    console.error('エラー: ANTHROPIC_API_KEY環境変数が設定されていません');
    console.log('\n代替として、ローカルテンプレートを使用します...\n');
    return generateSpecLocally(options);
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

    const data = await response.json();
    const content = data.content[0].text;

    // JSONを抽出
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error('APIレスポンスからJSONを抽出できませんでした');
    }

    const specData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    return fillTemplate(specData);

  } catch (error) {
    console.error('AI生成エラー:', error);
    console.log('\n代替として、ローカルテンプレートを使用します...\n');
    return generateSpecLocally(options);
  }
}

/**
 * ローカルテンプレートを使用した仕様書生成（APIキーがない場合のフォールバック）
 */
function generateSpecLocally(options: SpecGenerationOptions): string {
  const { componentName, description } = options;

  const specData = {
    componentTitle: `Windows風${componentName}`,
    componentSlug: `${componentName.toLowerCase()}-demo`,
    purpose: `${description}を実現するコンポーネントです。Windows Forms のデザイン言語に従い、使いやすいインターフェースを提供します。`,
    targetUsers: '- デスクトップアプリケーション開発者\n- Windows Forms風UIを求めるWeb開発者',
    keyFeatures: `- ${description}\n- Windows Forms風の視覚デザイン\n- 複数のバリエーションとサイズをサポート\n- アクセシビリティ対応`,
    visualDescription: `Windows Forms アプリケーションの${componentName}と同様の外観を持ちます。グラデーション背景、ボーダー、ホバー効果により立体的な印象を与えます。`,
    basicExample: `<${componentName} />\n<${componentName} variant="primary" />\n<${componentName} disabled />`,
    designTokens: '| 要素 | 値 | 説明 |\n|------|-----|------|\n| フォント | Segoe UI | Windows標準フォント |\n| ボーダー色 | #adadad | 標準ボーダー |\n| 背景 | linear-gradient | グラデーション背景 |',
    propertiesTable: '| `variant` | string | "default" | ✗ | コンポーネントのバリエーション |\n| `disabled` | boolean | false | ✗ | 無効化状態 |',
    propertiesDetail: '#### variant\nコンポーネントの外観バリエーションを指定します。\n- `default`: 標準スタイル\n- `primary`: 強調スタイル\n\n#### disabled\n無効化状態にします。ユーザー操作を受け付けなくなります。',
    variations: '### デフォルト\n<div style="margin: 2rem 0; padding: 2rem; background: #f0f0f0;">\n  <' + componentName + ' variant="default" />\n</div>\n\n### プライマリ\n<div style="margin: 2rem 0; padding: 2rem; background: #f0f0f0;">\n  <' + componentName + ' variant="primary" />\n</div>',
    stateTransitions: '```\n通常 → ホバー → アクティブ\n  ↓\n無効化\n```',
    stateVisuals: '### 通常状態\nデフォルトの外観\n\n### ホバー状態\nマウスカーソルを重ねると、背景色が変化\n\n### アクティブ状態\nクリック時、さらに濃い背景色に\n\n### 無効化状態\nグレーアウトし、操作不可',
    userInteractions: '- **マウスオーバー**: ホバー状態に遷移\n- **クリック**: アクティブ状態を経て、イベント発火',
    keyboardInteractions: '該当する場合は、Tabキー、Enterキーなどの操作を記載',
    events: '必要に応じて、onclick等のイベントを記載',
    basicUsage: '```astro\n<' + componentName + ' />\n```\n\n最もシンプルな使用例です。',
    practicalExamples: '### 例1: フォーム内での使用\n```astro\n<form>\n  <' + componentName + ' variant="primary" />\n</form>\n```\n\n### 例2: 複数配置\n```astro\n<div style="display: flex; gap: 1rem;">\n  <' + componentName + ' />\n  <' + componentName + ' variant="primary" />\n</div>\n```',
    commonPatterns: '- OKボタンとキャンセルボタンの組み合わせ\n- ツールバー内での使用',
    ariaAttributes: '必要に応じて、`aria-label`, `aria-disabled`などを設定します。',
    a11yKeyboard: 'キーボードのみで操作可能にします。',
    a11yScreenReader: 'スクリーンリーダーでコンテンツが適切に読み上げられるようにします。',
    technicalConstraints: '- Astro 5.x以上が必要\n- モダンブラウザでの動作を想定',
    usageNotes: '- 過度な使用は避け、UIの一貫性を保ってください\n- アクセシビリティを考慮した実装を心がけてください',
    knownIssues: '現時点で既知の問題はありません。',
    relatedComponents: `他の関連コンポーネント（Button, Label等）を参照してください。`,
    references: '- [Windows Forms デザインガイドライン](https://learn.microsoft.com/ja-jp/dotnet/desktop/winforms/)\n- [Astro公式ドキュメント](https://docs.astro.build/)',
    cssImplementation: '```css\n/* グラデーション背景 */\nbackground: linear-gradient(to bottom, #f0f0f0 0%, #e5e5e5 100%);\n\n/* ホバー効果 */\n:hover {\n  background: linear-gradient(to bottom, #e5f3ff 0%, #d0e9ff 100%);\n}\n```',
    typescriptImplementation: '```typescript\ninterface Props {\n  variant?: "default" | "primary";\n  disabled?: boolean;\n}\n```'
  };

  return fillTemplate(specData);
}

/**
 * テンプレートにデータを埋め込む
 */
function fillTemplate(data: any): string {
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

  if (args.length < 2) {
    console.log(`
使用法:
  npm run spec:generate <コンポーネント名> <説明> [カテゴリー] [参考コンポーネント]

例:
  npm run spec:generate "ScrollBar" "縦横両対応のスクロールバー"
  npm run spec:generate "DatePicker" "日付選択コンポーネント" "form" "ComboBox"

オプション:
  - カテゴリー: ui, layout, form, feedback (デフォルト: ui)
  - 参考コンポーネント: 既存コンポーネント名（そのデモページと実装を参考にします）

環境変数:
  ANTHROPIC_API_KEY: Claude APIキー（設定すると高品質な仕様書を生成）
    `);
    process.exit(1);
  }

  const [componentName, description, category, baseOn] = args;

  console.log('🚀 仕様書生成を開始します...\n');
  console.log(`コンポーネント: ${componentName}`);
  console.log(`説明: ${description}`);
  console.log(`カテゴリー: ${category || 'ui'}`);
  if (baseOn) console.log(`参考: ${baseOn}`);
  console.log('');

  const spec = await generateSpecWithAI({
    componentName,
    description,
    category: (category as any) || 'ui',
    baseOn
  });

  // ファイルに保存
  const outputPath = path.join(
    __dirname,
    '../src/pages',
    `${componentName.toLowerCase()}-demo.mdx`
  );

  fs.writeFileSync(outputPath, spec, 'utf-8');

  console.log(`✅ 仕様書を生成しました: ${outputPath}`);
  console.log('\n次のステップ:');
  console.log('1. 生成された仕様書をレビュー');
  console.log('2. 必要に応じて修正・追記');
  console.log(`3. 実装: src/components/ui/${componentName}.astro`);
  console.log(`4. 開発サーバーで確認: npm run dev`);
}

main().catch(console.error);
