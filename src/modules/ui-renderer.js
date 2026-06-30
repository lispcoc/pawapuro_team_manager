/**
 * UI レンダリングモジュール
 * ワークスペースのレンダリング機能を管理
 */

import { escapeHtml, toInt, meterPercent, gradeByValue, splitCsv } from "./utils.js";
import { getPlayerPositionLabel } from "./player-manager.js";
import { getPlayerTraitsByMode, getTraitTone, buildTraitPreviewGrid } from "./trait-manager.js";
import { getPlayerStrategiesByMode } from "./strategy-manager.js";
import { getPlayerBreakingBallDirectionalEntries, getPlayerBreakingBallTotal } from "./breaking-ball-manager.js";
import { getBreakingBallFamily } from "./breaking-ball-manager.js";
import { BREAKING_BALL_FAMILY_MAP, ROSTER_TAB_ID } from "./constants.js";
import { isPlayerTabDirty, findPlayer } from "./state-manager.js";

/**
 * ステータスメッセージを設定
 */
export function setStatus(message) {
  const statusBar = document.getElementById("statusBar");
  if (statusBar) {
    statusBar.textContent = message;
  }
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
 * 統計フィールドを構築
 */
export function statField(label, inputName, value, min, max, unit = "") {
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

/**
 * 能力チップを構築
 */
export function buildAbilityChips(list, variant = "generic") {
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

/**
 * ワークスペースタブをレンダリング
 */
export function renderWorkspaceTabs(state, onTabSelect, requestClosePlayerTab) {
  const workspaceTabs = document.getElementById("workspaceTabs");
  if (!workspaceTabs) return;

  workspaceTabs.innerHTML = "";

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
      if (typeof onTabSelect === "function") {
        onTabSelect(id);
        return;
      }
      state.activeWorkspaceTab = id;
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

    workspaceTabs.appendChild(wrapper);
  };

  createTab(ROSTER_TAB_ID, "選手一覧", false);

  for (const playerId of state.openTabs) {
    const target = findPlayer(playerId);
    if (!target) continue;
    createTab(playerId, target.player.name || "名称未設定", true);
  }
}

/**
 * チームタブをレンダリング
 */
export function renderTeamTabs(container, state, onTeamSelect) {
  container.innerHTML = "";

  for (const team of state.data.teams) {
    const btn = document.createElement("button");
    btn.className = `tab-btn ${team.id === state.selectedTeamId ? "active" : ""}`;
    btn.textContent = team.name;
    btn.addEventListener("click", () => {
      if (typeof onTeamSelect === "function") {
        onTeamSelect(team.id);
        return;
      }
      state.selectedTeamId = team.id;
    });
    container.appendChild(btn);
  }
}

/**
 * プレイヤーフォームを構築
 */
export function buildPlayerForm(player, toInt, escapeHtml, buildPositionPanel, statField, buildTraitPreviewGrid, buildTraitPanel, buildStrategyPanel, buildAbilityChips) {
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
                    const level = family?.hasLevel === false ? 0 : toInt(b.level, 1);
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

/**
 * チッププレビューをリフレッシュ
 */
export function refreshChipPreview(form, fieldName, targetSelector, variant = "generic") {
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
