const ROSTER_TAB_ID = "__roster__";

const POSITION_OPTIONS = [
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

const POSITION_OPTION_MAP = new Map(POSITION_OPTIONS.map((option) => [option.key, option]));

const RANK_LETTERS = ["A", "B", "C", "D", "E", "F", "G"];
const POSITIVE_RANK_LETTERS = new Set(["A", "B", "C"]);
const NEGATIVE_RANK_LETTERS = new Set(["E", "F", "G"]);
const LINKED_RANKED_TRAIT_BASES = ["回復", "ケガしにくさ"];

const RANKED_TRAIT_BASES = [
  "チャンス",
  "対左投手",
  "盗塁",
  "走塁",
  "送球",
  "回復",
  "ケガしにくさ",
  "打たれ強さ",
  "対ピンチ",
  "対左打者",
  "ノビ",
  "クイック"
];

const TOGGLE_TRAITS = [
  "奪三振",
  "キレ○",
  "緩急○",
  "球持ち○",
  "低め○",
  "逃げ球",
  "内角攻め",
  "リリース○",
  "牽制○",
  "対ランナー○",
  "要所○",
  "打球反応○",
  "フライボールピッチャー",
  "ゴロピッチャー",
  "球速安定",
  "乱調",
  "一発",
  "四球",
  "負け運",
  "勝ち運",
  "荒れ球",
  "抜け球",
  "ポーカーフェイス",
  "真っスラ",
  "回またぎ○",
  "火消し",
  "緊急登板○",
  "クロスファイヤー",
  "ナチュラルシュート",
  "ラインドライブ",
  "流し打ち",
  "広角打法",
  "パワーヒッター",
  "アベレージヒッター",
  "プルヒッター",
  "初球○",
  "粘り打ち",
  "固め打ち",
  "サヨナラ男",
  "逆境○",
  "満塁男",
  "決勝打",
  "カット打ち",
  "バント○",
  "内野安打○",
  "ヘッドスライディング",
  "ホーム突入",
  "対ストレート○",
  "対変化球○",
  "いぶし銀",
  "マルチ弾",
  "代打○",
  "存在感",
  "お祭り男",
  "死球集中",
  "ホーム死守",
  "フレーミング○",
  "ブロッキング",
  "巨人キラー",
  "広島キラー",
  "オリックスキラー",
  "三振",
  "エラー",
  "併殺"
];

const PITCHER_RANKED_TRAIT_BASES = ["打たれ強さ", "対ピンチ", "対左打者", "ノビ", "クイック", "回復", "ケガしにくさ"];
const HITTER_RANKED_TRAIT_BASES = ["チャンス", "対左投手", "盗塁", "走塁", "送球", "回復", "ケガしにくさ"];

const PITCHER_TOGGLE_TRAITS = [
  "奪三振",
  "キレ○",
  "緩急○",
  "球持ち○",
  "低め○",
  "逃げ球",
  "内角攻め",
  "リリース○",
  "牽制○",
  "対ランナー○",
  "要所○",
  "打球反応○",
  "フライボールピッチャー",
  "ゴロピッチャー",
  "球速安定",
  "乱調",
  "一発",
  "四球",
  "負け運",
  "勝ち運",
  "荒れ球",
  "抜け球",
  "ポーカーフェイス",
  "真っスラ",
  "回またぎ○",
  "火消し",
  "緊急登板○",
  "クロスファイヤー",
  "ナチュラルシュート"
];

const HITTER_TOGGLE_TRAITS = [
  "ラインドライブ",
  "流し打ち",
  "広角打法",
  "パワーヒッター",
  "アベレージヒッター",
  "プルヒッター",
  "初球○",
  "粘り打ち",
  "固め打ち",
  "サヨナラ男",
  "逆境○",
  "満塁男",
  "決勝打",
  "カット打ち",
  "バント○",
  "内野安打○",
  "ヘッドスライディング",
  "ホーム突入",
  "対ストレート○",
  "対変化球○",
  "いぶし銀",
  "マルチ弾",
  "代打○",
  "存在感",
  "お祭り男",
  "死球集中",
  "ホーム死守",
  "フレーミング○",
  "ブロッキング",
  "巨人キラー",
  "広島キラー",
  "オリックスキラー",
  "三振",
  "エラー",
  "併殺"
];

const POSITIVE_SPECIAL_TRAITS = new Set([
  "DeNAキラー",
  "アウトコースヒッター",
  "アベレージヒッター",
  "いぶし銀",
  "インコースヒッター",
  "お祭り男",
  "オリックスキラー",
  "かく乱",
  "カット打ち",
  "キャッチャー",
  "キレ○",
  "クイック",
  "クロスファイヤー",
  "ケガしにくさ",
  "サヨナラ男",
  "ジャイロボール",
  "ダメ押し",
  "チャンス",
  "チャンスメーカー",
  "ナチュラルシュート",
  "ノビ",
  "ハイボールヒッター",
  "パワーヒッター",
  "バント○",
  "バント職人",
  "ファイターズキラー",
  "プルヒッター",
  "フレーミング○",
  "プレッシャーラン",
  "ブロッキング",
  "ヘッドスライディング",
  "ポーカーフェイス",
  "ホークスキラー",
  "ホーム死守",
  "ホーム突入",
  "マルチ弾",
  "ヤクルトキラー",
  "ラインドライブ",
  "リリース○",
  "レーザービーム",
  "ローボールヒッター",
  "ロッテキラー",
  "悪球打ち",
  "意外性",
  "夏男",
  "火消し",
  "回またぎ○",
  "回復",
  "楽天キラー",
  "緩急○",
  "逆境○",
  "球持ち○",
  "球速安定",
  "巨人キラー",
  "恐怖の満塁男",
  "緊急登板○",
  "決勝打",
  "牽制○",
  "固め打ち",
  "広角打法",
  "広島キラー",
  "荒れ球",
  "高速チャージ",
  "国際大会○",
  "阪神キラー",
  "死球集中",
  "守備職人",
  "秋男",
  "春男",
  "初球○",
  "勝ち運",
  "尻上がり",
  "真っスラ",
  "走塁",
  "送球",
  "存在感",
  "打たれ強さ",
  "打球反応○",
  "対ストレート○",
  "対ピンチ",
  "対ランナー○",
  "対左打者",
  "対左投手",
  "対変化球○",
  "代打○",
  "奪三振",
  "中日キラー",
  "低め○",
  "鉄腕",
  "盗塁",
  "逃げ球",
  "内角攻め",
  "内野安打○",
  "粘り打ち",
  "満塁男",
  "要所○",
  "流し打ち",
  "力配分"
]);

const NEGATIVE_SPECIAL_TRAITS = new Set([
  "エラー",
  "キャッチャー",
  "クイック",
  "ケガしにくさ",
  "ゴロピッチャー",
  "スロースターター",
  "チャンス",
  "ノビ",
  "フライボールピッチャー",
  "一発",
  "回復",
  "軽い球",
  "三振",
  "四球",
  "寸前",
  "走塁",
  "送球",
  "打たれ強さ",
  "対ピンチ",
  "対ランナー",
  "対左打者",
  "対左投手",
  "盗塁",
  "抜け球",
  "負け運",
  "併殺",
  "乱調"
]);

const KNOWN_TOGGLE_TRAITS = new Set(TOGGLE_TRAITS);
const KNOWN_RANKED_TRAITS = new Set(RANKED_TRAIT_BASES);
const KNOWN_PITCHER_TOGGLE_TRAITS = new Set(PITCHER_TOGGLE_TRAITS);
const KNOWN_HITTER_TOGGLE_TRAITS = new Set(HITTER_TOGGLE_TRAITS);
const KNOWN_PITCHER_RANKED_TRAITS = new Set(PITCHER_RANKED_TRAIT_BASES);
const KNOWN_HITTER_RANKED_TRAITS = new Set(HITTER_RANKED_TRAIT_BASES);

const TRAIT_EDITOR_CONFIGS = {
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

const PITCHER_STRATEGY_OPTIONS = [
  "調子次第",
  "調子安定",
  "テンポ○",
  "勝利投手",
  "リード時",
  "接戦時",
  "守護神",
  "中継ぎエース",
  "ビハインドでも",
  "変化球中心",
  "スタミナ限界",
  "投球位置右",
  "投球位置左",
  "おまかせ"
];

const HITTER_STRATEGY_OPTIONS = [
  "代打要員",
  "積極打法",
  "慎重打法",
  "ミート多用",
  "強振多用",
  "選球眼",
  "積極走塁",
  "慎重走塁",
  "積極盗塁",
  "慎重盗塁",
  "積極守備",
  "慎重守備",
  "チームプレイ○",
  "おまかせ"
];

const STRATEGY_EDITOR_CONFIGS = {
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

const BREAKING_BALL_LEVELS = [1, 2, 3, 4, 5, 6, 7];

const BREAKING_BALL_FAMILIES = [
  {
    id: "shoot",
    label: "シュート系",
    hasLevel: true,
    options: ["シュート", "Hシュート", "高速シュート", "シンキングツーシーム"]
  },
  {
    id: "straight",
    label: "ストレート系",
    hasLevel: false,
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

const BREAKING_BALL_FAMILY_MAP = new Map(BREAKING_BALL_FAMILIES.map((family) => [family.id, family]));

const BREAKING_BALL_OPTION_TO_FAMILY = new Map(
  BREAKING_BALL_FAMILIES.flatMap((family) => family.options.map((name) => [name, family.id]))
);

const BREAKING_BALL_LAYOUT_RIGHT = [
  ["shoot", "straight"],
  ["slider", "sinker"],
  ["fork", "curve"]
];

const BREAKING_BALL_LAYOUT_LEFT = [
  ["straight", "shoot"],
  ["sinker", "slider"],
  ["curve", "fork"]
];

const APP_SETTINGS_STORAGE_KEY = "pawapuro-team-manager-settings";
const BREAKING_BALL_DISPLAY_MODES = {
  STANDARD: "standard",
  ARROW: "arrow"
};
const STARTUP_OPEN_MODES = {
  NEW_FILE: "new-file",
  OPEN_FILE_DIALOG: "open-file-dialog",
  OPEN_LAST_EDITED_FILE: "open-last-edited-file"
};
const FILE_DIALOG_DEFAULT_DIRECTORY_MODES = {
  DOCUMENTS: "documents",
  LAST_OPENED_DIRECTORY: "last-opened-directory"
};

const BREAKING_BALL_DIRECTION_LAYOUTS = {
  right: [
    { familyId: "slider", angle: 0 },
    { familyId: "curve", angle: 45 },
    { familyId: "fork", angle: 90 },
    { familyId: "sinker", angle: 135 },
    { familyId: "shoot", angle: 180 }
  ],
  left: [
    { familyId: "shoot", angle: 0 },
    { familyId: "sinker", angle: 45 },
    { familyId: "fork", angle: 90 },
    { familyId: "curve", angle: 135 },
    { familyId: "slider", angle: 180 }
  ]
};

const state = {
  data: null,
  lastSavedSnapshot: "",
  selectedTeamId: null,
  openTabs: [],
  playerDrafts: {},
  dirtyPlayerTabs: new Set(),
  activeWorkspaceTab: ROSTER_TAB_ID,
  rosterFilters: {
    keyword: "",
    type: "all",
    position: ""
  },
  rosterViewMode: "both",
  rosterSort: {
    key: "number",
    direction: "asc"
  },
  settings: createDefaultSettings()
};

const els = {
  workspaceTabs: document.getElementById("workspaceTabs"),
  workspaceContent: document.getElementById("workspaceContent"),
  statusBar: document.getElementById("statusBar"),
  saveAllBtn: document.getElementById("saveAllBtn")
};

function setStatus(message) {
  els.statusBar.textContent = message;
}

function serializeDataSnapshot(data) {
  return JSON.stringify(data ?? null);
}

function hasUnsavedChanges() {
  if (!state.data) {
    return false;
  }

  if (state.dirtyPlayerTabs.size > 0) {
    return true;
  }

  return serializeDataSnapshot(state.data) !== state.lastSavedSnapshot;
}

function getCurrentTeam() {
  return state.data?.teams.find((team) => team.id === state.selectedTeamId) || null;
}

function findPlayer(playerId) {
  for (const team of state.data.teams) {
    const player = team.players.find((p) => p.id === playerId);
    if (player) {
      return { player, team };
    }
  }
  return null;
}

function stringifyComparable(obj) {
  return JSON.stringify(obj);
}

function buildFormSnapshot(form) {
  const snapshot = {};
  const ignoredNames = new Set(["p_breakingBallsExtra"]);
  form.querySelectorAll("input[name], select[name], textarea[name]").forEach((field) => {
    if (ignoredNames.has(field.name)) return;
    snapshot[field.name] = String(field.value ?? "");
  });
  return snapshot;
}

function applyFormSnapshot(form, snapshot) {
  Object.entries(snapshot || {}).forEach(([name, value]) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;
    field.value = value;
  });
}

function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createDefaultSettings() {
  return {
    breakingBallDisplayMode: BREAKING_BALL_DISPLAY_MODES.STANDARD,
    breakingBallDisplayNameInList: true,
    startupOpenMode: STARTUP_OPEN_MODES.NEW_FILE,
    fileDialogDefaultDirectoryMode: FILE_DIALOG_DEFAULT_DIRECTORY_MODES.DOCUMENTS,
    lastEditedFilePath: ""
  };
}

function normalizeAppSettings(settings) {
  const base = createDefaultSettings();
  const mode = String(settings?.breakingBallDisplayMode || "").trim();
  const validModes = new Set(Object.values(BREAKING_BALL_DISPLAY_MODES));
  const breakingBallDisplayNameInList = Boolean(settings?.breakingBallDisplayNameInList);
  const startupOpenMode = String(settings?.startupOpenMode || "").trim();
  const validStartupOpenModes = new Set(Object.values(STARTUP_OPEN_MODES));
  const fileDialogDefaultDirectoryMode = String(settings?.fileDialogDefaultDirectoryMode || "").trim();
  const validDirectoryModes = new Set(Object.values(FILE_DIALOG_DEFAULT_DIRECTORY_MODES));
  const lastEditedFilePath = String(settings?.lastEditedFilePath || "").trim();

  return {
    ...base,
    ...(settings && typeof settings === "object" ? settings : {}),
    breakingBallDisplayMode: validModes.has(mode) ? mode : base.breakingBallDisplayMode,
    breakingBallDisplayNameInList,
    startupOpenMode: validStartupOpenModes.has(startupOpenMode) ? startupOpenMode : base.startupOpenMode,
    fileDialogDefaultDirectoryMode: validDirectoryModes.has(fileDialogDefaultDirectoryMode)
      ? fileDialogDefaultDirectoryMode
      : base.fileDialogDefaultDirectoryMode,
    lastEditedFilePath
  };
}

function loadAppSettings() {
  try {
    const raw = window.localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return createDefaultSettings();
    }

    return normalizeAppSettings(JSON.parse(raw));
  } catch {
    return createDefaultSettings();
  }
}

function persistAppSettings() {
  try {
    window.localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(state.settings));
  } catch {
    // ignore persistence failures
  }
}

function applyAppSettings(nextSettings, options = {}) {
  const { rerender = true, statusMessage = "" } = options;
  state.settings = normalizeAppSettings(nextSettings);
  persistAppSettings();

  if (rerender && state.data) {
    renderWorkspaceContent();
  }

  if (statusMessage) {
    setStatus(statusMessage);
  }
}

function getBreakingBallDisplayMode() {
  return state.settings?.breakingBallDisplayMode || BREAKING_BALL_DISPLAY_MODES.STANDARD;
}

function getBreakingBallDisplayNameInList() {
  return state.settings?.breakingBallDisplayNameInList ?? true;
}

function getStartupOpenMode() {
  return state.settings?.startupOpenMode || STARTUP_OPEN_MODES.NEW_FILE;
}

function getFileDialogDefaultDirectoryMode() {
  return state.settings?.fileDialogDefaultDirectoryMode || FILE_DIALOG_DEFAULT_DIRECTORY_MODES.DOCUMENTS;
}

function getLastEditedFilePath() {
  return String(state.settings?.lastEditedFilePath || "").trim();
}

function rememberLastEditedFilePath(dataPath) {
  const nextPath = String(dataPath || "").trim();
  if (!nextPath || nextPath === getLastEditedFilePath()) {
    return;
  }

  applyAppSettings(
    {
      ...state.settings,
      lastEditedFilePath: nextPath
    },
    { rerender: false }
  );
}

function getBreakingBallDirectionLayout(throwHand) {
  return throwHand === "left" ? BREAKING_BALL_DIRECTION_LAYOUTS.left : BREAKING_BALL_DIRECTION_LAYOUTS.right;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function parsePositionText(text) {
  const tokens = uniqueStrings(String(text || "").split("/"));
  return {
    primary: tokens[0] || "",
    secondary: tokens.slice(1)
  };
}

function normalizePositionsValue(value) {
  const fallback = { primary: "", secondary: [] };
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const primary = String(value.primary || "").trim();
  const secondary = uniqueStrings(Array.isArray(value.secondary) ? value.secondary : []).filter((item) => item !== primary);
  return { primary, secondary };
}

function formatPositions(positions) {
  const normalized = normalizePositionsValue(positions);
  const ordered = normalized.primary
    ? [normalized.primary, ...normalized.secondary.filter((item) => item !== normalized.primary)]
    : normalized.secondary;
  return ordered.join("/");
}

function getPlayerPositions(player) {
  const structured = normalizePositionsValue(player.positions);
  if (structured.primary || structured.secondary.length > 0) {
    return structured;
  }
  return parsePositionText(player.position);
}

function getPlayerPositionLabel(player) {
  return formatPositions(getPlayerPositions(player));
}

function getPositionOption(positionKey) {
  return POSITION_OPTION_MAP.get(positionKey) || null;
}

function getMainPositionCategory(player) {
  const primary = getPlayerPositions(player).primary;
  return getPositionOption(primary)?.category || "neutral";
}

function buildPositionBadge(player) {
  const category = getMainPositionCategory(player);
  const categoryClass = category === "neutral" ? "" : ` ${category}`;
  return `<span class="player-name-badge${categoryClass}">${escapeHtml(player.name ?? "")}</span>`;
}

function getTraitEditorConfig(mode) {
  return TRAIT_EDITOR_CONFIGS[mode] || TRAIT_EDITOR_CONFIGS.hitter;
}

function getStrategyEditorConfig(mode) {
  return STRATEGY_EDITOR_CONFIGS[mode] || STRATEGY_EDITOR_CONFIGS.hitter;
}

function decodeLegacyTrait(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return { mode: null, name: "" };
  }

  if (raw.startsWith("投手:")) {
    return { mode: "pitcher", name: raw.slice(3).trim() };
  }

  if (raw.startsWith("野手:")) {
    return { mode: "hitter", name: raw.slice(3).trim() };
  }

  return { mode: null, name: raw };
}

function decodeLegacyStrategy(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return { mode: null, name: "" };
  }

  if (raw.startsWith("投手:")) {
    return { mode: "pitcher", name: raw.slice(3).trim() };
  }

  if (raw.startsWith("野手:")) {
    return { mode: "hitter", name: raw.slice(3).trim() };
  }

  return { mode: null, name: raw };
}

function buildLegacyCombinedTraits(pitcherTraits, hitterTraits) {
  const pitcher = uniqueStrings(Array.isArray(pitcherTraits) ? pitcherTraits : []);
  const hitter = uniqueStrings(Array.isArray(hitterTraits) ? hitterTraits : []);
  const inHitter = new Set(hitter);
  const inPitcher = new Set(pitcher);
  const result = [];

  for (const name of pitcher) {
    result.push(inHitter.has(name) ? `投手:${name}` : name);
  }

  for (const name of hitter) {
    result.push(inPitcher.has(name) ? `野手:${name}` : name);
  }

  return result;
}

function buildLegacyCombinedStrategies(pitcherItems, hitterItems) {
  const pitcher = uniqueStrings(Array.isArray(pitcherItems) ? pitcherItems : []);
  const hitter = uniqueStrings(Array.isArray(hitterItems) ? hitterItems : []);
  const inHitter = new Set(hitter);
  const inPitcher = new Set(pitcher);
  const result = [];

  for (const name of pitcher) {
    result.push(inHitter.has(name) ? `投手:${name}` : name);
  }

  for (const name of hitter) {
    result.push(inPitcher.has(name) ? `野手:${name}` : name);
  }

  return result;
}

function splitStrategiesByEditorMode(items, playerType = "二刀流") {
  const pitcher = [];
  const hitter = [];

  for (const raw of Array.isArray(items) ? items : []) {
    const decoded = decodeLegacyStrategy(raw);
    const value = decoded.name;
    if (!value) continue;

    if (decoded.mode === "pitcher") {
      pitcher.push(value);
      continue;
    }

    if (decoded.mode === "hitter") {
      hitter.push(value);
      continue;
    }

    const isPitcher = STRATEGY_EDITOR_CONFIGS.pitcher.knownSet.has(value);
    const isHitter = STRATEGY_EDITOR_CONFIGS.hitter.knownSet.has(value);

    if (isPitcher && !isHitter) {
      pitcher.push(value);
      continue;
    }

    if (isHitter && !isPitcher) {
      hitter.push(value);
      continue;
    }

    if (playerType === "投手") {
      pitcher.push(value);
    } else if (playerType === "野手") {
      hitter.push(value);
    } else {
      hitter.push(value);
    }
  }

  return {
    pitcher: uniqueStrings(pitcher),
    hitter: uniqueStrings(hitter)
  };
}

function getPlayerStrategiesByMode(player, mode) {
  const modeKey = mode === "pitcher" ? "strategyPitcher" : "strategyHitter";
  const configured = uniqueStrings(Array.isArray(player[modeKey]) ? player[modeKey].map((item) => decodeLegacyStrategy(item).name) : []);
  if (configured.length > 0) {
    return configured;
  }

  return splitStrategiesByEditorMode(player.strategy, player.type)[mode];
}

function getPlayerAllStrategies(player) {
  return buildLegacyCombinedStrategies(getPlayerStrategiesByMode(player, "pitcher"), getPlayerStrategiesByMode(player, "hitter"));
}

function isRankedTraitTextForBases(trait, rankedBases) {
  for (const base of rankedBases) {
    if (!trait.startsWith(base)) continue;
    const suffix = trait.slice(base.length);
    if (RANK_LETTERS.includes(suffix)) {
      return true;
    }
  }
  return false;
}

function splitTraitsByEditorMode(traits, playerType = "二刀流") {
  const pitcher = [];
  const hitter = [];

  for (const raw of Array.isArray(traits) ? traits : []) {
    const decoded = decodeLegacyTrait(raw);
    const trait = decoded.name;
    if (!trait) continue;

    if (decoded.mode === "pitcher") {
      pitcher.push(trait);
      continue;
    }

    if (decoded.mode === "hitter") {
      hitter.push(trait);
      continue;
    }

    const isPitcherRanked = isRankedTraitTextForBases(trait, PITCHER_RANKED_TRAIT_BASES);
    const isHitterRanked = isRankedTraitTextForBases(trait, HITTER_RANKED_TRAIT_BASES);
    if (isPitcherRanked || isHitterRanked) {
      if (isPitcherRanked && !isHitterRanked) {
        pitcher.push(trait);
      } else if (isHitterRanked && !isPitcherRanked) {
        hitter.push(trait);
      } else if (playerType === "投手") {
        pitcher.push(trait);
      } else if (playerType === "野手") {
        hitter.push(trait);
      } else {
        pitcher.push(trait);
        hitter.push(trait);
      }
      continue;
    }

    const isPitcherToggle = KNOWN_PITCHER_TOGGLE_TRAITS.has(trait);
    const isHitterToggle = KNOWN_HITTER_TOGGLE_TRAITS.has(trait);
    if (isPitcherToggle || isHitterToggle) {
      if (isPitcherToggle) pitcher.push(trait);
      if (isHitterToggle) hitter.push(trait);
      continue;
    }

    if (playerType === "投手") {
      pitcher.push(trait);
    } else if (playerType === "野手") {
      hitter.push(trait);
    } else {
      hitter.push(trait);
    }
  }

  return {
    pitcher: uniqueStrings(pitcher),
    hitter: uniqueStrings(hitter)
  };
}

function getPlayerTraitsByMode(player, mode) {
  const modeKey = mode === "pitcher" ? "traitsPitcher" : "traitsHitter";
  const configured = uniqueStrings(Array.isArray(player[modeKey]) ? player[modeKey].map((item) => decodeLegacyTrait(item).name) : []);
  if (configured.length > 0) {
    return configured;
  }

  return splitTraitsByEditorMode(player.traits, player.type)[mode];
}

function getPlayerAllTraits(player) {
  return buildLegacyCombinedTraits(getPlayerTraitsByMode(player, "pitcher"), getPlayerTraitsByMode(player, "hitter"));
}

function buildPlayerSnapshot(player) {
  const pitcherTraits = getPlayerTraitsByMode(player, "pitcher").join(",");
  const hitterTraits = getPlayerTraitsByMode(player, "hitter").join(",");
  const pitcherStrategy = getPlayerStrategiesByMode(player, "pitcher").join(",");
  const hitterStrategy = getPlayerStrategiesByMode(player, "hitter").join(",");
  const breakingBalls = (player.pitcher?.breakingBalls || [])
    .map((ball) => {
      const name = String(ball.name || "").trim();
      const familyId = getBreakingBallFamily(name);
      const family = familyId ? BREAKING_BALL_FAMILY_MAP.get(familyId) : null;
      const level = family?.hasLevel === false ? 0 : clamp(toInt(ball.level, 1), 1, 7);
      return level > 0 ? `${name}:${level}` : name;
    })
    .join("\n");

  return {
    name: String(player.name || ""),
    number: String(toInt(player.number, 0)),
    age: String(toInt(player.age, 18)),
    type: String(player.type || "野手"),
    position: String(getPlayerPositionLabel(player) || ""),
    hand: String(player.hand || ""),
    h_trajectory: String(toInt(player.hitter?.trajectory, 1)),
    h_contact: String(toInt(player.hitter?.contact, 1)),
    h_power: String(toInt(player.hitter?.power, 1)),
    h_speed: String(toInt(player.hitter?.speed, 1)),
    h_arm: String(toInt(player.hitter?.arm, 1)),
    h_fielding: String(toInt(player.hitter?.fielding, 1)),
    h_catching: String(toInt(player.hitter?.catching, 1)),
    p_velocity: String(toInt(player.pitcher?.velocity, 120)),
    p_control: String(toInt(player.pitcher?.control, 1)),
    p_stamina: String(toInt(player.pitcher?.stamina, 1)),
    p_breakingBalls: breakingBalls,
    traits_pitcher: pitcherTraits,
    traits_hitter: hitterTraits,
    strategy_pitcher: pitcherStrategy,
    strategy_hitter: hitterStrategy
  };
}

function updatePlayerDraftFromForm(form) {
  const playerId = form.dataset.playerId;
  if (!playerId) return;
  const target = findPlayer(playerId);
  if (!target) return;

  const base = buildPlayerSnapshot(target.player);
  const draft = buildFormSnapshot(form);
  const hasChanges = stringifyComparable(base) !== stringifyComparable(draft);

  const wasDirty = state.dirtyPlayerTabs.has(playerId);

  if (hasChanges) {
    state.playerDrafts[playerId] = draft;
    state.dirtyPlayerTabs.add(playerId);
  } else {
    delete state.playerDrafts[playerId];
    state.dirtyPlayerTabs.delete(playerId);
  }

  const isDirty = state.dirtyPlayerTabs.has(playerId);
  if (wasDirty !== isDirty) {
    renderWorkspaceTabs();
  }
}

function clearPlayerDraft(playerId) {
  delete state.playerDrafts[playerId];
  state.dirtyPlayerTabs.delete(playerId);
}

function isPlayerTabDirty(playerId) {
  return state.dirtyPlayerTabs.has(playerId);
}

function gradeByValue(value) {
  if (value >= 90) return "S";
  if (value >= 80) return "A";
  if (value >= 70) return "B";
  if (value >= 60) return "C";
  if (value >= 50) return "D";
  if (value >= 40) return "E";
  if (value >= 20) return "F";
  return "G";
}

function formatRankedNumber(value) {
  const safeValue = toInt(value, 0);
  const grade = gradeByValue(safeValue);
  return `<span class="roster-rank grade-${grade}">${grade}</span><span class="roster-value">${safeValue}</span>`;
}

function getBreakingBallOrderKeyFromNineCounterClockwise(angle) {
  const normalized = ((toInt(angle, 0) % 360) + 360) % 360;
  return (180 - normalized + 360) % 360;
}

function getPlayerBreakingBallDirectionalEntries(player) {
  const rawBreakingBalls = Array.isArray(player?.pitcher?.breakingBalls) ? player.pitcher.breakingBalls : [];
  const { stateByFamily, extras } = buildBreakingBallState(rawBreakingBalls);
  const throwHand = extractThrowingHand(player?.hand);
  const sortedDirections = [...getBreakingBallDirectionLayout(throwHand)].sort(
    (left, right) => getBreakingBallOrderKeyFromNineCounterClockwise(left.angle) - getBreakingBallOrderKeyFromNineCounterClockwise(right.angle)
  );
  const entries = [];

  sortedDirections.forEach(({ familyId, angle }) => {
    const balls = stateByFamily[familyId] || [];
    balls.forEach((ball) => {
      const name = String(ball?.name || "").trim();
      const level = clamp(toInt(ball?.level, 0), 0, 7);
      if (!name || level <= 0) {
        return;
      }
      entries.push({ name, level, angle });
    });
  });

  for (const extraBall of extras) {
    const name = String(extraBall?.name || "").trim();
    const level = clamp(toInt(extraBall?.level, 0), 0, 7);
    if (!name || level <= 0) {
      continue;
    }
    entries.push({ name, level, angle: null });
  }

  return entries;
}

function getPlayerBreakingBallTotal(player) {
  return getPlayerBreakingBallDirectionalEntries(player).reduce((sum, entry) => sum + entry.level, 0);
}

function buildRosterBreakingBallArrowIconSvg(angle, level) {
  return `
    <svg viewBox="0 0 36 24" class="roster-breaking-ball-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      ${buildChunkyArrowGlyph(18, 12, angle, "#0f6d63", "#0b4f49")}
      <text x="18" y="12" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#ffffff" font-weight="800">${level}</text>
    </svg>
  `;
}

function buildPlayerBreakingBallDirectionCell(player) {
  const entries = getPlayerBreakingBallDirectionalEntries(player);
  if (!entries.length) {
    return "-";
  }
  const breakingBallDisplayNameInList = state.settings?.breakingBallDisplayNameInList ?? true;

  return `
    <div class="roster-breaking-ball-list">
      ${entries
        .map((entry) => {
          const title = `${entry.name} ${entry.level}`;
          if (typeof entry.angle !== "number") {
            return `<span class="roster-breaking-ball-item" title="${escapeHtml(title)}"><span class="roster-breaking-ball-name">${escapeHtml(title)}</span></span>`;
          }
          if (breakingBallDisplayNameInList) {
            return `<span class="roster-breaking-ball-item" title="${escapeHtml(title)}">${buildRosterBreakingBallArrowIconSvg(entry.angle, entry.level)}<span class="roster-breaking-ball-name">${escapeHtml(entry.name)}</span></span>`;
          } else {
            return `<span title="${escapeHtml(title)}">${buildRosterBreakingBallArrowIconSvg(entry.angle, entry.level)}</span>`;
          }
        })
        .join("")}
    </div>
  `;
}

function getComparableValue(player, key) {
  const hitter = player.hitter || {};
  const pitcher = player.pitcher || {};

  switch (key) {
    case "number":
      return toInt(player.number, 0);
    case "name":
      return String(player.name || "");
    case "type":
      return String(player.type || "");
    case "position":
      return getPlayerPositionLabel(player);
    case "hand":
      return String(player.hand || "");
    case "trajectory":
      return toInt(hitter.trajectory, 0);
    case "contact":
      return toInt(hitter.contact, 0);
    case "power":
      return toInt(hitter.power, 0);
    case "speed":
      return toInt(hitter.speed, 0);
    case "arm":
      return toInt(hitter.arm, 0);
    case "fielding":
      return toInt(hitter.fielding, 0);
    case "catching":
      return toInt(hitter.catching, 0);
    case "velocity":
      return toInt(pitcher.velocity, 0);
    case "control":
      return toInt(pitcher.control, 0);
    case "stamina":
      return toInt(pitcher.stamina, 0);
    case "breakingTotal":
      return getPlayerBreakingBallTotal(player);
    default:
      return "";
  }
}

function compareValues(left, right) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right), "ja");
}

