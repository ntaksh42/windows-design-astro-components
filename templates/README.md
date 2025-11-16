# テンプレート集

すぐに使えるページテンプレート集です。新しいページを作成する際のベースとして活用してください。

---

## 使い方

### 1. テンプレートをコピー

```bash
# ログインフォームを作成
cp templates/login-form.astro src/pages/my-login.astro

# 設定画面を作成
cp templates/settings-page.astro src/pages/my-settings.astro

# データ一覧を作成
cp templates/data-list.astro src/pages/my-list.astro
```

### 2. インポートパスを修正

コピー後、ファイル内のインポートパスを修正してください：

**修正前**:
```astro
import BaseLayout from '../src/layouts/BaseLayout.astro';
import FlowLayout from '../src/components/ui/FlowLayout.astro';
```

**修正後**:
```astro
import BaseLayout from '../layouts/BaseLayout.astro';
import FlowLayout from '../components/ui/FlowLayout.astro';
```

### 3. カスタマイズ

テンプレートを元に、プロジェクトに合わせてカスタマイズしてください。

---

## 利用可能なテンプレート

### login-form.astro
**説明**: ログインフォーム
**含まれる要素**:
- ユーザー名入力欄
- パスワード入力欄
- 「ログイン状態を保持」チェックボックス
- ログイン・キャンセルボタン
- パスワードリセットリンク

**用途**: ログイン画面、認証画面

---

### settings-page.astro
**説明**: 設定画面
**含まれる要素**:
- 通知設定グループ（チェックボックス）
- 表示設定グループ（テーマ、フォントサイズ、言語）
- プライバシー設定グループ
- 保存・キャンセル・リセットボタン

**用途**: ユーザー設定、アプリケーション設定、環境設定

---

### data-list.astro
**説明**: データ一覧画面
**含まれる要素**:
- 検索バー（テキスト入力 + 検索・クリアボタン）
- ツールバー（新規追加、編集、削除、エクスポート、更新）
- データテーブル（チェックボックス、複数カラム、操作ボタン）
- ページネーション

**用途**: ユーザー一覧、商品一覧、注文一覧など

---

## Tips

### 1. BaseLayoutの活用

全てのテンプレートは `BaseLayout` を使用しています。これにより：
- 共通のナビゲーション
- 共通のスタイル
- レスポンシブ対応

が自動的に適用されます。

---

### 2. FlowLayoutでレイアウト

テンプレートは `FlowLayout` を中心に構成されています：

```astro
<!-- 縦方向に並べる -->
<FlowLayout direction="vertical" gap={15}>
  <!-- コンテンツ -->
</FlowLayout>

<!-- ボタンを右寄せ -->
<FlowLayout gap={10} justify="end">
  <Button>キャンセル</Button>
  <Button variant="primary">保存</Button>
</FlowLayout>
```

---

### 3. カスタマイズのポイント

#### タイトル変更
```astro
<BaseLayout title="新しいタイトル">
```

#### 色の変更
```astro
<FlowLayout background="#f5f5f5">  <!-- 背景色 -->
```

#### サイズ調整
```astro
<FlowLayout width={500}>  <!-- 幅を500pxに -->
```

#### 間隔調整
```astro
<FlowLayout gap={20}>  <!-- 要素間の間隔を20pxに -->
```

---

## GitHub Copilotとの連携

これらのテンプレートは GitHub Copilot が参照できるように設計されています。

### 使い方

1. テンプレートをコピー
2. GitHub Copilot に「このフォームに電話番号フィールドを追加して」などと指示
3. Copilot がテンプレートの構造を理解し、適切なコードを生成

---

## さらなるカスタマイズ

### コンポーネントの追加

利用可能なコンポーネント:
- Button, Label, TextBox, CheckBox, RadioButton
- ComboBox, NumericUpDown, ProgressBar
- TabControl, TabPage, GroupBox
- MenuBar, Menu, MenuItem

詳細は `/component-catalog` を参照してください。

---

### UIBuilder（JSON駆動）

より動的なUIが必要な場合は、UIBuilder を検討してください：

```astro
import UIBuilder from '../components/ui/UIBuilder.astro';

const uiSchema = { /* JSON定義 */ };
---

<UIBuilder schema={uiSchema} />
```

詳細は `/uibuilder-demo` を参照してください。

---

## 関連ドキュメント

- `.github/copilot-instructions.md` - GitHub Copilot向け指示
- `docs/copilot-examples.md` - より詳細なサンプルコード集
- `/component-catalog` - 全コンポーネントリファレンス
- `/image-to-ui-guide` - 画像からUI実装ガイド

---

ハッピーコーディング！
