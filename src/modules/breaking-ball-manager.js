/**
 * 変化球管理モジュール
 * 変化球の解析、編集、表示機能を管理
 */

import {
  BREAKING_BALL_FAMILIES,
  BREAKING_BALL_FAMILY_MAP,
  BREAKING_BALL_OPTION_TO_FAMILY,
  BREAKING_BALL_LEVELS,
  BREAKING_BALL_LAYOUT_LEFT,
  BREAKING_BALL_LAYOUT_RIGHT,
  BREAKING_BALL_DIRECTION_LAYOUTS,
  BREAKING_BALL_DISPLAY_MODES
} from "./constants.js";
import { clamp, toInt, escapeHtml, getBreakingBallOrderKeyFromNineCounterClockwise, buildChunkyArrowGlyph } from "./utils.js";

/**
 * 変化球の所属ファミリーを取得
 */
export function getBreakingBallFamily(name) {
  const value = String(name || "").trim();
  if (!value) return null;
  return BREAKING_BALL_OPTION_TO_FAMILY.get(value) || null;
}

/**
 * 投力方向から変化球レイアウトを取得
 */
export function getBreakingBallDirectionLayout(throwHand) {
  return throwHand === "left" ? BREAKING_BALL_DIRECTION_LAYOUTS.left : BREAKING_BALL_DIRECTION_LAYOUTS.right;
}

/**
 * 変化球の状態を構築
 */
export function buildBreakingBallState(entries) {
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

/**
 * 変化球テキストをパース
 */
export function parseBreakingBalls(text) {
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

/**
 * 変化球グリッドHTMLを構築
 */
export function buildBreakingBallGrid(stateByFamily, throwHand) {
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

/**
 * エディタから変化球情報を取得
 */
export function composeBreakingBallsFromEditor(editor) {
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

/**
 * エディタから変化球を同期
 */
export function syncBreakingBallsFromEditor(form) {
  const editor = form.querySelector("#breakingBallEditor");
  const hidden = form.querySelector('textarea[name="p_breakingBalls"]');
  if (!editor || !hidden) return;

  const rows = composeBreakingBallsFromEditor(editor);
  hidden.value = rows.map((item) => (item.level > 0 ? `${item.name}:${item.level}` : item.name)).join("\n");

  const meter = form.querySelector("#breakingBallMeter");
  const parsed = parseBreakingBalls(String(hidden?.value || ""));
  const { stateByFamily } = buildBreakingBallState(parsed);
  const throwHand = form.querySelector('input[name="hand"]')?.value;
  if (meter && throwHand) {
    const displayMode = getBreakingBallDisplayMode?.() || BREAKING_BALL_DISPLAY_MODES.STANDARD;
    meter.innerHTML = buildBreakingBallMeterMarkup(stateByFamily, throwHand.includes("左投") ? "left" : "right", displayMode);
  }
}

/**
 * レーダーSVGを構築
 */
export function buildBreakingBallRadarSvg(stateByFamily, throwHand) {
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

/**
 * 矢印表示SVGを構築
 */
export function buildBreakingBallArrowSvg(stateByFamily, throwHand) {
  const viewBoxWidth = 240;
  const viewBoxHeight = 160;
  const centerX = viewBoxWidth / 2;
  const centerY = 50;
  const guideLength = 42;
  const labelLength = 80;
  const straightLabelLength = 30;
  const defaultArrowDistance = 45;
  const straightArrowDistance = 10;
  const numberDistance = 0;

  let svgHtml = `<svg viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" class="breaking-ball-meter-svg" xmlns="http://www.w3.org/2000/svg">`;
  svgHtml += `<circle cx="${centerX}" cy="${centerY}" r="10" fill="#f4f7fb" stroke="#d0dae8" stroke-width="1.5" />`;

  getBreakingBallDirectionLayout(throwHand).forEach(({ familyId, angle }) => {
    const balls = stateByFamily[familyId] || [{ name: "", level: 0 }, { name: "", level: 0 }];
    const angleRad = (angle * Math.PI) / 180;
    const normalX = -Math.sin(angleRad);
    const normalY = Math.cos(angleRad);
    const isStraight = familyId === "straight";
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
    const currentLabelLength = isStraight ? straightLabelLength : labelLength;
    const labelX = centerX + Math.cos(angleRad) * currentLabelLength;
    const labelY = centerY + Math.sin(angleRad) * currentLabelLength;

    svgHtml += `<line x1="${centerX}" y1="${centerY}" x2="${guideX}" y2="${guideY}" stroke="#c8d4e3" stroke-width="0" stroke-linecap="round" />`;

    const hasTwoBalls = activeBalls.length >= 2;
    let drawnActiveCount = 0;
    const ballNames = [];
    const arrowDistance = isStraight ? straightArrowDistance : defaultArrowDistance;

    balls.forEach((ball) => {
      const name = String(ball?.name || "").trim();
      let level = toInt(ball?.level, 0);
      if (!name || level <= 0) {
        return;
      }

      if (isStraight) {
        level = 1;
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

/**
 * メーターマークアップを構築
 */
export function buildBreakingBallMeterMarkup(stateByFamily, throwHand, displayMode = BREAKING_BALL_DISPLAY_MODES.STANDARD) {
  return displayMode === BREAKING_BALL_DISPLAY_MODES.ARROW
    ? buildBreakingBallArrowSvg(stateByFamily, throwHand)
    : buildBreakingBallRadarSvg(stateByFamily, throwHand);
}

/**
 * 変化球エディタグリッドをレンダリング
 */
export function renderBreakingBallEditorGrid(form, displayModeGetter) {
  const editor = form.querySelector("#breakingBallEditor");
  const grid = form.querySelector("#breakingBallGrid");
  const meter = form.querySelector("#breakingBallMeter");
  if (!editor || !grid) return;

  const hidden = form.querySelector('textarea[name="p_breakingBalls"]');
  const parsed = parseBreakingBalls(String(hidden?.value || ""));
  const throwHand = form.querySelector('input[name="hand"]')?.value;
  const throwHandDir = throwHand?.includes("左投") ? "left" : "right";
  const { stateByFamily, extras } = buildBreakingBallState(parsed);

  grid.classList.toggle("lefty", throwHandDir === "left");
  grid.innerHTML = buildBreakingBallGrid(stateByFamily, throwHandDir);

  if (meter) {
    const displayMode = displayModeGetter?.() || BREAKING_BALL_DISPLAY_MODES.STANDARD;
    meter.innerHTML = buildBreakingBallMeterMarkup(stateByFamily, throwHandDir, displayMode);
  }

  const extraInput = editor.querySelector('input[name="p_breakingBallsExtra"]');
  if (extraInput) {
    extraInput.value = JSON.stringify(extras);
  }

  syncBreakingBallsFromEditor(form);
}

// Export for use by other modules
export let getBreakingBallDisplayMode = null;

export function setGetBreakingBallDisplayMode(fn) {
  getBreakingBallDisplayMode = fn;
}
