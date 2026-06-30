/**
 * イベントハンドラモジュール
 * UI イベント、フォーム操作を管理
 */

import { toInt, clamp, splitCsv, uniqueStrings, escapeHtml, meterPercent, gradeByValue } from "./utils.js";
import {
  getTraitEditorConfig,
  parseTraitState,
  composeTraitsFromState
} from "./trait-manager.js";
import {
  getStrategyEditorConfig,
  parseStrategyState,
  composeStrategyFromState
} from "./strategy-manager.js";
import { normalizePositionsValue, formatPositions, parsePositionText } from "./player-manager.js";
import { renderBreakingBallEditorGrid, syncBreakingBallsFromEditor } from "./breaking-ball-manager.js";
import { getBreakingBallDisplayMode } from "./state-manager.js";
import { LINKED_RANKED_TRAIT_BASES } from "./constants.js";

/**
 * ロスターフィルターをバインド
 */
export function bindRosterFilters(state, renderCallback) {
  const keywordInput = document.getElementById("filterKeyword");
  const typeSelect = document.getElementById("filterType");
  const positionInput = document.getElementById("filterPosition");
  const viewModeSelect = document.getElementById("rosterViewMode");
  const resetButton = document.getElementById("resetRosterFilters");

  if (keywordInput) {
    keywordInput.addEventListener("input", (event) => {
      state.rosterFilters.keyword = event.target.value;
      renderCallback();
    });
  }

  if (typeSelect) {
    typeSelect.addEventListener("change", (event) => {
      state.rosterFilters.type = event.target.value;
      renderCallback();
    });
  }

  if (positionInput) {
    positionInput.addEventListener("input", (event) => {
      state.rosterFilters.position = event.target.value;
      renderCallback();
    });
  }

  if (viewModeSelect) {
    viewModeSelect.addEventListener("change", (event) => {
      state.rosterViewMode = event.target.value;
      renderCallback();
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      state.rosterFilters = {
        keyword: "",
        type: "all",
        position: ""
      };
      state.rosterViewMode = "both";
      state.rosterSort = {
        key: "number",
        direction: "asc"
      };
      renderCallback();
    });
  }
}

/**
 * ロスターソートをバインド
 */
export function bindRosterSorting(state, renderCallback) {
  const workspaceContent = document.getElementById("workspaceContent");
  workspaceContent.querySelectorAll(".sort-header-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const sortKey = button.dataset.sortKey;
      if (state.rosterSort.key === sortKey) {
        state.rosterSort.direction = state.rosterSort.direction === "asc" ? "desc" : "asc";
      } else {
        state.rosterSort.key = sortKey;
        state.rosterSort.direction = "asc";
      }
      renderCallback();
    });
  });
}

/**
 * 統計バーをドラッグバインド
 */
