# GitHub Copilot Instructions

このプロジェクトは、**Astroで構築されたWindows Forms風UIコンポーネントライブラリ**です。
日本語のドキュメントとデモページを含み、学習目的で作成されています。

---

## プロジェクト概要

### 技術スタック
- **Astro 5.x**: 静的サイトジェネレーター
- **TypeScript**: 型安全性
- **MDX**: マークダウン + コンポーネント
- Windows Forms風デザインシステム

### ディレクトリ構造
```
src/
├── components/ui/    # 再利用可能なUIコンポーネント
├── layouts/          # ページレイアウト（BaseLayout.astro）
└── pages/            # デモページ（.astro または .mdx）
```

---

## コンポーネント使用ルール

### 1. Import文は常にこの形式で記述

```astro
---
import Button from '../components/ui/Button.astro';
import Label from '../components/ui/Label.astro';
import TextBox from '../components/ui/TextBox.astro';
import FlowLayout from '../components/ui/FlowLayout.astro';
import Container from '../components/ui/Container.astro';
---
```

**注意**: 相対パスは現在のファイルの位置に応じて調整してください。

---

### 2. レイアウトには FlowLayout を優先的に使用

**推奨**: 自動配置で柔軟性が高い
```astro
<FlowLayout direction="vertical" gap={10}>
  <Label>名前:</Label>
  <TextBox placeholder="入力してください" />
</FlowLayout>
```

**非推奨**: 座標指定が必要な場合のみ Container を使用
```astro
<Container x={100} y={50}>
  <Button>ボタン</Button>
</Container>
```

---

### 3. ボタングループは必ず FlowLayout で右寄せ

```astro
<FlowLayout gap={10} justify="end">
  <Button>キャンセル</Button>
  <Button variant="primary">保存</Button>
</FlowLayout>
```

---

### 4. フォームフィールドは縦方向の FlowLayout でグループ化

```astro
<FlowLayout direction="vertical" gap={5}>
  <Label>ユーザー名:</Label>
  <TextBox placeholder="ユーザー名" width={300} />
</FlowLayout>
```

---

### 5. グループボックスには GroupBox を使用

```astro
<GroupBox title="ユーザー情報">
  <FlowLayout direction="vertical" gap={10} padding={15}>
    <Label>名前:</Label>
    <TextBox />
  </FlowLayout>
</GroupBox>
```

---

## 利用可能なコンポーネント一覧

### レイアウト
- **FlowLayout**: 自動配置（横/縦）
  - Props: `direction`, `gap`, `align`, `justify`, `wrap`, `padding`, `background`, `border`
- **Container**: 絶対座標配置
  - Props: `x`, `y`, `width`, `height`, `padding`, `background`, `border`
- **GroupBox**: 枠付きグループ
  - Props: `title`, `width`, `height`

### 基本コンポーネント
- **Button**: ボタン
  - Props: `variant` (`default`, `primary`, `flat`), `disabled`
- **Label**: テキストラベル
  - Props: `bold`, `align`
- **TextBox**: テキスト入力
  - Props: `type`, `placeholder`, `disabled`, `width`
- **CheckBox**: チェックボックス
  - Props: `label`, `checked`, `disabled`
- **RadioButton**: ラジオボタン
  - Props: `label`, `name`, `value`, `checked`, `disabled`
- **ComboBox**: ドロップダウンリスト
  - Props: `options` (配列), `disabled`, `width`
- **NumericUpDown**: 数値入力
  - Props: `min`, `max`, `step`, `value`, `disabled`, `width`
- **ProgressBar**: プログレスバー
  - Props: `value`, `max`, `width`, `height`, `variant`

### その他
- **TabControl** / **TabPage**: タブコントロール
- **MenuBar** / **Menu** / **MenuItem**: メニュー
- **MessageBox**: メッセージボックス
- **UIBuilder**: JSON駆動のUI生成

詳細は `/component-catalog` を参照してください。

---

## よくあるパターン

### パターン1: ログインフォーム

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import FlowLayout from '../components/ui/FlowLayout.astro';
import Label from '../components/ui/Label.astro';
import TextBox from '../components/ui/TextBox.astro';
import Button from '../components/ui/Button.astro';
import CheckBox from '../components/ui/CheckBox.astro';
---