function sortRosterPlayers(players) {
  const { key, direction } = state.rosterSort;
  const sorted = [...players].sort((left, right) => {
    const leftValue = getComparableValue(left, key);
    const rightValue = getComparableValue(right, key);
    const result = compareValues(leftValue, rightValue);
    return direction === "asc" ? result : -result;
  });
  return sorted;
}

function getRosterColumns() {
  const commonColumns = [
    { key: "number", label: "背番号", sortable: true, cell: (player) => `${player.number ?? ""}` },
    { key: "name", label: "名前", sortable: true, cell: (player) => buildPositionBadge(player) },
    { key: "type", label: "区分", sortable: true, cell: (player) => escapeHtml(player.type ?? "") },
    { key: "position", label: "守備/適性", sortable: true, cell: (player) => escapeHtml(getPlayerPositionLabel(player) || "") },
    { key: "hand", label: "投打", sortable: true, cell: (player) => escapeHtml(player.hand ?? "") }
  ];

  const hitterColumns = [
    { key: "trajectory", label: "弾道", sortable: true, cell: (player) => `${player.hitter?.trajectory ?? "-"}` },
    { key: "contact", label: "ミート", sortable: true, cell: (player) => formatRankedNumber(player.hitter?.contact) },
    { key: "power", label: "パワー", sortable: true, cell: (player) => formatRankedNumber(player.hitter?.power) },
    { key: "speed", label: "走力", sortable: true, cell: (player) => formatRankedNumber(player.hitter?.speed) },
    { key: "arm", label: "肩力", sortable: true, cell: (player) => formatRankedNumber(player.hitter?.arm) },
    { key: "fielding", label: "守備力", sortable: true, cell: (player) => formatRankedNumber(player.hitter?.fielding) },
    { key: "catching", label: "捕球", sortable: true, cell: (player) => formatRankedNumber(player.hitter?.catching) }
  ];

  const pitcherColumns = [
    { key: "velocity", label: "球速", sortable: true, cell: (player) => `${player.pitcher?.velocity ?? "-"}` },
    { key: "control", label: "コントロール", sortable: true, cell: (player) => formatRankedNumber(player.pitcher?.control) },
    { key: "stamina", label: "スタミナ", sortable: true, cell: (player) => formatRankedNumber(player.pitcher?.stamina) },
    { key: "breakingTotal", label: "総変化量", sortable: true, cell: (player) => `<span class="roster-breaking-total">${getPlayerBreakingBallTotal(player)}</span>` },
    { key: "breakingDetail", label: "各変化量", sortable: false, cell: (player) => buildPlayerBreakingBallDirectionCell(player) }
  ];

  if (state.rosterViewMode === "hitter") {
    return [...commonColumns, ...hitterColumns];
  }

  if (state.rosterViewMode === "pitcher") {
    return [...commonColumns, ...pitcherColumns];
  }

  return [...commonColumns, ...hitterColumns, ...pitcherColumns];
}

