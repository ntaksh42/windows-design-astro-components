---
name: component-from-capture
description: 画像キャプチャ（直接貼り付けまたはファイルパス指定）から既存のWindows Forms風Astroコンポーネントを組み合わせて画面ページを自動生成します。UIデザインを解析し、レイアウト、色、サイズ、テキストを再現した画面を作成します。
allowed-tools: "Read, Write, Edit, Glob, Grep, Bash"
---

# キャプチャから画面ページ作成

このスキルは、画像ファイルからUIデザインを解析し、既存のWindows Forms風Astroコンポーネントを組み合わせて画面ページを自動生成します。

## 実行手順

### 1. 画像ファイルの取得

ユーザーに画像の提供方法を確認：

**方法A: 画像を直接貼り付け（推奨）**
- 「画像を直接チャットに貼り付けてください（コピー＆ペースト）」
- ユーザーが画像を貼り付けると、システムが自動的に一時ファイルとして保存
- そのファイルパスが提供されるので、Read toolで読み込む

**方法B: ファイルパスを指定**
- 「キャプチャ画像のファイルパスを入力してください（PNG、JPG、JPEG対応）」
- 絶対パスまたはプロジェクトからの相対パスを受け取る

### 2. 画像の読み込みと解析

- Read toolを使用して画像ファイルを読み込む
- 画像から以下の要素を識別・解析：
  * **UI要素の種類**（ボタン、テキストボックス、ラベル、チェックボックス等）
  * **レイアウト構造**（配置、間隔、整列）
  * **色・スタイル**（背景色、テキスト色、ボーダー）
  * **サイズ**（幅、高さ、余白）
  * **テキスト内容**（ラベル、ボタンテキスト等）
  * **インタラクション要素**（フォームフィールド、ボタン等）

### 3. 既存コンポーネントの確認

必ず最初に利用可能な既存コンポーネントをGlobで確認：

```bash
Glob pattern: src/components/ui/*.astro
```

利用可能な主なコンポーネント：
- **基本**: Button, Label, TextBox, CheckBox, RadioButton, ComboBox
- **レイアウト**: Container, FlowLayout, Panel, GroupBox, SplitContainer
- **入力**: NumericUpDown, DateTimePicker, TrackBar, RichTextBox
- **表示**: ProgressBar, TabControl/TabPage, TreeView, ListBox, PictureBox
- **データ**: DataGridView
- **メニュー**: MenuBar, Menu, MenuItem, ContextMenu, ToolStrip, StatusStrip

### 3.5. コンポーネントのProps確認

使用予定のコンポーネントのPropsを確認：

**手順：**
1. 使用するコンポーネントファイルをReadで読み込む
2. `interface Props { ... }` セクションからProps定義を抽出
3. 利用可能なprops（variant、size、disabled等）とそのデフォルト値を把握
4. JSDocコメントから各propsの説明を理解

**例：**
```typescript
// Button.astro から抽出
interface Props {
  variant?: 'default' | 'primary' | 'flat';  // ボタンスタイル
  disabled?: boolean;  // 無効化
  type?: 'button' | 'submit' | 'reset';  // ボタンタイプ
}
```

これにより正確なprops指定が可能になり、エラーを防止できます。

### 3.6. 既存デモページの参照

類似レイアウトの実装例を参照：

**手順：**
1. `src/pages/*-demo.{astro,mdx}` をGlobで一覧取得
2. キャプチャと類似したレイアウトのデモページを特定
3. Readでデモページを読み込み、以下を学習：
   - コンポーネントの組み合わせ方
   - レイアウト用コンポーネント（Container、FlowLayout等）の使い方
   - スタイル適用の方法
   - props設定の実例

**参照が有用なケース：**
- フォームレイアウト → `textbox-demo.mdx`, `checkbox-demo.mdx`
- メニュー構造 → `menubar-demo.mdx`, `contextmenu-demo.mdx`
- データ表示 → `datagridview-demo.mdx`, `listbox-demo.mdx`
- 分割レイアウト → `splitcontainer-demo.mdx`

### 4. 画面設計

解析結果から既存コンポーネントの組み合わせを決定：

