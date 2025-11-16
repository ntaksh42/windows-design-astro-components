# GitHub Copilot用サンプルコード集

このドキュメントは、GitHub Copilotがより正確なコードを生成するためのサンプル集です。

---

## レイアウトパターン

### パターン1: 縦並びフォーム（推奨）

ラベルと入力欄を縦に並べる標準的なフォームレイアウト。

```astro
<FlowLayout direction="vertical" gap={15} padding={20}>
  <!-- フィールド1 -->
  <FlowLayout direction="vertical" gap={5}>
    <Label>名前:</Label>
    <TextBox placeholder="名前を入力" width={300} />
  </FlowLayout>

  <!-- フィールド2 -->
  <FlowLayout direction="vertical" gap={5}>
    <Label>メールアドレス:</Label>
    <TextBox type="email" placeholder="email@example.com" width={300} />
  </FlowLayout>

  <!-- フィールド3 -->
  <FlowLayout direction="vertical" gap={5}>
    <Label>電話番号:</Label>
    <TextBox type="tel" placeholder="000-0000-0000" width={300} />
  </FlowLayout>
</FlowLayout>
```

---

### パターン2: 横並びラベル+入力

ラベルと入力欄を横に並べるコンパクトなレイアウト。

```astro
<FlowLayout direction="vertical" gap={10} padding={20}>
  <FlowLayout align="center" gap={10}>
    <Label style="width: 100px;">名前:</Label>
    <TextBox width={200} />
  </FlowLayout>

  <FlowLayout align="center" gap={10}>
    <Label style="width: 100px;">メール:</Label>
    <TextBox type="email" width={200} />
  </FlowLayout>

  <FlowLayout align="center" gap={10}>
    <Label style="width: 100px;">年齢:</Label>
    <NumericUpDown min={0} max={120} value={20} width={100} />
  </FlowLayout>
</FlowLayout>
```

---

### パターン3: グリッド風レイアウト

複数のフィールドを2カラムで配置。

```astro
<FlowLayout direction="vertical" gap={15} padding={20}>
  <!-- 行1: 名前とフリガナ -->
  <FlowLayout gap={15}>
    <FlowLayout direction="vertical" gap={5} style="flex: 1;">
      <Label>名前:</Label>
      <TextBox width="100%" />
    </FlowLayout>
    <FlowLayout direction="vertical" gap={5} style="flex: 1;">
      <Label>フリガナ:</Label>
      <TextBox width="100%" />
    </FlowLayout>
  </FlowLayout>

  <!-- 行2: 電話番号とメール -->
  <FlowLayout gap={15}>
    <FlowLayout direction="vertical" gap={5} style="flex: 1;">
      <Label>電話番号:</Label>
      <TextBox type="tel" width="100%" />
    </FlowLayout>
    <FlowLayout direction="vertical" gap={5} style="flex: 1;">
      <Label>メール:</Label>
      <TextBox type="email" width="100%" />
    </FlowLayout>
  </FlowLayout>
</FlowLayout>
```

---

## ボタン配置パターン

### パターン1: 右寄せ（保存・キャンセル）

最も一般的なボタン配置。キャンセルを左、主要アクションを右に配置。

```astro
<FlowLayout gap={10} justify="end" padding={20}>
  <Button>キャンセル</Button>
  <Button variant="primary">保存</Button>
</FlowLayout>
```

---

### パターン2: 左右分離（削除と保存）

破壊的なアクション（削除など）を左、保存系を右に配置。

```astro
<FlowLayout gap={10} justify="space-between" padding={20}>
  <Button>削除</Button>
  <FlowLayout gap={10}>
    <Button>キャンセル</Button>
    <Button variant="primary">保存</Button>
  </FlowLayout>
</FlowLayout>
```

---

### パターン3: 中央配置

単一の主要アクション。

```astro
<FlowLayout justify="center" padding={20}>
  <Button variant="primary">開始する</Button>
</FlowLayout>
```

---

### パターン4: 均等配置

複数の等価なオプション。

```astro
<FlowLayout gap={10} justify="space-evenly" padding={20}>
  <Button>オプション1</Button>
  <Button>オプション2</Button>
  <Button>オプション3</Button>
</FlowLayout>
```

