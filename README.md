# Astro Components

Astroで作る再利用可能なコンポーネント集です。学習しながら、実用的なコンポーネントライブラリを構築していきます。

## 開始方法

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:4321` にアクセスしてください。

### ビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

## ドキュメント

### 学習ガイド

- [Astro入門ガイド](./docs/astro-guide.md) - Astroの基本的な使い方と仕組み
- [Astro文法リファレンス](./docs/astro-syntax.md) - Astroの文法を網羅的に解説
- [プロジェクト構造ガイド](./docs/project-structure.md) - このプロジェクトの構造と開発方法

### AI仕様書生成ツール ✨

このプロジェクトには、**自然言語またはExcelメモからPC アプリ風の外部仕様書を自動生成する**ツールが含まれています。

#### 方法1: 自然言語から生成

```bash
# npmコマンドで実行
npm run spec:generate "コンポーネント名" "説明"

# Claude Codeのスラッシュコマンドで実行（推奨）
/spec-generate
```

**使用例:**
```bash
# ScrollBarコンポーネントの仕様書を生成
npm run spec:generate "ScrollBar" "縦横両対応のスクロールバー、マウスホイール対応"

# 既存コンポーネントを参考にして生成
npm run spec:generate "SearchBox" "検索用入力欄" "form" "TextBox"
```

#### 方法2: Excelメモから生成 📊 NEW!

既存のExcelやCSVファイルから仕様書を生成できます。

```bash
# npmコマンドで実行
npm run spec:from-excel "<Excelファイルパス>"

# Claude Codeのスラッシュコマンドで実行（推奨）
/spec-from-excel
```

**使用例:**
```bash
# CSVファイルから生成
npm run spec:from-excel "./specs/DatePicker.csv"

# Excelファイルの特定シートから生成
npm run spec:from-excel "./specs/components.xlsx" "DatePicker"
```

**Excelテンプレート:** [templates/excel-spec/](./templates/excel-spec/) にサンプルがあります。

**詳細は [AI仕様書生成ツール使用ガイド](./docs/spec-generator-guide.md) を参照してください。**

### 推奨学習順序

1. まず[Astro入門ガイド](./docs/astro-guide.md)でAstroの全体像を把握
2. [Astro文法リファレンス](./docs/astro-syntax.md)で実際の書き方を学ぶ
3. [プロジェクト構造ガイド](./docs/project-structure.md)で開発の進め方を理解
4. [AI仕様書生成ツール](./docs/spec-generator-guide.md)で効率的な開発フローを習得

## プロジェクト構造

```
astro-components/
├── docs/              # ドキュメント
├── public/            # 静的ファイル
├── src/
│   ├── components/    # コンポーネント本体
│   ├── layouts/       # レイアウト
│   ├── pages/         # デモページ
│   └── styles/        # スタイル
└── README.md
```

## コンポーネント一覧

現在作成中です。以下のコンポーネントを追加予定:

- [ ] ボタン
- [ ] カード
- [ ] モーダル
- [ ] アコーディオン
- [ ] フォーム要素

## 技術スタック

- [Astro](https://astro.build/) - Webフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全性
- [Vite](https://vitejs.dev/) - ビルドツール

## ライセンス

ISC
