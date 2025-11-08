# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Astroで構築されたWindows Forms風のUIコンポーネントライブラリです。日本語のドキュメントとデモページを含み、学習目的で作成されています。

## 開発コマンド

### 開発サーバー
```bash
npm run dev
# または
npm start
```
ブラウザで `http://localhost:4321` にアクセス

### ビルド
```bash
npm run build
```
TypeScriptの型チェック(`astro check`)を実行してからビルドを行います。

### プレビュー
```bash
npm run preview
```
ビルド後の静的サイトをプレビュー

## アーキテクチャ

### コンポーネント設計パターン

コンポーネントは**Windows Forms風のデザインシステム**に従っています：
- グラデーション背景とボーダーによる立体的な外観
- ホバー・アクティブ・無効化状態の視覚的フィードバック
- `Segoe UI`フォントファミリーの使用

### ディレクトリ構造の役割

```
src/
├── components/ui/    # 再利用可能なUIコンポーネント（Button, Menu, TextBox等）
├── layouts/          # ページ共通のレイアウト（BaseLayout.astro）
└── pages/            # デモページ（.astroまたは.mdx形式）
```

### コンポーネント規約

1. **Props定義**: TypeScriptインターフェースで型安全性を確保
   ```astro
   interface Props {
     variant?: 'default' | 'primary' | 'flat';
     disabled?: boolean;
   }
   ```

2. **デフォルト値**: 分割代入でデフォルト値を設定
   ```astro
   const { variant = 'default', disabled = false } = Astro.props;
   ```

3. **スロット**: `<slot>`で子要素を受け取る。フォールバックコンテンツも設定可能
   ```astro
   <slot>{label}</slot>
   ```

4. **スコープ付きCSS**: `<style>`タグはコンポーネントにスコープされる（自動的にclass名がユニークになる）

### レイアウトシステム

`BaseLayout.astro`が基本構造を提供：
- グローバルスタイル（`is:global`属性で定義）
- ナビゲーションメニュー
- レスポンシブなmainコンテナ

デモページは`.astro`または`.mdx`形式で作成し、`BaseLayout`をラップして使用します。

### MDXサポート

`@astrojs/mdx`統合により、MDXファイル内でAstroコンポーネントを使用可能：
```mdx
import Button from '../components/ui/Button.astro';

<Button variant="primary">クリック</Button>
```

## 新しいコンポーネントの追加手順

1. `src/components/ui/ComponentName.astro`を作成
2. Propsインターフェースを定義（JSDocコメント推奨）
3. Windows Forms風のスタイルを実装
4. `src/pages/componentname-demo.mdx`でデモページを作成
5. `BaseLayout.astro`のナビゲーションにリンクを追加

## 技術スタック

- **Astro 5.15.4**: 静的サイトジェネレーター
- **TypeScript 5.9.3**: 型安全性
- **Vite 7.2.2**: ビルドツール
- **@astrojs/mdx**: MDXサポート

## 注意事項

- このプロジェクトは学習目的であり、実際の本番環境での使用は想定していません
- `docs/`ディレクトリには詳細なAstroガイド・文法リファレンス・プロジェクト構造ガイドがあります
- 日本語がメインの言語です
