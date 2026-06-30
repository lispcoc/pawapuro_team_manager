# パワプロ チームマネージャ - アーキテクチャ仕様書

## 概要
パワプロのチームデータを管理するElectron/Webベースのアプリケーション。以前は3644行の単一ファイル（`renderer.js`）だったソースコードを、機能ごとにモジュール化しました。

## プロジェクト構成

### ディレクトリ構成
```
src/
├── index.html           # HTMLテンプレート
├── styles.css          # スタイルシート
├── renderer.js         # メインエントリポイント（新規作成、統合）
└── modules/            # 機能別モジュール
    ├── constants.js    # 定数定義
    ├── utils.js        # ユーティリティ関数
    ├── state-manager.js         # 状態管理
    ├── player-manager.js        # プレイヤー管理
    ├── trait-manager.js         # 特性管理
    ├── strategy-manager.js      # 戦略管理
    ├── breaking-ball-manager.js # 変化球管理
    ├── ui-renderer.js           # UI レンダリング（未作成）
    ├── event-handlers.js        # イベントハンドラ（未作成）
    ├── roster-manager.js        # ロスター表示管理（未作成）
    └── file-operations.js       # ファイル操作（未作成）
```

## モジュール別説明

### 1. `constants.js` (650行)
**目的**: アプリケーション全体で使用される定数の集中管理

**主な定数**:
- ポジション設定 (`POSITION_OPTIONS`, `POSITION_OPTION_MAP`)
- ランク関連 (`RANK_LETTERS`, `POSITIVE_RANK_LETTERS`, `NEGATIVE_RANK_LETTERS`)
- 特性定義 (`RANKED_TRAIT_BASES`, `TOGGLE_TRAITS`, `PITCHER_TOGGLE_TRAITS`, `HITTER_TOGGLE_TRAITS`)
- トレイトエディタ設定 (`TRAIT_EDITOR_CONFIGS`)
- 戦略オプション (`PITCHER_STRATEGY_OPTIONS`, `HITTER_STRATEGY_OPTIONS`)
- 変化球ファミリー (`BREAKING_BALL_FAMILIES`, `BREAKING_BALL_FAMILY_MAP`)
- 表示設定 (`BREAKING_BALL_DISPLAY_MODES`, `STARTUP_OPEN_MODES`)
- ポジティブ/ネガティブ特性セット

**責務**:
- 不変の値を一元管理
- マジックナンバー/文字列を排除
- 定数の型安全性確保

### 2. `utils.js` (170行)
**目的**: 汎用的なヘルパー関数の提供

**主な関数**:
- `toInt(value, fallback)` - 数値変換
- `escapeHtml(text)` - HTML特殊文字エスケープ
- `clamp(value, min, max)` - 値の範囲制限
- `uniqueStrings(values)` - 重複排除
- `normalizeForSearch(text)` - 検索用テキスト正規化
- `splitCsv(text)` - CSV形式のテキスト解析
- `sanitizeIdSeed(text, fallback)` - IDシード正規化
- `makeUniqueId(existingIds, seed)` - ユニークID生成
- `meterPercent(value, min, max)` - メーターパーセンテージ計算
- `gradeByValue(value)` - 数値から等級判定
- `extractThrowingHand(hand)` - 投力方向抽出

**責務**:
- 複数モジュール間で共有される汎用処理
- 外部依存なく動作する純粋関数

### 3. `state-manager.js` (300行)
**目的**: アプリケーション全体の状態管理

**主な状態**:
```javascript
state = {
  data,                      // JSONデータ
  lastSavedSnapshot,         // 最後の保存スナップショット
  selectedTeamId,            // 選択中のチームID
  openTabs,                  // 開いているプレイヤータブ
  playerDrafts,              // 編集中のプレイヤードラフト
  dirtyPlayerTabs,           // 編集中のプレイヤー
  activeWorkspaceTab,        // アクティブなタブ
  rosterFilters,             // ロスタフィルタ設定
  rosterViewMode,            // ロスタビューモード
  rosterSort,                // ロスタソート設定
  settings                   // アプリケーション設定
}
```

**主な関数**:
- `createDefaultSettings()` - デフォルト設定作成
- `normalizeAppSettings(settings)` - 設定値正規化
- `loadAppSettings()` - LS から設定読み込み
- `persistAppSettings()` - 設定を LS に保存
- `applyAppSettings(nextSettings, options)` - 設定適用
- `hasUnsavedChanges()` - 未保存変更判定
- `getCurrentTeam()` - 現在選択中のチーム取得
- `findPlayer(playerId)` - プレイヤー検索
- `buildFormSnapshot(form)` - フォーム状態スナップショット作成
- `applyFormSnapshot(form, snapshot)` - フォーム状態復元

