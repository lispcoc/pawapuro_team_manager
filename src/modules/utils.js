/**
 * ユーティリティ関数モジュール
 * 汎用的なヘルパー関数を管理
 */

/**
 * 数値型に変換
 */
export function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * HTML特殊文字をエスケープ
 */
export function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * 値を指定範囲にクリップ
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * 重複を除いた文字列配列を取得
 */
export function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

/**
 * ユーザー入力値を検索用に正規化
 */
export function normalizeForSearch(text) {
  return String(text || "").trim().toLowerCase();
}

/**
 * CSV文字列をパース（テキストエリアの入力など）
 */
export function splitCsv(text) {
  return String(text || "")
    .split(/[、,]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * ID種のテキストを正規化
 */
export function sanitizeIdSeed(text, fallback) {
  const normalized = String(text || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9_]/g, "");
  return normalized || fallback;
}

/**
 * ユニークなIDを生成
 */
export function makeUniqueId(existingIds, seed) {
  let nextId = seed;
  let index = 2;
  while (existingIds.has(nextId)) {
    nextId = `${seed}_${index}`;
    index += 1;
  }
  return nextId;
}

/**
 * メーター表示用のパーセンテージを計算
 */
export function meterPercent(value, min, max) {
  if (max <= min) return 0;
  const p = ((value - min) / (max - min)) * 100;
  return clamp(Math.round(p), 0, 100);
}

/**
 * 値に基づいて等級を判定
 */
export function gradeByValue(value) {
  if (value >= 90) return "S";
  if (value >= 80) return "A";
  if (value >= 70) return "B";
  if (value >= 60) return "C";
  if (value >= 50) return "D";
  if (value >= 40) return "E";
  if (value >= 20) return "F";
  return "G";
}

/**
 * 投打属性から投力方向を抽出
 */
export function extractThrowingHand(hand) {
  const text = String(hand || "").trim();
  if (text.includes("左投")) return "left";
  if (text.includes("右投")) return "right";
  return "right";
}

/**
 * 10時方向カウンターの角度から並び順キーを取得
 */
export function getBreakingBallOrderKeyFromNineCounterClockwise(angle) {
  const normalized = ((toInt(angle, 0) % 360) + 360) % 360;
  return (180 - normalized + 360) % 360;
}

/**
 * 矢印グリフを構築（SVG）
 */
export function buildChunkyArrowGlyph(x, y, angle, fill = "#0f6d63", stroke = "#0b4f49") {
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

/**
 * 2つの値を比較（ローカライズ対応）
 */
export function compareValues(left, right) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }
  return String(left).localeCompare(String(right), "ja");
}

/**
 * 適用可能な値を比較
 */
export function stringifyComparable(obj) {
  return JSON.stringify(obj);
}