function buildSortableHeader(column) {
  if (!column.sortable) {
    return column.label;
  }

  const isActive = state.rosterSort.key === column.key;
  const directionMark = isActive ? (state.rosterSort.direction === "asc" ? " ▲" : " ▼") : "";
  return `<button type="button" class="sort-header-btn ${isActive ? "active" : ""}" data-sort-key="${column.key}">${column.label}${directionMark}</button>`;
}

function meterPercent(value, min, max) {
  if (max <= min) return 0;
  const p = ((value - min) / (max - min)) * 100;
  return clamp(Math.round(p), 0, 100);
}

function statField(label, inputName, value, min, max, unit = "") {
  const safeValue = toInt(value, min);
  const grade = gradeByValue(safeValue);
  const percent = meterPercent(safeValue, min, max);

  return `
    <div class="stat-row">
      <label>${label}</label>
      <div class="stat-input-wrap">
        <input type="number" min="${min}" max="${max}" name="${inputName}" value="${safeValue}" />
        <span class="unit">${unit}</span>
      </div>
      <span class="grade-badge grade-${grade}">${grade}</span>
      <div class="meter"><span style="width:${percent}%"></span></div>
    </div>
  `;
}

function getRankedTraitTone(rank) {
  if (POSITIVE_RANK_LETTERS.has(rank)) return "positive";
  if (NEGATIVE_RANK_LETTERS.has(rank)) return "negative";
  return "neutral";
}

function getTraitTone(trait, mode = null) {
  const normalized = String(trait || "").trim();
  const config = mode ? getTraitEditorConfig(mode) : null;

  for (const base of (config?.rankedBases || RANKED_TRAIT_BASES)) {
    if (!normalized.startsWith(base)) continue;
    const suffix = normalized.slice(base.length);
    if (RANK_LETTERS.includes(suffix)) {
      return getRankedTraitTone(suffix);
    }
  }

  if (config && !config.knownToggleSet.has(normalized)) {
    return "neutral";
  }

  if (POSITIVE_SPECIAL_TRAITS.has(normalized)) {
    return "positive";
  }

  if (NEGATIVE_SPECIAL_TRAITS.has(normalized)) {
    return "negative";
  }

  return "neutral";
}

function applyRankCardTone(select) {
  const card = select.closest(".trait-rank-card");
  if (!card) return;

  const tone = getRankedTraitTone(String(select.value || "").trim());
  card.classList.toggle("positive", tone === "positive");
  card.classList.toggle("negative", tone === "negative");
}

function buildAbilityChips(list, variant = "generic") {
  if (!Array.isArray(list) || list.length === 0) {
    return '<span class="ability-chip muted">なし</span>';
  }

  return list
    .map((item) => {
      const tone = variant === "trait" ? getTraitTone(item) : "neutral";
      const toneClass = tone === "neutral" ? "" : ` ${tone}`;
      return `<span class="ability-chip${toneClass}">${escapeHtml(item)}</span>`;
    })
    .join("");
}

function buildTraitPreviewGrid(traits, mode) {
  const config = getTraitEditorConfig(mode);
  const parsed = parseTraitState(traits, config.rankedBases, config.toggleTraits);

  const rankedCells = config.rankedBases.map((base) => {
    const rank = parsed.ranked[base];
    const tone = getRankedTraitTone(rank);
    const toneClass = tone === "neutral" ? "" : ` ${tone}`;
    return `
      <div class="trait-preview-cell${toneClass}">
        <span class="trait-preview-name">${escapeHtml(base)}</span>
        <strong class="trait-preview-rank">${escapeHtml(rank)}</strong>
      </div>
    `;
  }).join("");

  const activeToggles = config.toggleTraits.filter((trait) => parsed.toggles.has(trait));
  const toggleCells = activeToggles.length > 0
    ? activeToggles.map((trait) => {
        const tone = getTraitTone(trait, mode);
        const toneClass = tone === "neutral" ? "" : ` ${tone}`;
        return `<div class="trait-preview-chip${toneClass}">${escapeHtml(trait)}</div>`;
      }).join("")
    : '<div class="trait-preview-chip muted">なし</div>';

  const unknownCells = parsed.unknown.length > 0
    ? parsed.unknown.map((trait) => `<div class="trait-preview-chip neutral">${escapeHtml(trait)}</div>`).join("")
    : "";

  return `
    <div class="trait-preview-grid-wrap">
      <div class="trait-preview-group">
        <p class="trait-preview-title">${escapeHtml(config.label)}ランク系特殊能力</p>
        <div class="trait-preview-grid ranked">${rankedCells}</div>
      </div>
      <div class="trait-preview-group">
        <p class="trait-preview-title">${escapeHtml(config.label)}個別特殊能力</p>
        <div class="trait-preview-grid toggle">${toggleCells}${unknownCells}</div>
      </div>
    </div>
  `;
}

function isRankedTraitText(trait) {
  return isRankedTraitTextForBases(trait, RANKED_TRAIT_BASES);
}

function parseTraitState(traits, rankedBases = RANKED_TRAIT_BASES, toggleTraits = TOGGLE_TRAITS) {
  const ranked = Object.fromEntries(rankedBases.map((base) => [base, "D"]));
  const toggles = new Set();
  const unknown = [];
  const knownToggle = new Set(toggleTraits);

  for (const raw of traits) {
    const trait = String(raw || "").trim();
    if (!trait) continue;

    let handled = false;
    for (const base of rankedBases) {
      if (!trait.startsWith(base)) continue;
      const suffix = trait.slice(base.length);
      if (RANK_LETTERS.includes(suffix)) {
        ranked[base] = suffix;
        handled = true;
        break;
      }
    }
    if (handled) continue;

    if (knownToggle.has(trait)) {
      toggles.add(trait);
      continue;
    }

    unknown.push(trait);
  }

  return { ranked, toggles, unknown };
}

function composeTraitsFromState(ranked, toggles, unknown, rankedBases = RANKED_TRAIT_BASES, toggleTraits = TOGGLE_TRAITS) {
  const traits = [];

  for (const base of rankedBases) {
    if (ranked[base]) {
      traits.push(`${base}${ranked[base]}`);
    }
  }

  for (const t of toggleTraits) {
    if (toggles.has(t)) {
      traits.push(t);
    }
  }

  for (const x of unknown) {
    if (!traits.includes(x)) {
      traits.push(x);
    }
  }

  return traits;
}

function buildTraitPanel(traits, mode) {
  const config = getTraitEditorConfig(mode);
  const parsed = parseTraitState(traits, config.rankedBases, config.toggleTraits);

  const rankedCards = config.rankedBases.map((base) => {
    const rank = parsed.ranked[base] || "D";
    const tone = getRankedTraitTone(rank);
    const toneClass = tone === "neutral" ? "" : ` ${tone}`;
    return `
      <div class="trait-rank-card${toneClass}">
        <span>${escapeHtml(base)}</span>
        <select class="trait-rank-select" data-trait-base="${escapeHtml(base)}">
          ${RANK_LETTERS.map((optionRank) => `<option value="${optionRank}" ${rank === optionRank ? "selected" : ""}>${optionRank}</option>`).join("")}
        </select>
      </div>
    `;
  }).join("");

  const toggleCards = config.toggleTraits.map((trait) => {
    const tone = getTraitTone(trait, mode);
    const toneClass = tone === "neutral" ? "" : ` ${tone}`;
    return `
      <button type="button" class="trait-toggle-card${toneClass} ${parsed.toggles.has(trait) ? "active" : ""}" data-trait-name="${escapeHtml(trait)}">
        ${escapeHtml(trait)}
      </button>
    `;
  }).join("");

  const unknownArea = parsed.unknown.join(",");

  return `
    <div class="trait-panel" data-trait-panel="${escapeHtml(mode)}" hidden>
      <div class="trait-panel-header">
        <h4>${escapeHtml(config.label)}特殊能力一覧</h4>
        <button type="button" class="sub-btn" data-close-trait-panel="${escapeHtml(mode)}">閉じる</button>
      </div>
      <div class="trait-panel-body">
        <div class="trait-section">
          <p class="trait-section-title">ランク系特殊能力（A〜G / 既定値 D）</p>
          <div class="trait-rank-grid">${rankedCards}</div>
        </div>
        <div class="trait-section">
          <p class="trait-section-title">トグル特殊能力</p>
          <div class="trait-toggle-grid">${toggleCards}</div>
        </div>
        <div class="trait-section">
          <p class="trait-section-title">その他（一覧外を手入力）</p>
          <textarea data-unknown-traits="${escapeHtml(mode)}" placeholder="例: 変化球中心, テンポ○">${escapeHtml(unknownArea)}</textarea>
        </div>
      </div>
    </div>
  `;
}

function buildPositionPanel(player) {
  const positions = getPlayerPositions(player);

  const primaryCards = POSITION_OPTIONS.map((option) => {
    const activeClass = positions.primary === option.key ? " active" : "";
    return `
      <button type="button" class="position-primary-card ${option.category}${activeClass}" data-position-primary="${escapeHtml(option.key)}">
        <span class="position-card-short">${escapeHtml(option.shortLabel)}</span>
        <span class="position-card-label">${escapeHtml(option.key)}</span>
      </button>
    `;
  }).join("");

  const secondaryCards = POSITION_OPTIONS.map((option) => {
    const activeClass = positions.secondary.includes(option.key) ? " active" : "";
    return `
      <button type="button" class="position-toggle-card ${option.category}${activeClass}" data-position-secondary="${escapeHtml(option.key)}">
        ${escapeHtml(option.key)}
      </button>
    `;
  }).join("");

  return `
    <div class="position-panel" id="positionPanel" hidden>
      <div class="position-panel-header">
        <h4>守備/適性一覧</h4>
        <button type="button" class="sub-btn" id="closePositionPanel">閉じる</button>
      </div>
      <div class="position-panel-body">
        <div class="trait-section">
          <p class="trait-section-title">メインポジション</p>
          <div class="position-primary-grid">${primaryCards}</div>
        </div>
        <div class="trait-section">
          <p class="trait-section-title">サブ適性</p>
          <div class="position-toggle-grid">${secondaryCards}</div>
        </div>
      </div>
    </div>
  `;
}

function parseStrategyState(items, options = HITTER_STRATEGY_OPTIONS) {
  const known = new Set(options);
  const toggles = new Set();
  const unknown = [];

  for (const raw of Array.isArray(items) ? items : []) {
    const value = String(raw || "").trim();
    if (!value) continue;
    if (known.has(value)) {
      toggles.add(value);
      continue;
    }
    unknown.push(value);
  }

  return { toggles, unknown };
}

function composeStrategyFromState(toggles, unknown, options = HITTER_STRATEGY_OPTIONS) {
  const items = [];
  for (const strategy of options) {
    if (toggles.has(strategy)) {
      items.push(strategy);
    }
  }
  for (const x of unknown) {
    if (!items.includes(x)) {
      items.push(x);
    }
  }
  return items;
}