**責務**:
- グローバル状態の一元管理
- 状態更新時の一貫性確保
- ローカルストレージとの同期

### 4. `player-manager.js` (430行)
**目的**: プレイヤーデータの管理・操作

**主な関数**:
- `parsePositionText(text)` - ポジションテキスト解析
- `normalizePositionsValue(value)` - ポジション値正規化
- `formatPositions(positions)` - ポジション形式設定
- `getPlayerPositions(player)` - プレイヤーポジション取得
- `getPlayerPositionLabel(player)` - ポジションラベル取得
- `getMainPositionCategory(player)` - メインポジションカテゴリ取得
- `buildPositionBadge(player)` - ポジションバッジ HTML構築
- `buildPositionPanel(player)` - ポジション選択パネル構築
- `buildPlayerSnapshot(player)` - プレイヤースナップショット作成
- `normalizePlayer(player)` - プレイヤーデータ正規化
- `createDefaultPlayer(team)` - デフォルトプレイヤー作成

**責務**:
- プレイヤー情報の正規化・変換
- ポジション情報の一元管理
- UI 生成用データの処理

### 5. `trait-manager.js` (370行)
**目的**: 特性（トレイト）システムの管理

**主な関数**:
- `isRankedTraitTextForBases(trait, rankedBases)` - ランク付き特性判定
- `getTraitEditorConfig(mode)` - トレイトエディタ設定取得
- `decodeLegacyTrait(value)` - レガシートレイトデコード
- `buildLegacyCombinedTraits(pitcherTraits, hitterTraits)` - 統合特性構築
- `splitTraitsByEditorMode(traits, playerType)` - 特性をモード別に分割
- `getPlayerTraitsByMode(player, mode)` - プレイヤーのモード別特性取得
- `getPlayerAllTraits(player)` - すべての特性取得
- `getTraitTone(trait, mode)` - 特性のトーン判定
- `parseTraitState(traits, rankedBases, toggleTraits)` - 特性状態パース
- `composeTraitsFromState(ranked, toggles, unknown, ...)` - 特性状態から特性合成
- `buildTraitPreviewGrid(traits, mode)` - 特性プレビューグリッド構築
- `buildTraitPanel(traits, mode)` - 特性編集パネル構築

**責務**:
- ランク付き特性とトグル特性の管理
- レガシー形式との互換性維持
- 投手・野手特性の統合・分割

### 6. `strategy-manager.js` (280行)
**目的**: 起用法（戦略）システムの管理

**主な関数**:
- `getStrategyEditorConfig(mode)` - 戦略エディタ設定取得
- `decodeLegacyStrategy(value)` - レガシー戦略デコード
- `buildLegacyCombinedStrategies(...)` - 統合戦略構築
- `splitStrategiesByEditorMode(items, playerType)` - 戦略をモード別分割
- `getPlayerStrategiesByMode(player, mode)` - モード別戦略取得
- `getPlayerAllStrategies(player)` - すべての戦略取得
- `parseStrategyState(items, options)` - 戦略状態パース
- `composeStrategyFromState(toggles, unknown, options)` - 戦略状態から合成
- `buildStrategyPanel(strategy, mode)` - 戦略編集パネル構築

**責務**:
- 投手・野手別の起用法管理
- UI との相互作用

### 7. `breaking-ball-manager.js` (570行)
**目的**: 変化球システムの管理

**主な関数**:
- `getBreakingBallFamily(name)` - 変化球ファミリー取得
- `getBreakingBallDirectionLayout(throwHand)` - 投力方向別レイアウト取得
- `buildBreakingBallState(entries)` - 変化球状態構築
- `parseBreakingBalls(text)` - 変化球テキスト解析
- `buildBreakingBallGrid(stateByFamily, throwHand)` - エディタグリッド構築
- `composeBreakingBallsFromEditor(editor)` - エディタから変化球取得
- `syncBreakingBallsFromEditor(form)` - エディタから同期
- `buildBreakingBallRadarSvg(stateByFamily, throwHand)` - レーダー SVG 構築
- `buildBreakingBallArrowSvg(stateByFamily, throwHand)` - 矢印 SVG 構築
- `buildBreakingBallMeterMarkup(stateByFamily, throwHand, displayMode)` - メーターマークアップ構築
- `renderBreakingBallEditorGrid(form, displayModeGetter)` - エディタグリッドレンダリング

