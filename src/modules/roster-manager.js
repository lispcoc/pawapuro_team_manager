/**
 * ロスター管理モジュール
 * 選手一覧の表示ロジックを管理
 */

import { toInt, compareValues, escapeHtml, gradeByValue, buildChunkyArrowGlyph, normalizeForSearch } from "./utils.js";
import { getPlayerPositionLabel, buildPositionBadge } from "./player-manager.js";
import { getPlayerBreakingBallTotal, getPlayerBreakingBallDirectionalEntries } from "./breaking-ball-manager.js";
import { getBreakingBallDisplayNameInList } from "./state-manager.js";

/**
 * 比較可能な値を取得
 */
export function getComparableValue(player, key) {
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

/**
 * ロスター選手をソート
 */
export function sortRosterPlayers(players, rosterSort) {
  const { key, direction } = rosterSort;
  const sorted = [...players].sort((left, right) => {
    const leftValue = getComparableValue(left, key);
    const rightValue = getComparableValue(right, key);
    const result = compareValues(leftValue, rightValue);
    return direction === "asc" ? result : -result;
  });
  return sorted;
}

/**
 * ランク付き数値をフォーマット
 */
export function formatRankedNumber(value) {
  const safeValue = toInt(value, 0);
  const grade = gradeByValue(safeValue);
  return `<span class="roster-rank grade-${grade}">${grade}</span><span class="roster-value">${safeValue}</span>`;
}

/**
 * ロスターのカラム定義を取得
 */
export function getRosterColumns(rosterViewMode) {
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

  if (rosterViewMode === "hitter") {
    return [...commonColumns, ...hitterColumns];
  }

  if (rosterViewMode === "pitcher") {
    return [...commonColumns, ...pitcherColumns];
  }

  return [...commonColumns, ...hitterColumns, ...pitcherColumns];
}

/**
 * プレイヤー変化球方向セルを構築
 */
export function buildPlayerBreakingBallDirectionCell(player) {
  const entries = getPlayerBreakingBallDirectionalEntries(player);
  if (!entries.length) {
    return "-";
  }
  const breakingBallDisplayNameInList = getBreakingBallDisplayNameInList();

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
            return `<span class="roster-breaking-ball-item-no-name" title="${escapeHtml(title)}">${buildRosterBreakingBallArrowIconSvg(entry.angle, entry.level)}</span>`;
          }
        })
        .join("")}
    </div>
  `;
}

/**
 * ロスターの破球アイコンSVGを構築
 */
export function buildRosterBreakingBallArrowIconSvg(angle, level) {
  return `
    <svg viewBox="4 0 28 24" class="roster-breaking-ball-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="overflow: visible;">
      ${buildChunkyArrowGlyph(18, 12, angle, "#0f6d63", "#0b4f49")}
      <text x="18" y="12" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#ffffff" font-weight="800">${level}</text>
    </svg>
  `;
}

/**
 * ソート可能なヘッダを構築
 */
export function buildSortableHeader(column, rosterSort) {
  if (!column.sortable) {
    return column.label;
  }

  const isActive = rosterSort.key === column.key;
  const directionMark = isActive ? (rosterSort.direction === "asc" ? " ▲" : " ▼") : "";
  return `<button type="button" class="sort-header-btn ${isActive ? "active" : ""}" data-sort-key="${column.key}">${column.label}${directionMark}</button>`;
}

/**
 * フィルター条件にマッチするか判定
 */
export function matchesRosterFilters(player, filters) {
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

/**
 * ロスター行HTMLを構築
 */
export function rosterRow(player, columns) {
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