**重要**: 新しいコンポーネントは作成しない。必ず既存コンポーネントのみを使用する。

設計方針：
- キャプチャのレイアウトに最も近いコンポーネント構成を選択
- Container、FlowLayout、Panelを使って配置を再現
- GroupBoxで論理的なグループ化を行う
- 複雑なレイアウトはSplitContainerで分割

### 4.5. 設計プレビューとユーザー確認

**重要**: 実装前にユーザーに設計を確認してもらう：

**提示する内容：**
1. **使用するコンポーネントリスト**
   - 各UI要素に対応するコンポーネント名
   - 主要なprops設定（variant、size等）

2. **レイアウト構造の説明**
   ```
   Container
   └─ FlowLayout (direction="vertical")
      ├─ GroupBox (title="ユーザー情報")
      │  ├─ Label: "名前"
      │  ├─ TextBox
      │  └─ ...
      └─ FlowLayout (direction="horizontal")
         ├─ Button (variant="primary"): "保存"
         └─ Button: "キャンセル"
   ```

3. **再現が困難な要素とその代替案**
   - 例：「カスタムグラデーション → 標準のButton variantで代替」
   - 例：「複雑なアニメーション → 静的な表示のみ」

4. **ユーザーに確認を求める**
   - 「この設計で進めてよろしいですか？」
   - 修正要望があれば設計を調整
   - 承認を得てから実装開始

### 5. 画面ページファイルの作成

ファイルパス: `src/pages/screen-{name}.astro`

**必須要素：**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
// 必要な既存コンポーネントをimport
import Button from '../components/ui/Button.astro';
import Label from '../components/ui/Label.astro';
// ... 他のコンポーネント

const pageTitle = '{画面名}';
---

<BaseLayout title={pageTitle}>
  <h1>{pageTitle}</h1>

  <div class="screen-description">
    <p>この画面はキャプチャから再現されました。</p>
  </div>

  <!-- ここにコンポーネントを組み合わせて画面を構築 -->
  <Container>
    <!-- レイアウトとコンポーネント -->
  </Container>

  <style>
    /* 画面固有のスタイル（必要に応じて） */
  </style>
</BaseLayout>
```

**コンポーネント配置のポイント：**
- キャプチャの視覚的構造を忠実に再現
- 適切なProps（variant、disabled、value等）を設定
- レスポンシブを考慮したレイアウト
- Windows Forms風のスタイルを維持

### 6. ナビゲーションへの追加

- `src/layouts/BaseLayout.astro`のnavセクションにリンクを追加
- 形式: `<a href="/screen-{name}">{日本語名}画面</a>`

### 6.5. 実装後の検証

生成したコードを自動検証し、エラーを修正：

**検証手順：**

1. **構文チェック（必須）**
   ```bash
   npm run build
   ```
   - TypeScriptの型エラーをチェック
   - Astroの構文エラーをチェック
   - 出力を解析してエラーがあれば修正

2. **Import文の検証**
   - 使用したコンポーネントがすべてimportされているか確認
   - import元のパスが正しいか確認（`../components/ui/`）
   - 未使用のimportがないか確認

3. **Props名の正確性チェック**
   - コンポーネントに渡しているpropsが存在するか確認
   - props名のスペルミスをチェック
   - 必須propsが設定されているか確認

4. **閉じタグの確認**
   - すべての開きタグに対応する閉じタグがあるか
   - セルフクロージングタグ（`<Component />`）の正確性
   - スロットの正しい使用

5. **エラー修正の優先順位**
   - 致命的エラー（ビルド失敗）→ 最優先で修正
   - 型エラー → 次に修正
   - 警告 → 可能なら修正

**自動修正の例：**

```typescript
// エラー例1: importの欠落
// エラー: Button is not defined
// 修正: import Button from '../components/ui/Button.astro'; を追加

// エラー例2: props名の誤り
// エラー: Property 'varient' does not exist. Did you mean 'variant'?
// 修正: varient="primary" → variant="primary"