function buildStrategyPanel(strategy, mode) {
  const config = getStrategyEditorConfig(mode);
  const parsed = parseStrategyState(strategy, config.options);
  const cards = config.options.map((option) => {
    return `
      <button type="button" class="strategy-toggle-card ${parsed.toggles.has(option) ? "active" : ""}" data-strategy-name="${escapeHtml(option)}">
        ${escapeHtml(option)}
      </button>
    `;
  }).join("");

  return `
    <div class="strategy-panel" data-strategy-panel="${escapeHtml(mode)}" hidden>
      <div class="strategy-panel-header">
        <h4>${escapeHtml(config.label)}起用法一覧</h4>
        <button type="button" class="sub-btn" data-close-strategy-panel="${escapeHtml(mode)}">閉じる</button>
      </div>
      <div class="strategy-panel-body">
        <div class="trait-section">
          <p class="trait-section-title">${escapeHtml(config.label)}起用法</p>
          <div class="strategy-toggle-grid">${cards}</div>
        </div>
        <div class="trait-section">
          <p class="trait-section-title">その他（一覧外を手入力）</p>
          <textarea data-unknown-strategy="${escapeHtml(mode)}" placeholder="例: 変化球中心, テンポ○">${escapeHtml(parsed.unknown.join(","))}</textarea>
        </div>
      </div>
    </div>
  `;
}

function splitCsv(text) {
  return String(text || "")
    .split(/[、,]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function extractThrowingHand(hand) {
  const text = String(hand || "").trim();
  if (text.includes("左投")) return "left";
  if (text.includes("右投")) return "right";
  return "right";
}

function getBreakingBallFamily(name) {
  const value = String(name || "").trim();
  if (!value) return null;
  return BREAKING_BALL_OPTION_TO_FAMILY.get(value) || null;
}

function buildBreakingBallState(entries) {
  const stateByFamily = Object.fromEntries(
    BREAKING_BALL_FAMILIES.map((family) => [
      family.id,
      [
        { name: "", level: family.hasLevel ? 1 : 0 },
        { name: "", level: family.hasLevel ? 1 : 0 }
      ]
    ])
  );
  const extras = [];

  for (const raw of Array.isArray(entries) ? entries : []) {
    const name = String(raw?.name || "").trim();
    if (!name) continue;

    const familyId = getBreakingBallFamily(name);
    if (!familyId) {
      extras.push({ name, level: toInt(raw?.level, 1) });
      continue;
    }

    const family = BREAKING_BALL_FAMILY_MAP.get(familyId);
    const balls = stateByFamily[familyId];
    let placed = false;
    for (let i = 0; i < 2; i++) {
      if (!balls[i].name) {
        balls[i] = {
          name,
          level: family.hasLevel ? clamp(toInt(raw?.level, 1), 1, 7) : 0
        };
        placed = true;
        break;
      }
    }
    if (!placed) {
      extras.push({ name, level: toInt(raw?.level, 1) });
    }
  }

  return { stateByFamily, extras };
}

function buildBreakingBallGrid(stateByFamily, throwHand) {
  const layout = throwHand === "left" ? BREAKING_BALL_LAYOUT_LEFT : BREAKING_BALL_LAYOUT_RIGHT;
  const orderedFamilyIds = layout.flat();

  return orderedFamilyIds
    .map((familyId) => {
      const family = BREAKING_BALL_FAMILY_MAP.get(familyId);
      const balls = stateByFamily[familyId] || [{ name: "", level: 1 }, { name: "", level: 1 }];

      const ballHtml = balls.map((selected, ballIndex) => {
        const levelControl = family.hasLevel
          ? `
            <div class="breaking-ball-field level">
              <label>Lv</label>
              <select data-breaking-ball-level="${escapeHtml(familyId)}-${ballIndex}">
                ${BREAKING_BALL_LEVELS.map((level) => `<option value="${level}" ${toInt(selected.level, 1) === level ? "selected" : ""}>${level}</option>`).join("")}
              </select>
            </div>
          `
          : `
            <div class="breaking-ball-field level disabled">
              <span class="breaking-ball-level-label">Lv</span>
              <div class="breaking-ball-fixed">-</div>
            </div>
          `;

        return `
          <div class="breaking-ball-item">
            <div class="breaking-ball-field">
              <select data-breaking-ball-name="${escapeHtml(familyId)}-${ballIndex}">
                <option value="">なし</option>
                ${family.options.map((name) => `<option value="${escapeHtml(name)}" ${selected.name === name ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
              </select>
            </div>
            ${levelControl}
          </div>
        `;
      }).join("");

      return `
        <div class="breaking-ball-card" data-breaking-ball-family="${escapeHtml(familyId)}">
          <p class="breaking-ball-title">${escapeHtml(family.label)}</p>
          <div class="breaking-ball-items">
            ${ballHtml}
          </div>
        </div>
      `;
    })
    .join("");
}

function composeBreakingBallsFromEditor(editor) {
  const extrasRaw = editor.querySelector('input[name="p_breakingBallsExtra"]')?.value || "[]";
  let extras = [];
  try {
    extras = JSON.parse(extrasRaw);
  } catch {
    extras = [];
  }

  const list = [];
  for (const family of BREAKING_BALL_FAMILIES) {
    for (let i = 0; i < 2; i++) {
      const name = String(editor.querySelector(`[data-breaking-ball-name="${family.id}-${i}"]`)?.value || "").trim();
      if (!name) continue;

      if (family.hasLevel) {
        const level = clamp(toInt(editor.querySelector(`[data-breaking-ball-level="${family.id}-${i}"]`)?.value, 1), 1, 7);
        list.push({ name, level });
      } else {
        list.push({ name, level: 0 });
      }
    }
  }

  return [...list, ...extras.map((item) => ({ name: String(item?.name || "").trim(), level: toInt(item?.level, 1) })).filter((item) => item.name)];
}

function syncBreakingBallsFromEditor(form) {
  const editor = form.querySelector("#breakingBallEditor");
  const hidden = form.querySelector('textarea[name="p_breakingBalls"]');
  if (!editor || !hidden) return;

  const rows = composeBreakingBallsFromEditor(editor);
  hidden.value = rows.map((item) => (item.level > 0 ? `${item.name}:${item.level}` : item.name)).join("\n");

  const meter = form.querySelector("#breakingBallMeter");
  const parsed = parseBreakingBalls(String(hidden?.value || ""));
  const { stateByFamily } = buildBreakingBallState(parsed);
  const throwHand = extractThrowingHand(form.querySelector('input[name="hand"]')?.value);
  if (meter) {
    meter.innerHTML = buildBreakingBallMeterMarkup(stateByFamily, throwHand);
  }
}

function buildBreakingBallRadarSvg(stateByFamily, throwHand) {
  const family_colors = ["#ff6b6b", "#e6a8a8"];

  const viewBoxWidth = 240;
  const viewBoxHeight = 130;
  const centerX = viewBoxWidth / 2;
  const centerY = 55;
  const meterRadius = 10;
  const meterHeight = 40;

  let svgHtml = `<svg viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" class="breaking-ball-meter-svg" xmlns="http://www.w3.org/2000/svg">`;

  svgHtml += `<defs><linearGradient id="meterGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#f0f0f0;stop-opacity:1" /><stop offset="100%" style="stop-color:#e0e0e0;stop-opacity:1" /></linearGradient></defs>`;

  svgHtml += `<path d="M ${centerX - meterRadius} ${centerY} A ${meterRadius} ${meterRadius} 0 0 1 ${centerX + meterRadius} ${centerY}" stroke="#d0dae8" stroke-width="1.5" fill="none" />`;

  getBreakingBallDirectionLayout(throwHand).forEach(({ familyId, angle }) => {
    const balls = stateByFamily[familyId] || [{ name: "", level: 0 }, { name: "", level: 0 }];
    const angleRad = (angle * Math.PI) / 180;
    const activeBalls = balls.filter((b) => {
      const name = String(b?.name || "").trim();
      const level = toInt(b?.level, 0);
      return name && level > 0;
    });
    const hasTwoBalls = activeBalls.length >= 2;
    const baseStrokeWidth = 7.5;
    const strokeWidth = hasTwoBalls ? baseStrokeWidth / 2 : baseStrokeWidth;
    const normalX = -Math.sin(angleRad);
    const normalY = Math.cos(angleRad);
    const parallelOffset = hasTwoBalls ? strokeWidth / 2 : 0;
    let drawnActiveCount = 0;

    balls.forEach((state, ballIndex) => {
      const name = String(state?.name || "").trim();
      const level = toInt(state?.level, 0);
      if (name && level > 0) {
        const sideOffset = hasTwoBalls ? (drawnActiveCount === 0 ? -parallelOffset : parallelOffset) : 0;
        drawnActiveCount += 1;

        const x1 = centerX + Math.cos(angleRad) * meterRadius + normalX * sideOffset;
        const y1 = centerY + Math.sin(angleRad) * meterRadius + normalY * sideOffset;
        const meterX = centerX + Math.cos(angleRad) * (meterRadius + (meterHeight * level) / 7) + normalX * sideOffset;
        const meterY = centerY + Math.sin(angleRad) * (meterRadius + (meterHeight * level) / 7) + normalY * sideOffset;

        const color = family_colors[ballIndex] || "#999";
        const outlineWidth = strokeWidth + 1;

        svgHtml += `<line x1="${x1}" y1="${y1}" x2="${meterX}" y2="${meterY}" stroke="#111" stroke-width="${outlineWidth}" stroke-linecap="butt" />`;
        svgHtml += `<line x1="${x1}" y1="${y1}" x2="${meterX}" y2="${meterY}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="butt" />`;

        {
          const dividerHalfLen = outlineWidth / 2;
          for (let mark = 0; mark <= level; mark += 1) {
            const markDistance = meterRadius + (meterHeight * mark) / 7;
            const markX = centerX + Math.cos(angleRad) * markDistance + normalX * sideOffset;
            const markY = centerY + Math.sin(angleRad) * markDistance + normalY * sideOffset;
            const markX1 = markX - normalX * dividerHalfLen;
            const markY1 = markY - normalY * dividerHalfLen;
            const markX2 = markX + normalX * dividerHalfLen;
            const markY2 = markY + normalY * dividerHalfLen;
            svgHtml += `<line x1="${markX1}" y1="${markY1}" x2="${markX2}" y2="${markY2}" stroke="#111" stroke-width="1" stroke-linecap="butt" />`;
          }
        }
      }
    });

    const hasBalls = activeBalls.length > 0;
    if (hasBalls) {
      const ballNames = activeBalls
        .map((b) => String(b?.name || "").trim())
        .filter(Boolean)
        .join("/");
      const labelDist = meterRadius + meterHeight + 8;
      const labelX = centerX + Math.cos(angleRad) * labelDist;
      const labelY = centerY + Math.sin(angleRad) * labelDist;
      svgHtml += `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" class="breaking-ball-meter-label" font-size="8" fill="#658299" font-weight="700">${escapeHtml(ballNames)}</text>`;
    }
  });

  svgHtml += `</svg>`;
  return svgHtml;
}

function buildBreakingBallArrowSvg(stateByFamily, throwHand) {
  const viewBoxWidth = 240;
  const viewBoxHeight = 140;
  const centerX = viewBoxWidth / 2;
  const centerY = 50;
  const guideLength = 42;
  const labelLength = 80;
  const arrowDistance = 30;
  const numberDistance = 0;

  let svgHtml = `<svg viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" class="breaking-ball-meter-svg" xmlns="http://www.w3.org/2000/svg">`;
  svgHtml += `<circle cx="${centerX}" cy="${centerY}" r="10" fill="#f4f7fb" stroke="#d0dae8" stroke-width="1.5" />`;

  getBreakingBallDirectionLayout(throwHand).forEach(({ familyId, angle }) => {
    const balls = stateByFamily[familyId] || [{ name: "", level: 0 }, { name: "", level: 0 }];
    const angleRad = (angle * Math.PI) / 180;
    const normalX = -Math.sin(angleRad);
    const normalY = Math.cos(angleRad);
    const activeBalls = balls.filter((b) => {
      const name = String(b?.name || "").trim();
      const level = toInt(b?.level, 0);
      return name && level > 0;
    });

    if (activeBalls.length === 0) {
      return;
    }

    const guideX = centerX + Math.cos(angleRad) * guideLength;
    const guideY = centerY + Math.sin(angleRad) * guideLength;
    const labelX = centerX + Math.cos(angleRad) * labelLength;
    const labelY = centerY + Math.sin(angleRad) * labelLength;

    svgHtml += `<line x1="${centerX}" y1="${centerY}" x2="${guideX}" y2="${guideY}" stroke="#c8d4e3" stroke-width="1.5" stroke-linecap="round" />`;

    const hasTwoBalls = activeBalls.length >= 2;
    let drawnActiveCount = 0;
    const ballNames = [];

    balls.forEach((ball) => {
      const name = String(ball?.name || "").trim();
      const level = toInt(ball?.level, 0);
      if (!name || level <= 0) {
        return;
      }

      const sideOffset = hasTwoBalls ? (drawnActiveCount === 0 ? -9 : 9) : 0;
      drawnActiveCount += 1;
      ballNames.push(name);

      const arrowX = centerX + Math.cos(angleRad) * arrowDistance + normalX * sideOffset;
      const arrowY = centerY + Math.sin(angleRad) * arrowDistance + normalY * sideOffset;
      const numberX = arrowX;
      const numberY = arrowY - numberDistance;

      svgHtml += buildChunkyArrowGlyph(arrowX, arrowY, angle, "#0f6d63", "#0b4f49");
      svgHtml += `<text x="${numberX}" y="${numberY}" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#ffffff" font-weight="800">${level}</text>`;
    });

    svgHtml += `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" class="breaking-ball-meter-label" font-size="8" fill="#658299" font-weight="700">${escapeHtml(ballNames.join("/"))}</text>`;
  });

  svgHtml += `</svg>`;
  return svgHtml;
}

function buildChunkyArrowGlyph(x, y, angle, fill = "#0f6d63", stroke = "#0b4f49") {
  const path = [
    "M -14 -5",
    "L 0 -5",
    "L 0 -10",
    "L 14 0",
    "L 0 10",
    "L 0 5",
    "L -14 5",
    "Z"
  ].join(" ");

  return `
    <g transform="translate(${x} ${y}) rotate(${angle})">
      <path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round" />
    </g>
  `;
}

function buildBreakingBallMeterMarkup(stateByFamily, throwHand) {
  return getBreakingBallDisplayMode() === BREAKING_BALL_DISPLAY_MODES.ARROW
    ? buildBreakingBallArrowSvg(stateByFamily, throwHand)
    : buildBreakingBallRadarSvg(stateByFamily, throwHand);
}

function renderBreakingBallEditorGrid(form) {
  const editor = form.querySelector("#breakingBallEditor");
  const grid = form.querySelector("#breakingBallGrid");
  const meter = form.querySelector("#breakingBallMeter");
  if (!editor || !grid) return;

  const hidden = form.querySelector('textarea[name="p_breakingBalls"]');
  const parsed = parseBreakingBalls(String(hidden?.value || ""));
  const throwHand = extractThrowingHand(form.querySelector('input[name="hand"]')?.value);
  const { stateByFamily, extras } = buildBreakingBallState(parsed);

  grid.classList.toggle("lefty", throwHand === "left");
  grid.innerHTML = buildBreakingBallGrid(stateByFamily, throwHand);

  if (meter) {
    meter.innerHTML = buildBreakingBallMeterMarkup(stateByFamily, throwHand);
  }

  const extraInput = editor.querySelector('input[name="p_breakingBallsExtra"]');
  if (extraInput) {
    extraInput.value = JSON.stringify(extras);
  }

  syncBreakingBallsFromEditor(form);
}

function normalizePlayer(player) {
  player.number = toInt(player.number, 0);
  player.age = toInt(player.age, 18);

  if (player.hitter) {
    player.hitter.trajectory = toInt(player.hitter.trajectory, 1);
    player.hitter.contact = toInt(player.hitter.contact, 1);
    player.hitter.power = toInt(player.hitter.power, 1);
    player.hitter.speed = toInt(player.hitter.speed, 1);
    player.hitter.arm = toInt(player.hitter.arm, 1);
    player.hitter.fielding = toInt(player.hitter.fielding, 1);
    player.hitter.catching = toInt(player.hitter.catching, 1);
  }

  if (player.pitcher) {
    player.pitcher.velocity = toInt(player.pitcher.velocity, 120);
    player.pitcher.control = toInt(player.pitcher.control, 1);
    player.pitcher.stamina = toInt(player.pitcher.stamina, 1);
    player.pitcher.breakingBalls = Array.isArray(player.pitcher.breakingBalls)
      ? player.pitcher.breakingBalls
      : [];
  }

  const legacyTraits = Array.isArray(player.traits) ? player.traits : [];
  const splitTraits = splitTraitsByEditorMode(legacyTraits, player.type || "二刀流");
  player.traitsPitcher = uniqueStrings(Array.isArray(player.traitsPitcher) ? player.traitsPitcher : splitTraits.pitcher);
  player.traitsHitter = uniqueStrings(Array.isArray(player.traitsHitter) ? player.traitsHitter : splitTraits.hitter);
  player.traits = buildLegacyCombinedTraits(player.traitsPitcher, player.traitsHitter);

  const legacyStrategy = Array.isArray(player.strategy) ? player.strategy : [];
  const splitStrategy = splitStrategiesByEditorMode(legacyStrategy, player.type || "二刀流");
  player.strategyPitcher = uniqueStrings(Array.isArray(player.strategyPitcher) ? player.strategyPitcher : splitStrategy.pitcher);
  player.strategyHitter = uniqueStrings(Array.isArray(player.strategyHitter) ? player.strategyHitter : splitStrategy.hitter);
  player.strategy = buildLegacyCombinedStrategies(player.strategyPitcher, player.strategyHitter);

  player.positions = getPlayerPositions(player);
  player.position = formatPositions(player.positions);
}

function parseBreakingBalls(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, levelText] = line.split(":").map((s) => s.trim());
      const familyId = getBreakingBallFamily(name || "");
      const family = familyId ? BREAKING_BALL_FAMILY_MAP.get(familyId) : null;
      return {
        name: name || "変化球",
        level: family?.hasLevel === false ? 0 : clamp(toInt(levelText, 1), 1, 7)
      };
    });
}

function renderWorkspaceTabs() {
  els.workspaceTabs.innerHTML = "";

  const createTab = (id, label, closable) => {
    const wrapper = document.createElement("div");
    wrapper.className = "workspace-tab-item";
    if (state.activeWorkspaceTab === id) {
      wrapper.classList.add("active");
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `workspace-tab-btn ${state.activeWorkspaceTab === id ? "active" : ""}`;
    btn.title = label;
    const isDirty = closable && isPlayerTabDirty(id);
    const displayLabel = isDirty ? `${label} (*)` : label;
    btn.innerHTML = `<span class="workspace-tab-title">${escapeHtml(displayLabel)}</span>`;
    btn.addEventListener("click", () => {
      state.activeWorkspaceTab = id;
      renderWorkspaceTabs();
      renderWorkspaceContent();
    });

    if (closable) {
      btn.addEventListener("auxclick", (event) => {
        if (event.button !== 1) return;
        event.preventDefault();
        requestClosePlayerTab(id);
      });

      btn.addEventListener("mousedown", (event) => {
        if (event.button === 1) {
          event.preventDefault();
        }
      });
    }

    wrapper.appendChild(btn);

    if (closable) {
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "workspace-tab-close";
      closeBtn.setAttribute("aria-label", `${label} を閉じる`);
      closeBtn.textContent = "✕";
      closeBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        requestClosePlayerTab(id);
      });
      wrapper.appendChild(closeBtn);
    }

    els.workspaceTabs.appendChild(wrapper);
  };

  createTab(ROSTER_TAB_ID, "選手一覧", false);

  for (const playerId of state.openTabs) {
    const target = findPlayer(playerId);
    if (!target) continue;
    createTab(playerId, target.player.name || "名称未設定", true);
  }
}

function renderTeamTabs(container) {
  container.innerHTML = "";

  for (const team of state.data.teams) {
    const btn = document.createElement("button");
    btn.className = `tab-btn ${team.id === state.selectedTeamId ? "active" : ""}`;
    btn.textContent = team.name;
    btn.addEventListener("click", () => {
      state.selectedTeamId = team.id;
      renderWorkspaceContent();
    });
    container.appendChild(btn);
  }
}

function rosterRow(player) {
  const columns = getRosterColumns();
  const cells = columns.map((column) => `<td>${column.cell(player)}</td>`).join("");

  return `
    <tr data-player-id="${player.id}">
      ${cells}
      <td>
        <div class="row-actions">
          <button class="edit-btn" data-player-id="${player.id}">編集</button>
          <button class="danger-btn" data-delete-player-id="${player.id}">削除</button>
        </div>
      </td>
    </tr>
  `;
}

function normalizeForSearch(text) {
  return String(text || "").trim().toLowerCase();
}

function matchesRosterFilters(player, filters) {
  const keyword = normalizeForSearch(filters.keyword);
  const type = String(filters.type || "all");
  const position = normalizeForSearch(filters.position);
  const positionLabel = getPlayerPositionLabel(player);

  if (type !== "all" && player.type !== type) {
    return false;
  }

  if (position && !normalizeForSearch(positionLabel).includes(position)) {
    return false;
  }

  if (!keyword) {
    return true;
  }

  const searchTargets = [
    player.name,
    player.number,
    player.type,
    positionLabel,
    player.hand,
    ...(player.traits || []),
    ...(player.strategy || [])
  ];

  return searchTargets.some((value) => normalizeForSearch(value).includes(keyword));
}

function bindRosterFilters() {
  const keywordInput = document.getElementById("filterKeyword");
  const typeSelect = document.getElementById("filterType");
  const positionInput = document.getElementById("filterPosition");
  const viewModeSelect = document.getElementById("rosterViewMode");
  const resetButton = document.getElementById("resetRosterFilters");

  if (keywordInput) {
    keywordInput.addEventListener("input", (event) => {
      state.rosterFilters.keyword = event.target.value;
      renderWorkspaceContent();
    });
  }

  if (typeSelect) {
    typeSelect.addEventListener("change", (event) => {
      state.rosterFilters.type = event.target.value;
      renderWorkspaceContent();
    });
  }

  if (positionInput) {
    positionInput.addEventListener("input", (event) => {
      state.rosterFilters.position = event.target.value;
      renderWorkspaceContent();
    });
  }

  if (viewModeSelect) {
    viewModeSelect.addEventListener("change", (event) => {
      state.rosterViewMode = event.target.value;
      renderWorkspaceContent();
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      state.rosterFilters = {
        keyword: "",
        type: "all",
        position: ""
      };
      state.rosterViewMode = "both";
      state.rosterSort = {
        key: "number",
        direction: "asc"
      };
      renderWorkspaceContent();
    });
  }
}

function bindRosterSorting() {
  els.workspaceContent.querySelectorAll(".sort-header-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const sortKey = button.dataset.sortKey;
      if (state.rosterSort.key === sortKey) {
        state.rosterSort.direction = state.rosterSort.direction === "asc" ? "desc" : "asc";
      } else {
        state.rosterSort.key = sortKey;
        state.rosterSort.direction = "asc";
      }
      renderWorkspaceContent();
    });
  });
}