---

### パターン5: ツールバー風

フラットボタンを横に並べたツールバー。

```astro
<FlowLayout gap={5} padding={10} background="#e0e0e0">
  <Button variant="flat">新規</Button>
  <Button variant="flat">開く</Button>
  <Button variant="flat">保存</Button>
  <div style="width: 1px; height: 24px; background: #999; margin: 0 5px;"></div>
  <Button variant="flat">切り取り</Button>
  <Button variant="flat">コピー</Button>
  <Button variant="flat">貼り付け</Button>
</FlowLayout>
```

---

## グループボックスパターン

### パターン1: 単純なグループ化

関連する設定項目をグループ化。

```astro
<GroupBox title="ユーザー情報">
  <FlowLayout direction="vertical" gap={10} padding={15}>
    <FlowLayout direction="vertical" gap={5}>
      <Label>名前:</Label>
      <TextBox width={300} />
    </FlowLayout>
    <FlowLayout direction="vertical" gap={5}>
      <Label>メール:</Label>
      <TextBox type="email" width={300} />
    </FlowLayout>
  </FlowLayout>
</GroupBox>
```

---

### パターン2: 複数のグループボックス

設定画面などで複数のセクションに分割。

```astro
<FlowLayout direction="vertical" gap={20} padding={20}>
  <!-- グループ1 -->
  <GroupBox title="通知設定">
    <FlowLayout direction="vertical" gap={8} padding={15}>
      <CheckBox label="メール通知を受け取る" checked={true} />
      <CheckBox label="プッシュ通知を受け取る" />
      <CheckBox label="サウンドを再生" checked={true} />
    </FlowLayout>
  </GroupBox>

  <!-- グループ2 -->
  <GroupBox title="表示設定">
    <FlowLayout direction="vertical" gap={10} padding={15}>
      <FlowLayout align="center" gap={10}>
        <Label>テーマ:</Label>
        <ComboBox options={["ライト", "ダーク", "自動"]} width={150} />
      </FlowLayout>
      <FlowLayout align="center" gap={10}>
        <Label>フォントサイズ:</Label>
        <NumericUpDown min={8} max={24} value={12} width={80} />
      </FlowLayout>
    </FlowLayout>
  </GroupBox>

  <!-- ボタン -->
  <FlowLayout gap={10} justify="end">
    <Button>キャンセル</Button>
    <Button variant="primary">保存</Button>
  </FlowLayout>
</FlowLayout>
```

---

## チェックボックス・ラジオボタンパターン

### パターン1: チェックボックスリスト

```astro
<FlowLayout direction="vertical" gap={8} padding={20}>
  <Label bold={true}>興味のある分野を選択してください:</Label>
  <CheckBox label="プログラミング" />
  <CheckBox label="デザイン" />
  <CheckBox label="マーケティング" />
  <CheckBox label="ビジネス" />
  <CheckBox label="その他" />
</FlowLayout>
```

---

### パターン2: ラジオボタングループ

```astro
<FlowLayout direction="vertical" gap={8} padding={20}>
  <Label bold={true}>性別:</Label>
  <RadioButton name="gender" value="male" label="男性" />
  <RadioButton name="gender" value="female" label="女性" />
  <RadioButton name="gender" value="other" label="その他" />
  <RadioButton name="gender" value="no-answer" label="回答しない" />
</FlowLayout>
```

---

### パターン3: グループボックス内のラジオボタン

```astro
<GroupBox title="配送方法を選択">
  <FlowLayout direction="vertical" gap={8} padding={15}>
    <RadioButton name="shipping" value="standard" label="通常配送（3-5営業日）" checked={true} />
    <RadioButton name="shipping" value="express" label="速達配送（1-2営業日）" />
    <RadioButton name="shipping" value="overnight" label="翌日配送" />
  </FlowLayout>
</GroupBox>
```

---

## タブコントロールパターン

### パターン1: 基本的なタブ