// エラー例3: 閉じタグの欠落
// エラー: Expected closing tag for <FlowLayout>
// 修正: </FlowLayout> を追加
```

**検証結果の報告：**
- ビルド成功/失敗を報告
- 修正したエラーの数と内容を報告
- 未解決のエラーがあればユーザーに報告

### 7. 結果の報告

ユーザーに以下を報告：
- 解析した画面要素の概要
- 使用した既存コンポーネントのリスト
- 生成された画面ファイルのパス
- 元画像と比較した再現度と差異
- アクセスURL: `http://localhost:4321/screen-{name}`
- `npm run dev`で確認するよう案内

### 8. フィードバックと反復改善

初回生成後、ユーザーのフィードバックに基づいて段階的に改善：

**フィードバックの収集：**

1. **ユーザーに確認を促す**
   - 「生成した画面を確認していただけますか？」
   - 「改善したい点があればお知らせください」

2. **フィードバックのカテゴリー**
   - **レイアウト**: 配置、間隔、サイズの調整
   - **コンポーネント**: 別のコンポーネントへの変更
   - **スタイル**: 色、フォント、ボーダー等の調整
   - **機能**: 追加のインタラクションや動作
   - **コンテンツ**: テキストやラベルの修正

**反復改善のプロセス：**

```
ステップ1: ユーザーからフィードバックを受け取る
   ↓
ステップ2: フィードバックを分析し、修正内容を明確化
   ↓
ステップ3: 修正箇所を特定し、変更計画を提示
   ↓
ステップ4: ユーザーの承認を得る
   ↓
ステップ5: Editツールで該当箇所を修正
   ↓
ステップ6: 検証（npm run build）
   ↓
ステップ7: 修正結果を報告
   ↓
ステップ8: 追加のフィードバックがあれば繰り返し
```

**改善例：**

```
ユーザー: 「ボタンがもっと大きい方がいいです」
→ Button のサイズを調整、またはsize propsを追加

ユーザー: 「入力フィールドの間隔が狭い」
→ FlowLayoutのgap値を増やす（8px → 12px or 16px）

ユーザー: 「保存ボタンを目立たせたい」
→ variant="default" → variant="primary" に変更

ユーザー: 「この部分はGroupBoxで囲みたい」
→ 該当部分をGroupBoxで囲むように修正
```

**反復の終了条件：**
- ユーザーが満足した場合
- ユーザーが「これで完成です」と明示した場合
- 3回以上の反復でこれ以上の改善が困難な場合

## 解析のガイドライン

### コンポーネント選択のデシジョンツリー

UI要素を識別したら、以下のデシジョンツリーで最適なコンポーネントを選択：

**ステップ1: 要素の目的を特定**
```
1. テキスト表示のみ？
   YES → Label
   NO → ステップ2へ

2. ボタンまたはクリック可能？
   YES → ステップ2-1へ
   NO → ステップ3へ

2-1. ボタンの種類は？
   - 通常のボタン → Button (variant: 'default' / 'primary' / 'flat')
   - メニュー項目 → MenuItem
   - ツールバー内 → Button (size: 'small')

3. 入力フィールド？
   YES → ステップ3-1へ
   NO → ステップ4へ

3-1. 入力の種類は？
   - 1行テキスト → TextBox
   - 複数行テキスト → RichTextBox
   - 数値のみ → NumericUpDown
   - 日付/時刻 → DateTimePicker
   - パスワード → TextBox (type="password")

4. 選択UI？
   YES → ステップ4-1へ
   NO → ステップ5へ

4-1. 選択の種類は？
   - 単一選択（少数の選択肢） → RadioButton
   - 単一選択（多数の選択肢） → ComboBox or ListBox
   - 複数選択（チェック形式） → CheckBox
   - 複数選択（リスト形式） → ListBox (selectionMode="multiple")

5. コンテナ・レイアウト？
   YES → ステップ5-1へ
   NO → ステップ6へ

5-1. コンテナの種類は？
   - グループ化（枠線+タイトル） → GroupBox
   - 自由配置 → Panel or Container
   - フロー配置 → FlowLayout
   - 分割 → SplitContainer
   - タブ切り替え → TabControl + TabPage

6. データ表示？
   YES → ステップ6-1へ
   NO → ステップ7へ

6-1. データ表示の種類は？
   - 表形式 → DataGridView
   - リスト → ListBox
   - ツリー構造 → TreeView
   - 画像 → PictureBox
   - 進捗状況 → ProgressBar
   - スライダー → TrackBar

7. メニュー・ナビゲーション？
   YES → ステップ7-1へ
   NO → 最も近いコンポーネントを選択

7-1. メニューの種類は？
   - メニューバー → MenuBar + Menu + MenuItem
   - コンテキストメニュー → ContextMenu + MenuItem
   - ツールバー → ToolStrip
   - ステータスバー → StatusStrip
```

