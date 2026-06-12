# パワプロ チームデータ管理ツール

Electronで動作する、JSONベースのパワプロ用チームデータ管理ツールです。

## 特徴

- チーム別の選手一覧をExcelライクな表形式で表示
- 選手ごとの編集ボタンから、詳細タブを複数同時に開いて編集
- 野手能力・投手能力・特殊能力/起用法を1画面で編集
- 変更内容をJSONへ保存

## 参考形式

選手データ項目は次の参考ページの構成に寄せています。

- https://www.baseless.org/data/source/2026/work.html

## 開発基準ドキュメント

今後の選手データ関連の開発では、まず次の仕様メモを参照してください。

- docs/pawapuro-2026-2027-player-data-spec.md

## 起動方法

1. 依存関係をインストール

   npm install

2. アプリを起動

   npm start

## データ保存先

- 初回起動時に `data/teams.default.json` をユーザーデータ領域へコピー
- 実際の編集データはElectronの `userData` 配下の `teams.json` へ保存

## JSONスキーマ概要

```json
{
  "version": 1,
  "updatedAt": "YYYY-MM-DD",
  "teams": [
    {
      "id": "TEAM_ID",
      "name": "チーム名",
      "players": [
        {
          "id": "player_id",
          "name": "選手名",
          "number": 1,
          "type": "投手|野手|二刀流",
          "position": "守備/適性",
          "hand": "右投左打",
          "hitter": {
            "trajectory": 1,
            "contact": 50,
            "power": 50,
            "speed": 50,
            "arm": 50,
            "fielding": 50,
            "catching": 50
          },
          "pitcher": {
            "velocity": 150,
            "control": 50,
            "stamina": 50,
            "breakingBalls": [{ "name": "フォーク", "level": 3 }]
          },
          "traits": ["特殊能力"],
          "strategy": ["起用法"]
        }
      ]
    }
  ]
}
```