```astro
<TabControl>
  <TabPage label="基本情報">
    <FlowLayout direction="vertical" gap={10} padding={20}>
      <Label>基本情報の入力欄</Label>
      <TextBox />
    </FlowLayout>
  </TabPage>

  <TabPage label="詳細設定">
    <FlowLayout direction="vertical" gap={10} padding={20}>
      <Label>詳細設定の入力欄</Label>
      <CheckBox label="オプション1" />
    </FlowLayout>
  </TabPage>

  <TabPage label="確認">
    <FlowLayout direction="vertical" gap={10} padding={20}>
      <Label>確認画面</Label>
    </FlowLayout>
  </TabPage>
</TabControl>
```

---

## プログレスバーパターン

### パターン1: ダウンロード進捗

```astro
<FlowLayout direction="vertical" gap={10} padding={20} width={400}>
  <Label bold={true}>ファイルをダウンロード中...</Label>
  <ProgressBar value={65} width="100%" />
  <Label>65% 完了 (325 MB / 500 MB)</Label>
  <FlowLayout gap={10} justify="end">
    <Button>キャンセル</Button>
  </FlowLayout>
</FlowLayout>
```

---

### パターン2: 複数のステップ

```astro
<FlowLayout direction="vertical" gap={15} padding={20} width={500}>
  <FlowLayout direction="vertical" gap={5}>
    <FlowLayout justify="space-between">
      <Label>ステップ1: ダウンロード</Label>
      <Label>100%</Label>
    </FlowLayout>
    <ProgressBar value={100} variant="success" width="100%" />
  </FlowLayout>

  <FlowLayout direction="vertical" gap={5}>
    <FlowLayout justify="space-between">
      <Label>ステップ2: インストール</Label>
      <Label>45%</Label>
    </FlowLayout>
    <ProgressBar value={45} width="100%" />
  </FlowLayout>

  <FlowLayout direction="vertical" gap={5}>
    <FlowLayout justify="space-between">
      <Label>ステップ3: 設定</Label>
      <Label>0%</Label>
    </FlowLayout>
    <ProgressBar value={0} width="100%" />
  </FlowLayout>
</FlowLayout>
```

---

## データテーブルパターン

### パターン1: シンプルなテーブル

```astro
<FlowLayout direction="vertical" gap={15} padding={20}>
  <!-- ツールバー -->
  <FlowLayout gap={10}>
    <Button variant="primary">新規追加</Button>
    <Button>編集</Button>
    <Button>削除</Button>
  </FlowLayout>

  <!-- テーブル -->
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr style="background: #f5f5f5;">
        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">ID</th>
        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">名前</th>
        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">メール</th>
        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">1</td>
        <td style="padding: 10px; border: 1px solid #ddd;">山田太郎</td>
        <td style="padding: 10px; border: 1px solid #ddd;">yamada@example.com</td>
        <td style="padding: 10px; border: 1px solid #ddd;">
          <FlowLayout gap={5}>
            <Button variant="flat">編集</Button>
            <Button variant="flat">削除</Button>
          </FlowLayout>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">2</td>
        <td style="padding: 10px; border: 1px solid #ddd;">佐藤花子</td>
        <td style="padding: 10px; border: 1px solid #ddd;">sato@example.com</td>
        <td style="padding: 10px; border: 1px solid #ddd;">
          <FlowLayout gap={5}>
            <Button variant="flat">編集</Button>
            <Button variant="flat">削除</Button>
          </FlowLayout>
        </td>
      </tr>
    </tbody>
  </table>
</FlowLayout>
```

---

## 検索フィルターパターン

### パターン1: 検索バー

```astro
<FlowLayout gap={10} align="center" padding={20}>
  <Label>検索:</Label>
  <TextBox placeholder="キーワードを入力" width={300} />
  <Button variant="primary">検索</Button>
  <Button>クリア</Button>
</FlowLayout>
```

---

### パターン2: 詳細検索

