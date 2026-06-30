/**
 * 状態管理モジュール
 * アプリケーション全体の状態を管理
 */

import {
  ROSTER_TAB_ID,
  APP_SETTINGS_STORAGE_KEY,
  BREAKING_BALL_DISPLAY_MODES,
  STARTUP_OPEN_MODES,
  FILE_DIALOG_DEFAULT_DIRECTORY_MODES
} from "./constants.js";
import { buildPlayerSnapshot as defaultBuildPlayerSnapshot } from "./player-manager.js";

/**
 * グローバル状態オブジェクト
 */
export const state = {
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

/**
 * デフォルト設定を作成
 */
export function createDefaultSettings() {
  return {
    breakingBallDisplayMode: BREAKING_BALL_DISPLAY_MODES.STANDARD,
    breakingBallDisplayNameInList: true,
    startupOpenMode: STARTUP_OPEN_MODES.NEW_FILE,
    fileDialogDefaultDirectoryMode: FILE_DIALOG_DEFAULT_DIRECTORY_MODES.DOCUMENTS,
    lastEditedFilePath: ""
  };
}

/**
 * 設定値を正規化し、デフォルト値とマージ
 */
export function normalizeAppSettings(settings) {
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

/**
 * ローカルストレージから設定を読み込み
 */
export function loadAppSettings() {
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

/**
 * 設定をローカルストレージに保存
 */
export function persistAppSettings() {
  try {
    window.localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(state.settings));
  } catch {
    // ignore persistence failures
  }
}

/**
 * 設定を適用（ストレージに保存し、必要に応じてUIを再レンダリング）
 */
export function applyAppSettings(nextSettings, options = {}) {
  const { rerender = true, statusMessage = "", statusCallback = null } = options;
  state.settings = normalizeAppSettings(nextSettings);
  persistAppSettings();

  if (rerender && state.data && statusCallback) {
    statusCallback("renderWorkspaceContent");
  }

  if (statusMessage && statusCallback) {
    statusCallback("setStatus", statusMessage);
  }
}

/**
 * 変化球表示モードを取得
 */
export function getBreakingBallDisplayMode() {
  return state.settings?.breakingBallDisplayMode || BREAKING_BALL_DISPLAY_MODES.STANDARD;
}

/**
 * 変化球名の表示フラグを取得
 */
export function getBreakingBallDisplayNameInList() {
  return state.settings?.breakingBallDisplayNameInList ?? true;
}

/**
 * 起動時の開いに方針を取得
 */
export function getStartupOpenMode() {
  return state.settings?.startupOpenMode || STARTUP_OPEN_MODES.NEW_FILE;
}

/**
 * ファイルダイアログのデフォルトディレクトリモードを取得
 */
export function getFileDialogDefaultDirectoryMode() {
  return state.settings?.fileDialogDefaultDirectoryMode || FILE_DIALOG_DEFAULT_DIRECTORY_MODES.DOCUMENTS;
}

/**
 * 最後に編集したファイルパスを取得
 */
export function getLastEditedFilePath() {
  return String(state.settings?.lastEditedFilePath || "").trim();
}

/**
 * 最後に編集したファイルパスを記録
 */
export function rememberLastEditedFilePath(dataPath) {
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

/**
 * データのスナップショットを文字列化
 */
export function serializeDataSnapshot(data) {
  return JSON.stringify(data ?? null);
}

/**
 * 未保存の変更があるか判定
 */
export function hasUnsavedChanges() {
  if (!state.data) {
    return false;
  }

  if (state.dirtyPlayerTabs.size > 0) {
    return true;
  }

  return serializeDataSnapshot(state.data) !== state.lastSavedSnapshot;
}

/**
 * 現在選択されているチームを取得
 */
export function getCurrentTeam() {
  return state.data?.teams.find((team) => team.id === state.selectedTeamId) || null;
}

/**
 * プレイヤーIDからプレイヤーとチームを検索
 */
export function findPlayer(playerId) {
  for (const team of state.data.teams) {
    const player = team.players.find((p) => p.id === playerId);
    if (player) {
      return { player, team };
    }
  }
  return null;
}

/**
 * フォームスナップショットを構築
 */
export function buildFormSnapshot(form) {
  const snapshot = {};
  const ignoredNames = new Set(["p_breakingBallsExtra"]);
  form.querySelectorAll("input[name], select[name], textarea[name]").forEach((field) => {
    if (ignoredNames.has(field.name)) return;
    snapshot[field.name] = String(field.value ?? "");
  });
  return snapshot;
}

/**
 * フォームスナップショットを適用
 */
export function applyFormSnapshot(form, snapshot) {
  Object.entries(snapshot || {}).forEach(([name, value]) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;
    field.value = value;
  });
}

/**
 * プレイヤーのドラフトを更新
 */
export function updatePlayerDraftFromForm(form) {
  const playerId = form.dataset.playerId;
  if (!playerId) return;
  const target = findPlayer(playerId);
  if (!target) return;

  const base = buildPlayerSnapshotImpl(target.player);
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
    // Trigger workspace tabs re-render via callback
  }
}

/**
 * プレイヤーのドラフトをクリア
 */
export function clearPlayerDraft(playerId) {
  delete state.playerDrafts[playerId];
  state.dirtyPlayerTabs.delete(playerId);
}

/**
 * プレイヤータブがダーティかどうか判定
 */
export function isPlayerTabDirty(playerId) {
  return state.dirtyPlayerTabs.has(playerId);
}

// Import utility for draft builder (imported in methods as needed)
import { stringifyComparable } from "./utils.js";

let buildPlayerSnapshotImpl = defaultBuildPlayerSnapshot;

export function setBuildPlayerSnapshot(fn) {
  if (typeof fn === "function") {
    buildPlayerSnapshotImpl = fn;
  }
}
