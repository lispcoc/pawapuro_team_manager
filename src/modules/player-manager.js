/**
 * プレイヤー管理モジュール
 * プレイヤーデータの追加、編集、削除、正規化機能を管理
 */

import {
  POSITION_OPTIONS,
  POSITION_OPTION_MAP,
  RANK_LETTERS,
  BREAKING_BALL_FAMILY_MAP
} from "./constants.js";
import { toInt, clamp, escapeHtml, sanitizeIdSeed, makeUniqueId } from "./utils.js";
import { getPlayerTraitsByMode, buildLegacyCombinedTraits, splitTraitsByEditorMode } from "./trait-manager.js";
import { getPlayerStrategiesByMode, buildLegacyCombinedStrategies, splitStrategiesByEditorMode } from "./strategy-manager.js";

/**
 * ポジションテキストをパース
 */
export function parsePositionText(text) {
  const tokens = uniqueStrings(String(text || "").split("/"));
  return {
    primary: tokens[0] || "",
    secondary: tokens.slice(1)
  };
}

/**
 * ポジション値を正規化
 */
export function normalizePositionsValue(value) {
  const fallback = { primary: "", secondary: [] };
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const primary = String(value.primary || "").trim();
  const secondary = uniqueStrings(Array.isArray(value.secondary) ? value.secondary : []).filter((item) => item !== primary);
  return { primary, secondary };
}

/**
 * ポジションをフォーマット
 */
export function formatPositions(positions) {
  const normalized = normalizePositionsValue(positions);
  const ordered = normalized.primary
    ? [normalized.primary, ...normalized.secondary.filter((item) => item !== normalized.primary)]
    : normalized.secondary;
  return ordered.join("/");
}

/**
 * プレイヤーのポジションを取得
 */
export function getPlayerPositions(player) {
  const structured = normalizePositionsValue(player.positions);
  if (structured.primary || structured.secondary.length > 0) {
    return structured;
  }
  return parsePositionText(player.position);
}

/**
 * プレイヤーのポジションラベルを取得
 */
export function getPlayerPositionLabel(player) {
  return formatPositions(getPlayerPositions(player));
}

/**
 * メインのポジションカテゴリを取得
 */
export function getMainPositionCategory(player) {
  const primary = getPlayerPositions(player).primary;
  const option = POSITION_OPTION_MAP.get(primary);
  return option?.category || "neutral";
}

/**
 * ポジションバッジを構築
 */
export function buildPositionBadge(player) {
  const category = getMainPositionCategory(player);
  const categoryClass = category === "neutral" ? "" : ` ${category}`;
  return `<span class="player-name-badge${categoryClass}">${escapeHtml(player.name ?? "")}</span>`;
}

/**
 * ポジション選択パネルを構築
 */
export function buildPositionPanel(player) {
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

/**
 * プレイヤーのスナップショットを構築
 */
export function buildPlayerSnapshot(player) {
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

/**
 * プレイヤーデータを正規化
 */
export function normalizePlayer(player) {
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

/**
 * デフォルトのプレイヤーを作成
 */
export function createDefaultPlayer(team) {
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

// Import utilities
import { uniqueStrings } from "./utils.js";
import { getBreakingBallFamily } from "./breaking-ball-manager.js";