<BaseLayout title="ログイン">
  <FlowLayout direction="vertical" gap={15} padding={30} width={400} background="#fff" border={true}>
    <!-- ユーザー名 -->
    <FlowLayout direction="vertical" gap={5}>
      <Label>ユーザー名:</Label>
      <TextBox placeholder="ユーザー名" width="100%" />
    </FlowLayout>

    <!-- パスワード -->
    <FlowLayout direction="vertical" gap={5}>
      <Label>パスワード:</Label>
      <TextBox type="password" placeholder="パスワード" width="100%" />
    </FlowLayout>

    <!-- チェックボックス -->
    <CheckBox label="ログイン状態を保持" />

    <!-- ボタングループ -->
    <FlowLayout gap={10} justify="end">
      <Button>キャンセル</Button>
      <Button variant="primary">ログイン</Button>
    </FlowLayout>
  </FlowLayout>
</BaseLayout>
```

---

### パターン2: 設定画面

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import FlowLayout from '../components/ui/FlowLayout.astro';
import GroupBox from '../components/ui/GroupBox.astro';
import CheckBox from '../components/ui/CheckBox.astro';
import Label from '../components/ui/Label.astro';
import ComboBox from '../components/ui/ComboBox.astro';
import Button from '../components/ui/Button.astro';
---

<BaseLayout title="設定">
  <FlowLayout direction="vertical" gap={20} padding={20}>
    <!-- 通知設定グループ -->
    <GroupBox title="通知設定">
      <FlowLayout direction="vertical" gap={10} padding={15}>
        <CheckBox label="メール通知を受け取る" checked={true} />
        <CheckBox label="プッシュ通知を受け取る" />
        <CheckBox label="サウンドを再生" />
      </FlowLayout>
    </GroupBox>

    <!-- 表示設定グループ -->
    <GroupBox title="表示設定">
      <FlowLayout direction="vertical" gap={10} padding={15}>
        <FlowLayout align="center" gap={10}>
          <Label>テーマ:</Label>
          <ComboBox options={["ライト", "ダーク", "自動"]} width={150} />
        </FlowLayout>
      </FlowLayout>
    </GroupBox>

    <!-- ボタングループ -->
    <FlowLayout gap={10} justify="end">
      <Button>リセット</Button>
      <Button>キャンセル</Button>
      <Button variant="primary">保存</Button>
    </FlowLayout>
  </FlowLayout>
</BaseLayout>
```

---

### パターン3: データ一覧画面

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import FlowLayout from '../components/ui/FlowLayout.astro';
import Button from '../components/ui/Button.astro';
import TextBox from '../components/ui/TextBox.astro';
import Label from '../components/ui/Label.astro';
---

<BaseLayout title="ユーザー一覧">
  <FlowLayout direction="vertical" gap={15} padding={20}>
    <!-- 検索バー -->
    <FlowLayout gap={10} align="center">
      <Label>検索:</Label>
      <TextBox placeholder="名前で検索" width={300} />
      <Button>検索</Button>
    </FlowLayout>

    <!-- ツールバー -->
    <FlowLayout gap={10}>
      <Button variant="primary">新規追加</Button>
      <Button>編集</Button>
      <Button>削除</Button>
    </FlowLayout>

    <!-- データテーブル（HTML tableを使用） -->
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th>ID</th>
          <th>名前</th>
          <th>メール</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>山田太郎</td>
          <td>yamada@example.com</td>
          <td>
            <FlowLayout gap={5}>
              <Button variant="flat">編集</Button>
              <Button variant="flat">削除</Button>
            </FlowLayout>
          </td>
        </tr>
      </tbody>
    </table>
  </FlowLayout>