### UI要素の識別

| 視覚的特徴 | 対応コンポーネント |
|-----------|------------------|
| 矩形 + テキスト + グラデーション背景 | Button |
| 矩形 + 白背景 + ボーダー + テキスト入力 | TextBox |
| テキストのみ | Label |
| 小さな四角 + チェックマーク | CheckBox |
| 小さな円 + ドット | RadioButton |
| ドロップダウン矢印付きフィールド | ComboBox |
| 上下矢印付き数値フィールド | NumericUpDown |
| 水平/垂直プログレスバー | ProgressBar |
| タブヘッダー + コンテンツエリア | TabControl |
| 枠線 + タイトル付きグループ | GroupBox |
| 階層構造のリスト | TreeView |

### レイアウトパターン

キャプチャから以下のパターンを識別し、対応するコンポーネント構造を使用：

#### 1. フォームパターン（ラベル+入力フィールドの縦並び）
```astro
<FlowLayout direction="vertical" gap="12px">
  <Label>名前</Label>
  <TextBox placeholder="名前を入力" />
  <Label>メールアドレス</Label>
  <TextBox type="email" />
  <FlowLayout direction="horizontal" gap="8px">
    <Button variant="primary">保存</Button>
    <Button>キャンセル</Button>
  </FlowLayout>
</FlowLayout>
```

#### 2. マスター詳細パターン（左リスト、右詳細）
```astro
<SplitContainer orientation="vertical" initialPosition={250}>
  <ListBox slot="panel1" items={[...]} />
  <Container slot="panel2">
    <!-- 詳細表示エリア -->
  </Container>
</SplitContainer>
```

#### 3. ダッシュボードパターン（グリッド状のカード配置）
```astro
<Container>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
    <GroupBox title="統計1">...</GroupBox>
    <GroupBox title="統計2">...</GroupBox>
    <GroupBox title="統計3">...</GroupBox>
    <GroupBox title="統計4">...</GroupBox>
  </div>
</Container>
```

#### 4. ツールバー+コンテンツパターン（上部ツールバー、下部メイン）
```astro
<FlowLayout direction="vertical" gap="0">
  <ToolStrip>
    <Button>新規</Button>
    <Button>開く</Button>
    <Button>保存</Button>
  </ToolStrip>
  <Container style="flex: 1;">
    <!-- メインコンテンツ -->
  </Container>
  <StatusStrip>
    <Label>準備完了</Label>
  </StatusStrip>
</FlowLayout>
```

#### 5. タブパターン（切り替え可能なコンテンツ）
```astro
<TabControl>
  <TabPage title="基本情報">...</TabPage>
  <TabPage title="詳細設定">...</TabPage>
  <TabPage title="その他">...</TabPage>
</TabControl>
```

#### 6. ウィザードパターン（ステップごとの入力）
```astro
<Container>
  <GroupBox title="ステップ1: 基本情報">
    <!-- ステップ1のフォーム -->
  </GroupBox>
  <FlowLayout direction="horizontal" gap="8px" style="margin-top: 16px;">
    <Button disabled>戻る</Button>
    <Button variant="primary">次へ</Button>
  </FlowLayout>
</Container>
```

### 色の抽出と標準化

**手順：**
1. キャプチャから背景色、テキスト色、ボーダー色を抽出
2. 抽出した色を最も近いWindows Forms標準色にマッピング
3. カスタム色が必要な場合でも、可能な限り標準色を使用

**Windows Forms標準色マッピング表：**

