# Astro文法リファレンス

Astroの文法を網羅的に解説したリファレンスガイドです。実践的なコード例とともに学べます。

---

## 目次

1. [ファイル構造](#ファイル構造)
2. [フロントマター](#フロントマター)
3. [テンプレート構文](#テンプレート構文)
4. [Props（プロパティ）](#propsプロパティ)
5. [スロット](#スロット)
6. [クライアントディレクティブ](#クライアントディレクティブ)
7. [スタイル](#スタイル)
8. [スクリプト](#スクリプト)
9. [特殊な構文とTips](#特殊な構文とtips)

---

## ファイル構造

Astroファイルは3つのセクションで構成されます:

```astro
---
// 1. フロントマター（Component Script）
// サーバーサイドで実行されるJavaScript/TypeScript
const message = "こんにちは";
---

<!-- 2. テンプレート（HTML） -->
<div>{message}</div>

<style>
  /* 3. スタイル（CSS） */
  div {
    color: blue;
  }
</style>

<script>
  // 4. クライアントスクリプト（オプション）
  console.log("ブラウザで実行");
</script>
```

---

## フロントマター

フロントマターは`---`で囲まれた部分で、**サーバーサイド**で実行されます。

### 基本的な使い方

```astro
---
// 変数定義
const title = "ページタイトル";
const count = 42;

// 配列
const items = ["りんご", "バナナ", "みかん"];

// オブジェクト
const user = {
  name: "田中太郎",
  age: 25,
  email: "tanaka@example.com"
};

// 関数
function greet(name: string) {
  return `こんにちは、${name}さん!`;
}
---

<h1>{title}</h1>
<p>{greet(user.name)}</p>
```

### async/awaitが使える

```astro
---
// API呼び出し
const response = await fetch('https://api.example.com/posts');
const posts = await response.json();

// ファイル読み込み
import { readFile } from 'node:fs/promises';
const content = await readFile('./data.txt', 'utf-8');

// データベースクエリ
import { db } from '../lib/database';
const users = await db.query('SELECT * FROM users');
---

<ul>
  {posts.map(post => (
    <li>{post.title}</li>
  ))}
</ul>
```

### インポート

```astro
---
// コンポーネントのインポート
import Button from '../components/Button.astro';
import Card from '../components/Card.astro';

// CSSのインポート
import '../styles/global.css';

// TypeScript/JavaScriptのインポート
import { formatDate } from '../utils/helpers';
import type { User } from '../types';

// JSONのインポート
import data from '../data/config.json';
---
```

### 環境変数

```astro
---
// PUBLIC_で始まる変数はクライアントでも使える
const apiUrl = import.meta.env.PUBLIC_API_URL;

// それ以外はサーバーサイドのみ
const apiKey = import.meta.env.SECRET_API_KEY;
---
```

---

## テンプレート構文

### 変数の展開

```astro
---
const name = "太郎";
const age = 25;
const html = "<strong>太字</strong>";
---

<!-- 通常の変数 -->
<p>{name}</p>

<!-- 式の評価 -->
<p>{age + 5}</p>

<!-- HTMLエスケープされる -->
<div>{html}</div>  <!-- <strong>太字</strong> と表示される -->

<!-- HTMLをそのまま表示（注意: XSSのリスクあり） -->
<div set:html={html} />  <!-- 太字 と表示される -->
```

### 条件分岐

```astro
---
const isLoggedIn = true;
const role = "admin";
const count = 5;
---

<!-- if文 -->
{isLoggedIn && <p>ログイン中</p>}

<!-- if-else -->
{isLoggedIn ? (
  <p>ようこそ!</p>
) : (
  <p>ログインしてください</p>
)}

<!-- 複数条件 -->
{role === "admin" && (
  <button>管理画面へ</button>
)}

<!-- 複雑な条件 -->
{count > 0 ? (
  count > 10 ? (
    <p>たくさんあります</p>
  ) : (
    <p>少しあります</p>
  )
) : (
  <p>ありません</p>
)}
```

### ループ

#### map()を使った配列の表示

```astro
---
const fruits = ["りんご", "バナナ", "みかん"];

const users = [
  { id: 1, name: "太郎", age: 25 },
  { id: 2, name: "花子", age: 30 },
  { id: 3, name: "次郎", age: 22 }
];
---

<!-- 基本的なループ -->
<ul>
  {fruits.map(fruit => (
    <li>{fruit}</li>
  ))}
</ul>

<!-- オブジェクトの配列 -->
<ul>
  {users.map(user => (
    <li key={user.id}>
      {user.name} ({user.age}歳)
    </li>
  ))}
</ul>

<!-- インデックスも使う -->
<ul>
  {fruits.map((fruit, index) => (
    <li>{index + 1}. {fruit}</li>
  ))}
</ul>
```

#### filter()との組み合わせ

```astro
---
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const users = [
  { name: "太郎", active: true },
  { name: "花子", active: false },
  { name: "次郎", active: true }
];
---

<!-- 偶数のみ -->
<ul>
  {numbers.filter(n => n % 2 === 0).map(n => (
    <li>{n}</li>
  ))}
</ul>

<!-- アクティブなユーザーのみ -->
<ul>
  {users
    .filter(user => user.active)
    .map(user => (
      <li>{user.name}</li>
    ))}
</ul>
```

### 属性の設定

```astro
---
const title = "タイトル";
const imageUrl = "/images/photo.jpg";
const isDisabled = true;
const customClass = "highlight";
---

<!-- 通常の属性 -->
<h1 title={title}>見出し</h1>

<!-- 画像のsrc -->
<img src={imageUrl} alt="写真" />

<!-- 真偽値属性 -->
<button disabled={isDisabled}>ボタン</button>

<!-- クラス名 -->
<div class={customClass}>コンテンツ</div>

<!-- 複数のクラス -->
<div class={`base-class ${customClass}`}>コンテンツ</div>

<!-- 条件付きクラス -->
<div class={isDisabled ? "disabled" : "active"}>コンテンツ</div>

<!-- スプレッド属性 -->
---
const attrs = {
  id: "my-div",
  class: "container",
  'data-value': "123"
};
---
<div {...attrs}>コンテンツ</div>
```

### フラグメント

複数要素を返す場合:

```astro
---
const items = ["A", "B", "C"];
---

<!-- フラグメント（余分なdivを追加しない） -->
<>
  <h1>タイトル</h1>
  <p>説明</p>
</>

<!-- ループ内でも使える -->
{items.map(item => (
  <>
    <dt>{item}</dt>
    <dd>{item}の説明</dd>
  </>
))}
```

---

## Props（プロパティ）

コンポーネントにデータを渡すための仕組みです。

### 基本的な使い方

**Button.astro**
```astro
---
// Propsの型定義
interface Props {
  text: string;
  type?: 'button' | 'submit' | 'reset';
}

// Propsの取得
const { text, type = 'button' } = Astro.props;
---

<button type={type}>{text}</button>
```

**使用側**
```astro
---
import Button from './Button.astro';
---

<Button text="送信" type="submit" />
<Button text="キャンセル" />
```

### 高度なProps

```astro
---
interface Props {
  // 必須プロパティ
  title: string;

  // オプション
  description?: string;

  // デフォルト値
  size?: 'sm' | 'md' | 'lg';

  // 数値
  count?: number;

  // 真偽値
  disabled?: boolean;

  // 配列
  tags?: string[];

  // オブジェクト
  user?: {
    name: string;
    email: string;
  };

  // 関数（あまり使わない）
  onClick?: () => void;
}

const {
  title,
  description = "",
  size = 'md',
  count = 0,
  disabled = false,
  tags = [],
  user
} = Astro.props;
---

<div class={`card ${size}`}>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
  {count > 0 && <span>Count: {count}</span>}

  {tags.length > 0 && (
    <div class="tags">
      {tags.map(tag => <span class="tag">{tag}</span>)}
    </div>
  )}

  {user && (
    <div class="user">
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>
  )}
</div>
```

### 残りのプロパティ（Rest Props）

```astro
---
interface Props {
  title: string;
  variant?: string;
}

const { title, variant, ...rest } = Astro.props;
---

<!-- restで残りの属性をすべて渡す -->
<div class={variant} {...rest}>
  <h2>{title}</h2>
</div>
```

**使用例**:
```astro
<MyComponent
  title="タイトル"
  variant="primary"
  id="my-component"
  data-test="value"
/>
<!-- id="my-component" と data-test="value" がrestに含まれる -->
```

---

## スロット

コンポーネント内に子要素を挿入する仕組みです。

### デフォルトスロット

**Container.astro**
```astro
---
// Propsがあってもなくても良い
---

<div class="container">
  <slot />  <!-- ここに子要素が入る -->
</div>

<style>
  .container {
    padding: 2rem;
    background: white;
  }
</style>
```

**使用例**:
```astro
<Container>
  <h1>タイトル</h1>
  <p>ここに任意のコンテンツを入れられる</p>
</Container>
```

### 名前付きスロット

**Layout.astro**
```astro
<div class="layout">
  <header>
    <slot name="header" />
  </header>

  <main>
    <slot />  <!-- デフォルトスロット -->
  </main>

  <aside>
    <slot name="sidebar" />
  </aside>

  <footer>
    <slot name="footer" />
  </footer>
</div>
```

**使用例**:
```astro
<Layout>
  <h1 slot="header">ヘッダー</h1>

  <div slot="sidebar">
    <p>サイドバー</p>
  </div>

  <!-- デフォルトスロット（slot属性なし） -->
  <p>メインコンテンツ</p>

  <p slot="footer">フッター</p>
</Layout>
```

### フォールバックコンテンツ

スロットが空の場合のデフォルト表示:

```astro
<div class="card">
  <div class="header">
    <slot name="header">
      <!-- フォールバック: スロットが空の場合に表示 -->
      <h2>デフォルトタイトル</h2>
    </slot>
  </div>

  <div class="body">
    <slot>
      <p>コンテンツがありません</p>
    </slot>
  </div>
</div>
```

---

## クライアントディレクティブ

JavaScriptをクライアント（ブラウザ）で実行するための指示です。

### client:load

ページ読み込み時にすぐにハイドレート:

```astro
---
import InteractiveCounter from './Counter.jsx';
---

<!-- ページが読み込まれたらすぐにJavaScriptを実行 -->
<InteractiveCounter client:load />
```

### client:idle

ページがアイドル状態になったらハイドレート:

```astro
---
import ChatWidget from './ChatWidget.jsx';
---

<!-- メインコンテンツ読み込み後、ブラウザがアイドル時に実行 -->
<ChatWidget client:idle />
```

### client:visible

要素が画面に表示されたらハイドレート:

```astro
---
import HeavyComponent from './HeavyComponent.jsx';
---

<!-- スクロールして見えるようになったら読み込む -->
<HeavyComponent client:visible />
```

### client:media

メディアクエリが一致したらハイドレート:

```astro
---
import MobileMenu from './MobileMenu.jsx';
---

<!-- 画面幅が768px以下の時だけ読み込む -->
<MobileMenu client:media="(max-width: 768px)" />
```

### client:only

サーバーサイドレンダリングをスキップ:

```astro
---
import BrowserOnlyComponent from './BrowserOnly.jsx';
---

<!-- SSRしない、クライアントのみで実行 -->
<BrowserOnlyComponent client:only="react" />
```

---

## スタイル

### スコープ付きスタイル（デフォルト）

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
    /* このh2だけに適用される */
    color: blue;
  }
</style>
```

### グローバルスタイル

```astro
<style is:global>
  /* すべてのページに適用 */
  body {
    margin: 0;
    font-family: sans-serif;
  }

  .highlight {
    background: yellow;
  }
</style>
```

### CSS変数

```astro
---
const primaryColor = "#3b82f6";
---

<button class="btn">クリック</button>

<style define:vars={{ primaryColor }}>
  .btn {
    background: var(--primaryColor);
    color: white;
  }
</style>
```

### 外部CSSのインポート

```astro
---
import '../styles/global.css';
import '../styles/components.css';
---
```

### クラス名の動的生成

```astro
---
const variant = "primary";
const size = "large";
const isActive = true;
---

<!-- テンプレートリテラル -->
<button class={`btn btn-${variant} btn-${size}`}>ボタン</button>

<!-- 条件付き -->
<div class={`card ${isActive ? 'active' : 'inactive'}`}>カード</div>

<!-- 配列をjoinする -->
---
const classes = ['btn', variant && `btn-${variant}`, size && `btn-${size}`]
  .filter(Boolean)
  .join(' ');
---
<button class={classes}>ボタン</button>
```

---

## スクリプト

### インラインスクリプト

```astro
<button id="myButton">クリック</button>

<script>
  // ブラウザで実行される
  const button = document.getElementById('myButton');
  button?.addEventListener('click', () => {
    alert('クリックされました!');
  });
</script>
```

### TypeScriptスクリプト

```astro
<button id="counter">0</button>

<script>
  let count: number = 0;
  const button = document.getElementById('counter') as HTMLButtonElement;

  button?.addEventListener('click', () => {
    count++;
    button.textContent = count.toString();
  });
</script>
```

### モジュールスクリプト

```astro
<script>
  import { formatDate } from '../utils/helpers';

  const now = new Date();
  console.log(formatDate(now));
</script>
```

### is:inline（バンドルしない）

```astro
<script is:inline>
  // このスクリプトはバンドルされず、そのまま出力される
  console.log('インラインスクリプト');
</script>
```

---

## 特殊な構文とTips

### コメント

```astro
---
// JavaScriptコメント（フロントマター内）
const value = 42;

/*
  複数行コメント
*/
---

<!-- HTMLコメント -->
<div>
  {/* JSX風のコメント */}
  <p>テキスト</p>
</div>
```

### set:html（危険）

```astro
---
const htmlContent = "<strong>太字</strong>";
---

<!-- XSSに注意！信頼できるHTMLのみ使用 -->
<div set:html={htmlContent} />
```

### set:text

```astro
---
const text = "<script>alert('XSS')</script>";
---

<!-- 常にエスケープされる（安全） -->
<div set:text={text} />
```

### define:vars

```astro
---
const bgColor = "#f0f0f0";
const textColor = "#333";
---

<div class="box">コンテンツ</div>

<style define:vars={{ bgColor, textColor }}>
  .box {
    background: var(--bgColor);
    color: var(--textColor);
  }
</style>
```

### is:raw（処理をスキップ）

```astro
<!-- Astroの処理をスキップし、そのまま出力 -->
<div is:raw>
  {変数} <!-- これは処理されない -->
</div>
```

### Fragment shorthand

```astro
<!-- <Fragment>の省略形 -->
<>
  <h1>タイトル</h1>
  <p>段落</p>
</>
```

---

## よく使うパターン集

### ページタイトルの設定

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<head>
  <title>{title} | サイト名</title>
  {description && <meta name="description" content={description} />}
</head>
```

### 条件付きレンダリング

```astro
---
const items = [];
const isLoading = false;
const error = null;
---

{isLoading && <p>読み込み中...</p>}

{error && <p class="error">{error}</p>}

{!isLoading && !error && items.length === 0 && (
  <p>アイテムがありません</p>
)}

{!isLoading && !error && items.length > 0 && (
  <ul>
    {items.map(item => <li>{item}</li>)}
  </ul>
)}
```

### 日付のフォーマット

```astro
---
const date = new Date();

const formatted = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(date);
---

<time datetime={date.toISOString()}>
  {formatted}
</time>
```

### 画像の最適化

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/photo.jpg';
---

<!-- 自動最適化 -->
<Image src={myImage} alt="説明" width={800} height={600} />

<!-- 外部画像 -->
<img src="/images/photo.jpg" alt="説明" loading="lazy" />
```

---

## まとめ

### 重要ポイント

1. **フロントマター**: サーバーサイドで実行、`---`で囲む
2. **テンプレート**: JSX風の構文、`{}`で変数展開
3. **Props**: `Astro.props`で取得、TypeScriptで型定義
4. **スロット**: `<slot />`で子要素を挿入
5. **スタイル**: デフォルトでスコープ付き
6. **クライアントディレクティブ**: 必要な時だけJavaScript

### 次のステップ

- [Astro入門ガイド](./astro-guide.md)で全体像を把握
- [プロジェクト構造ガイド](./project-structure.md)で実践方法を学ぶ
- 実際にコンポーネントを作ってみる

---

**最終更新**: 2025年11月8日