function updateStatPresentation(input) {
  const row = input.closest(".stat-row");
  if (!row) return;

  const min = toInt(input.min, 0);
  const max = toInt(input.max, 100);
  const safeValue = clamp(toInt(input.value, min), min, max);
  input.value = safeValue;

  const grade = row.querySelector(".grade-badge");
  const meter = row.querySelector(".meter span");
  if (grade) {
    const gradeText = gradeByValue(safeValue);
    grade.textContent = gradeText;
    grade.className = `grade-badge grade-${gradeText}`;
  }
  if (meter) {
    meter.style.width = `${meterPercent(safeValue, min, max)}%`;
  }
}

function updateTrajectoryPresentation(form) {
  const input = form.querySelector('input[name="h_trajectory"]');
  if (!input) return;
  const safeValue = clamp(toInt(input.value, 1), 1, 4);
  input.value = safeValue;
  form.querySelectorAll(".trajectory-dots .dot").forEach((dot, index) => {
    dot.classList.toggle("on", index < safeValue);
  });
}

function updateHeroPresentation(form) {
  const number = toInt(form.querySelector('input[name="number"]')?.value, 0);
  const age = toInt(form.querySelector('input[name="age"]')?.value, 18);
  const type = form.querySelector('select[name="type"]')?.value || "-";
  const position = form.querySelector('input[name="position"]')?.value || "-";
  const hand = form.querySelector('input[name="hand"]')?.value || "-";
  const name = form.querySelector('input[name="name"]')?.value || "名称未設定";

  const heroNumber = form.querySelector(".hero-number");
  if (heroNumber) {
    heroNumber.textContent = `#${number}`;
  }

  const badgeValues = form.querySelectorAll(".hero-badge strong");
  if (badgeValues.length >= 4) {
    badgeValues[0].textContent = type;
    badgeValues[1].textContent = position;
    badgeValues[2].textContent = hand;
    badgeValues[3].textContent = `${age}歳`;
  }

  const currentTab = els.workspaceTabs.querySelector(`.workspace-tab-btn.active`);
  if (currentTab && state.activeWorkspaceTab !== ROSTER_TAB_ID) {
    currentTab.innerHTML = `<span class="workspace-tab-title">${escapeHtml(name)}</span>`;
  }
}

