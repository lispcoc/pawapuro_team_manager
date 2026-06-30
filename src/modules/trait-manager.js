/**
 * トレイト（特性）管理モジュール
 * 特性の解析、編集、同期機能を管理
 */

import {
  RANK_LETTERS,
  TRAIT_EDITOR_CONFIGS,
  POSITIVE_RANK_LETTERS,
  NEGATIVE_RANK_LETTERS,
  POSITIVE_SPECIAL_TRAITS,
  NEGATIVE_SPECIAL_TRAITS,
  LINKED_RANKED_TRAIT_BASES,
  PITCHER_RANKED_TRAIT_BASES,
  HITTER_RANKED_TRAIT_BASES
} from "./constants.js";
import { escapeHtml, splitCsv, uniqueStrings } from "./utils.js";

/**
 * ランク付き特性かどうかを判定
 */
export function isRankedTraitTextForBases(trait, rankedBases) {
  for (const base of rankedBases) {
    if (!trait.startsWith(base)) continue;
    const suffix = trait.slice(base.length);
    if (RANK_LETTERS.includes(suffix)) {
      return true;
    }
  }
  return false;
}

/**
 * トレイトエディタ設定を取得
 */
export function getTraitEditorConfig(mode) {
  return TRAIT_EDITOR_CONFIGS[mode] || TRAIT_EDITOR_CONFIGS.hitter;
}

/**
 * レガシートレイトをデコード
 */
export function decodeLegacyTrait(value) {
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
 * 投手・野手特性を統合したレガシー形式で構築
 */
export function buildLegacyCombinedTraits(pitcherTraits, hitterTraits) {
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

/**
 * 特性をモードごとに分割
 */
export function splitTraitsByEditorMode(traits, playerType = "二刀流") {
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

    const isPitcherToggle = TRAIT_EDITOR_CONFIGS.pitcher.knownToggleSet.has(trait);
    const isHitterToggle = TRAIT_EDITOR_CONFIGS.hitter.knownToggleSet.has(trait);
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

/**
 * プレイヤーのモード別特性を取得
 */
export function getPlayerTraitsByMode(player, mode) {
  const modeKey = mode === "pitcher" ? "traitsPitcher" : "traitsHitter";
  const configured = uniqueStrings(Array.isArray(player[modeKey]) ? player[modeKey].map((item) => decodeLegacyTrait(item).name) : []);
  if (configured.length > 0) {
    return configured;
  }

  return splitTraitsByEditorMode(player.traits, player.type)[mode];
}

/**
 * プレイヤーのすべての特性を統合して取得
 */
export function getPlayerAllTraits(player) {
  return buildLegacyCombinedTraits(getPlayerTraitsByMode(player, "pitcher"), getPlayerTraitsByMode(player, "hitter"));
}

/**
 * ランク付き特性のトーンを取得
 */
export function getRankedTraitTone(rank) {
  if (POSITIVE_RANK_LETTERS.has(rank)) return "positive";
  if (NEGATIVE_RANK_LETTERS.has(rank)) return "negative";
  return "neutral";
}

/**
 * 特性のトーン（ポジティブ/ネガティブ）を判定
 */
export function getTraitTone(trait, mode = null) {
  const normalized = String(trait || "").trim();
  const config = mode ? getTraitEditorConfig(mode) : null;

  for (const base of (config?.rankedBases || PITCHER_RANKED_TRAIT_BASES)) {
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

/**
 * トレイト状態をパース
 */
export function parseTraitState(traits, rankedBases = PITCHER_RANKED_TRAIT_BASES, toggleTraits = []) {
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

/**
 * トレイト状態から特性を合成
 */
export function composeTraitsFromState(ranked, toggles, unknown, rankedBases = PITCHER_RANKED_TRAIT_BASES, toggleTraits = []) {
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

/**
 * トレイトプレビューグリッドを構築
 */
export function buildTraitPreviewGrid(traits, mode) {
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

/**
 * トレイトパネルを構築
 */
export function buildTraitPanel(traits, mode) {
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
