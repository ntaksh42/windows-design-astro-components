# Astro入門ガイド

## 目次
1. [Astroとは](#astroとは)
2. [Astroの主な特徴](#astroの主な特徴)
3. [プロジェクト構造](#プロジェクト構造)
4. [.astroファイルの基本](#astroファイルの基本)
5. [コンポーネントの作り方](#コンポーネントの作り方)
6. [ルーティング](#ルーティング)
7. [スタイリング](#スタイリング)
8. [静的サイト生成とSSR](#静的サイト生成とssr)

---

## Astroとは

**Astro**は、高速なWebサイトを構築するための**モダンなWebフレームワーク**です。

### なぜAstroが注目されているのか？

- **デフォルトでJavaScriptゼロ**: 必要な部分だけJavaScriptを使う
- **超高速**: 静的HTMLを生成するため、ページの読み込みが非常に速い
- **フレームワーク非依存**: React、Vue、Svelteなど、好きなUIフレームワークを組み合わせ可能
- **開発者体験**: シンプルで学びやすい構文

---

## Astroの主な特徴

### 1. アイランドアーキテクチャ

Astroは「アイランドアーキテクチャ」という概念を採用しています。

```
┌─────────────────────────────────┐
│   静的なHTML (JavaScriptなし)    │
│  ┌─────────┐      ┌─────────┐  │
│  │ Island  │      │ Island  │  │ ← 必要な部分だけインタラクティブ
│  │ (JS有)  │      │ (JS有)  │  │
│  └─────────┘      └─────────┘  │
└─────────────────────────────────┘
```

- ページの大部分は静的HTML
- インタラクティブな部分だけJavaScriptを読み込む
- 結果: 高速で軽量なサイト

### 2. ゼロJavaScriptデフォルト

```astro
---
// このコードはサーバーサイドで実行される
const greeting = "こんにちは";
---

<h1>{greeting}</h1>  <!-- 静的HTMLとして出力 -->
```

### 3. 部分的ハイドレーション

必要な時だけJavaScriptを読み込む:

```astro
---
import InteractiveButton from './InteractiveButton.jsx';
---

<!-- client:loadで、このコンポーネントだけJavaScriptを読み込む -->
<InteractiveButton client:load />
```

---

## プロジェクト構造

```
astro-components/
│
├── public/                    # 静的ファイル（そのまま配信される）
│   ├── favicon.ico
│   ├── images/
│   └── fonts/
│
├── src/                       # ソースコード
│   │
│   ├── components/            # 再利用可能なコンポーネント
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   └── Header.astro
│   │
│   ├── layouts/               # ページレイアウト
│   │   ├── BaseLayout.astro
│   │   └── BlogLayout.astro
│   │
│   ├── pages/                 # ページ（ルーティング）
│   │   ├── index.astro        # → /
│   │   ├── about.astro        # → /about
│   │   └── blog/
│   │       └── post.astro     # → /blog/post
│   │
│   └── styles/                # グローバルスタイル
│       └── global.css
│
├── astro.config.mjs           # Astro設定ファイル
├── tsconfig.json              # TypeScript設定
└── package.json
```

### 各ディレクトリの役割

| ディレクトリ | 説明 |
|------------|------|
| `public/` | 画像、フォント、faviconなど。ビルド時にそのままルートにコピーされる |
| `src/components/` | ボタン、カードなど、再利用するコンポーネント |
| `src/layouts/` | ページ全体のレイアウト（ヘッダー、フッター、共通構造） |
| `src/pages/` | **重要**: ファイル名がURLになる（ファイルベースルーティング） |
| `src/styles/` | CSSファイル（任意） |

---

## .astroファイルの基本

Astroファイルは3つの部分で構成されます:

```astro
---
// 1. フロントマター（---で囲まれた部分）
// サーバーサイドで実行されるJavaScript/TypeScript
const pageTitle = "マイページ";
const items = ["りんご", "バナナ", "みかん"];

// データ取得も可能
const response = await fetch('https://api.example.com/data');
const data = await response.json();
---

<!-- 2. HTMLテンプレート -->
<html lang="ja">
  <head>
    <title>{pageTitle}</title>
  </head>
  <body>
    <h1>{pageTitle}</h1>

    <!-- JSXのような構文が使える -->
    <ul>
      {items.map(item => (
        <li>{item}</li>
      ))}
    </ul>
  </body>
</html>

<!-- 3. スタイル（オプション） -->
<style>
  h1 {
    color: blue;
    font-size: 2rem;
  }
</style>
```

### フロントマターの特徴

- **サーバーサイドのみで実行**: ブラウザには送信されない
- **async/awaitが使える**: API呼び出し、ファイル読み込みなど
- **セキュア**: APIキーなどの秘密情報を安全に扱える

```astro
---
// このコードはビルド時/リクエスト時にサーバーで実行
const API_KEY = import.meta.env.SECRET_API_KEY; // 安全
const data = await fetchData(API_KEY);
---

<div>{data.title}</div>
```

---

## コンポーネントの作り方

### 基本的なコンポーネント

**src/components/Card.astro**
```astro
---
// プロパティの型定義
interface Props {
  title: string;
  description: string;
  imageUrl?: string;
}

const { title, description, imageUrl } = Astro.props;
---

<div class="card">
  {imageUrl && <img src={imageUrl} alt={title} />}
  <h2>{title}</h2>
  <p>{description}</p>
</div>

<style>
  .card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
  }

  .card h2 {
    margin-top: 0;
    color: #333;
  }

  .card img {
    width: 100%;
    border-radius: 4px;
  }
</style>
```

### コンポーネントの使用

**src/pages/index.astro**
```astro
---
import Card from '../components/Card.astro';
---

<html lang="ja">
  <body>
    <Card
      title="Astro入門"
      description="Astroを学ぼう"
      imageUrl="/images/astro-logo.png"
    />

    <Card
      title="コンポーネント作成"
      description="再利用可能なパーツを作る"
    />
  </body>
</html>
```

### スロットの使用

コンポーネント内にコンテンツを挿入できます:

**src/components/Container.astro**
```astro
---
interface Props {
  width?: 'narrow' | 'wide' | 'full';
}

const { width = 'narrow' } = Astro.props;
---

<div class={`container ${width}`}>
  <slot /> <!-- ここに子要素が入る -->
</div>

<style>
  .container.narrow { max-width: 600px; }
  .container.wide { max-width: 1200px; }
  .container.full { max-width: 100%; }
</style>
```

**使用例:**
```astro
<Container width="wide">
  <h1>タイトル</h1>
  <p>ここに任意のコンテンツ</p>
</Container>
```

---

## ルーティング

Astroは**ファイルベースルーティング**を採用しています。

### 基本的なルーティング

```
src/pages/
├── index.astro          → /
├── about.astro          → /about
├── contact.astro        → /contact
└── blog/
    ├── index.astro      → /blog
    ├── post-1.astro     → /blog/post-1
    └── post-2.astro     → /blog/post-2
```

### 動的ルーティング

**src/pages/blog/[slug].astro**
```astro
---
// 動的パラメータを取得
const { slug } = Astro.params;

// slugに基づいてデータ取得
const post = await getPostBySlug(slug);
---

<h1>{post.title}</h1>
<div>{post.content}</div>
```

アクセス例:
- `/blog/my-first-post` → `slug = "my-first-post"`
- `/blog/astro-tutorial` → `slug = "astro-tutorial"`

### 静的パスの生成

```astro
---
// ビルド時にどのパスを生成するか指定
export async function getStaticPaths() {
  return [
    { params: { slug: 'post-1' } },
    { params: { slug: 'post-2' } },
    { params: { slug: 'post-3' } },
  ];
}

const { slug } = Astro.params;
---

<h1>記事: {slug}</h1>
```

---

## スタイリング

Astroでは複数のスタイリング方法があります。

### 1. スコープ付きスタイル（推奨）

```astro
<div class="card">
  <h2>タイトル</h2>
</div>

<style>
  /* このスタイルはこのコンポーネント内でのみ有効 */
  .card {
    background: white;
    padding: 1rem;
  }

  h2 {
    color: blue; /* 他のh2には影響しない */
  }
</style>
```

### 2. グローバルスタイル

**src/styles/global.css**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}
```

**使用:**
```astro
---
import '../styles/global.css';
---
```

### 3. インラインスタイル

```astro
---
const primaryColor = "#3b82f6";
---

<div style={`background-color: ${primaryColor}; padding: 1rem;`}>
  コンテンツ
</div>
```

### 4. CSS変数

```astro
<div class="themed">
  <p>テーマカラー</p>
</div>

<style>
  .themed {
    --primary: #3b82f6;
    --secondary: #8b5cf6;

    background: var(--primary);
    color: white;
  }
</style>
```

---

## 静的サイト生成とSSR

### 静的サイト生成（SSG）- デフォルト

```bash
npm run build
```

- ビルド時にすべてのページをHTMLに変換
- 高速で、CDNでホスティング可能
- ブログ、ドキュメント、ポートフォリオに最適

### サーバーサイドレンダリング（SSR）

**astro.config.mjs**
```javascript
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',  // SSRモード
  adapter: node({ mode: 'standalone' }),
});
```

- リクエストごとにHTMLを生成
- 動的なコンテンツ、認証が必要なサイトに最適

---

## まとめ

### Astroの基本原則

1. **静的HTML優先**: デフォルトでJavaScriptなし
2. **必要な時だけJS**: `client:*`ディレクティブで制御
3. **ファイルベースルーティング**: ファイル構造がURLになる
4. **コンポーネント指向**: 再利用可能なパーツを作る
5. **スコープ付きCSS**: スタイルの衝突を防ぐ

### 開発フロー

```
1. src/pages/ にページを作成
   ↓
2. src/components/ にコンポーネントを作成
   ↓
3. スタイルを追加（<style>タグ）
   ↓
4. npm run dev で動作確認
   ↓
5. npm run build でビルド
```

### 次のステップ

- 実際にコンポーネントを作ってみる
- レイアウトを使ってページを統一する
- 動的ルーティングを試す
- 好きなUIフレームワークを統合する

---

## 参考リンク

- [公式ドキュメント](https://docs.astro.build/)
- [Astro公式チュートリアル](https://docs.astro.build/ja/tutorial/0-introduction/)
- [Astroテーマ集](https://astro.build/themes/)

---

**作成日**: 2025年11月8日
**対象**: Astro初学者
