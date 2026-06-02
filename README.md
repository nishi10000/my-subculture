# My Subculture Timeline

自分の記憶に残っているゲーム、映画、音楽、漫画、体験などを、発売日/公開日ベースで並べる静的なサブカルチャー年表サイトです。

## 概要

- `data.json` に登録した思い出を時系列で表示
- JavaScriptでクライアントサイド描画
- 画像付きのカード形式タイムライン
- ビルド不要の静的サイト

## 主なファイル

- `index.html` - ページ本体とカードテンプレート
- `styles.css` - タイムライン表示のスタイル
- `script.js` - `data.json` を読み込んで画面へ描画
- `data.json` - 年表データ
- `images/` - 表示用画像

## データ形式

`data.json` は配列形式です。

```json
{
  "date": "1990-10-27",
  "title": "作品名や出来事",
  "tag": "Game",
  "memory": "当時の思い出",
  "image": "images/example.jpg",
  "link": "https://example.com"
}
```

## ローカルで見る

ビルドは不要です。ブラウザで `index.html` を開くか、簡易サーバーを起動します。

```bash
python3 -m http.server 8000
```

その後、以下へアクセスします。

```text
http://localhost:8000/
```

## 更新方法

1. `data.json` に新しい項目を追加
2. 必要に応じて `images/` に画像を追加
3. 画像のライセンス/クレジットが必要な場合は `index.html` の Image credits に追記
