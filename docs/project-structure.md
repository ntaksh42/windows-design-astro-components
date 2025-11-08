# プロジェクト構造ガイド

このドキュメントでは、`astro-components`プロジェクトの構造と各ファイルの役割を説明します。

---

## プロジェクト概要

このプロジェクトは、**Astroで再利用可能なコンポーネントライブラリを作成する**ことを目的としています。

---

## ディレクトリ構造

```
astro-components/
│
├── docs/                      # ドキュメント
│   ├── astro-guide.md         # Astro入門ガイド
│   └── project-structure.md   # このファイル
│
├── public/                    # 静的ファイル（そのまま配信）
│   ├── images/                # 画像ファイル
│   ├── fonts/                 # フォントファイル
│   └── favicon.ico            # ファビコン
│
├── src/                       # ソースコード
│   │
│   ├── components/            # コンポーネントライブラリ
│   │   ├── ui/                # UIコンポーネント
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   └── Modal.astro
│   │   │
│   │   ├── layout/            # レイアウト用コンポーネント
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── Sidebar.astro
│   │   │
│   │   └── form/              # フォーム関連
│   │       ├── Input.astro
│   │       ├── Select.astro
│   │       └── Checkbox.astro
│   │
│   ├── layouts/               # ページレイアウト
│   │   ├── BaseLayout.astro   # 基本レイアウト
│   │   └── DemoLayout.astro   # デモページ用レイアウト
│   │
│   ├── pages/                 # ページ（各コンポーネントのデモ）
│   │   ├── index.astro        # トップページ（一覧）
│   │   ├── button.astro       # ボタンのデモ
│   │   ├── card.astro         # カードのデモ
│   │   └── form.astro         # フォームのデモ
│   │
│   ├── styles/                # スタイル
│   │   ├── global.css         # グローバルスタイル
│   │   └── variables.css      # CSS変数（色、サイズなど）
│   │
│   └── utils/                 # ユーティリティ関数
│       └── helpers.ts         # ヘルパー関数
│
├── .gitignore                 # Git除外設定
├── astro.config.mjs           # Astro設定ファイル
├── package.json               # プロジェクト情報と依存関係
├── tsconfig.json              # TypeScript設定
└── README.md                  # プロジェクトの説明
```

---

## 各ファイル・ディレクトリの詳細

### `public/`

**用途**: ビルド時にそのまま配信される静的ファイル

```
public/
├── images/
│   └── logo.png        # /images/logo.png でアクセス
├── fonts/
│   └── custom.woff2    # /fonts/custom.woff2 でアクセス
└── favicon.ico         # /favicon.ico でアクセス
```

**使用例**:
```astro
<img src="/images/logo.png" alt="ロゴ" />
```

---

### `src/components/`

**用途**: 再利用可能なコンポーネントを配置

#### 推奨の整理方法

**カテゴリー別**に分ける:

```
components/
├── ui/           # ボタン、カード、バッジなど
├── layout/       # ヘッダー、フッター、グリッドなど
├── form/         # 入力フィールド、セレクト、チェックボックスなど
└── feedback/     # アラート、トースト、スピナーなど
```

**命名規則**:
- PascalCase: `Button.astro`, `UserCard.astro`
- 説明的な名前: `PrimaryButton.astro`, `BlogPostCard.astro`

**例**:
```
src/components/ui/Button.astro
src/components/ui/Card.astro
src/components/layout/Header.astro
src/components/form/Input.astro
```

---

### `src/layouts/`

**用途**: ページ全体の共通レイアウトを定義

#### BaseLayout.astro（基本レイアウト）

すべてのページで共通するHTML構造:

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = "" } = Astro.props;
---

<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <slot /> <!-- ページコンテンツが入る -->
  </body>
</html>
```

**使用例**:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="ボタンのデモ">
  <h1>ボタンコンポーネント</h1>
</BaseLayout>
```

---

### `src/pages/`

**用途**: 実際のページ（ファイル名がURLになる）

#### 重要ポイント

- `index.astro` → `/`（ルート）
- `about.astro` → `/about`
- `blog/post.astro` → `/blog/post`

#### このプロジェクトでの使い方

各コンポーネントのデモページを作成:

```
pages/
├── index.astro           # コンポーネント一覧
├── components/
│   ├── button.astro      # ボタンのデモ
│   ├── card.astro        # カードのデモ
│   └── modal.astro       # モーダルのデモ
```

**例（button.astro）**:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Button from '../components/ui/Button.astro';
---

<BaseLayout title="ボタンコンポーネント">
  <h1>ボタンのバリエーション</h1>

  <h2>プライマリボタン</h2>
  <Button variant="primary">クリック</Button>

  <h2>セカンダリボタン</h2>
  <Button variant="secondary">キャンセル</Button>
</BaseLayout>
```

---

### `src/styles/`

**用途**: グローバルスタイルとCSS変数

#### global.css（共通スタイル）

```css
/* リセット */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ベーススタイル */
body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f9fafb;
}
```

#### variables.css（CSS変数）

デザインシステムの基盤:

```css
:root {
  /* カラーパレット */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-success: #10b981;
  --color-danger: #ef4444;

  /* サイズ */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;

  /* ボーダー */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

**使用例**:
```astro
<style>
  .button {
    background: var(--color-primary);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
  }
</style>
```

---

### 設定ファイル

#### `astro.config.mjs`

Astroの設定:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  // サイトのURL（デプロイ時に設定）
  // site: 'https://example.com',

  // ベースパス（サブディレクトリでホスティングする場合）
  // base: '/my-components',

  // SSRモード（必要に応じて）
  // output: 'server',
});
```

#### `tsconfig.json`

TypeScriptの設定:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "astro"
  }
}
```

#### `package.json`

プロジェクトの依存関係とスクリプト:

```json
{
  "scripts": {
    "dev": "astro dev",      // 開発サーバー起動
    "build": "astro build",  // 本番用ビルド
    "preview": "astro preview" // ビルド後のプレビュー
  }
}
```

---

## 開発ワークフロー

### 1. 新しいコンポーネントを作る

```bash
# 例: ボタンコンポーネント
src/components/ui/Button.astro
```

### 2. デモページを作る

```bash
# ボタンのデモページ
src/pages/components/button.astro
```

### 3. 開発サーバーで確認

```bash
npm run dev
# http://localhost:4321/components/button にアクセス
```

### 4. ドキュメントを追加

```bash
# コンポーネントの使い方をREADMEに追加
docs/components/button.md
```

---

## コンポーネント作成のベストプラクティス

### 1. Propsの型定義を明確に

```astro
---
interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const { variant = 'primary', size = 'md', disabled = false } = Astro.props;
---
```

### 2. スタイルはコンポーネント内に

```astro
<button class="btn">クリック</button>

<style>
  .btn {
    /* スコープ付きスタイル */
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
  }
</style>
```

### 3. 再利用性を考える

```astro
<!-- 悪い例 -->
<button style="background: blue; padding: 10px;">送信</button>

<!-- 良い例 -->
<Button variant="primary" size="md">送信</Button>
```

---

## まとめ

### プロジェクトの目的

- 再利用可能なコンポーネントライブラリの作成
- 各コンポーネントのデモページで使い方を示す
- きれいに整理された構造を保つ

### 基本的なルール

1. `src/components/` にコンポーネント本体
2. `src/pages/` にデモページ
3. 1コンポーネント = 1ファイル
4. カテゴリー別にディレクトリを分ける
5. 型定義を必ず書く

---

**次のステップ**: [Astro入門ガイド](./astro-guide.md)を読んで、Astroの基本を理解しましょう!
