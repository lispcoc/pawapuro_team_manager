/**
 * ファイル操作モジュール
 * ファイルの保存・読込機能を管理
 */

import { serializeDataSnapshot, hasUnsavedChanges } from "./state-manager.js";
import { rememberLastEditedFilePath, getFileDialogDefaultDirectoryMode, getLastEditedFilePath, getStartupOpenMode, state, loadAppSettings } from "./state-manager.js";
import { setStatus } from "./ui-renderer.js";
import { normalizePlayer } from "./player-manager.js";
import { ROSTER_TAB_ID, STARTUP_OPEN_MODES } from "./constants.js";

/**
 * すべてのデータを保存
 */
export async function saveAll(options = {}) {
  const { saveAs = false, silentOnCancel = false } = options;

  try {
    const result = await window.teamApi.save(state.data, { saveAs });
    if (!result?.ok) {
      if (!silentOnCancel) {
        setStatus("保存をキャンセルしました。");
      }
      return { canceled: true };
    }

    state.lastSavedSnapshot = serializeDataSnapshot(state.data);
    rememberLastEditedFilePath(result?.dataPath);
    const fileLabel = result?.dataPath ? ` (${result.dataPath})` : "";
    setStatus(`JSONへ保存しました。${fileLabel}`);
    return { canceled: false, ok: true, dataPath: result?.dataPath };
  } catch (error) {
    setStatus(`保存に失敗: ${error.message}`);
    return { canceled: false, ok: false, error };
  }
}

/**
 * メニューからファイルを開く
 */
export async function openDataFileFromMenu() {
  if (hasUnsavedChanges()) {
    const decision = await window.teamApi.confirmSaveBeforeOpen();
    if (decision === "cancel") {
      setStatus("ファイルを開く操作をキャンセルしました。");
      return;
    }

    if (decision === "save") {
      const saved = await saveAll({ saveAs: false, silentOnCancel: true });
      if (!saved.ok) {
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

/**
 * 読み込んだデータを適用
 */
export function applyLoadedData(data, statusMessage, options = {}) {
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

  // Trigger UI update
  setStatus(statusMessage);
}

/**
 * アプリケーションブートストラップ
 */
export async function bootstrap(renderCallback) {
  const startupMode = getStartupOpenMode();
  state.settings = loadAppSettings();

  if (startupMode === STARTUP_OPEN_MODES.OPEN_FILE_DIALOG) {
    const result = await window.teamApi.openFile({
      defaultDirectoryMode: getFileDialogDefaultDirectoryMode(),
      lastOpenedFilePath: getLastEditedFilePath()
    });

    if (result?.ok) {
      const pathLabel = result.dataPath ? ` ${result.dataPath}` : "";
      applyLoadedData(result.data, `ファイルを読み込みました。${pathLabel}`, { dataPath: result.dataPath });
      renderCallback();
      return;
    }

    const data = await window.teamApi.load();
    applyLoadedData(data, "起動時のファイル選択をキャンセルしたため、新規チームデータを作成しました。");
    renderCallback();
    return;
  }

  if (startupMode === STARTUP_OPEN_MODES.OPEN_LAST_EDITED_FILE) {
    const lastEditedFilePath = getLastEditedFilePath();
    if (lastEditedFilePath) {
      const result = await window.teamApi.openSpecificFile(lastEditedFilePath);
      if (result?.ok) {
        const pathLabel = result.dataPath ? ` ${result.dataPath}` : "";
        applyLoadedData(result.data, `ファイルを読み込みました。${pathLabel}`, { dataPath: result.dataPath });
        renderCallback();
        return;
      }

      const reason = result?.error ? ` (${result.error})` : "";
      const data = await window.teamApi.load();
      applyLoadedData(data, `最後に編集したファイルを開けなかったため、新規チームデータを作成しました。${reason}`);
      renderCallback();
      return;
    }
  }

  const data = await window.teamApi.load();
  applyLoadedData(data, "新規チームデータを作成しました。");
  renderCallback();
}

/**
 * ハンドル：メニューから保存要求
 */
export function handleMenuSaveRequest() {
  void saveAll({ saveAs: false });
}

/**
 * ハンドル：メニューから名前を付けて保存要求
 */
export function handleMenuSaveAsRequest() {
  void saveAll({ saveAs: true });
}

/**
 * ハンドル：メニューから開く要求
 */
export function handleMenuOpenRequest() {
  void openDataFileFromMenu();
}

/**
 * ハンドル：未保存データチェック
 */
export async function handleRequestCheckUnsavedData() {
  return hasUnsavedChanges();
}

/**
 * ハンドル：アプリ保存して閉じる
 */
export async function handleAppSaveAndClose() {
  const result = await saveAll();
  if (!result.ok || result.canceled) {
    return;
  }
  
  setTimeout(() => {
    window.teamApi.notifyCloseApp();
  }, 200);
}

/**
 * ハンドル：データ読み込み
 */
export function handleDataLoaded(payload) {
  if (!payload?.data || !Array.isArray(payload.data.teams)) {
    setStatus("読み込み失敗: 不正なデータ形式です。");
    return;
  }

  const pathLabel = payload.dataPath ? ` ${payload.dataPath}` : "";
  applyLoadedData(payload.data, `ファイルを読み込みました。${pathLabel}`, { dataPath: payload.dataPath });
}
