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

### 4. 画面設計

解析結果から既存コンポーネントの組み合わせを決定：

**重要**: 新しいコンポーネントは作成しない。必ず既存コンポーネントのみを使用する。

設計方針：
- キャプチャのレイアウトに最も近いコンポーネント構成を選択
- Container、FlowLayout、Panelを使って配置を再現
- GroupBoxで論理的なグループ化を行う
- 複雑なレイアウトはSplitContainerで分割

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

### 7. 結果の報告

ユーザーに以下を報告：
- 解析した画面要素の概要
- 使用した既存コンポーネントのリスト
- 生成された画面ファイルのパス
- 元画像と比較した再現度と差異
- アクセスURL: `http://localhost:4321/screen-{name}`
- `npm run dev`で確認するよう案内

## 解析のガイドライン

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

- **垂直配置**: FlowLayout（direction="vertical"）
- **水平配置**: FlowLayout（direction="horizontal"）
- **グリッド**: Container + CSS Grid
- **フォームレイアウト**: ラベル + 入力フィールドの組み合わせ

### 色の抽出

- 背景色、テキスト色、ボーダー色を16進数カラーコードで記録
- Windows Forms標準色との対応を考慮：
  * グレー系グラデーション: `#f0f0f0` → `#e5e5e5`
  * プライマリブルー: `#007acc` → `#005a9e`
  * ボーダー: `#adadad`

### サイズの推定

- 相対的なサイズ関係を維持
- Windows Forms標準サイズを参考：
  * ボタン高さ: 24px（small）、28px（medium）、32px（large）
  * テキストボックス高さ: 24px（標準）
  * 余白: 8px、12px、16px等の4の倍数

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
