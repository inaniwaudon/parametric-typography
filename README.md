# parametric-typography

筑波大学の授業「[ディジタルコンテンツ表現演習](https://digicon.mast.tsukuba.ac.jp/)」の課題として制作した Web サイトです。
お手持ちのスマートフォンを操作して、パラメトリックなタイポグラフィを体感することができます。

デモ：https://parametric.yokohama.dev/

## 使い方

### タイプフェイスを生成する

<https://parametric.yokohama.dev/controller> にアクセスし、スマートフォンを傾けて文字の以下の属性を操作します。

- 骨格の曲率、ウェイト（太さ）、抑揚、丸さ

お好みのタイプフェイスが生成されたタイミングで画面をタップし、画面に指を触れたままスマートフォンをバットのように振ります。（**現時点で iOS にのみ対応しています**。その他の環境では、右下のスライダーや Submit ボタンを操作してください）

### 生成されたタイプフェイスを見る

<https://parametric.yokohama.dev/> にアクセスすると、生成したタイプフェイスがリアルタイムに新たに追加されていきます。上方向に流れていく「あ」の文字をクリックすることで、選択したタイプフェイスを OpenType フォントとしてダウンロードすることが可能です。

## 開発

React + vite による SPA として開発されています。データの管理には Firebase Realtime Database を利用します。

```bash
yarn

# localhost で立ち上げ
yarn run dev
```

### パスコマンドの生成

文字の骨格を編集するには、以下の操作を行います。新たな文字を追加するには、`/convert.ts` および `/src/lib/typo.ts` を編集します。

1. Illustrator で文字の骨格を描き SVG で出力します。2 つの骨格のアンカーポイント・ハンドルの個数と構成は一致する必要があります。
2. 出力された SVG のパスコマンド（path 要素の d 属性）を抽出し、各行に path 要素 1 つのパスコマンドが現れるようにします。パスコマンドは、`M`, `m`, `C`, `c`, `s` のいずれかで構成される必要があります
3. `/font/**.svg` に保存し、以下のコマンドを実行します。

```bash
yarn node --loader ts-node/esm convert.ts
```
4. `/src/lib/intonation.ts` を編集し、文字に抑揚を与えます。
