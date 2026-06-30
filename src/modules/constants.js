/**
 * 定数定義モジュール
 * アプリケーション全体で使用する定数を管理
 */

// タブID
export const ROSTER_TAB_ID = "__roster__";

// ポジション設定
export const POSITION_OPTIONS = [
  { key: "先発", category: "pitcher", shortLabel: "先" },
  { key: "中継ぎ", category: "pitcher", shortLabel: "継" },
  { key: "抑え", category: "pitcher", shortLabel: "抑" },
  { key: "捕手", category: "catcher", shortLabel: "捕" },
  { key: "一塁", category: "infield", shortLabel: "一" },
  { key: "二塁", category: "infield", shortLabel: "二" },
  { key: "三塁", category: "infield", shortLabel: "三" },
  { key: "遊撃", category: "infield", shortLabel: "遊" },
  { key: "外野", category: "outfield", shortLabel: "外" }
];

export const POSITION_OPTION_MAP = new Map(POSITION_OPTIONS.map((option) => [option.key, option]));

// ランク関連定数
export const RANK_LETTERS = ["A", "B", "C", "D", "E", "F", "G"];
export const POSITIVE_RANK_LETTERS = new Set(["A", "B", "C"]);
export const NEGATIVE_RANK_LETTERS = new Set(["E", "F", "G"]);
export const LINKED_RANKED_TRAIT_BASES = ["回復", "ケガしにくさ"];

// 特性定義
export const RANKED_TRAIT_BASES = [
  "チャンス", "対左投手", "盗塁", "走塁", "送球", "回復", "ケガしにくさ",
  "打たれ強さ", "対ピンチ", "対左打者", "ノビ", "クイック"
];

export const TOGGLE_TRAITS = [
  "奪三振", "キレ○", "緩急○", "球持ち○", "低め○", "逃げ球", "内角攻め",
  "リリース○", "牽制○", "対ランナー○", "要所○", "打球反応○",
  "フライボールピッチャー", "ゴロピッチャー", "球速安定", "乱調", "一発", "四球",
  "負け運", "勝ち運", "荒れ球", "抜け球", "ポーカーフェイス", "真っスラ",
  "回またぎ○", "火消し", "緊急登板○", "クロスファイヤー", "ナチュラルシュート",
  "ラインドライブ", "流し打ち", "広角打法", "パワーヒッター", "アベレージヒッター",
  "プルヒッター", "初球○", "粘り打ち", "固め打ち", "サヨナラ男", "逆境○", "満塁男",
  "決勝打", "カット打ち", "バント○", "内野安打○", "ヘッドスライディング",
  "ホーム突入", "対ストレート○", "対変化球○", "いぶし銀", "マルチ弾", "代打○",
  "存在感", "お祭り男", "死球集中", "ホーム死守", "フレーミング○", "ブロッキング",
  "巨人キラー", "広島キラー", "オリックスキラー", "三振", "エラー", "併殺"
];

export const PITCHER_RANKED_TRAIT_BASES = ["打たれ強さ", "対ピンチ", "対左打者", "ノビ", "クイック", "回復", "ケガしにくさ"];
export const HITTER_RANKED_TRAIT_BASES = ["チャンス", "対左投手", "盗塁", "走塁", "送球", "回復", "ケガしにくさ"];

export const PITCHER_TOGGLE_TRAITS = [
  "奪三振", "キレ○", "緩急○", "球持ち○", "低め○", "逃げ球", "内角攻め",
  "リリース○", "牽制○", "対ランナー○", "要所○", "打球反応○",
  "フライボールピッチャー", "ゴロピッチャー", "球速安定", "乱調", "一発", "四球",
  "負け運", "勝ち運", "荒れ球", "抜け球", "ポーカーフェイス", "真っスラ",
  "回またぎ○", "火消し", "緊急登板○", "クロスファイヤー", "ナチュラルシュート"
];

export const HITTER_TOGGLE_TRAITS = [
  "ラインドライブ", "流し打ち", "広角打法", "パワーヒッター", "アベレージヒッター",
  "プルヒッター", "初球○", "粘り打ち", "固め打ち", "サヨナラ男", "逆境○", "満塁男",
  "決勝打", "カット打ち", "バント○", "内野安打○", "ヘッドスライディング",
  "ホーム突入", "対ストレート○", "対変化球○", "いぶし銀", "マルチ弾", "代打○",
  "存在感", "お祭り男", "死球集中", "ホーム死守", "フレーミング○", "ブロッキング",
  "巨人キラー", "広島キラー", "オリックスキラー", "三振", "エラー", "併殺"
];