| 抽出色の範囲 | 標準色（16進数） | 用途 |
|------------|----------------|------|
| #f5f5f5 ~ #ffffff | `#f0f0f0` | 背景（明） |
| #e0e0e0 ~ #f0f0f0 | `#e5e5e5` | 背景（暗） |
| #000000 ~ #333333 | `#000000` | テキスト（通常） |
| #666666 ~ #999999 | `#6d6d6d` | テキスト（無効） |
| #a0a0a0 ~ #b5b5b5 | `#adadad` | ボーダー |
| #0060a0 ~ #0090ff | `#007acc` | プライマリ（明） |
| #004080 ~ #006090 | `#005a9e` | プライマリ（暗） |
| #d0d0d0 ~ #e0e0e0 | `#d9d9d9` | 無効化背景 |

**色の正規化ルール：**
- 抽出色の各RGB成分を最も近い標準色と比較
- 差異が20以内なら標準色を使用
- カスタム色を使う場合はコメントで理由を記述

**例：**
```astro
<!-- 抽出色: #f2f2f2 → 標準色 #f0f0f0 を使用（差異: 2） -->
<Button style="background: #f0f0f0;">ボタン</Button>

<!-- 抽出色: #ff5733 → カスタム色が必要（ブランドカラー） -->
<Button style="background: #ff5733;">特別なボタン</Button>
```

### サイズの推定と正規化

**手順：**
1. キャプチャからUI要素のサイズ（幅、高さ、余白）を推定
2. 相対的なサイズ関係を維持しながら、4pxの倍数に正規化
3. Windows Forms標準サイズに可能な限り合わせる

**Windows Forms標準サイズ：**

| 要素 | サイズ | 備考 |
|-----|-------|------|
| Button（高さ） | 24px（small）<br>28px（medium）<br>32px（large） | デフォルトは28px |
| TextBox（高さ） | 24px | 1行テキスト |
| Label（高さ） | 20px～24px | テキストサイズに依存 |
| CheckBox/RadioButton | 20px × 20px | チェック部分 |
| ComboBox（高さ） | 24px | TextBoxと同じ |
| 余白（gap） | 4px, 8px, 12px, 16px | 4の倍数 |
| パディング | 8px, 12px, 16px | 内側余白 |
| GroupBox境界 | 2px～4px | ボーダー幅 |

**サイズ正規化ルール：**
- 測定値を最も近い4の倍数に丸める
- 極端に小さい/大きい値は標準範囲に調整
- フォントサイズは12px, 14px, 16px, 18px等の偶数値

**正規化の例：**
```
抽出サイズ: 27px → 28px（4の倍数、標準ボタン高さ）
抽出サイズ: 10px → 12px（4の倍数）
抽出サイズ: 45px → 44px（4の倍数）
抽出余白: 7px → 8px（4の倍数）
抽出余白: 15px → 16px（4の倍数）
```

**レスポンシブ対応：**
- 絶対値（px）と相対値（%）を適切に使い分け
- コンテナは相対値、UI要素は絶対値を基本とする
- 画面幅に応じて調整が必要な場合はメディアクエリを使用

## 注意事項

- **絶対に新しいコンポーネントを作成しない** - 必ず既存コンポーネントのみを使用
- 完全な再現ではなく、既存コンポーネントで実現可能な範囲で再現する
- キャプチャが不鮮明な場合は推測箇所をユーザーに確認
- 複雑なUIは段階的に実装（まず基本構造、次に詳細）
- 既存コンポーネントのPropsを最大限活用（variant、disabled、size等）
- 既存コンポーネントで実現困難な要素は、最も近いコンポーネントで代替
- 必要に応じてユーザーに追加情報を質問（色の正確な値、動作仕様等）
- 画面ファイルは`src/pages/screen-{name}.astro`形式で作成（.mdxではなく.astro）

## エラーハンドリング

- 画像ファイルが存在しない場合: パスの再確認を促す
- 画像が読み込めない場合: ファイル形式を確認（PNG、JPG、JPEG対応）
- UI要素が識別できない場合: ユーザーに説明を求める
- 既存コンポーネントで実現困難な要素: 最も近いコンポーネントでの代替案を提示
- 複雑すぎるレイアウト: 段階的な実装を提案（基本構造→詳細）