function bindStatBarDrag(form) {
  form.querySelectorAll(".stat-row .meter").forEach((meter) => {
    const row = meter.closest(".stat-row");
    if (!row) return;
    const input = row.querySelector('input[type="number"]');
    if (!input) return;

    let dragging = false;

    function applyPointer(e) {
      const rect = meter.getBoundingClientRect();
      const clientX = e.clientX;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const min = toInt(input.min, 0);
      const max = toInt(input.max, 100);
      const newValue = Math.round(min + ratio * (max - min));
      input.value = newValue;
      updateStatPresentation(input);
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    meter.addEventListener("mousedown", (e) => {
      e.preventDefault();
      dragging = true;
      meter.classList.add("dragging");
      document.body.classList.add("stat-dragging");
      applyPointer(e);
    });

    const onMove = (e) => { if (dragging) applyPointer(e); };
    const onUp = () => {
      if (dragging) {
        dragging = false;
        meter.classList.remove("dragging");
        document.body.classList.remove("stat-dragging");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  });
}

function bindRealtimeFormUpdates(form) {
  const statInputs = form.querySelectorAll('.stat-row input[type="number"]');
  statInputs.forEach((input) => {
    const refresh = () => updateStatPresentation(input);
    input.addEventListener("input", refresh);
    input.addEventListener("change", refresh);
  });

  bindStatBarDrag(form);

  const trajectoryInput = form.querySelector('input[name="h_trajectory"]');
  if (trajectoryInput) {
    const refresh = () => updateTrajectoryPresentation(form);
    trajectoryInput.addEventListener("input", refresh);
    trajectoryInput.addEventListener("change", refresh);
  }

  ["name", "number", "age", "hand"].forEach((fieldName) => {
    const input = form.querySelector(`[name="${fieldName}"]`);
    if (!input) return;
    input.addEventListener("input", () => updateHeroPresentation(form));
    input.addEventListener("change", () => updateHeroPresentation(form));
  });

  const handInput = form.querySelector('input[name="hand"]');
  if (handInput) {
    const refresh = () => renderBreakingBallEditorGrid(form);
    handInput.addEventListener("input", refresh);
    handInput.addEventListener("change", refresh);
  }

  const typeSelect = form.querySelector('select[name="type"]');
  if (typeSelect) {
    typeSelect.addEventListener("change", () => updateHeroPresentation(form));
  }
}

function openPlayerTab(playerId) {
  if (!state.openTabs.includes(playerId)) {
    state.openTabs.push(playerId);
  }
  state.activeWorkspaceTab = playerId;
  renderWorkspaceTabs();
  renderWorkspaceContent();
}

function closePlayerTab(playerId) {
  state.openTabs = state.openTabs.filter((id) => id !== playerId);
  clearPlayerDraft(playerId);
  if (state.activeWorkspaceTab === playerId) {
    state.activeWorkspaceTab = ROSTER_TAB_ID;
  }
  renderWorkspaceTabs();
  renderWorkspaceContent();
}


function requestClosePlayerTab(playerId) {
  if (!isPlayerTabDirty(playerId)) {
    closePlayerTab(playerId);
    return;
  }

  const target = findPlayer(playerId);
  const playerName = target?.player?.name || "この選手";
  
  showCloseUnsavedPlayerDialog(playerName, playerId);
}

function showCloseUnsavedPlayerDialog(playerName, playerId) {
  const dialog = document.createElement("div");
  dialog.className = "confirm-dialog-overlay";
  dialog.innerHTML = `
    <div class="confirm-dialog">
      <div class="confirm-dialog-content">
        <p>${escapeHtml(playerName)} に未保存の編集があります。どうしますか？</p>
      </div>
      <div class="confirm-dialog-actions">
        <button class="dialog-btn dialog-btn-primary" data-action="save">保存して閉じる</button>
        <button class="dialog-btn" data-action="close">保存せずに閉じる</button>
        <button class="dialog-btn dialog-btn-cancel" data-action="cancel">キャンセル</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  const handleAction = (action) => {
    if (document.body.contains(dialog)) {
      document.body.removeChild(dialog);
    }
    
    if (action === "save") {
      const form = document.getElementById("playerForm");
      if (form) {
        const originalCloseTab = closePlayerTab;
        window.closePlayerTabAfterSave = () => {
          originalCloseTab(playerId);
          delete window.closePlayerTabAfterSave;
        };
        form.dispatchEvent(new Event("submit"));
      }
    } else if (action === "close") {
      closePlayerTab(playerId);
    }
  };
  
  const buttons = dialog.querySelectorAll(".confirm-dialog-actions button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      handleAction(btn.dataset.action);
    });
  });
  
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      handleAction("cancel");
    }
  });
}

function showSettingsDialog() {
  const existing = document.querySelector(".settings-dialog-overlay");
  if (existing) {
    const select = existing.querySelector("#startupOpenMode");
    if (select instanceof HTMLSelectElement) {
      select.focus();
    }
    return;
  }

  const dialog = document.createElement("div");
  dialog.className = "settings-dialog-overlay";
  dialog.innerHTML = `
    <div class="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="settingsDialogTitle">
      <div class="settings-dialog-header">
        <div>
          <h2 id="settingsDialogTitle">設定</h2>
          <p>表示や操作に関する設定を変更できます。</p>
        </div>
        <button type="button" class="dialog-icon-btn" data-settings-close aria-label="閉じる">✕</button>
      </div>
      <div class="settings-dialog-body">
        <section class="settings-section">
          <h3>起動時のファイルオープン</h3>
          <label for="startupOpenMode">起動時の動作</label>
          <select id="startupOpenMode">
            <option value="${STARTUP_OPEN_MODES.NEW_FILE}" ${getStartupOpenMode() === STARTUP_OPEN_MODES.NEW_FILE ? "selected" : ""}>新規ファイル</option>
            <option value="${STARTUP_OPEN_MODES.OPEN_FILE_DIALOG}" ${getStartupOpenMode() === STARTUP_OPEN_MODES.OPEN_FILE_DIALOG ? "selected" : ""}>選択してファイルを開く</option>
            <option value="${STARTUP_OPEN_MODES.OPEN_LAST_EDITED_FILE}" ${getStartupOpenMode() === STARTUP_OPEN_MODES.OPEN_LAST_EDITED_FILE ? "selected" : ""}>最後に編集したファイルを開く</option>
          </select>
        </section>
        <section class="settings-section">
          <h3>ファイル選択</h3>
          <label for="fileDialogDefaultDirectoryMode">ファイル選択時の既定ディレクトリ</label>
          <select id="fileDialogDefaultDirectoryMode">
            <option value="${FILE_DIALOG_DEFAULT_DIRECTORY_MODES.DOCUMENTS}" ${getFileDialogDefaultDirectoryMode() === FILE_DIALOG_DEFAULT_DIRECTORY_MODES.DOCUMENTS ? "selected" : ""}>マイドキュメント</option>
            <option value="${FILE_DIALOG_DEFAULT_DIRECTORY_MODES.LAST_OPENED_DIRECTORY}" ${getFileDialogDefaultDirectoryMode() === FILE_DIALOG_DEFAULT_DIRECTORY_MODES.LAST_OPENED_DIRECTORY ? "selected" : ""}>最後に開いたファイルのディレクトリ</option>
          </select>
        </section>
        <section class="settings-section">
          <h3>変化球表示</h3>
          <label for="breakingBallDisplayMode">表示方式</label>
          <select id="breakingBallDisplayMode">
            <option value="${BREAKING_BALL_DISPLAY_MODES.STANDARD}" ${getBreakingBallDisplayMode() === BREAKING_BALL_DISPLAY_MODES.STANDARD ? "selected" : ""}>通常：各方向にバーを表示</option>
            <option value="${BREAKING_BALL_DISPLAY_MODES.ARROW}" ${getBreakingBallDisplayMode() === BREAKING_BALL_DISPLAY_MODES.ARROW ? "selected" : ""}>新方式：矢印＋強さ数字を表示</option>
          </select>
          <p class="settings-help">新方式では方向ごとに矢印を表示し、その上に強さ 1〜7 を数字で表示します。球種名は矢印の先に表示されます。</p>
        </section>
        <section class="settings-section">
          <h3>リスト内での変化球表示</h3>
          <div>
            <input type="checkbox" id="breakingBallDisplayNameInList" ${getBreakingBallDisplayNameInList() ? "checked" : ""} />
            <label for="breakingBallDisplayNameInList">変化球名の表示</label>
          </div>
        </section>
      </div>
      <div class="settings-dialog-actions">
        <button type="button" class="sub-btn" data-settings-close>キャンセル</button>
        <button type="button" class="primary" data-settings-save>保存</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  const closeDialog = () => {
    if (document.body.contains(dialog)) {
      document.body.removeChild(dialog);
    }
    window.removeEventListener("keydown", handleKeydown);
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      closeDialog();
    }
  };

  window.addEventListener("keydown", handleKeydown);

  dialog.querySelectorAll("[data-settings-close]").forEach((button) => {
    button.addEventListener("click", closeDialog);
  });

  dialog.querySelector("[data-settings-save]")?.addEventListener("click", () => {
    const selectedStartupOpenMode = String(dialog.querySelector("#startupOpenMode")?.value || "").trim();
    const selectedDirectoryMode = String(dialog.querySelector("#fileDialogDefaultDirectoryMode")?.value || "").trim();
    const selectedMode = String(dialog.querySelector("#breakingBallDisplayMode")?.value || "").trim();
    const breakingBallDisplayNameInList = Boolean(dialog.querySelector("#breakingBallDisplayNameInList")?.checked);
    applyAppSettings(
      {
        ...state.settings,
        startupOpenMode: selectedStartupOpenMode,
        fileDialogDefaultDirectoryMode: selectedDirectoryMode,
        breakingBallDisplayMode: selectedMode,
        breakingBallDisplayNameInList
      },
      {
        rerender: true,
        statusMessage: "設定を更新しました。"
      }
    );
    closeDialog();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  dialog.querySelector("#startupOpenMode")?.focus();
}

function sanitizeIdSeed(text, fallback) {
  const normalized = String(text || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9_]/g, "");
  return normalized || fallback;
}

function makeUniqueId(existingIds, seed) {
  let nextId = seed;
  let index = 2;
  while (existingIds.has(nextId)) {
    nextId = `${seed}_${index}`;
    index += 1;
  }
  return nextId;
}

function createDefaultPlayer(team) {
  const nextNumber = Math.max(0, ...team.players.map((player) => toInt(player.number, 0))) + 1;
  const existingPlayerIds = new Set(team.players.map((player) => String(player.id || "")));
  const seed = sanitizeIdSeed(`${team.id}_P`, "PLAYER");
  const id = makeUniqueId(existingPlayerIds, seed);

  return {
    id,
    name: "新規選手",
    number: nextNumber,
    age: 18,
    type: "野手",
    position: "外野",
    hand: "右投右打",
    hitter: {
      trajectory: 1,
      contact: 1,
      power: 1,
      speed: 1,
      arm: 1,
      fielding: 1,
      catching: 1
    },
    pitcher: {
      velocity: 120,
      control: 1,
      stamina: 1,
      breakingBalls: []
    },
    traitsPitcher: [],
    traitsHitter: [],
    strategyPitcher: [],
    strategyHitter: []
  };
}

function addTeam(teamName, leagueName = "") {
  const name = String(teamName || "").trim();
  if (!name) {
    setStatus("チーム名が空のため、追加を中止しました。");
    return false;
  }

  const existingTeamIds = new Set(state.data.teams.map((team) => String(team.id || "")));
  const baseId = sanitizeIdSeed(name, "TEAM");
  const id = makeUniqueId(existingTeamIds, baseId);
  const league = String(leagueName || "").trim();

  state.data.teams.push({
    id,
    name,
    league,
    players: []
  });

  state.selectedTeamId = id;
  state.activeWorkspaceTab = ROSTER_TAB_ID;
  renderWorkspaceTabs();
  renderWorkspaceContent();
  setStatus(`${name} を追加しました。全体を保存してください。`);
  return true;
}

function deleteCurrentTeam() {
  const team = getCurrentTeam();
  if (!team) return;

  const teamPlayerIds = new Set(team.players.map((player) => player.id));
  const hasDirtyTabs = [...teamPlayerIds].some((playerId) => isPlayerTabDirty(playerId));
  const dirtyWarning = hasDirtyTabs ? "\n未保存の編集中タブも破棄されます。" : "";
  const confirmed = window.confirm(`チーム「${team.name}」を削除しますか？${dirtyWarning}`);
  if (!confirmed) return;

  state.data.teams = state.data.teams.filter((item) => item.id !== team.id);
  state.openTabs = state.openTabs.filter((playerId) => !teamPlayerIds.has(playerId));
  teamPlayerIds.forEach((playerId) => clearPlayerDraft(playerId));

  if (!state.data.teams.some((item) => item.id === state.selectedTeamId)) {
    state.selectedTeamId = state.data.teams[0]?.id || null;
  }

  if (state.activeWorkspaceTab !== ROSTER_TAB_ID && !findPlayer(state.activeWorkspaceTab)) {
    state.activeWorkspaceTab = ROSTER_TAB_ID;
  }

  renderWorkspaceTabs();
  renderWorkspaceContent();
  setStatus(`${team.name} を削除しました。全体を保存してください。`);
}

function addPlayerToCurrentTeam() {
  const team = getCurrentTeam();
  if (!team) {
    setStatus("先にチームを追加してください。");
    return;
  }

  const player = createDefaultPlayer(team);
  normalizePlayer(player);
  team.players.push(player);
  openPlayerTab(player.id);
  setStatus(`${team.name} に新規選手を追加しました。全体を保存してください。`);
}

function deletePlayerById(playerId) {
  const target = findPlayer(playerId);
  if (!target) return;

  const isDirty = isPlayerTabDirty(playerId);
  const dirtyWarning = isDirty ? "\n未保存の編集内容は破棄されます。" : "";
  const confirmed = window.confirm(`選手「${target.player.name || "名称未設定"}」を削除しますか？${dirtyWarning}`);
  if (!confirmed) return;

  target.team.players = target.team.players.filter((player) => player.id !== playerId);
  state.openTabs = state.openTabs.filter((id) => id !== playerId);
  clearPlayerDraft(playerId);

  if (state.activeWorkspaceTab === playerId) {
    state.activeWorkspaceTab = ROSTER_TAB_ID;
  }

  renderWorkspaceTabs();
  renderWorkspaceContent();
  setStatus(`${target.player.name || "選手"} を削除しました。全体を保存してください。`);
}

function buildPlayerForm(player) {
  const hitter = player.hitter || {
    trajectory: 1,
    contact: 1,
    power: 1,
    speed: 1,
    arm: 1,
    fielding: 1,
    catching: 1
  };

  const pitcher = player.pitcher || {
    velocity: 120,
    control: 1,
    stamina: 1,
    breakingBalls: []
  };

  const infoCards = [
    { key: "区分", value: player.type || "-" },
    { key: "守備/適性", value: getPlayerPositionLabel(player) || "-" },
    { key: "投打", value: player.hand || "-" },
    { key: "年齢", value: `${player.age || 18}歳` }
  ];

  const defaultInnerTab = player.type === "投手" ? "pitcher" : "hitter";
  const hitterTraits = getPlayerTraitsByMode(player, "hitter");
  const pitcherTraits = getPlayerTraitsByMode(player, "pitcher");
  const hitterStrategy = getPlayerStrategiesByMode(player, "hitter");
  const pitcherStrategy = getPlayerStrategiesByMode(player, "pitcher");

  return `
    <form id="playerForm" data-player-id="${player.id}">
      <div class="pw-screen">
        <section class="pw-hero">
          <div class="hero-number">#${toInt(player.number, 0)}</div>
          <div class="hero-main">
            <div class="hero-row">
              <label>選手名</label>
              <input name="name" value="${escapeHtml(player.name || "")}" />
            </div>
            <div class="hero-row two">
              <div>
                <label>背番号</label>
                <input type="number" name="number" value="${toInt(player.number, 0)}" />
              </div>
              <div>
                <label>年齢</label>
                <input type="number" name="age" value="${toInt(player.age, 18)}" />
              </div>
            </div>
            <div class="hero-row three">
              <div>
                <label>区分</label>
                <select name="type">
                  <option value="野手" ${player.type === "野手" ? "selected" : ""}>野手</option>
                  <option value="投手" ${player.type === "投手" ? "selected" : ""}>投手</option>
                  <option value="二刀流" ${player.type === "二刀流" ? "selected" : ""}>二刀流</option>
                </select>
              </div>
              <div>
                <label>守備/適性</label>
                <input name="position" value="${escapeHtml(getPlayerPositionLabel(player))}" readonly />
              </div>
              <div>
                <label>守備適性編集</label>
                <div class="preset-inline single">
                  <button type="button" id="openPositionPanel" class="sub-btn">ポジションを選択</button>
                </div>
              </div>
            </div>
            ${buildPositionPanel(player)}
            <div class="hero-row">
              <label>投打</label>
              <input name="hand" value="${escapeHtml(player.hand || "")}" />
            </div>
          </div>
          <div class="hero-badges">
            ${infoCards
              .map((item) => `<div class="hero-badge"><span>${escapeHtml(item.key)}</span><strong>${escapeHtml(item.value)}</strong></div>`)
              .join("")}
          </div>
        </section>

        <section class="detail-subtab-section">
          <div class="detail-subtab-header">
            <button type="button" class="detail-subtab-btn ${defaultInnerTab === "hitter" ? "active" : ""}" data-detail-subtab="hitter">野手詳細</button>
            <button type="button" class="detail-subtab-btn ${defaultInnerTab === "pitcher" ? "active" : ""}" data-detail-subtab="pitcher">投手詳細</button>
          </div>

          <div class="detail-subtab-pane ${defaultInnerTab === "hitter" ? "active" : ""}" data-detail-subtab-pane="hitter">
            <article class="pw-card">
              <h3>野手能力</h3>
              <div class="trajectory-row">
                <label>弾道</label>
                <input type="number" min="1" max="4" name="h_trajectory" value="${toInt(hitter.trajectory, 1)}" />
                <div class="trajectory-dots">
                  ${Array.from({ length: 4 })
                    .map((_, i) => `<span class="dot ${i < toInt(hitter.trajectory, 1) ? "on" : ""}"></span>`)
                    .join("")}
                </div>
              </div>
              <div class="stats-list">
                ${statField("ミート", "h_contact", hitter.contact, 1, 100)}
                ${statField("パワー", "h_power", hitter.power, 1, 100)}
                ${statField("走力", "h_speed", hitter.speed, 1, 100)}
                ${statField("肩力", "h_arm", hitter.arm, 1, 100)}
                ${statField("守備力", "h_fielding", hitter.fielding, 1, 100)}
                ${statField("捕球", "h_catching", hitter.catching, 1, 100)}
              </div>
            </article>

            <article class="pw-card full">
              <h3>野手特殊能力</h3>
              <div class="ability-group">
                <label>現在の野手特殊能力</label>
                <div class="traits-preview traits-preview-hitter">${buildTraitPreviewGrid(hitterTraits, "hitter")}</div>
                <button type="button" class="sub-btn" data-open-trait-panel="hitter">野手特殊能力を編集</button>
                ${buildTraitPanel(hitterTraits, "hitter")}
                <textarea class="hidden-data-input" name="traits_hitter">${escapeHtml(hitterTraits.join(","))}</textarea>
              </div>
            </article>

            <article class="pw-card full">
              <h3>野手起用法</h3>
              <div class="ability-group">
                <label>現在の野手起用法</label>
                <div class="chips-wrap strategy-preview strategy-preview-hitter">${buildAbilityChips(hitterStrategy)}</div>
                <button type="button" class="sub-btn" data-open-strategy-panel="hitter">野手起用法を編集</button>
                ${buildStrategyPanel(hitterStrategy, "hitter")}
                <textarea class="hidden-data-input" name="strategy_hitter">${escapeHtml(hitterStrategy.join(","))}</textarea>
              </div>
            </article>
          </div>

          <div class="detail-subtab-pane ${defaultInnerTab === "pitcher" ? "active" : ""}" data-detail-subtab-pane="pitcher">
            <article class="pw-card">
              <h3>投手能力</h3>
              <div class="stats-list">
                ${statField("球速", "p_velocity", pitcher.velocity, 120, 170, "km/h")}
                ${statField("コントロール", "p_control", pitcher.control, 1, 100)}
                ${statField("スタミナ", "p_stamina", pitcher.stamina, 1, 100)}
              </div>
              <div class="breakball-editor">
                <div id="breakingBallMeterWrap" class="breaking-ball-meter-wrap">
                  <label>変化球</label>
                  <div id="breakingBallMeter" class="breaking-ball-meter"></div>
                </div>
                <label>変化球</label>
                <div id="breakingBallEditor" class="breaking-ball-editor-ui">
                  <div id="breakingBallGrid" class="breaking-ball-grid"></div>
                  <input type="hidden" name="p_breakingBallsExtra" value="[]" />
                </div>
                <textarea class="hidden-data-input" name="p_breakingBalls">${pitcher.breakingBalls
                  .map((b) => {
                    const familyId = getBreakingBallFamily(b.name);
                    const family = familyId ? BREAKING_BALL_FAMILY_MAP.get(familyId) : null;
                    const level = family?.hasLevel === false ? 0 : clamp(toInt(b.level, 1), 1, 7);
                    return level > 0 ? `${escapeHtml(b.name)}:${level}` : `${escapeHtml(b.name)}`;
                  })
                  .join("\n")}</textarea>
              </div>
            </article>

            <article class="pw-card full">
              <h3>投手特殊能力</h3>
              <div class="ability-group">
                <label>現在の投手特殊能力</label>
                <div class="traits-preview traits-preview-pitcher">${buildTraitPreviewGrid(pitcherTraits, "pitcher")}</div>
                <button type="button" class="sub-btn" data-open-trait-panel="pitcher">投手特殊能力を編集</button>
                ${buildTraitPanel(pitcherTraits, "pitcher")}
                <textarea class="hidden-data-input" name="traits_pitcher">${escapeHtml(pitcherTraits.join(","))}</textarea>
              </div>
            </article>

            <article class="pw-card full">
              <h3>投手起用法</h3>
              <div class="ability-group">
                <label>現在の投手起用法</label>
                <div class="chips-wrap strategy-preview strategy-preview-pitcher">${buildAbilityChips(pitcherStrategy)}</div>
                <button type="button" class="sub-btn" data-open-strategy-panel="pitcher">投手起用法を編集</button>
                ${buildStrategyPanel(pitcherStrategy, "pitcher")}
                <textarea class="hidden-data-input" name="strategy_pitcher">${escapeHtml(pitcherStrategy.join(","))}</textarea>
              </div>
            </article>
          </div>
        </section>
      </div>
    </form>
  `;
}

function refreshChipPreview(form, fieldName, targetSelector, variant = "generic") {
  const textarea = form.querySelector(`textarea[name="${fieldName}"]`);
  const target = form.querySelector(targetSelector);
  if (!textarea || !target) return;

  if (String(variant).startsWith("trait:")) {
    const mode = String(variant).split(":")[1] || "hitter";
    target.innerHTML = buildTraitPreviewGrid(splitCsv(textarea.value), mode);
    return;
  }

  target.innerHTML = buildAbilityChips(splitCsv(textarea.value), variant);
}

function syncTraitsFromPanel(form, mode) {
  const config = getTraitEditorConfig(mode);
  const traitPanel = form.querySelector(`[data-trait-panel="${mode}"]`);
  const traitsArea = form.querySelector(`textarea[name="traits_${mode}"]`);
  if (!traitPanel || !traitsArea) return;

  const ranked = {};
  traitPanel.querySelectorAll(".trait-rank-select").forEach((select) => {
    const base = select.dataset.traitBase;
    const value = String(select.value || "").trim();
    if (config.knownRankedSet.has(base) && RANK_LETTERS.includes(value)) {
      ranked[base] = value;
    }
  });

  const toggles = new Set();
  traitPanel.querySelectorAll(".trait-toggle-card.active").forEach((btn) => {
    const name = String(btn.dataset.traitName || "").trim();
    if (config.knownToggleSet.has(name)) {
      toggles.add(name);
    }
  });

  const unknownText = traitPanel.querySelector(`[data-unknown-traits="${mode}"]`)?.value || "";
  const unknown = splitCsv(unknownText).filter(
    (trait) => !config.knownToggleSet.has(trait) && !isRankedTraitTextForBases(trait, config.rankedBases)
  );

  const traits = composeTraitsFromState(ranked, toggles, unknown, config.rankedBases, config.toggleTraits);
  traitsArea.value = traits.join(",");

  const linkedBases = LINKED_RANKED_TRAIT_BASES.filter((base) => config.knownRankedSet.has(base));
  if (linkedBases.length > 0) {
    const otherMode = mode === "pitcher" ? "hitter" : "pitcher";
    const otherConfig = getTraitEditorConfig(otherMode);
    const otherTraitsArea = form.querySelector(`textarea[name="traits_${otherMode}"]`);

    if (otherTraitsArea) {
      const parsedOther = parseTraitState(splitCsv(otherTraitsArea.value), otherConfig.rankedBases, otherConfig.toggleTraits);

      linkedBases.forEach((base) => {
        if (!otherConfig.knownRankedSet.has(base)) return;
        const linkedRank = ranked[base];
        if (RANK_LETTERS.includes(linkedRank)) {
          parsedOther.ranked[base] = linkedRank;
        }
      });

      const syncedOtherTraits = composeTraitsFromState(
        parsedOther.ranked,
        parsedOther.toggles,
        parsedOther.unknown,
        otherConfig.rankedBases,
        otherConfig.toggleTraits
      );
      otherTraitsArea.value = syncedOtherTraits.join(",");
      applyTraitsToPanel(form, syncedOtherTraits, otherMode);
      refreshChipPreview(form, `traits_${otherMode}`, `.traits-preview-${otherMode}`, `trait:${otherMode}`);
    }
  }

  applyTraitsToPanel(form, traits, mode);
  refreshChipPreview(form, `traits_${mode}`, `.traits-preview-${mode}`, `trait:${mode}`);
  updatePlayerDraftFromForm(form);
}

function applyTraitsToPanel(form, traits, mode) {
  const config = getTraitEditorConfig(mode);
  const panel = form.querySelector(`[data-trait-panel="${mode}"]`);
  if (!panel) return;

  const parsed = parseTraitState(traits, config.rankedBases, config.toggleTraits);

  panel.querySelectorAll(".trait-rank-select").forEach((select) => {
    const base = select.dataset.traitBase;
    select.value = parsed.ranked[base] || "D";
    applyRankCardTone(select);
  });

  panel.querySelectorAll(".trait-toggle-card").forEach((btn) => {
    const name = btn.dataset.traitName;
    btn.classList.toggle("active", parsed.toggles.has(name));
  });

  const unknownInput = panel.querySelector(`[data-unknown-traits="${mode}"]`);
  if (unknownInput) {
    unknownInput.value = parsed.unknown.join(",");
  }
}

function syncStrategyFromPanel(form, mode) {
  const config = getStrategyEditorConfig(mode);
  const panel = form.querySelector(`[data-strategy-panel="${mode}"]`);
  const strategyArea = form.querySelector(`textarea[name="strategy_${mode}"]`);
  if (!panel || !strategyArea) return;

  const toggles = new Set();
  panel.querySelectorAll(".strategy-toggle-card.active").forEach((btn) => {
    const value = String(btn.dataset.strategyName || "").trim();
    if (config.knownSet.has(value)) {
      toggles.add(value);
    }
  });

  const unknownText = panel.querySelector(`[data-unknown-strategy="${mode}"]`)?.value || "";
  const unknown = splitCsv(unknownText).filter((item) => !config.knownSet.has(item));
  const next = composeStrategyFromState(toggles, unknown, config.options);
  strategyArea.value = next.join(",");
  refreshChipPreview(form, `strategy_${mode}`, `.strategy-preview-${mode}`);
  updatePlayerDraftFromForm(form);
}

function applyStrategyToPanel(form, strategy, mode) {
  const config = getStrategyEditorConfig(mode);
  const panel = form.querySelector(`[data-strategy-panel="${mode}"]`);
  if (!panel) return;

  const parsed = parseStrategyState(strategy, config.options);
  panel.querySelectorAll(".strategy-toggle-card").forEach((btn) => {
    const value = String(btn.dataset.strategyName || "").trim();
    btn.classList.toggle("active", parsed.toggles.has(value));
  });

  const unknownInput = panel.querySelector(`[data-unknown-strategy="${mode}"]`);
  if (unknownInput) {
    unknownInput.value = parsed.unknown.join(",");
  }
}

function bindDetailSubTabs(form) {
  const buttons = [...form.querySelectorAll("[data-detail-subtab]")];
  const panes = [...form.querySelectorAll("[data-detail-subtab-pane]")];
  if (buttons.length === 0 || panes.length === 0) return;

  const activate = (mode) => {
    buttons.forEach((button) => {
      button.classList.toggle("active", button.dataset.detailSubtab === mode);
    });
    panes.forEach((pane) => {
      pane.classList.toggle("active", pane.dataset.detailSubtabPane === mode);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => activate(button.dataset.detailSubtab));
  });

  const activeButton = buttons.find((button) => button.classList.contains("active"));
  activate(activeButton?.dataset.detailSubtab || buttons[0].dataset.detailSubtab);
}

function syncPositionFromPanel(form) {
  const positionInput = form.querySelector('input[name="position"]');
  const panel = form.querySelector("#positionPanel");
  if (!positionInput || !panel) return;

  const primary = String(panel.querySelector(".position-primary-card.active")?.dataset.positionPrimary || "").trim();
  const secondary = uniqueStrings(
    [...panel.querySelectorAll(".position-toggle-card.active")].map((button) => button.dataset.positionSecondary)
  ).filter((value) => value !== primary);

  positionInput.value = formatPositions({ primary, secondary });
  updateHeroPresentation(form);
  updatePlayerDraftFromForm(form);
}

function applyPositionsToPanel(form, positions) {
  const panel = form.querySelector("#positionPanel");
  if (!panel) return;

  const normalized = normalizePositionsValue(positions);
  panel.querySelectorAll(".position-primary-card").forEach((button) => {
    const isActive = button.dataset.positionPrimary === normalized.primary;
    button.classList.toggle("active", isActive);
  });

  panel.querySelectorAll(".position-toggle-card").forEach((button) => {
    const isActive = normalized.secondary.includes(button.dataset.positionSecondary);
    button.classList.toggle("active", isActive);
  });
}

function bindPresetHandlers(form) {
  const positionInput = form.querySelector('input[name="position"]');
  const openPositionPanel = form.querySelector("#openPositionPanel");
  const closePositionPanel = form.querySelector("#closePositionPanel");
  const positionPanel = form.querySelector("#positionPanel");
  if (positionInput && openPositionPanel && closePositionPanel && positionPanel) {
    applyPositionsToPanel(form, parsePositionText(positionInput.value));

    openPositionPanel.addEventListener("click", () => {
      positionPanel.hidden = false;
    });

    closePositionPanel.addEventListener("click", () => {
      syncPositionFromPanel(form);
      positionPanel.hidden = true;
    });

    positionPanel.addEventListener("click", (event) => {
      const primaryCard = event.target.closest(".position-primary-card");
      if (primaryCard) {
        positionPanel.querySelectorAll(".position-primary-card").forEach((button) => {
          button.classList.toggle("active", button === primaryCard);
        });
        syncPositionFromPanel(form);
        return;
      }

      const secondaryCard = event.target.closest(".position-toggle-card");
      if (secondaryCard) {
        secondaryCard.classList.toggle("active");
        syncPositionFromPanel(form);
      }
    });
  }

  ["pitcher", "hitter"].forEach((mode) => {
    const traitsArea = form.querySelector(`textarea[name="traits_${mode}"]`);
    const openTraitPanel = form.querySelector(`[data-open-trait-panel="${mode}"]`);
    const traitPanel = form.querySelector(`[data-trait-panel="${mode}"]`);
    const closeTraitPanel = form.querySelector(`[data-close-trait-panel="${mode}"]`);
    if (!traitsArea || !openTraitPanel || !closeTraitPanel || !traitPanel) return;

    applyTraitsToPanel(form, splitCsv(traitsArea.value), mode);

    openTraitPanel.addEventListener("click", () => {
      if (traitPanel.hidden) {
        traitPanel.hidden = false;
      } else {
        syncTraitsFromPanel(form, mode);
        traitPanel.hidden = true;
      }
    });

    closeTraitPanel.addEventListener("click", () => {
      syncTraitsFromPanel(form, mode);
      traitPanel.hidden = true;
    });

    traitPanel.addEventListener("click", (event) => {
      const toggle = event.target.closest(".trait-toggle-card");
      if (toggle) {
        toggle.classList.toggle("active");
        syncTraitsFromPanel(form, mode);
      }
    });

    traitPanel.addEventListener("change", (event) => {
      if (event.target.classList.contains("trait-rank-select")) {
        syncTraitsFromPanel(form, mode);
      }
    });

    const unknownInput = traitPanel.querySelector(`[data-unknown-traits="${mode}"]`);
    if (unknownInput) {
      unknownInput.addEventListener("input", () => {
        syncTraitsFromPanel(form, mode);
      });
    }

    traitsArea.addEventListener("input", () => {
      const traits = splitCsv(traitsArea.value);
      applyTraitsToPanel(form, traits, mode);
      refreshChipPreview(form, `traits_${mode}`, `.traits-preview-${mode}`, `trait:${mode}`);
    });
  });

  ["pitcher", "hitter"].forEach((mode) => {
    const strategyArea = form.querySelector(`textarea[name="strategy_${mode}"]`);
    const openStrategyPanel = form.querySelector(`[data-open-strategy-panel="${mode}"]`);
    const closeStrategyPanel = form.querySelector(`[data-close-strategy-panel="${mode}"]`);
    const strategyPanel = form.querySelector(`[data-strategy-panel="${mode}"]`);
    if (!strategyArea || !openStrategyPanel || !closeStrategyPanel || !strategyPanel) return;

    applyStrategyToPanel(form, splitCsv(strategyArea.value), mode);

    openStrategyPanel.addEventListener("click", () => {
      strategyPanel.hidden = false;
    });

    closeStrategyPanel.addEventListener("click", () => {
      syncStrategyFromPanel(form, mode);
      strategyPanel.hidden = true;
    });

    strategyPanel.addEventListener("click", (event) => {
      const toggle = event.target.closest(".strategy-toggle-card");
      if (toggle) {
        toggle.classList.toggle("active");
        syncStrategyFromPanel(form, mode);
      }
    });

    const unknownStrategyInput = strategyPanel.querySelector(`[data-unknown-strategy="${mode}"]`);
    if (unknownStrategyInput) {
      unknownStrategyInput.addEventListener("input", () => {
        syncStrategyFromPanel(form, mode);
      });
    }

    strategyArea.addEventListener("input", () => {
      applyStrategyToPanel(form, splitCsv(strategyArea.value), mode);
      refreshChipPreview(form, `strategy_${mode}`, `.strategy-preview-${mode}`);
    });
  });

  const breakingBallEditor = form.querySelector("#breakingBallEditor");
  if (breakingBallEditor) {
    renderBreakingBallEditorGrid(form);

    breakingBallEditor.addEventListener("change", (event) => {
      if (!(event.target instanceof HTMLSelectElement)) return;
      syncBreakingBallsFromEditor(form);
      updatePlayerDraftFromForm(form);
    });
  }

  const syncDraft = () => updatePlayerDraftFromForm(form);
  form.addEventListener("input", syncDraft);
  form.addEventListener("change", syncDraft);
}

function savePlayerForm(form) {
  const target = findPlayer(form.dataset.playerId);
  if (!target) return;

  const player = target.player;
  const formData = new FormData(form);

  player.name = String(formData.get("name") || "").trim();
  player.number = toInt(formData.get("number"), 0);
  player.age = toInt(formData.get("age"), 18);
  player.type = String(formData.get("type") || "野手").trim();
  player.positions = parsePositionText(String(formData.get("position") || "").trim());
  player.position = formatPositions(player.positions);
  player.hand = String(formData.get("hand") || "").trim();

  player.hitter = {
    trajectory: toInt(formData.get("h_trajectory"), 1),
    contact: toInt(formData.get("h_contact"), 1),
    power: toInt(formData.get("h_power"), 1),
    speed: toInt(formData.get("h_speed"), 1),
    arm: toInt(formData.get("h_arm"), 1),
    fielding: toInt(formData.get("h_fielding"), 1),
    catching: toInt(formData.get("h_catching"), 1)
  };

  player.pitcher = {
    velocity: toInt(formData.get("p_velocity"), 120),
    control: toInt(formData.get("p_control"), 1),
    stamina: toInt(formData.get("p_stamina"), 1),
    breakingBalls: parseBreakingBalls(String(formData.get("p_breakingBalls") || ""))
  };

  player.traitsPitcher = splitCsv(formData.get("traits_pitcher"));
  player.traitsHitter = splitCsv(formData.get("traits_hitter"));
  player.traits = buildLegacyCombinedTraits(player.traitsPitcher, player.traitsHitter);
  player.strategyPitcher = splitCsv(formData.get("strategy_pitcher"));
  player.strategyHitter = splitCsv(formData.get("strategy_hitter"));
  player.strategy = buildLegacyCombinedStrategies(player.strategyPitcher, player.strategyHitter);

  normalizePlayer(player);
  clearPlayerDraft(player.id);
  renderWorkspaceTabs();
  renderWorkspaceContent();
  setStatus(`${player.name} を更新しました。全体を保存してください。`);
  
  if (window.closePlayerTabAfterSave) {
    window.closePlayerTabAfterSave();
  }
}

function renderRosterWorkspace() {
  const team = getCurrentTeam();
  const allPlayers = team?.players || [];
  const filteredPlayers = allPlayers.filter((player) => matchesRosterFilters(player, state.rosterFilters));
  const columns = getRosterColumns();
  if (!columns.some((column) => column.key === state.rosterSort.key)) {
    state.rosterSort = { key: "number", direction: "asc" };
  }
  const players = sortRosterPlayers(filteredPlayers);
  const headers = columns.map((column) => `<th>${buildSortableHeader(column)}</th>`).join("");

  els.workspaceContent.innerHTML = `
    <section class="panel roster-workspace">
      <div class="panel-header">
        <h2>選手一覧</h2>
        <div class="roster-header-controls">
          <div id="teamTabs" class="team-tabs"></div>
          <div class="roster-actions">
            <button type="button" id="addTeamBtn" class="sub-btn">チーム追加</button>
            <button type="button" id="deleteTeamBtn" class="danger-btn" ${team ? "" : "disabled"}>チーム削除</button>
            <button type="button" id="addPlayerBtn" class="sub-btn" ${team ? "" : "disabled"}>選手追加</button>
          </div>
          <div id="addTeamForm" class="inline-create-team" hidden>
            <input id="newTeamName" placeholder="チーム名" />
            <input id="newTeamLeague" placeholder="リーグ（任意）" value="セ・リーグ" />
            <button type="button" id="confirmAddTeamBtn" class="sub-btn">作成</button>
            <button type="button" id="cancelAddTeamBtn" class="danger-btn">キャンセル</button>
          </div>
        </div>
      </div>
      <div class="roster-filter-bar">
        <div class="filter-field keyword">
          <label for="filterKeyword">キーワード</label>
          <input id="filterKeyword" value="${escapeHtml(state.rosterFilters.keyword)}" placeholder="名前・背番号・特能で検索" />
        </div>
        <div class="filter-field narrow">
          <label for="filterType">区分</label>
          <select id="filterType">
            <option value="all" ${state.rosterFilters.type === "all" ? "selected" : ""}>すべて</option>
            <option value="野手" ${state.rosterFilters.type === "野手" ? "selected" : ""}>野手</option>
            <option value="投手" ${state.rosterFilters.type === "投手" ? "selected" : ""}>投手</option>
            <option value="二刀流" ${state.rosterFilters.type === "二刀流" ? "selected" : ""}>二刀流</option>
          </select>
        </div>
        <div class="filter-field">
          <label for="filterPosition">守備/適性</label>
          <input id="filterPosition" value="${escapeHtml(state.rosterFilters.position)}" placeholder="例: 先, 外野, 遊" />
        </div>
        <div class="filter-field narrow">
          <label for="rosterViewMode">表示能力</label>
          <select id="rosterViewMode">
            <option value="both" ${state.rosterViewMode === "both" ? "selected" : ""}>両方表示</option>
            <option value="pitcher" ${state.rosterViewMode === "pitcher" ? "selected" : ""}>投手能力のみ</option>
            <option value="hitter" ${state.rosterViewMode === "hitter" ? "selected" : ""}>野手能力のみ</option>
          </select>
        </div>
        <div class="filter-actions">
          <button type="button" id="resetRosterFilters" class="sub-btn">リセット</button>
          <span class="filter-result-count">${players.length} / ${allPlayers.length}</span>
        </div>
      </div>
      <div class="table-wrapper">
        <table id="rosterTable">
          <thead>
            <tr>
              ${headers}
              <th>編集</th>
            </tr>
          </thead>
          <tbody id="rosterBody">${players.map(rosterRow).join("")}</tbody>
        </table>
      </div>
    </section>
  `;

  const teamTabs = document.getElementById("teamTabs");
  renderTeamTabs(teamTabs);
  bindRosterFilters();
  bindRosterSorting();

  const addTeamBtn = document.getElementById("addTeamBtn");
  const addTeamForm = document.getElementById("addTeamForm");
  const newTeamName = document.getElementById("newTeamName");
  const newTeamLeague = document.getElementById("newTeamLeague");
  const confirmAddTeamBtn = document.getElementById("confirmAddTeamBtn");
  const cancelAddTeamBtn = document.getElementById("cancelAddTeamBtn");

  addTeamBtn?.addEventListener("click", () => {
    if (!addTeamForm) return;
    addTeamForm.hidden = false;
    newTeamName?.focus();
  });

  cancelAddTeamBtn?.addEventListener("click", () => {
    if (!addTeamForm) return;
    addTeamForm.hidden = true;
  });

  confirmAddTeamBtn?.addEventListener("click", () => {
    const ok = addTeam(newTeamName?.value || "", newTeamLeague?.value || "");
    if (!ok) return;
    if (addTeamForm) {
      addTeamForm.hidden = true;
    }
  });

  newTeamName?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    confirmAddTeamBtn?.click();
  });

  newTeamLeague?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    confirmAddTeamBtn?.click();
  });

  document.getElementById("deleteTeamBtn")?.addEventListener("click", deleteCurrentTeam);
  document.getElementById("addPlayerBtn")?.addEventListener("click", addPlayerToCurrentTeam);

  els.workspaceContent.querySelectorAll("#rosterBody tr[data-player-id]").forEach((row) => {
    row.addEventListener("dblclick", () => openPlayerTab(row.dataset.playerId));
  });
  els.workspaceContent.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => openPlayerTab(btn.dataset.playerId));
  });
  els.workspaceContent.querySelectorAll("[data-delete-player-id]").forEach((btn) => {
    btn.addEventListener("click", () => deletePlayerById(btn.dataset.deletePlayerId));
  });
}