export const KNOWN_TOGGLE_TRAITS = new Set(TOGGLE_TRAITS);
export const KNOWN_RANKED_TRAITS = new Set(RANKED_TRAIT_BASES);
export const KNOWN_PITCHER_TOGGLE_TRAITS = new Set(PITCHER_TOGGLE_TRAITS);
export const KNOWN_HITTER_TOGGLE_TRAITS = new Set(HITTER_TOGGLE_TRAITS);
export const KNOWN_PITCHER_RANKED_TRAITS = new Set(PITCHER_RANKED_TRAIT_BASES);
export const KNOWN_HITTER_RANKED_TRAITS = new Set(HITTER_RANKED_TRAIT_BASES);

// トレイトエディタ設定
export const TRAIT_EDITOR_CONFIGS = {
  pitcher: {
    mode: "pitcher",
    label: "投手",
    rankedBases: PITCHER_RANKED_TRAIT_BASES,
    toggleTraits: PITCHER_TOGGLE_TRAITS,
    knownRankedSet: KNOWN_PITCHER_RANKED_TRAITS,
    knownToggleSet: KNOWN_PITCHER_TOGGLE_TRAITS
  },
  hitter: {
    mode: "hitter",
    label: "野手",
    rankedBases: HITTER_RANKED_TRAIT_BASES,
    toggleTraits: HITTER_TOGGLE_TRAITS,
    knownRankedSet: KNOWN_HITTER_RANKED_TRAITS,
    knownToggleSet: KNOWN_HITTER_TOGGLE_TRAITS
  }
};

// 投手戦略オプション
export const PITCHER_STRATEGY_OPTIONS = [
  "調子次第", "調子安定", "テンポ○", "勝利投手", "リード時", "接戦時", "守護神",
  "中継ぎエース", "ビハインドでも", "変化球中心", "スタミナ限界", "投球位置右",
  "投球位置左", "おまかせ"
];

// 野手戦略オプション
export const HITTER_STRATEGY_OPTIONS = [
  "代打要員", "積極打法", "慎重打法", "ミート多用", "強振多用", "選球眼",
  "積極走塁", "慎重走塁", "積極盗塁", "慎重盗塁", "積極守備", "慎重守備",
  "チームプレイ○", "おまかせ"
];

// 戦略エディタ設定
export const STRATEGY_EDITOR_CONFIGS = {
  pitcher: {
    mode: "pitcher",
    label: "投手",
    options: PITCHER_STRATEGY_OPTIONS,
    knownSet: new Set(PITCHER_STRATEGY_OPTIONS)
  },
  hitter: {
    mode: "hitter",
    label: "野手",
    options: HITTER_STRATEGY_OPTIONS,
    knownSet: new Set(HITTER_STRATEGY_OPTIONS)
  }
};

// 変化球レベル
export const BREAKING_BALL_LEVELS = [1, 2, 3, 4, 5, 6, 7];

// 変化球ファミリー定義
export const BREAKING_BALL_FAMILIES = [
  {
    id: "shoot",
    label: "シュート系",
    hasLevel: true,
    options: ["シュート", "Hシュート", "高速シュート", "シンキングツーシーム"]
  },
  {
    id: "straight",
    label: "ストレート系",
    hasLevel: true,
    options: ["ツーシーム", "ツーシームファスト", "ムービングファスト", "超スローボール"]
  },
  {
    id: "slider",
    label: "スライダー系",
    hasLevel: true,
    options: ["スライダー", "Hスライダー", "Vスライダー", "カットボール", "スラーブ"]
  },
  {
    id: "sinker",
    label: "シンカー系",
    hasLevel: true,
    options: ["シンカー", "Hシンカー", "スクリュー", "サークルチェンジ", "シンキングスプリット", "チェンジアップ"]
  },
  {
    id: "fork",
    label: "フォーク系",
    hasLevel: true,
    options: ["フォーク", "SFF", "パーム", "Vフォーク", "ナックル"]
  },
  {
    id: "curve",
    label: "カーブ系",
    hasLevel: true,
    options: ["カーブ", "スローカーブ", "ドロップ", "ドロップカーブ", "ナックルカーブ", "パワーカーブ"]
  }
];

export const BREAKING_BALL_FAMILY_MAP = new Map(BREAKING_BALL_FAMILIES.map((family) => [family.id, family]));
export const BREAKING_BALL_OPTION_TO_FAMILY = new Map(
  BREAKING_BALL_FAMILIES.flatMap((family) => family.options.map((name) => [name, family.id]))
);