export function bindStatBarDrag(form) {
  form.querySelectorAll(".stat-row .meter").forEach((meter) => {
    const row = meter.closest(".stat-row");
    if (!row) return;
    const input = row.querySelector('input[type="number"]');
    if (!input) return;

    let dragging = false;

    function applyPointer(e) {
      const rect = meter.getBoundingClientRect();
      const clientX = e.clientX;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const min = toInt(input.min, 0);
      const max = toInt(input.max, 100);
      const newValue = Math.round(min + ratio * (max - min));
      input.value = newValue;
      updateStatPresentation(input);
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    meter.addEventListener("mousedown", (e) => {
      e.preventDefault();
      dragging = true;
      meter.classList.add("dragging");
      document.body.classList.add("stat-dragging");
      applyPointer(e);
    });

    const onMove = (e) => { if (dragging) applyPointer(e); };
    const onUp = () => {
      if (dragging) {
        dragging = false;
        meter.classList.remove("dragging");
        document.body.classList.remove("stat-dragging");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  });
}

/**
 * 統計入力プレゼンテーションを更新
 */
export function updateStatPresentation(input) {
  const row = input.closest(".stat-row");
  if (!row) return;

  const min = toInt(input.min, 0);
  const max = toInt(input.max, 100);
  const safeValue = clamp(toInt(input.value, min), min, max);
  input.value = safeValue;

  const grade = row.querySelector(".grade-badge");
  const meter = row.querySelector(".meter span");
  if (grade) {
    const gradeText = gradeByValue(safeValue);
    grade.textContent = gradeText;
    grade.className = `grade-badge grade-${gradeText}`;
  }
  if (meter) {
    meter.style.width = `${meterPercent(safeValue, min, max)}%`;
  }
}

/**
 * 弾道プレゼンテーションを更新
 */
export function updateTrajectoryPresentation(form) {
  const input = form.querySelector('input[name="h_trajectory"]');
  if (!input) return;
  const safeValue = clamp(toInt(input.value, 1), 1, 4);
  input.value = safeValue;
  form.querySelectorAll(".trajectory-dots .dot").forEach((dot, index) => {
    dot.classList.toggle("on", index < safeValue);
  });
}

/**
 * ヒーロープレゼンテーションを更新
 */
export function updateHeroPresentation(form) {
  const number = toInt(form.querySelector('input[name="number"]')?.value, 0);
  const age = toInt(form.querySelector('input[name="age"]')?.value, 18);
  const type = form.querySelector('select[name="type"]')?.value || "-";
  const position = form.querySelector('input[name="position"]')?.value || "-";
  const hand = form.querySelector('input[name="hand"]')?.value || "-";
  const name = form.querySelector('input[name="name"]')?.value || "名称未設定";

  const heroNumber = form.querySelector(".hero-number");
  if (heroNumber) {
    heroNumber.textContent = `#${number}`;
  }

  const badgeValues = form.querySelectorAll(".hero-badge strong");
  if (badgeValues.length >= 4) {
    badgeValues[0].textContent = type;
    badgeValues[1].textContent = position;
    badgeValues[2].textContent = hand;
    badgeValues[3].textContent = `${age}歳`;
  }

  const workspaceTabs = document.getElementById("workspaceTabs");
  const currentTab = workspaceTabs?.querySelector(`.workspace-tab-btn.active`);
  if (currentTab && form.dataset.playerId !== null) {
    currentTab.innerHTML = `<span class="workspace-tab-title">${escapeHtml(name)}</span>`;
  }
}

/**
 * リアルタイムフォーム更新をバインド
 */
export function bindRealtimeFormUpdates(form, updatePlayerDraftCallback) {
  const statInputs = form.querySelectorAll('.stat-row input[type="number"]');
  statInputs.forEach((input) => {
    const refresh = () => updateStatPresentation(input);
    input.addEventListener("input", refresh);
    input.addEventListener("change", refresh);
  });

  bindStatBarDrag(form);

  const trajectoryInput = form.querySelector('input[name="h_trajectory"]');
  if (trajectoryInput) {
    const refresh = () => updateTrajectoryPresentation(form);
    trajectoryInput.addEventListener("input", refresh);
    trajectoryInput.addEventListener("change", refresh);
  }

  ["name", "number", "age", "hand"].forEach((fieldName) => {
    const input = form.querySelector(`[name="${fieldName}"]`);
    if (!input) return;
    input.addEventListener("input", () => updateHeroPresentation(form));
    input.addEventListener("change", () => updateHeroPresentation(form));
  });

  const handInput = form.querySelector('input[name="hand"]');
  if (handInput) {
    const refresh = () => {
      renderBreakingBallEditorGrid(form, getBreakingBallDisplayMode);
    };
    handInput.addEventListener("input", refresh);
    handInput.addEventListener("change", refresh);
  }

  const typeSelect = form.querySelector('select[name="type"]');
  if (typeSelect) {
    typeSelect.addEventListener("change", () => updateHeroPresentation(form));
  }

  const syncDraft = () => updatePlayerDraftCallback(form);
  form.addEventListener("input", syncDraft);
  form.addEventListener("change", syncDraft);
}

/**
 * トレイトをパネルから同期
 */
export function syncTraitsFromPanel(form, mode, updatePlayerDraftCallback, refreshChipPreviewCallback) {
  const config = getTraitEditorConfig(mode);
  const traitPanel = form.querySelector(`[data-trait-panel="${mode}"]`);
  const traitsArea = form.querySelector(`textarea[name="traits_${mode}"]`);
  if (!traitPanel || !traitsArea) return;

  const ranked = {};
  traitPanel.querySelectorAll(".trait-rank-select").forEach((select) => {
    const base = select.dataset.traitBase;
    const value = String(select.value || "").trim();
    if (config.knownRankedSet.has(base) && ["A", "B", "C", "D", "E", "F", "G"].includes(value)) {
      ranked[base] = value;
    }
  });

  const toggles = new Set();
  traitPanel.querySelectorAll(".trait-toggle-card.active").forEach((btn) => {
    const name = String(btn.dataset.traitName || "").trim();
    if (config.knownToggleSet.has(name)) {
      toggles.add(name);
    }
  });

  const unknownText = traitPanel.querySelector(`[data-unknown-traits="${mode}"]`)?.value || "";
  const unknown = splitCsv(unknownText).filter(
    (trait) => !config.knownToggleSet.has(trait)
  );

  const traits = composeTraitsFromState(ranked, toggles, unknown, config.rankedBases, config.toggleTraits);
  traitsArea.value = traits.join(",");

  const linkedBases = LINKED_RANKED_TRAIT_BASES.filter((base) => config.knownRankedSet.has(base));

  applyTraitsToPanel(form, traits, mode);
  refreshChipPreviewCallback(form, `traits_${mode}`, `.traits-preview-${mode}`, `trait:${mode}`);
  updatePlayerDraftCallback(form);
}

/**
 * トレイトをパネルに適用
 */
export function applyTraitsToPanel(form, traits, mode) {
  const config = getTraitEditorConfig(mode);
  const panel = form.querySelector(`[data-trait-panel="${mode}"]`);
  if (!panel) return;

  const parsed = parseTraitState(traits, config.rankedBases, config.toggleTraits);

  panel.querySelectorAll(".trait-rank-select").forEach((select) => {
    const base = select.dataset.traitBase;
    select.value = parsed.ranked[base] || "D";
  });

  panel.querySelectorAll(".trait-toggle-card").forEach((btn) => {
    const name = btn.dataset.traitName;
    btn.classList.toggle("active", parsed.toggles.has(name));
  });

  const unknownInput = panel.querySelector(`[data-unknown-traits="${mode}"]`);
  if (unknownInput) {
    unknownInput.value = parsed.unknown.join(",");
  }
}

/**
 * 戦略をパネルから同期
 */
export function syncStrategyFromPanel(form, mode, updatePlayerDraftCallback, refreshChipPreviewCallback) {
  const config = getStrategyEditorConfig(mode);
  const panel = form.querySelector(`[data-strategy-panel="${mode}"]`);
  const strategyArea = form.querySelector(`textarea[name="strategy_${mode}"]`);
  if (!panel || !strategyArea) return;

  const toggles = new Set();
  panel.querySelectorAll(".strategy-toggle-card.active").forEach((btn) => {
    const value = String(btn.dataset.strategyName || "").trim();
    if (config.knownSet.has(value)) {
      toggles.add(value);
    }
  });

  const unknownText = panel.querySelector(`[data-unknown-strategy="${mode}"]`)?.value || "";
  const unknown = splitCsv(unknownText).filter((item) => !config.knownSet.has(item));
  const next = composeStrategyFromState(toggles, unknown, config.options);
  strategyArea.value = next.join(",");
  refreshChipPreviewCallback(form, `strategy_${mode}`, `.strategy-preview-${mode}`);
  updatePlayerDraftCallback(form);
}

/**
 * 戦略をパネルに適用
 */
export function applyStrategyToPanel(form, strategy, mode) {
  const config = getStrategyEditorConfig(mode);
  const panel = form.querySelector(`[data-strategy-panel="${mode}"]`);
  if (!panel) return;

  const parsed = parseStrategyState(strategy, config.options);
  panel.querySelectorAll(".strategy-toggle-card").forEach((btn) => {
    const value = String(btn.dataset.strategyName || "").trim();
    btn.classList.toggle("active", parsed.toggles.has(value));
  });

  const unknownInput = panel.querySelector(`[data-unknown-strategy="${mode}"]`);
  if (unknownInput) {
    unknownInput.value = parsed.unknown.join(",");
  }
}

/**
 * ポジションをパネルから同期
 */
export function syncPositionFromPanel(form, updatePlayerDraftCallback, updateHeroPresentationCallback) {
  const positionInput = form.querySelector('input[name="position"]');
  const panel = form.querySelector("#positionPanel");
  if (!positionInput || !panel) return;

  const primary = String(panel.querySelector(".position-primary-card.active")?.dataset.positionPrimary || "").trim();
  const secondary = uniqueStrings(
    [...panel.querySelectorAll(".position-toggle-card.active")].map((button) => button.dataset.positionSecondary)
  ).filter((value) => value !== primary);

  positionInput.value = formatPositions({ primary, secondary });
  updateHeroPresentationCallback(form);
  updatePlayerDraftCallback(form);
}

/**
 * ポジションをパネルに適用
 */
export function applyPositionsToPanel(form, positions) {
  const panel = form.querySelector("#positionPanel");
  if (!panel) return;

  const normalized = normalizePositionsValue(positions);
  panel.querySelectorAll(".position-primary-card").forEach((button) => {
    const isActive = button.dataset.positionPrimary === normalized.primary;
    button.classList.toggle("active", isActive);
  });

  panel.querySelectorAll(".position-toggle-card").forEach((button) => {
    const isActive = normalized.secondary.includes(button.dataset.positionSecondary);
    button.classList.toggle("active", isActive);
  });
}

/**
 * 詳細サブタブをバインド
 */
export function bindDetailSubTabs(form) {
  const buttons = [...form.querySelectorAll("[data-detail-subtab]")];
  const panes = [...form.querySelectorAll("[data-detail-subtab-pane]")];
  if (buttons.length === 0 || panes.length === 0) return;

  const activate = (mode) => {
    buttons.forEach((button) => {
      button.classList.toggle("active", button.dataset.detailSubtab === mode);
    });
    panes.forEach((pane) => {
      pane.classList.toggle("active", pane.dataset.detailSubtabPane === mode);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => activate(button.dataset.detailSubtab));
  });

  const activeButton = buttons.find((button) => button.classList.contains("active"));
  activate(activeButton?.dataset.detailSubtab || buttons[0].dataset.detailSubtab);
}

/**
 * プリセットハンドラをバインド
 */
export function bindPresetHandlers(form, updatePlayerDraftCallback, updateHeroPresentationCallback, refreshChipPreviewCallback, renderBreakingBallCallback) {
  const positionInput = form.querySelector('input[name="position"]');
  const openPositionPanel = form.querySelector("#openPositionPanel");
  const closePositionPanel = form.querySelector("#closePositionPanel");
  const positionPanel = form.querySelector("#positionPanel");

  if (positionInput && openPositionPanel && closePositionPanel && positionPanel) {
    applyPositionsToPanel(form, parsePositionText(positionInput.value));

    openPositionPanel.addEventListener("click", () => {
      positionPanel.hidden = false;
    });

    closePositionPanel.addEventListener("click", () => {
      syncPositionFromPanel(form, updatePlayerDraftCallback, updateHeroPresentationCallback);
      positionPanel.hidden = true;
    });

    positionPanel.addEventListener("click", (event) => {
      const primaryCard = event.target.closest(".position-primary-card");
      if (primaryCard) {
        positionPanel.querySelectorAll(".position-primary-card").forEach((button) => {
          button.classList.toggle("active", button === primaryCard);
        });
        syncPositionFromPanel(form, updatePlayerDraftCallback, updateHeroPresentationCallback);
        return;
      }

      const secondaryCard = event.target.closest(".position-toggle-card");
      if (secondaryCard) {
        secondaryCard.classList.toggle("active");
        syncPositionFromPanel(form, updatePlayerDraftCallback, updateHeroPresentationCallback);
      }
    });
  }

  // Bind trait panels for pitcher and hitter
  ["pitcher", "hitter"].forEach((mode) => {
    const traitsArea = form.querySelector(`textarea[name="traits_${mode}"]`);
    const openTraitPanel = form.querySelector(`[data-open-trait-panel="${mode}"]`);
    const traitPanel = form.querySelector(`[data-trait-panel="${mode}"]`);
    const closeTraitPanel = form.querySelector(`[data-close-trait-panel="${mode}"]`);
    if (!traitsArea || !openTraitPanel || !closeTraitPanel || !traitPanel) return;

    applyTraitsToPanel(form, splitCsv(traitsArea.value), mode);

    openTraitPanel.addEventListener("click", () => {
      traitPanel.hidden = !traitPanel.hidden;
      if (!traitPanel.hidden) {
        syncTraitsFromPanel(form, mode, updatePlayerDraftCallback, refreshChipPreviewCallback);
        traitPanel.hidden = true;
      }
    });

    closeTraitPanel.addEventListener("click", () => {
      syncTraitsFromPanel(form, mode, updatePlayerDraftCallback, refreshChipPreviewCallback);
      traitPanel.hidden = true;
    });

    traitPanel.addEventListener("click", (event) => {
      const toggle = event.target.closest(".trait-toggle-card");
      if (toggle) {
        toggle.classList.toggle("active");
        syncTraitsFromPanel(form, mode, updatePlayerDraftCallback, refreshChipPreviewCallback);
      }
    });

    traitPanel.addEventListener("change", (event) => {
      if (event.target.classList.contains("trait-rank-select")) {
        syncTraitsFromPanel(form, mode, updatePlayerDraftCallback, refreshChipPreviewCallback);
      }
    });

    const unknownInput = traitPanel.querySelector(`[data-unknown-traits="${mode}"]`);
    if (unknownInput) {
      unknownInput.addEventListener("input", () => {
        syncTraitsFromPanel(form, mode, updatePlayerDraftCallback, refreshChipPreviewCallback);
      });
    }

    traitsArea.addEventListener("input", () => {
      const traits = splitCsv(traitsArea.value);
      applyTraitsToPanel(form, traits, mode);
      refreshChipPreviewCallback(form, `traits_${mode}`, `.traits-preview-${mode}`, `trait:${mode}`);
    });
  });

  // Bind strategy panels
  ["pitcher", "hitter"].forEach((mode) => {
    const strategyArea = form.querySelector(`textarea[name="strategy_${mode}"]`);
    const openStrategyPanel = form.querySelector(`[data-open-strategy-panel="${mode}"]`);
    const closeStrategyPanel = form.querySelector(`[data-close-strategy-panel="${mode}"]`);
    const strategyPanel = form.querySelector(`[data-strategy-panel="${mode}"]`);
    if (!strategyArea || !openStrategyPanel || !closeStrategyPanel || !strategyPanel) return;

    applyStrategyToPanel(form, splitCsv(strategyArea.value), mode);

    openStrategyPanel.addEventListener("click", () => {
      strategyPanel.hidden = false;
    });

    closeStrategyPanel.addEventListener("click", () => {
      syncStrategyFromPanel(form, mode, updatePlayerDraftCallback, refreshChipPreviewCallback);
      strategyPanel.hidden = true;
    });

    strategyPanel.addEventListener("click", (event) => {
      const toggle = event.target.closest(".strategy-toggle-card");
      if (toggle) {
        toggle.classList.toggle("active");
        syncStrategyFromPanel(form, mode, updatePlayerDraftCallback, refreshChipPreviewCallback);
      }
    });

    const unknownStrategyInput = strategyPanel.querySelector(`[data-unknown-strategy="${mode}"]`);
    if (unknownStrategyInput) {
      unknownStrategyInput.addEventListener("input", () => {
        syncStrategyFromPanel(form, mode, updatePlayerDraftCallback, refreshChipPreviewCallback);
      });
    }

    strategyArea.addEventListener("input", () => {
      applyStrategyToPanel(form, splitCsv(strategyArea.value), mode);
      refreshChipPreviewCallback(form, `strategy_${mode}`, `.strategy-preview-${mode}`);
    });
  });

  // Bind breaking ball editor
  const breakingBallEditor = form.querySelector("#breakingBallEditor");
  if (breakingBallEditor) {
    renderBreakingBallCallback(form);

    breakingBallEditor.addEventListener("change", (event) => {
      if (!(event.target instanceof HTMLSelectElement)) return;
      syncBreakingBallsFromEditor(form);
      updatePlayerDraftCallback(form);
    });
  }
}
