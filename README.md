# parametric-typography

筑波大学の授業「[ディジタルコンテンツ表現演習](https://digicon.mast.tsukuba.ac.jp/)」の課題として制作した Web サイトです。
お手持ちのスマートフォンを操作して、パラメトリックなタイポグラフィを体感することができます。

デモ：https://parametric-typography.yokohama.dev/

## 使い方

`/` にアクセスし、スマートフォンを傾けて文字の以下の属性を操作します。

- 骨格の曲率、ウェイト（太さ）、抑揚、丸さ

お好みのタイポグラフィが生成されたタイミングで画面をタップし、画面に指を触れたままスマートフォンをバットのように振ります。**現時点では iOS にのみ対応しています**。

`/display` にアクセスすると、生成したタイポグラフィがリアルタイムに新たに追加されていきます。生成したタイポグラフィは、OpenType フォントとしてダウンロードすることが可能です。

## 開発

React + vite による SPA として開発されています。データの管理には Firebase Realtime Database を利用します。

```bash
yarn

# localhost で立ち上げ
yarn run dev
```

### パスコマンドの生成

新たな文字を追加するには、Illustrator

1. Illustrator で文字の骨格を描き SVG で出力します
2. 出力された SVG のパスコマンド（path 要素の d 属性）を抽出し、各行に path 要素 1 つのパスコマンドが現れるようにします。パスコマンドは、`M`, `m`, `C`, `c`, `s` のいずれかで構成される必要があります
3. 適当なファイル名で保存し、以下のコマンドを実行します。

```bash
yarn node --loader ts-node/esm convert.ts <input>
```
4. 