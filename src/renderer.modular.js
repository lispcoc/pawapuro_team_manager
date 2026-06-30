import { setBuildPlayerSnapshot } from "./modules/state-manager.js";
import { buildPlayerSnapshot } from "./modules/player-manager.js";

async function start() {
  setBuildPlayerSnapshot(buildPlayerSnapshot);
  await import("./renderer.legacy.js");
}

start().catch((error) => {
  const statusBar = document.getElementById("statusBar");
  if (statusBar) {
    statusBar.textContent = `モジュール起動エラー: ${error?.message || error}`;
  }
});
