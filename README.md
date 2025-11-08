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

### 推奨学習順序

1. まず[Astro入門ガイド](./docs/astro-guide.md)でAstroの全体像を把握
2. [Astro文法リファレンス](./docs/astro-syntax.md)で実際の書き方を学ぶ
3. [プロジェクト構造ガイド](./docs/project-structure.md)で開発の進め方を理解

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