```astro
<GroupBox title="検索条件">
  <FlowLayout direction="vertical" gap={10} padding={15}>
    <FlowLayout align="center" gap={10}>
      <Label style="width: 100px;">名前:</Label>
      <TextBox width={200} />
    </FlowLayout>

    <FlowLayout align="center" gap={10}>
      <Label style="width: 100px;">カテゴリ:</Label>
      <ComboBox options={["全て", "カテゴリ1", "カテゴリ2"]} width={200} />
    </FlowLayout>

    <FlowLayout align="center" gap={10}>
      <Label style="width: 100px;">ステータス:</Label>
      <CheckBox label="アクティブ" checked={true} />
      <CheckBox label="非アクティブ" />
    </FlowLayout>

    <FlowLayout gap={10} justify="end">
      <Button>クリア</Button>
      <Button variant="primary">検索</Button>
    </FlowLayout>
  </FlowLayout>
</GroupBox>
```

---

## ダイアログ・モーダルパターン

### パターン1: 確認ダイアログ

```astro
<FlowLayout direction="vertical" gap={20} padding={30} width={400} background="#fff" border={true}>
  <Label bold={true} style="font-size: 18px;">確認</Label>
  <Label>この項目を削除してもよろしいですか？</Label>
  <FlowLayout gap={10} justify="end">
    <Button>キャンセル</Button>
    <Button variant="primary">削除</Button>
  </FlowLayout>
</FlowLayout>
```

---

### パターン2: 入力ダイアログ

```astro
<FlowLayout direction="vertical" gap={15} padding={30} width={400} background="#fff" border={true}>
  <Label bold={true} style="font-size: 18px;">新しいフォルダ</Label>

  <FlowLayout direction="vertical" gap={5}>
    <Label>フォルダ名:</Label>
    <TextBox placeholder="フォルダ名を入力" width="100%" />
  </FlowLayout>

  <FlowLayout gap={10} justify="end">
    <Button>キャンセル</Button>
    <Button variant="primary">作成</Button>
  </FlowLayout>
</FlowLayout>
```

---

## ウィザード（複数ステップ）パターン

```astro
<FlowLayout direction="vertical" gap={20} padding={20}>
  <!-- ステップインジケーター -->
  <FlowLayout justify="center" gap={20}>
    <FlowLayout align="center" gap={5}>
      <div style="width: 30px; height: 30px; border-radius: 50%; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</div>
      <Label>基本情報</Label>
    </FlowLayout>
    <Label style="color: #ccc;">→</Label>
    <FlowLayout align="center" gap={5}>
      <div style="width: 30px; height: 30px; border-radius: 50%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</div>
      <Label style="color: #999;">詳細情報</Label>
    </FlowLayout>
    <Label style="color: #ccc;">→</Label>
    <FlowLayout align="center" gap={5}>
      <div style="width: 30px; height: 30px; border-radius: 50%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; font-weight: bold;">3</div>
      <Label style="color: #999;">確認</Label>
    </FlowLayout>
  </FlowLayout>

  <!-- コンテンツエリア -->
  <GroupBox title="ステップ1: 基本情報">
    <FlowLayout direction="vertical" gap={10} padding={20}>
      <FlowLayout direction="vertical" gap={5}>
        <Label>名前:</Label>
        <TextBox width={300} />
      </FlowLayout>
    </FlowLayout>
  </GroupBox>

  <!-- ナビゲーションボタン -->
  <FlowLayout justify="space-between">
    <Button disabled={true}>戻る</Button>
    <FlowLayout gap={10}>
      <Button>キャンセル</Button>
      <Button variant="primary">次へ</Button>
    </FlowLayout>
  </FlowLayout>
</FlowLayout>
```

---

## ベストプラクティス

### ✅ 推奨

1. **FlowLayoutを優先的に使用** - 自動配置で柔軟性が高い
2. **ボタンは右寄せ** - `justify="end"` を使用
3. **フィールドはグループ化** - Label + TextBox をFlowLayoutで囲む
4. **適切な間隔** - `gap={10}` ~ `gap={15}` が標準的
5. **プライマリアクションは明確に** - `variant="primary"` を使用

### ❌ 非推奨

1. **過度なネスト** - 4階層以上のネストは避ける
2. **インラインスタイルの乱用** - propsで調整可能な場合はpropsを使用
3. **Containerの多用** - 絶対座標は必要最小限に
4. **固定幅の乱用** - `width="100%"` など相対値も活用

---

このサンプル集を参考に、GitHub Copilotを活用して効率的にUIを構築してください！
