# parametric-typography

筑波大学の授業「[ディジタルコンテンツ表現演習](https://digicon.mast.tsukuba.ac.jp/)」の成果物として制作した Web サイトです。
お手持ちのスマートフォンを振動させて、パラメトリックなタイポグラフィを体感することができます。

- 太さ
- 曲率
- 抑揚

## Development

```
yarn run dev
```

```
yarn node --loader ts-node/esm convert.ts font/e.svg
```