function renderDetailWorkspace(playerId) {
  const target = findPlayer(playerId);
  if (!target) {
    state.activeWorkspaceTab = ROSTER_TAB_ID;
    renderWorkspaceTabs();
    renderWorkspaceContent();
    return;
  }

  els.workspaceContent.innerHTML = `
    <section class="panel detail-workspace">
      <div class="panel-header">
        <h2>${escapeHtml(target.player.name)} 詳細</h2>
        <div class="header-actions">
          <button type="button" id="savePlayerInDetailBtn" class="primary">この選手を保存</button>
          <button type="button" id="deletePlayerInDetailBtn" class="danger-btn">この選手を削除</button>
        </div>
      </div>
      <div class="detail-content">${buildPlayerForm(target.player)}</div>
    </section>
  `;

  document.getElementById("savePlayerInDetailBtn")?.addEventListener("click", () => {
    const form = document.getElementById("playerForm");
    if (form) form.dispatchEvent(new Event("submit"));
  });

  document.getElementById("deletePlayerInDetailBtn")?.addEventListener("click", () => {
    deletePlayerById(playerId);
  });

  const form = document.getElementById("playerForm");
  const draft = state.playerDrafts[playerId];
  if (draft) {
    applyFormSnapshot(form, draft);
  }
  renderBreakingBallEditorGrid(form);
  bindDetailSubTabs(form);
  bindPresetHandlers(form);
  bindRealtimeFormUpdates(form);
  updateHeroPresentation(form);
  updateTrajectoryPresentation(form);
  form.querySelectorAll('.stat-row input[type="number"]').forEach((input) => updateStatPresentation(input));

  ["pitcher", "hitter"].forEach((mode) => {
    const traitsField = form.querySelector(`textarea[name="traits_${mode}"]`);
    if (!traitsField) return;
    applyTraitsToPanel(form, splitCsv(traitsField.value), mode);
    refreshChipPreview(form, `traits_${mode}`, `.traits-preview-${mode}`, `trait:${mode}`);
  });

  ["pitcher", "hitter"].forEach((mode) => {
    const strategyField = form.querySelector(`textarea[name="strategy_${mode}"]`);
    if (!strategyField) return;
    applyStrategyToPanel(form, splitCsv(strategyField.value), mode);
    refreshChipPreview(form, `strategy_${mode}`, `.strategy-preview-${mode}`);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    savePlayerForm(form);
  });
}