**責務**:
- 6つの変化球ファミリーの管理
- 方向・強度・レベルの可視化
- SVG による複雑な描画処理

## データフロー

### 階層関係
```
constants.js
    ↓
utils.js
    ↓
trait-manager.js ← strategy-manager.js
    ↓
player-manager.js ← breaking-ball-manager.js
    ↓
state-manager.js
    ↓
UI レイヤー（未実装モジュール）
```

### 状態更新フロー
1. ユーザーが UI 操作（フォーム編集）
2. イベントハンドラが反応
3. `state.playerDrafts` に変更を記録
4. `updatePlayerDraftFromForm()` で dirty フラグ更新
5. UI 再レンダリング（ダーティ表示など）
6. 保存操作時に `savePlayerForm()` で `state.data` に確定

## 拡張性

### 新しい機能を追加する場合
1. **定数が必要か**: `constants.js` に追加
2. **汎用ユーティリティ**: `utils.js` に追加
3. **エンティティ固有の機能**: 対応モジュール（例：`trait-manager.js`）に追加
4. **UI レンダリング**: `ui-renderer.js` に追加（分割予定）
5. **イベントハンドリング**: `event-handlers.js` に追加（分割予定）

## パフォーマンス考慮事項

- **メモリ使用**: グローバル `state` はセッション中メモリに保持
- **ローカルストレージ**: 設定のみ保存（重いデータは JSON ファイル）
- **DOM 操作**: 編集時は textarea の値を同期的に更新
- **SVG 生成**: 必要時にのみレンダリング

## 型安全性

現在はプレーン JavaScript を使用。将来的に:
- TypeScript への移行で型安全性向上
- JSDoc による型ヒント活用
- 入力値の厳密なバリデーション強化

## テスト戦略

モジュール化により以下が可能に:
- 個別モジュールの単体テスト
- 関数の純粋性により deterministic テスト
- ダーティテスト（UI なし）の実装

推奨テストケース:
- `utils.js` の全関数
- `trait-manager.js` の状態遷移
- `strategy-manager.js` の状態遷移
- `player-manager.js` のデータ変換
- 変化球の角度・強度計算（`breaking-ball-manager.js`）

## 残りの未実装モジュール

### `ui-renderer.js` (予定)
- `renderRosterWorkspace()`
- `renderDetailWorkspace(playerId)`
- `renderWorkspaceContent()`
- `renderWorkspaceTabs()`
- `renderTeamTabs(container)`

### `event-handlers.js` (予定)
- `bindRosterFilters()`
- `bindRosterSorting()`
- `bindDetailSubTabs(form)`
- `bindPresetHandlers(form)`
- `bindRealtimeFormUpdates(form)`

### `roster-manager.js` (予定)
- `sortRosterPlayers(players)`
- `getRosterColumns()`
- `matchesRosterFilters(player, filters)`
- `rosterRow(player)`

### `file-operations.js` (予定)
- `saveAll(options)`
- `openDataFileFromMenu()`
- `applyLoadedData(data, statusMessage, options)`

## マイグレーション注意点

既存の `renderer.js` のコードを以下のように分割:
1. 定数定義 → `constants.js`
2. ユーティリティ関数 → `utils.js`
3. 状態管理 → `state-manager.js`
4. 特定機能 → 対応モジュール
5. UI レンダリング → `ui-renderer.js`（今後）
6. イベントハンドリング → `event-handlers.js`（今後）

新しい `renderer.js` は統合エントリポイント。既存コードとの互換性は:
- 関数のシグネチャ変更なし
- 副作用の同じ保持
- 段階的な移行が可能

## 次のステップ

1. ✅ `constants.js` - 完了
2. ✅ `utils.js` - 完了
3. ✅ `state-manager.js` - 完了
4. ✅ `player-manager.js` - 完了
5. ✅ `trait-manager.js` - 完了
6. ✅ `strategy-manager.js` - 完了
7. ✅ `breaking-ball-manager.js` - 完了
8. ⏳ `ui-renderer.js` - 予定
9. ⏳ `event-handlers.js` - 予定
10. ⏳ `roster-manager.js` - 予定
11. ⏳ `file-operations.js` - 予定
12. ⏳ 統合された新 `renderer.js` の生成

---

**最終行数削減目標**: 3644行 → 約500-600行（統合インポート/ブートストラップのみ）
**モジュール数**: 12+ ファイル（保守性・拡張性向上）