// 変化球レイアウト
export const BREAKING_BALL_LAYOUT_RIGHT = [
  ["shoot", "straight"],
  ["slider", "sinker"],
  ["fork", "curve"]
];

export const BREAKING_BALL_LAYOUT_LEFT = [
  ["straight", "shoot"],
  ["sinker", "slider"],
  ["curve", "fork"]
];

// アプリ設定関連
export const APP_SETTINGS_STORAGE_KEY = "pawapuro-team-manager-settings";

export const BREAKING_BALL_DISPLAY_MODES = {
  STANDARD: "standard",
  ARROW: "arrow"
};

export const STARTUP_OPEN_MODES = {
  NEW_FILE: "new-file",
  OPEN_FILE_DIALOG: "open-file-dialog",
  OPEN_LAST_EDITED_FILE: "open-last-edited-file"
};

export const FILE_DIALOG_DEFAULT_DIRECTORY_MODES = {
  DOCUMENTS: "documents",
  LAST_OPENED_DIRECTORY: "last-opened-directory"
};

// 変化球方向レイアウト
export const BREAKING_BALL_DIRECTION_LAYOUTS = {
  right: [
    { familyId: "straight", angle: 270 },
    { familyId: "slider", angle: 0 },
    { familyId: "curve", angle: 45 },
    { familyId: "fork", angle: 90 },
    { familyId: "sinker", angle: 135 },
    { familyId: "shoot", angle: 180 }
  ],
  left: [
    { familyId: "straight", angle: 270 },
    { familyId: "shoot", angle: 0 },
    { familyId: "sinker", angle: 45 },
    { familyId: "fork", angle: 90 },
    { familyId: "curve", angle: 135 },
    { familyId: "slider", angle: 180 }
  ]
};

// ポジティブ特性
export const POSITIVE_SPECIAL_TRAITS = new Set([
  "DeNAキラー", "アウトコースヒッター", "アベレージヒッター", "いぶし銀",
  "インコースヒッター", "お祭り男", "オリックスキラー", "かく乱", "カット打ち",
  "キャッチャー", "キレ○", "クイック", "クロスファイヤー", "ケガしにくさ",
  "サヨナラ男", "ジャイロボール", "ダメ押し", "チャンス", "チャンスメーカー",
  "ナチュラルシュート", "ノビ", "ハイボールヒッター", "パワーヒッター", "バント○",
  "バント職人", "ファイターズキラー", "プルヒッター", "フレーミング○",
  "プレッシャーラン", "ブロッキング", "ヘッドスライディング", "ポーカーフェイス",
  "ホークスキラー", "ホーム死守", "ホーム突入", "マルチ弾", "ヤクルトキラー",
  "ラインドライブ", "リリース○", "レーザービーム", "ローボールヒッター",
  "ロッテキラー", "悪球打ち", "意外性", "夏男", "火消し", "回またぎ○", "回復",
  "楽天キラー", "緩急○", "逆境○", "球持ち○", "球速安定", "巨人キラー",
  "恐怖の満塁男", "緊急登板○", "決勝打", "牽制○", "固め打ち", "広角打法",
  "広島キラー", "荒れ球", "高速チャージ", "国際大会○", "阪神キラー",
  "死球集中", "守備職人", "秋男", "春男", "初球○", "勝ち運", "尻上がり",
  "真っスラ", "走塁", "送球", "存在感", "打たれ強さ", "打球反応○",
  "対ストレート○", "対ピンチ", "対ランナー○", "対左打者", "対左投手",
  "対変化球○", "代打○", "奪三振", "中日キラー", "低め○", "鉄腕", "盗塁",
  "逃げ球", "内角攻め", "内野安打○", "粘り打ち", "満塁男", "要所○",
  "流し打ち", "力配分"
]);

// ネガティブ特性
export const NEGATIVE_SPECIAL_TRAITS = new Set([
  "エラー", "キャッチャー", "クイック", "ケガしにくさ", "ゴロピッチャー",
  "スロースターター", "チャンス", "ノビ", "フライボールピッチャー", "一発",
  "回復", "軽い球", "三振", "四球", "寸前", "走塁", "送球", "打たれ強さ",
  "対ピンチ", "対ランナー", "対左打者", "対左投手", "盗塁", "抜け球",
  "負け運", "併殺", "乱調"
]);