function renderWorkspaceContent() {
  if (state.activeWorkspaceTab === ROSTER_TAB_ID) {
    renderRosterWorkspace();
    return;
  }

  renderDetailWorkspace(state.activeWorkspaceTab);
}

async function saveAll(options = {}) {
  const { saveAs = false, silentOnCancel = false } = options;

  try {
    const result = await window.teamApi.save(state.data, { saveAs });
    if (!result?.ok) {
      if (!silentOnCancel) {
        setStatus("保存をキャンセルしました。");
      }
      return false;
    }

    state.lastSavedSnapshot = serializeDataSnapshot(state.data);
    rememberLastEditedFilePath(result?.dataPath);
    const fileLabel = result?.dataPath ? ` (${result.dataPath})` : "";
    setStatus(`JSONへ保存しました。${fileLabel}`);
    return true;
  } catch (error) {
    setStatus(`保存に失敗: ${error.message}`);
    return false;
  }
}

async function openDataFileFromMenu() {
  if (hasUnsavedChanges()) {
    const decision = await window.teamApi.confirmSaveBeforeOpen();
    if (decision === "cancel") {
      setStatus("ファイルを開く操作をキャンセルしました。");
      return;
    }

    if (decision === "save") {
      const saved = await saveAll({ saveAs: false, silentOnCancel: true });
      if (!saved) {
        setStatus("保存が完了しなかったため、ファイルを開く操作を中止しました。");
        return;
      }
    }
  }

  try {
    const result = await window.teamApi.openFile({
      defaultDirectoryMode: getFileDialogDefaultDirectoryMode(),
      lastOpenedFilePath: getLastEditedFilePath()
    });
    if (!result?.ok) {
      return;
    }

    const pathLabel = result.dataPath ? ` ${result.dataPath}` : "";
    applyLoadedData(result.data, `ファイルを読み込みました。${pathLabel}`, { dataPath: result.dataPath });
  } catch (error) {
    setStatus(`読み込み失敗: ${error.message}`);
  }
}

function applyLoadedData(data, statusMessage, options = {}) {
  const dataPath = String(options?.dataPath || "").trim();
  state.data = data;
  for (const team of state.data.teams) {
    for (const player of team.players) {
      normalizePlayer(player);
    }
  }

  const selectedTeamExists = state.data.teams.some((team) => team.id === state.selectedTeamId);
  state.selectedTeamId = selectedTeamExists ? state.selectedTeamId : state.data.teams[0]?.id || null;
  state.openTabs = [];
  state.playerDrafts = {};
  state.dirtyPlayerTabs.clear();
  state.activeWorkspaceTab = ROSTER_TAB_ID;
  state.lastSavedSnapshot = serializeDataSnapshot(state.data);
  rememberLastEditedFilePath(dataPath);

  renderWorkspaceTabs();
  renderWorkspaceContent();
  setStatus(statusMessage);
}

async function bootstrap() {
  try {
    state.settings = loadAppSettings();
    const startupMode = getStartupOpenMode();

    if (startupMode === STARTUP_OPEN_MODES.OPEN_FILE_DIALOG) {
      const result = await window.teamApi.openFile({
        defaultDirectoryMode: getFileDialogDefaultDirectoryMode(),
        lastOpenedFilePath: getLastEditedFilePath()
      });

      if (result?.ok) {
        const pathLabel = result.dataPath ? ` ${result.dataPath}` : "";
        applyLoadedData(result.data, `ファイルを読み込みました。${pathLabel}`, { dataPath: result.dataPath });
        return;
      }

      const data = await window.teamApi.load();
      applyLoadedData(data, "起動時のファイル選択をキャンセルしたため、新規チームデータを作成しました。");
      return;
    }

    if (startupMode === STARTUP_OPEN_MODES.OPEN_LAST_EDITED_FILE) {
      const lastEditedFilePath = getLastEditedFilePath();
      if (lastEditedFilePath) {
        const result = await window.teamApi.openSpecificFile(lastEditedFilePath);
        if (result?.ok) {
          const pathLabel = result.dataPath ? ` ${result.dataPath}` : "";
          applyLoadedData(result.data, `ファイルを読み込みました。${pathLabel}`, { dataPath: result.dataPath });
          return;
        }

        const reason = result?.error ? ` (${result.error})` : "";
        const data = await window.teamApi.load();
        applyLoadedData(data, `最後に編集したファイルを開けなかったため、新規チームデータを作成しました。${reason}`);
        return;
      }
    }

    const data = await window.teamApi.load();
    applyLoadedData(data, "新規チームデータを作成しました。");
  } catch (error) {
    setStatus(`読み込み失敗: ${error.message}`);
  }
}

els.saveAllBtn.addEventListener("click", saveAll);

window.teamApi.onMenuSaveRequest(() => {
  void saveAll({ saveAs: false });
});

window.teamApi.onMenuSaveAsRequest(() => {
  void saveAll({ saveAs: true });
});

window.teamApi.onMenuOpenRequest(() => {
  void openDataFileFromMenu();
});

window.teamApi.onMenuOpenSettingsRequest(() => {
  showSettingsDialog();
});

window.teamApi.onRequestCheckUnsavedData(async () => {
  return hasUnsavedChanges();
});

window.teamApi.onAppSaveAndClose(async () => {
  const result = await saveAll();
  if (!result.ok || result.canceled) {
    return;
  }
  
  setTimeout(() => {
    window.teamApi.notifyCloseApp();
  }, 200);
});

window.teamApi.onDataLoaded((payload) => {
  if (!payload?.data || !Array.isArray(payload.data.teams)) {
    setStatus("読み込み失敗: 不正なデータ形式です。");
    return;
  }

  const pathLabel = payload.dataPath ? ` ${payload.dataPath}` : "";
  applyLoadedData(payload.data, `ファイルを読み込みました。${pathLabel}`, { dataPath: payload.dataPath });
});

bootstrap();
