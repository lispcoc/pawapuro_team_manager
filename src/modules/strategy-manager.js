/**
 * 戦略管理モジュール
 * 起用法（戦略）の解析、編集、同期機能を管理
 */

import { STRATEGY_EDITOR_CONFIGS } from "./constants.js";
import { escapeHtml, splitCsv, uniqueStrings } from "./utils.js";

/**
 * 戦略エディタ設定を取得
 */
export function getStrategyEditorConfig(mode) {
  return STRATEGY_EDITOR_CONFIGS[mode] || STRATEGY_EDITOR_CONFIGS.hitter;
}

/**
 * レガシー戦略をデコード
 */
export function decodeLegacyStrategy(value) {
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

/**
 * 投手・野手戦略を統合したレガシー形式で構築
 */
export function buildLegacyCombinedStrategies(pitcherItems, hitterItems) {
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

/**
 * 戦略をモードごとに分割
 */
export function splitStrategiesByEditorMode(items, playerType = "二刀流") {
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

/**
 * プレイヤーのモード別戦略を取得
 */
export function getPlayerStrategiesByMode(player, mode) {
  const modeKey = mode === "pitcher" ? "strategyPitcher" : "strategyHitter";
  const configured = uniqueStrings(Array.isArray(player[modeKey]) ? player[modeKey].map((item) => decodeLegacyStrategy(item).name) : []);
  if (configured.length > 0) {
    return configured;
  }

  return splitStrategiesByEditorMode(player.strategy, player.type)[mode];
}

/**
 * プレイヤーのすべての戦略を統合して取得
 */
export function getPlayerAllStrategies(player) {
  return buildLegacyCombinedStrategies(getPlayerStrategiesByMode(player, "pitcher"), getPlayerStrategiesByMode(player, "hitter"));
}

/**
 * 戦略状態をパース
 */
export function parseStrategyState(items, options = []) {
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

/**
 * 戦略状態から戦略を合成
 */
export function composeStrategyFromState(toggles, unknown, options = []) {
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

/**
 * 戦略パネルを構築
 */
export function buildStrategyPanel(strategy, mode) {
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