</BaseLayout>
```

---

### パターン4: ウィザード形式（ステップ）

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import FlowLayout from '../components/ui/FlowLayout.astro';
import TabControl from '../components/ui/TabControl.astro';
import TabPage from '../components/ui/TabPage.astro';
import Label from '../components/ui/Label.astro';
import TextBox from '../components/ui/TextBox.astro';
import Button from '../components/ui/Button.astro';
---

<BaseLayout title="新規登録ウィザード">
  <FlowLayout direction="vertical" gap={20} padding={20}>
    <TabControl>
      <TabPage label="ステップ1: 基本情報">
        <FlowLayout direction="vertical" gap={10} padding={20}>
          <Label>名前を入力してください</Label>
          <TextBox width={300} />
        </FlowLayout>
      </TabPage>

      <TabPage label="ステップ2: 詳細情報">
        <FlowLayout direction="vertical" gap={10} padding={20}>
          <Label>メールアドレスを入力してください</Label>
          <TextBox type="email" width={300} />
        </FlowLayout>
      </TabPage>

      <TabPage label="ステップ3: 確認">
        <FlowLayout direction="vertical" gap={10} padding={20}>
          <Label>入力内容を確認してください</Label>
        </FlowLayout>
      </TabPage>
    </TabControl>

    <!-- ナビゲーションボタン -->
    <FlowLayout gap={10} justify="space-between">
      <Button>戻る</Button>
      <FlowLayout gap={10}>
        <Button>キャンセル</Button>
        <Button variant="primary">次へ</Button>
      </FlowLayout>
    </FlowLayout>
  </FlowLayout>
</BaseLayout>
```

---

## MDXファイルでの使用

MDXファイル（.mdx）でもコンポーネントを使用できます：

```mdx
---
layout: ../layouts/BaseLayout.astro
title: デモページ
---
import Button from '../components/ui/Button.astro';
import FlowLayout from '../components/ui/FlowLayout.astro';

# デモページ

通常のマークダウンとコンポーネントを混在できます。

<FlowLayout gap={10}>
  <Button>ボタン1</Button>
  <Button variant="primary">ボタン2</Button>
</FlowLayout>

マークダウンのテキストも書けます。
```

---

## UIBuilder（JSON駆動）の使用

画像からUIを生成する場合や、動的にUIを構築する場合は UIBuilder を使用：

```astro
---
import UIBuilder from '../components/ui/UIBuilder.astro';

const uiSchema = {
  type: "FlowLayout",
  props: {
    direction: "vertical",
    gap: 10,
    padding: 20
  },
  children: [
    { type: "Label", text: "名前:" },
    { type: "TextBox", props: { placeholder: "入力", width: 300 } },
    { type: "Button", text: "送信", props: { variant: "primary" } }
  ]
};
---

<UIBuilder schema={uiSchema} />
```

詳細は `/uibuilder-demo` と `/component-catalog` を参照してください。

---

## コーディング規約

### 1. Props の指定
- 数値は `{}` で囲む: `gap={10}`, `width={300}`
- 文字列はダブルクォート: `variant="primary"`
- ブール値は `{true}` または属性のみ: `disabled={true}` or `disabled`

### 2. インデント
- 2スペース（プロジェクト全体で統一）

### 3. コンポーネントのネスト
- 深すぎるネストは避ける（最大3-4階層）
- 複雑な構造は別コンポーネントに分割

### 4. スタイル
- インラインスタイルは最小限に
- Windows Forms風のデザインを維持
- コンポーネントのpropsで調整可能な場合はpropsを使用

---

## 参考ドキュメント

- `/component-catalog` - 全コンポーネントのリファレンス
- `/image-to-ui-guide` - 画像からUI実装ガイド
- `/uibuilder-demo` - UIBuilder使用例
- `docs/copilot-examples.md` - より詳しいサンプルコード集
- `templates/` - すぐ使えるテンプレート集

---

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動（http://localhost:4321）
npm run build    # ビルド（型チェック含む）
npm run preview  # ビルド後のプレビュー
```

---

## 注意事項

1. **日本語がメインの言語**です
2. このプロジェクトは**学習目的**であり、本番環境での使用は想定していません
3. **Windows Forms風のデザイン**を維持してください
4. コンポーネントの追加・変更時は必ずデモページも作成してください

---

## Copilotへのリクエスト例

### 新しいページを作成する場合
```
このプロジェクトのコンポーネントを使って、ユーザープロフィール編集画面を作ってください。
FlowLayoutを使い、名前、メール、電話番号の入力欄と、保存・キャンセルボタンを配置してください。
```

### 既存のコードをリファクタリングする場合
```
このコードをFlowLayoutを使ってリファクタリングしてください。
Containerの絶対座標ではなく、自動配置にしてください。
```

### UIBuilderのJSONを生成する場合
```
このUIをUIBuilder用のJSON形式に変換してください。
/component-catalog のJSON例を参照してください。
```
