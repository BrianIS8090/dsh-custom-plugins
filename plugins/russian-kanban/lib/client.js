window.__ModuleLoader__.load({
  id: "@local/russian-kanban",
  factory: function (require) {
    var module = { exports: {} }
    var exports = module.exports
if (typeof document !== 'undefined') { var style = document.querySelector('style[data-russian-kanban-style]') || document.head.appendChild(document.createElement('style')); style.setAttribute('data-russian-kanban-style', ''); style.textContent = ""; }
"use strict";var ig=Object.create;var pn=Object.defineProperty;var ug=Object.getOwnPropertyDescriptor;var dg=Object.getOwnPropertyNames;var cg=Object.getPrototypeOf,fg=Object.prototype.hasOwnProperty;var Ui=e=>{throw TypeError(e)};var pg=(e,t)=>{for(var a in t)pn(e,a,{get:t[a],enumerable:!0})},zi=(e,t,a,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of dg(t))!fg.call(e,r)&&r!==a&&pn(e,r,{get:()=>t[r],enumerable:!(o=ug(t,r))||o.enumerable});return e};var Z=(e,t,a)=>(a=e!=null?ig(cg(e)):{},zi(t||!e||!e.__esModule?pn(a,"default",{value:e,enumerable:!0}):a,e)),mg=e=>zi(pn({},"__esModule",{value:!0}),e);var Wi=(e,t,a)=>t.has(e)||Ui("Cannot "+a);var tt=(e,t,a)=>(Wi(e,t,"read from private field"),a?a.call(e):t.get(e)),Vi=(e,t,a)=>t.has(e)?Ui("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,a),Ms=(e,t,a,o)=>(Wi(e,t,"write to private field"),o?o.call(e,a):t.set(e,a),a);var MC={};pg(MC,{default:()=>DC});module.exports=mg(MC);var Gi=`/*
 * Kanban plugin styles.
 * All selectors are namespaced so this stylesheet can live in DSH's <head>.
 * Typography, colors, borders and shadows use DSH theme tokens directly.
 */

.kanban-root,
.kanban-portal {
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-13);
}

.kanban-root,
.kanban-root *,
.kanban-portal,
.kanban-portal * {
  box-sizing: border-box;
}

/* Low-specificity reset: component variants must retain their font and color. */
:where(.kanban-root, .kanban-portal) :where(button, input, textarea) {
  font: inherit;
}

:where(.kanban-root, .kanban-portal) button {
  color: inherit;
}

.kanban-root svg,
.kanban-portal svg {
  flex-shrink: 0;
}

:where(.kanban-root, .kanban-portal) :where(p, h3, ol) {
  margin: 0;
}

/* One inset keyboard ring, not an outer ring plus the surface's stroke.
 * Low specificity lets text fields and Radix menu highlights own their focus. */
:where(.kanban-root, .kanban-portal) :focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: -2px;
}

.kanban-sortable-card:focus-visible .kanban-card {
  box-shadow: none;
}

.kanban-panel-mode {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--dsw-alias-label-secondary);
  font-size: 14px;
}

/* Task selection above the composer. This is a slot-owned overlay, not a body portal. */
.kanban-task-picker {
  position: absolute;
  z-index: 30;
  inset-inline: 0;
  bottom: calc(100% + 8px);
  display: flex;
  max-height: min(420px, 55vh);
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-specific-menu);
  box-shadow: var(--dsw-elevation-prominent);
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-13);
}

.kanban-task-picker-header {
  display: flex;
  min-height: 40px;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}

.kanban-task-picker-header > svg { width: 16px; height: 16px; color: var(--dsw-alias-state-business-primary); }
.kanban-task-picker-header > span { min-width: 0; flex: 1; overflow: hidden; color: var(--dsw-alias-label-secondary); text-overflow: ellipsis; white-space: nowrap; }
.kanban-task-picker-header > button { display: grid; width: 28px; height: 28px; place-items: center; border: 0; border-radius: 6px; background: transparent; cursor: pointer; }
.kanban-task-picker-header > button:hover { background: var(--dsw-alias-interactive-bg-hover); }
.kanban-task-picker-header > button > svg { width: 15px; height: 15px; }
.kanban-task-picker-search { display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: var(--dsw-alias-label-secondary); }
.kanban-task-picker-search > svg { width: 14px; height: 14px; }
.kanban-task-picker-search > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kanban-task-picker-list { min-height: 0; flex: 1; overflow-y: auto; overscroll-behavior: contain; padding: 0 6px 6px; outline: none; }
.kanban-task-picker-group > h3 { position: sticky; z-index: 1; top: 0; display: flex; align-items: center; justify-content: space-between; margin: 0; padding: 8px 8px 5px; background: var(--dsw-specific-menu); color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-strong-12); }
.kanban-task-picker-group > h3 > span { font-weight: 400; }
.kanban-task-picker-row { display: flex; min-width: 0; align-items: center; gap: 4px; padding: 3px 4px; border-radius: 8px; cursor: default; }
.kanban-task-picker-row.is-active { background: var(--dsw-alias-interactive-bg-hover); }
.kanban-task-picker-row.is-checked { background: var(--dsw-alias-interactive-bg-hover); }
.kanban-task-picker-check { display: grid; width: 28px; height: 32px; flex-shrink: 0; place-items: center; border: 0; background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; }
.kanban-task-picker-check > svg { width: 15px; height: 15px; }
.kanban-task-picker-row.is-checked .kanban-task-picker-check { color: var(--dsw-alias-state-business-primary); }
.kanban-task-picker-row-body { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 2px; padding: 4px 0; text-align: start; }
.kanban-task-picker-row-body > strong { overflow: hidden; font-weight: 400; text-overflow: ellipsis; white-space: nowrap; }
.kanban-task-picker-row-body > small { overflow: hidden; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); text-overflow: ellipsis; white-space: nowrap; }
.kanban-task-picker-message { padding: 14px 12px; color: var(--dsw-alias-label-secondary); }
.kanban-task-picker-footer { display: flex; min-height: 36px; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 12px; border-top: 1px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.kanban-task-picker-footer > span { line-height: 1.5; }
.kanban-task-picker-add { flex-shrink: 0; padding: 5px 10px; border: 0; border-radius: 6px; background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); cursor: pointer; }
.kanban-task-picker-add:hover { background: var(--dsw-alias-interactive-bg-hover); }
@media (max-width: 600px) { .kanban-task-picker-footer > span { display: none; } .kanban-task-picker-add { margin-inline-start: auto; } }

.kanban-panel {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding: 28px clamp(24px, 4vw, 48px) 0;
}

/* Match DSH entry pages while keeping window chrome outside the content. */
html[data-platform="darwin"] .kanban-panel {
  padding-top: calc(28px + var(--dsh-frame-top-clearance, 0px));
}

.kanban-workspace-trigger {
  display: inline-flex;
  max-width: calc(100% + 12px);
  align-items: center;
  gap: 8px;
  margin: -4px -6px;
  padding: 4px 6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.kanban-workspace-trigger:hover:not(:disabled),
.kanban-workspace-trigger[data-state="open"] {
  background: var(--dsw-alias-interactive-bg-hover);
}

.kanban-workspace-trigger:disabled {
  cursor: default;
}

.kanban-workspace-trigger svg {
  width: 18px;
  height: 18px;
  color: var(--dsw-alias-label-secondary);
}

.kanban-workspace-trigger span,
.kanban-workspace-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.kanban-workspace-name {
  flex: 1;
}

.kanban-dropdown-content.kanban-workspace-menu {
  width: 280px;
  max-width: calc(100vw - 48px);
}

.kanban-panel-body {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
  flex-direction: column;
}

.kanban-panel-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  padding: 0 0 8px;
}

.kanban-panel-header h1 {
  min-width: 0;
  max-width: 100%;
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
}

.kanban-panel-empty {
  padding: 32px 0;
  color: var(--dsw-alias-label-secondary);
}

.kanban-panel-body > .kanban-view {
  height: auto;
  flex: 1;
  padding: 8px 0 0;
}

.kanban-loading {
  display: flex;
  height: 100%;
  min-height: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.kanban-view {
  display: flex;
  height: 100%;
  min-height: 0;
  min-width: 0;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.kanban-error {
  color: var(--dsw-alias-state-error-primary);
  font: var(--dsw-font-xs-13);
}

.kanban-muted-text {
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xs-13);
}

.kanban-warning {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--dsw-alias-state-warn-primary);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-2);
}

.kanban-warning-body {
  min-width: 0;
  flex: 1;
}

.kanban-warning-title {
  color: var(--dsw-alias-state-warn-label);
  font: var(--dsw-font-xxs-strong-12);
}

.kanban-warning-item {
  margin-top: 2px;
  overflow-wrap: anywhere;
  color: var(--dsw-alias-state-warn-label);
  font: var(--dsw-font-xxs-12);
}

.kanban-warning-dismiss {
  flex-shrink: 0;
  height: 24px;
  padding: 0 8px;
  color: var(--dsw-alias-state-warn-label);
  font: var(--dsw-font-xxs-strong-12);
}

.kanban-warning-dismiss:hover {
  color: var(--dsw-alias-state-warn-primary);
}

.kanban-content {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
  gap: 12px;
}

.kanban-toolbar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
}

.kanban-toolbar-settings {
  margin-left: auto;
}

.kanban-toolbar-button {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  box-shadow: none;
}

.kanban-toolbar-button:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}

.kanban-toolbar-button:active,
.kanban-toolbar-button.is-active {
  background: var(--dsw-alias-button-ghost-active-fill);
  color: var(--dsw-alias-label-primary);
}

.kanban-toolbar-button.is-active {
  position: relative;
}

.kanban-toolbar-button.is-active::after {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--dsw-alias-state-business-primary);
  content: "";
}

.kanban-filter-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxs-12);
}

.kanban-filter-chip {
  max-width: 100%;
  background: var(--dsw-alias-interactive-bg-hover);
}

.kanban-board-scroll {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
  gap: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1px 1px 8px;
  overscroll-behavior-x: contain;
}

/* Standard scrollbar styling takes precedence over the Host's WebKit skin. */
.kanban-board-scroll,
.kanban-column-cards,
.kanban-dialog-body,
.kanban-dropdown-content,
.kanban-select-viewport,
.kanban-textarea {
  scrollbar-width: thin;
  scrollbar-color: auto;
}

.kanban-filter-check {
  display: flex;
  width: 16px;
  height: 16px;
  align-items: center;
}

.kanban-priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  corner-shape: round;
}

/* Columns and cards */
.kanban-column {
  display: flex;
  /* Share the board width evenly; the minimum keeps a readable card column and
   * makes .kanban-board-scroll scroll horizontally only when they no longer fit. */
  flex: 1 1 0;
  min-width: 220px;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 65%, var(--dsw-alias-bg-module-platform));
}

.kanban-column.is-over {
  /* Highlight only the drop target, not every card inheriting its stroke token. */
  border-color: var(--dsw-alias-state-business-primary);
  box-shadow: inset 0 0 0 1px var(--dsw-alias-state-business-primary);
}

.kanban-column-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  padding: 12px 12px 10px;
}

.kanban-column-title {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
  font: var(--dsw-font-xs-strong-13);
}

.kanban-column-count {
  padding: 2px 6px;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxs-12);
}

.kanban-column-cards {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding: 2px 8px 8px;
  overscroll-behavior-y: contain;
}

.kanban-column-empty {
  padding: 20px 0;
  text-align: center;
  color: var(--dsw-alias-label-tertiary);
  font: var(--dsw-font-xxs-12);
}

.kanban-column-footer {
  flex-shrink: 0;
  padding: 6px 8px 8px;
}

.kanban-add-card {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  box-shadow: none;
}

.kanban-add-card:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}

.kanban-add-card:active {
  background: var(--dsw-alias-button-ghost-active-fill);
}

.kanban-sortable-card {
  position: relative;
  border-radius: 10px;
  cursor: grab;
  touch-action: auto;
  user-select: none;
}

.kanban-sortable-card:active {
  cursor: grabbing;
}

.kanban-sortable-card.is-dragging {
  opacity: 0.4;
}

.kanban-card {
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
}

.kanban-sortable-card:hover .kanban-card {
  border-color: var(--dsw-alias-border-l3);
  background: var(--dsw-alias-interactive-bg-hover-solid);
}

.kanban-sortable-card-content {
  padding: 12px;
}

.kanban-card-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.kanban-card-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 1px 6px;
  border: 0;
  border-radius: 6px;
  font: var(--dsw-font-xxs-12);
  overflow-wrap: anywhere;
}

.kanban-label-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  corner-shape: round;
}

.kanban-card-title {
  overflow-wrap: anywhere;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-strong-13);
}

.kanban-card-note {
  display: -webkit-box;
  max-height: 4.875em;
  margin-top: 6px;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxs-12);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.kanban-card-status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px 12px;
  margin-top: 8px;
}

.kanban-card-due-date {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxxs-11);
}

.kanban-card-due-date svg {
  width: 12px;
  height: 12px;
}

.kanban-card-due-date.is-today { color: var(--dsw-alias-state-warn-primary); }
.kanban-card-due-date.is-overdue { color: var(--dsw-alias-state-error-primary); }
.kanban-card-due-date.is-completed { color: var(--dsw-alias-label-tertiary); }

.kanban-card-comment-count {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-left: auto;
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxxs-11);
}

.kanban-card-comment-count svg {
  width: 12px;
  height: 12px;
}

.kanban-drag-preview {
  width: 100%;
  transform: rotate(2deg);
  cursor: grabbing;
}

.kanban-drag-preview .kanban-card {
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: var(--dsw-elevation-panel);
}

/* Form and activity */
.kanban-form-stack {
  display: grid;
  align-content: start;
  gap: 16px;
}

.kanban-form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.kanban-form-field {
  display: grid;
  min-width: 0;
  gap: 6px;
}

.kanban-date-fields { align-items: start; }

.kanban-completed-date {
  display: flex;
  align-items: center;
  min-height: 32px;
}

.kanban-due-date-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 10px;
}

.kanban-due-date-controls input { width: 160px; color-scheme: inherit; }

.kanban-date-shortcuts { display: flex; flex-wrap: wrap; gap: 2px; }
.kanban-date-shortcuts .kanban-button { padding: 0 6px; }

.kanban-field-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kanban-field-id {
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxs-12);
}

.kanban-markdown-preview {
  min-width: 0;
  padding: 8px 0;
  overflow-wrap: anywhere;
}

.kanban-textarea.kanban-markdown-source {
  width: 100%;
  min-height: 240px;
  font-family: var(--ds-font-family-code, ui-monospace, monospace);
  line-height: 1.6;
  tab-size: 2;
}

.kanban-note-hint {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxs-12);
}

.kanban-inline-priority {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kanban-comments-box {
  display: grid;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--dsw-alias-border-l2);
}

.kanban-comment-list {
  display: grid;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.kanban-comment-item {
  display: grid;
  gap: 4px;
  padding: 8px 0;
}

.kanban-comment-meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.kanban-comment-content {
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xxs-12);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.kanban-comment-composer {
  display: grid;
  justify-items: end;
  gap: 8px;
}

.kanban-comment-composer .kanban-textarea {
  width: 100%;
  min-height: 64px;
}

.kanban-activity-box {
  display: grid;
  gap: 6px;
  padding-top: 16px;
  border-top: 1px solid var(--dsw-alias-border-l2);
}

.kanban-activity-list {
  display: grid;
}

.kanban-activity-item {
  display: grid;
  grid-template-columns: 6px minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 8px;
  padding: 7px 0;
  border-top: 1px solid var(--dsw-alias-border-l2);
}

.kanban-activity-item:first-child {
  border-top: 0;
}

.kanban-activity-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  corner-shape: round;
}

.kanban-activity-dot.is-agent {
  background: var(--dsw-alias-state-business-primary);
}

.kanban-activity-dot.is-human {
  background: var(--dsw-alias-state-success-primary);
}

.kanban-activity-actor {
  font: var(--dsw-font-xxxs-strong-11);
}

.kanban-activity-actor.is-agent {
  color: var(--dsw-alias-state-business-primary);
}

.kanban-activity-actor.is-human {
  color: var(--dsw-alias-state-success-primary);
}

.kanban-activity-description {
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xxs-12);
}

.kanban-activity-time {
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxxs-11);
  white-space: nowrap;
}

.kanban-muted-small {
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxs-12);
}

.kanban-tiny-icon {
  width: 12px;
  height: 12px;
}

.kanban-tabular {
  font-variant-numeric: tabular-nums;
}

/* Radix-backed controls mirror the current Host primitive geometry and tokens. */
:where(.kanban-button) {
  display: inline-flex;
  appearance: none;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-13);
  cursor: pointer;
}

.kanban-button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.kanban-button svg {
  width: 16px;
  height: 16px;
  pointer-events: none;
}

:where(.kanban-button--size-default) {
  height: 36px;
  padding: 0 14px;
}

:where(.kanban-button--size-sm) {
  height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  font: var(--dsw-font-xxs-12);
}

:where(.kanban-button--size-lg) {
  height: 40px;
  padding: 0 18px;
  border-radius: 12px;
}

:where(.kanban-button--size-icon) {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 8px;
}

.kanban-button--default {
  background: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-label-primary-foreground);
}

.kanban-button--default:hover:not(:disabled) {
  background: var(--dsw-alias-button-primary-hover);
}

.kanban-button--destructive {
  background: var(--dsw-alias-state-error-primary);
  color: var(--dsw-static-neutral-00);
}

.kanban-button--destructive:hover:not(:disabled) {
  background: var(--dsw-alias-state-error-secondary);
}

.kanban-button--outline {
  border: 1px solid var(--dsw-alias-border-l3);
}

.kanban-button--secondary {
  background: var(--dsw-alias-interactive-bg-hover);
}

.kanban-button--secondary:hover:not(:disabled) {
  background: var(--dsw-alias-button-ghost-active-fill);
}

.kanban-button--outline:hover:not(:disabled),
.kanban-button--ghost:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.kanban-button--ghost:active:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-active);
}

.kanban-button--link {
  color: var(--dsw-alias-brand-primary);
  text-underline-offset: 4px;
}

.kanban-button--link:hover:not(:disabled) {
  text-decoration: underline;
}

.kanban-icon {
  width: 16px;
  height: 16px;
}

.kanban-icon-button {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  padding: 0;
}

.kanban-danger-button {
  color: var(--dsw-alias-state-error-primary);
}

/* Base styles must not override the card's compact business variant. */
:where(.kanban-card-content) {
  padding: 24px;
}

.kanban-card-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 24px;
}

.kanban-ui-card-title {
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.01em;
}

.kanban-card-description {
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xs-13);
}

.kanban-card-footer {
  display: flex;
  align-items: center;
  padding: 24px 24px 0;
}

:where(.kanban-badge) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  border-radius: 6px;
  padding: 2px 8px;
  font: var(--dsw-font-xxs-12);
}

.kanban-badge--default {
  background: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-label-primary-foreground);
  box-shadow: var(--dsw-shadow-lv1);
}

.kanban-badge--secondary {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
}

.kanban-badge--destructive {
  background: var(--dsw-alias-state-error-primary);
  color: var(--dsw-alias-label-primary-foreground);
  box-shadow: var(--dsw-shadow-lv1);
}

.kanban-badge--outline {
  color: var(--dsw-alias-label-primary);
}

.kanban-input,
.kanban-textarea {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--dsw-alias-border-l4);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-13);
}

.kanban-input {
  height: 32px;
  padding: 0 8px;
}

.kanban-textarea {
  min-height: 60px;
  padding: 8px;
  resize: vertical;
}

.kanban-input::placeholder,
.kanban-textarea::placeholder {
  color: var(--dsw-alias-label-secondary);
}

.kanban-input:focus,
.kanban-textarea:focus {
  border-color: var(--dsw-alias-state-business-primary);
  outline: none;
  box-shadow: none;
}

.kanban-input:disabled,
.kanban-textarea:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

:where(.kanban-label) {
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-13);
}

.kanban-separator {
  flex-shrink: 0;
  background: var(--dsw-alias-border-l1);
}

.kanban-separator--horizontal {
  width: 100%;
  height: 1px;
}

.kanban-separator--vertical {
  width: 1px;
  height: 100%;
}

/* Radix portals */
.kanban-dialog-overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: var(--dsw-alias-bg-mask-1);
  backdrop-filter: var(--dsw-mask-blur);
}

.kanban-dialog-overlay[data-state="open"] {
  animation: kanban-fade-in 150ms ease-out;
}

.kanban-dialog-overlay[data-state="closed"] {
  animation: kanban-fade-out 150ms ease-in;
}

.kanban-dialog-content {
  position: fixed;
  z-index: 1001;
  top: 50%;
  left: 50%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: calc(100% - 32px);
  max-width: 512px;
  max-height: calc(100dvh - 64px);
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 18px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-13);
  box-shadow: var(--dsw-shadow-lv3);
  transform: translate(-50%, -50%);
}

.kanban-dialog-wide {
  max-width: 576px;
}

.kanban-dialog-medium {
  max-width: 448px;
}

.kanban-dialog-content[data-state="open"] {
  animation: kanban-fade-in 150ms ease-out, kanban-dialog-in 150ms ease-out;
}

.kanban-dialog-content[data-state="closed"] {
  animation: kanban-fade-out 150ms ease-in, kanban-dialog-out 150ms ease-in;
}

.kanban-dialog-close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  font: inherit;
  cursor: pointer;
}

.kanban-dialog-close:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  opacity: 1;
}

.kanban-dialog-close-icon {
  width: 16px;
  height: 16px;
}

.kanban-dialog-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 52px 16px 20px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  text-align: left;
}

.kanban-dialog-body {
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: 16px 20px;
  overscroll-behavior: contain;
}

.kanban-dialog-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
}

.kanban-dialog-error {
  width: 100%;
  color: var(--dsw-alias-state-error-primary);
  font: var(--dsw-font-xs-13);
  overflow-wrap: anywhere;
}

.kanban-dialog-confirm {
  display: grid;
  width: 100%;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
}

.kanban-confirm-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.kanban-dialog-title {
  margin: 0;
  color: var(--dsw-alias-label-primary);
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.kanban-dialog-description {
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xs-13);
}

.kanban-dialog-delete {
  margin-right: auto;
}

.kanban-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.kanban-dropdown-content {
  z-index: 1100;
  min-width: 128px;
  max-width: calc(100vw - 16px);
  max-height: var(--radix-dropdown-menu-content-available-height);
  overflow-y: auto;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  padding: 4px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  box-shadow: var(--dsw-shadow-lv3);
}

.kanban-dropdown-content[data-state="open"] {
  animation: kanban-fade-in 120ms ease-out, kanban-scale-in 120ms ease-out;
}

.kanban-dropdown-item {
  text-decoration: none;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  border-radius: 8px;
  padding: 5px 10px;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-13);
  cursor: pointer;
  user-select: none;
  outline: none;
}

.kanban-dropdown-item--inset {
  padding-left: 32px;
}

.kanban-dropdown-item:hover,
.kanban-dropdown-item[data-highlighted] {
  background: var(--dsw-alias-interactive-bg-hover);
}

.kanban-dropdown-item[data-disabled] {
  pointer-events: none;
  opacity: 0.5;
}

.kanban-dropdown-item svg {
  width: 16px;
  height: 16px;
}

.kanban-dropdown-label {
  padding: 6px 8px;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-strong-13);
}

.kanban-dropdown-label--inset {
  padding-left: 32px;
}

.kanban-dropdown-separator {
  height: 1px;
  margin: 4px -4px;
  background: var(--dsw-alias-border-l1);
}

.kanban-select-trigger {
  display: flex;
  width: 100%;
  min-width: 0;
  height: 32px;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  white-space: nowrap;
  border: 1px solid var(--dsw-alias-border-l4);
  border-radius: 8px;
  padding: 0 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-13);
  cursor: pointer;
}

.kanban-select-trigger:focus-visible {
  border-color: var(--dsw-alias-state-business-primary);
  outline: none;
  box-shadow: none;
}

.kanban-select-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.kanban-select-trigger > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.kanban-select-icon,
.kanban-select-scroll-icon,
.kanban-select-check {
  width: 16px;
  height: 16px;
}

.kanban-select-scroll-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
}

.kanban-select-content {
  position: relative;
  z-index: 1100;
  max-height: min(384px, var(--radix-select-content-available-height, 384px));
  min-width: 128px;
  max-width: calc(100vw - 16px);
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  box-shadow: var(--dsw-shadow-lv3);
}

.kanban-select-content--popper .kanban-select-viewport--popper {
  min-width: var(--radix-select-trigger-width);
}

.kanban-select-content[data-state="open"] {
  animation: kanban-fade-in 120ms ease-out, kanban-scale-in 120ms ease-out;
}

.kanban-select-viewport {
  padding: 4px;
}

.kanban-select-label {
  padding: 6px 8px;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-strong-13);
}

.kanban-select-item {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 34px;
  align-items: center;
  border-radius: 8px;
  padding: 5px 32px 5px 10px;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-13);
  cursor: pointer;
  user-select: none;
  outline: none;
}

.kanban-select-item:hover,
.kanban-select-item[data-highlighted] {
  background: var(--dsw-alias-interactive-bg-hover);
}

.kanban-select-item[data-disabled] {
  pointer-events: none;
  opacity: 0.5;
}

.kanban-select-item-indicator {
  position: absolute;
  right: 8px;
  display: flex;
  width: 14px;
  height: 14px;
  align-items: center;
  justify-content: center;
}

.kanban-select-separator {
  height: 1px;
  margin: 4px -4px;
  background: var(--dsw-alias-border-l1);
}

.kanban-tooltip-content {
  z-index: 1200;
  overflow: hidden;
  border-radius: 6px;
  padding: 6px 12px;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
  box-shadow: var(--dsw-shadow-lv1);
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xxs-12);
}

.kanban-tooltip-content[data-state="open"] {
  animation: kanban-fade-in 120ms ease-out, kanban-scale-in 120ms ease-out;
}

/* List and label editors */
.kanban-editor-dialog {
  max-width: 480px;
}

.kanban-editor-dialog .kanban-dialog-description {
  font: var(--dsw-font-xxs-12);
}

.kanban-editor-body {
  display: grid;
  align-content: start;
  gap: 20px;
}

.kanban-editor-section,
.kanban-editor-add {
  display: grid;
  min-width: 0;
  gap: 8px;
}

.kanban-editor-caption {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxs-12);
}

.kanban-editor-caption span {
  color: var(--dsw-alias-label-tertiary);
  font-variant-numeric: tabular-nums;
}

.kanban-editor-list {
  min-width: 0;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
}

.kanban-editor-row {
  position: relative;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  gap: 8px;
  min-height: 46px;
  padding: 6px;
}

.kanban-editor-row + .kanban-editor-row {
  border-top: 1px solid var(--dsw-alias-border-l1);
}

.kanban-editor-row[data-dragging] {
  z-index: 1;
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: var(--dsw-shadow-lv1);
}

.kanban-editor-name {
  border-color: transparent;
  background: transparent;
}

.kanban-editor-name:hover:not(:disabled):not(:focus) {
  border-color: var(--dsw-alias-border-l2);
}

.kanban-editor-name:focus {
  background: var(--dsw-alias-bg-layer-2);
}

.kanban-editor-delete {
  color: var(--dsw-alias-label-tertiary);
}

.kanban-editor-delete:hover:not(:disabled),
.kanban-editor-delete:focus-visible {
  color: var(--dsw-alias-state-error-primary);
}

.kanban-editor-setting {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 148px;
  align-items: start;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--dsw-alias-border-l1);
}

.kanban-editor-setting-copy {
  display: grid;
  gap: 4px;
}

.kanban-editor-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 14px;
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxs-12);
}

.kanban-editor-add {
  width: 100%;
}

.kanban-editor-add-row {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding-inline: 7px;
}

.kanban-editor-add-icon {
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  color: var(--dsw-alias-label-tertiary);
}

.kanban-editor-add-button {
  height: 32px;
  min-width: 56px;
}

.kanban-drag-handle {
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  font: inherit;
  cursor: grab;
  touch-action: none;
}

.kanban-drag-handle:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.kanban-color-input {
  appearance: none;
  width: 32px;
  height: 32px;
  cursor: pointer;
  border: 0;
  border-radius: 6px;
  padding: 6px;
  background: transparent;
}

.kanban-color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.kanban-color-input::-webkit-color-swatch {
  border: 1px solid var(--dsw-alias-border-l4);
  border-radius: 50%;
  corner-shape: round;
}

.kanban-color-input::-moz-color-swatch {
  border: 1px solid var(--dsw-alias-border-l4);
  border-radius: 50%;
}

.kanban-color-input:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.kanban-color-input:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.kanban-dialog-footer-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kanban-animate-spin {
  animation: kanban-spin 1s linear infinite;
}

@keyframes kanban-spin {
  to { transform: rotate(360deg); }
}

@keyframes kanban-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes kanban-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes kanban-scale-in {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}

@keyframes kanban-dialog-in {
  from { transform: translate(-50%, -50%) scale(0.95); }
  to { transform: translate(-50%, -50%) scale(1); }
}

@keyframes kanban-dialog-out {
  from { transform: translate(-50%, -50%) scale(1); }
  to { transform: translate(-50%, -50%) scale(0.95); }
}

@media (max-width: 640px) {
  .kanban-view {
    padding: 10px;
  }

  .kanban-column {
    min-width: 200px;
  }

  .kanban-form-row {
    grid-template-columns: minmax(0, 1fr);
  }

  .kanban-dialog-content {
    max-height: calc(100dvh - 24px);
  }

  .kanban-dialog-header {
    padding-left: 14px;
  }

  .kanban-dialog-body {
    padding: 14px;
  }

  .kanban-dialog-footer {
    padding: 12px 14px;
  }
}

@media (max-width: 440px) {
  .kanban-editor-setting {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .kanban-root,
  .kanban-root *,
  .kanban-portal,
  .kanban-portal * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
  }
}

/* Host previews share z-index 1000 and mount after the drawer. */
.kanban-dialog-content.kanban-drawer-content {
  z-index: 1000;
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  height: 100dvh;
  max-width: 100%;
  max-height: 100dvh;
  border-width: 0 0 0 1px;
  border-radius: 0;
  transform: none;
}

.kanban-drawer-content[data-state="open"] {
  animation: kanban-drawer-in 180ms ease-out;
}

.kanban-drawer-content[data-state="closed"] {
  animation: kanban-drawer-out 150ms ease-in;
}

.kanban-drawer-content[data-resizing] {
  user-select: none;
}

.kanban-drawer-resize {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  width: 10px;
  outline: none;
  cursor: col-resize;
  touch-action: none;
}

.kanban-drawer-resize::after {
  position: absolute;
  top: calc(50% - 24px);
  left: 3px;
  width: 3px;
  height: 48px;
  border-radius: 2px;
  background: var(--dsw-alias-border-l2);
  content: "";
}

.kanban-drawer-resize:hover::after,
.kanban-drawer-resize:focus-visible::after,
.kanban-drawer-content[data-resizing] .kanban-drawer-resize::after {
  background: var(--dsw-alias-label-secondary);
}

.kanban-drawer-resize:focus-visible {
  box-shadow: inset 0 0 0 2px var(--dsw-alias-label-secondary);
}

@keyframes kanban-drawer-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes kanban-drawer-out {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

@media (max-width: 600px) {
  .kanban-dialog-content.kanban-drawer-content {
    border-left-width: 0;
  }
}

/* Search and actions share one compact row, wrapping when the pane is narrow. */
.kanban-search-row {
  font: var(--dsw-font-xs-13);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 12px;
  flex-shrink: 0;
}
.kanban-search-field {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1 1 240px;
  min-width: min(100%, 240px);
  max-width: 420px;
  padding-left: 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
}
.kanban-search-field > svg { width: 16px; height: 16px; color: var(--dsw-alias-label-tertiary); }
.kanban-search-field .kanban-input { min-width: 0; flex: 1; border: 0; background: transparent; }
.kanban-search-field input::-webkit-search-cancel-button { display: none; }
.kanban-search-field .kanban-button { width: 28px; height: 28px; margin-right: 3px; }
.kanban-search-match { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-12); overflow-wrap: anywhere; }

.kanban-images {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  border-radius: 8px;
}
.kanban-images.is-dragging { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 4px; }
.kanban-image-empty {
  padding: 18px 12px;
  border: 1px dashed var(--dsw-alias-border-l2);
  border-radius: 8px;
  color: var(--dsw-alias-label-secondary);
  text-align: center;
}
.kanban-image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(150px, 100%), 1fr));
  gap: 10px;
}
.kanban-image-tile {
  display: flex;
  flex-direction: column;
  min-width: 0;
  align-items: stretch;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  overflow: hidden;
}
.kanban-image-tile > .kanban-button { align-self: flex-end; }
.kanban-image-preview {
  position: relative;
  height: 116px;
  background: var(--dsw-alias-bg-layer-2);
  overflow: hidden;
}
.kanban-image-preview img { display: block; width: 100%; height: 100%; object-fit: contain; }
.kanban-image-open { display: block; width: 100%; height: 100%; border: 0; padding: 0; background: transparent; cursor: zoom-in; }
.kanban-image-open:disabled { cursor: default; }
.kanban-image-message {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxs-12);
}
.kanban-image-message > svg { width: 16px; height: 16px; }
.kanban-image-draft-info { display: flex; flex-direction: column; gap: 4px; padding: 6px 8px; overflow-wrap: anywhere; }
.kanban-image-filename { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: var(--dsw-font-xxs-12); }
.kanban-image-draft-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; }
@media (max-width: 600px) {
  .kanban-search-field { flex-basis: 100%; max-width: none; }
  .kanban-image-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

.kanban-filter-count { margin-left:auto; padding-left:16px; font-variant-numeric:tabular-nums; }
`;var fn=require("react");var mn=require("react");var Ki=e=>e?.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();function Xi(e,t,a=[]){if(t==null)throw new Error("[lucide]: iconNode is required when icon name is used");return{name:Ki(e),size:24,node:t,...a.length>0?{aliases:a}:{}}}var $i=e=>{let t="",a=!1;for(let o of e){if(o==="-"||o==="_"||o<=" "){a=t.length>0;continue}t.length===0?t+=o.toLowerCase():t+=a?o.toUpperCase():o,a=!1}return t};var ji=e=>{let t=$i(e);return t.charAt(0).toUpperCase()+t.slice(1)};var mr=require("react");var pr=(...e)=>e.filter((t,a,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===a).join(" ").trim();var ya={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};function As(e){return e!=null}function Yi(e,t={}){let a=t.attributeNames??{},o=f=>a[f]??f,r=e.size??e.width??ya.width,n=e.size??e.height??ya.height,s=e.aliases?.filter(f=>typeof f=="string"&&f.trim()!=="").map(f=>`lucide-${f}`)??[],l=[...e.name?[`lucide-${e.name}`]:[],...s],i=t.className?.split(" ").filter(Boolean)??[],u=t.includeDefaultClasses===!1?pr(...i):pr("lucide",...l,...i),c=t.absoluteStrokeWidth?Number(t.strokeWidth??ya["stroke-width"])*Number(e.size??e.width??ya.width)/Number(t.size??t.width??ya.width):t.strokeWidth??ya["stroke-width"];return["svg",{...Object.entries(ya).reduce((f,[p,h])=>(f[o(p)]=h,f),{}),..."color"in t&&t.color&&{[o("stroke")]:t.color},..."size"in t&&As(t.size)&&{[o("width")]:t.size,[o("height")]:t.size},..."width"in t&&As(t.width)&&{[o("width")]:t.width},..."height"in t&&As(t.height)&&{[o("height")]:t.height},[o("stroke-width")]:c,...u&&{[o("class")]:u},[o("viewBox")]:`0 0 ${r} ${n}`,...t.hasA11yProp===!1?{[o("aria-hidden")]:"true"}:{},..."attributes"in t&&t.attributes},e.node.map(f=>{let[p,h,g]=f,m=t.nonScalingStroke?{[o("vector-effect")]:"non-scaling-stroke",...h}:h;return g?[p,m,g]:[p,m]})]}function Zi(e,t={}){return Yi(e,{...t,attributeNames:{...t.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}var Ji=e=>{for(let t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};var Eo=require("react");var hg=(0,Eo.createContext)({});var Qi=()=>(0,Eo.useContext)(hg);var eu=(0,mr.forwardRef)(({color:e,size:t,width:a,height:o,strokeWidth:r,absoluteStrokeWidth:n,nonScalingStroke:s,className:l="",children:i,iconNode:u=[],icon:c={node:u,aliases:[],size:24},...d},f)=>{let{size:p=24,strokeWidth:h=2,absoluteStrokeWidth:g=!1,nonScalingStroke:m=!1,color:b="currentColor",className:x=""}=Qi()??{},L=!!i||Ji(d),[C,S,v=[]]=Zi(c,{color:e??b,width:a??t??p,height:o??t??p,strokeWidth:r??h,absoluteStrokeWidth:n??g,nonScalingStroke:s??m,className:pr(x,l),hasA11yProp:L,attributes:d});return(0,mr.createElement)(C,{ref:f,...S},[...v.map(([y,w])=>(0,mr.createElement)(y,w)),...Array.isArray(i)?i:[i]])});function ae(e,t=[],a=[]){let o=typeof e=="string"?Xi(e,t,a):e,r=(0,mn.forwardRef)(({className:n,...s},l)=>(0,mn.createElement)(eu,{ref:l,icon:o,className:n,...s}));return o.name&&(r.displayName=ji(o.name)),r}var tu={name:"calendar-days",size:24,node:[["path",{d:"M8 2v3",key:"1ioesn"}],["path",{d:"M16 2v3",key:"otl347"}],["rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",key:"h1oib"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M8 13h.01",key:"1sbv64"}],["path",{d:"M12 13h.01",key:"y0uutt"}],["path",{d:"M16 13h.01",key:"wip0gl"}],["path",{d:"M8 17h.01",key:"p3bg7i"}],["path",{d:"M12 17h.01",key:"p32p05"}],["path",{d:"M16 17h.01",key:"ql8jdd"}]]};tu.node;var za=ae(tu);var au={name:"check",size:24,node:[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]};au.node;var st=ae(au);var ou={name:"chevron-down",size:24,node:[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]};ou.node;var ka=ae(ou);var ru={name:"chevron-up",size:24,node:[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]};ru.node;var gr=ae(ru);var nu={name:"funnel",size:24,node:[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]],aliases:["filter"]};nu.node;var Ra=ae(nu);var su={name:"grip-vertical",size:24,node:[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]]};su.node;var hr=ae(su);var lu={name:"image-plus",size:24,node:[["path",{d:"M16 5h6",key:"1vod17"}],["path",{d:"M19 2v6",key:"4bpg5p"}],["path",{d:"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",key:"1ue2ih"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}]]};lu.node;var xr=ae(lu);var iu={name:"image",size:24,node:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]};iu.node;var Lr=ae(iu);var uu={name:"list-todo",size:24,node:[["path",{d:"M13 5h8",key:"a7qcls"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 19h8",key:"c3s6r1"}],["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["rect",{x:"3",y:"4",width:"6",height:"6",rx:"1",key:"cif1o7"}]]};uu.node;var br=ae(uu);var du={name:"list",size:24,node:[["path",{d:"M3 5h.01",key:"18ugdj"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 19h.01",key:"noohij"}],["path",{d:"M8 5h13",key:"1pao27"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 19h13",key:"m83p4d"}]]};du.node;var Cr=ae(du);var cu={name:"loader-circle",size:24,node:[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],aliases:["loader-2"]};cu.node;var ca=ae(cu);var fu={name:"message-square",size:24,node:[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}]]};fu.node;var fa=ae(fu);var pu={name:"panels-top-left",size:24,node:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M9 21V9",key:"1oto5p"}]],aliases:["layout"]};pu.node;var Qt=ae(pu);var mu={name:"pencil",size:24,node:[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]};mu.node;var vr=ae(mu);var gu={name:"plus",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]};gu.node;var Wa=ae(gu);var hu={name:"refresh-cw",size:24,node:[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]};hu.node;var Pa=ae(hu);var xu={name:"search",size:24,node:[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]};xu.node;var Va=ae(xu);var Lu={name:"send",size:24,node:[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]};Lu.node;var Ir=ae(Lu);var bu={name:"settings-2",size:24,node:[["path",{d:"M14 17H5",key:"gfn3mx"}],["path",{d:"M19 7h-9",key:"6i9tg"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]]};bu.node;var wr=ae(bu);var Cu={name:"square-check-big",size:24,node:[["path",{d:"M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",key:"2acyp4"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],aliases:["check-square"]};Cu.node;var Da=ae(Cu);var vu={name:"square",size:24,node:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]};vu.node;var Sr=ae(vu);var Iu={name:"tag",size:24,node:[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]};Iu.node;var Oo=ae(Iu);var wu={name:"tags",size:24,node:[["path",{d:"M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z",key:"16rjxf"}],["path",{d:"M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193",key:"178nd4"}],["circle",{cx:"10.5",cy:"6.5",r:".5",fill:"currentColor",key:"12ikhr"}]]};wu.node;var yr=ae(wu);var Su={name:"trash",size:24,node:[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],aliases:["trash-2"]};Su.node;var Bt=ae(Su);var yu={name:"x",size:24,node:[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]};yu.node;var $e=ae(yu);var ks=require("react");var Le=require("react");var D=Z(require("react")),Za=require("react-dom");var Ne=require("react");function Ru(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return(0,Ne.useMemo)(()=>o=>{t.forEach(r=>r(o))},t)}var kr=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";function Ga(e){let t=Object.prototype.toString.call(e);return t==="[object Window]"||t==="[object global]"}function gn(e){return"nodeType"in e}function lt(e){var t,a;return e?Ga(e)?e:gn(e)&&(t=(a=e.ownerDocument)==null?void 0:a.defaultView)!=null?t:window:window}function hn(e){let{Document:t}=lt(e);return e instanceof t}function Bo(e){return Ga(e)?!1:e instanceof lt(e).HTMLElement}function Es(e){return e instanceof lt(e).SVGElement}function Ka(e){return e?Ga(e)?e.document:gn(e)?hn(e)?e:Bo(e)||Es(e)?e.ownerDocument:document:document:document}var kt=kr?Ne.useLayoutEffect:Ne.useEffect;function Rr(e){let t=(0,Ne.useRef)(e);return kt(()=>{t.current=e}),(0,Ne.useCallback)(function(){for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return t.current==null?void 0:t.current(...o)},[])}function Pu(){let e=(0,Ne.useRef)(null),t=(0,Ne.useCallback)((o,r)=>{e.current=setInterval(o,r)},[]),a=(0,Ne.useCallback)(()=>{e.current!==null&&(clearInterval(e.current),e.current=null)},[]);return[t,a]}function Fo(e,t){t===void 0&&(t=[e]);let a=(0,Ne.useRef)(e);return kt(()=>{a.current!==e&&(a.current=e)},t),a}function No(e,t){let a=(0,Ne.useRef)();return(0,Ne.useMemo)(()=>{let o=e(a.current);return a.current=o,o},[...t])}function Pr(e){let t=Rr(e),a=(0,Ne.useRef)(null),o=(0,Ne.useCallback)(r=>{r!==a.current&&t?.(r,a.current),a.current=r},[]);return[a,o]}function Dr(e){let t=(0,Ne.useRef)();return(0,Ne.useEffect)(()=>{t.current=e},[e]),t.current}var Ts={};function Xa(e,t){return(0,Ne.useMemo)(()=>{if(t)return t;let a=Ts[e]==null?0:Ts[e]+1;return Ts[e]=a,e+"-"+a},[e,t])}function Du(e){return function(t){for(var a=arguments.length,o=new Array(a>1?a-1:0),r=1;r<a;r++)o[r-1]=arguments[r];return o.reduce((n,s)=>{let l=Object.entries(s);for(let[i,u]of l){let c=n[i];c!=null&&(n[i]=c+e*u)}return n},{...t})}}var $a=Du(1),ja=Du(-1);function xg(e){return"clientX"in e&&"clientY"in e}function qo(e){if(!e)return!1;let{KeyboardEvent:t}=lt(e.target);return t&&e instanceof t}function Lg(e){if(!e)return!1;let{TouchEvent:t}=lt(e.target);return t&&e instanceof t}function Mr(e){if(Lg(e)){if(e.touches&&e.touches.length){let{clientX:t,clientY:a}=e.touches[0];return{x:t,y:a}}else if(e.changedTouches&&e.changedTouches.length){let{clientX:t,clientY:a}=e.changedTouches[0];return{x:t,y:a}}}return xg(e)?{x:e.clientX,y:e.clientY}:null}var yt=Object.freeze({Translate:{toString(e){if(!e)return;let{x:t,y:a}=e;return"translate3d("+(t?Math.round(t):0)+"px, "+(a?Math.round(a):0)+"px, 0)"}},Scale:{toString(e){if(!e)return;let{scaleX:t,scaleY:a}=e;return"scaleX("+t+") scaleY("+a+")"}},Transform:{toString(e){if(e)return[yt.Translate.toString(e),yt.Scale.toString(e)].join(" ")}},Transition:{toString(e){let{property:t,duration:a,easing:o}=e;return t+" "+a+"ms "+o}}}),ku="a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]";function Mu(e){return e.matches(ku)?e:e.querySelector(ku)}var Ya=Z(require("react")),bg={display:"none"};function Au(e){let{id:t,value:a}=e;return Ya.default.createElement("div",{id:t,style:bg},a)}function Tu(e){let{id:t,announcement:a,ariaLiveType:o="assertive"}=e,r={position:"fixed",top:0,left:0,width:1,height:1,margin:-1,border:0,padding:0,overflow:"hidden",clip:"rect(0 0 0 0)",clipPath:"inset(100%)",whiteSpace:"nowrap"};return Ya.default.createElement("div",{id:t,style:r,role:"status","aria-live":o,"aria-atomic":!0},a)}function Eu(){let[e,t]=(0,Ya.useState)("");return{announce:(0,Ya.useCallback)(o=>{o!=null&&t(o)},[]),announcement:e}}var Ku=(0,D.createContext)(null);function Cg(e){let t=(0,D.useContext)(Ku);(0,D.useEffect)(()=>{if(!t)throw new Error("useDndMonitor must be used within a children of <DndContext>");return t(e)},[e,t])}function vg(){let[e]=(0,D.useState)(()=>new Set),t=(0,D.useCallback)(o=>(e.add(o),()=>e.delete(o)),[e]);return[(0,D.useCallback)(o=>{let{type:r,event:n}=o;e.forEach(s=>{var l;return(l=s[r])==null?void 0:l.call(s,n)})},[e]),t]}var Ig={draggable:`
    To pick up a draggable item, press the space bar.
    While dragging, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `},wg={onDragStart(e){let{active:t}=e;return"Picked up draggable item "+t.id+"."},onDragOver(e){let{active:t,over:a}=e;return a?"Draggable item "+t.id+" was moved over droppable area "+a.id+".":"Draggable item "+t.id+" is no longer over a droppable area."},onDragEnd(e){let{active:t,over:a}=e;return a?"Draggable item "+t.id+" was dropped over droppable area "+a.id:"Draggable item "+t.id+" was dropped."},onDragCancel(e){let{active:t}=e;return"Dragging was cancelled. Draggable item "+t.id+" was dropped."}};function Sg(e){let{announcements:t=wg,container:a,hiddenTextDescribedById:o,screenReaderInstructions:r=Ig}=e,{announce:n,announcement:s}=Eu(),l=Xa("DndLiveRegion"),[i,u]=(0,D.useState)(!1);if((0,D.useEffect)(()=>{u(!0)},[]),Cg((0,D.useMemo)(()=>({onDragStart(d){let{active:f}=d;n(t.onDragStart({active:f}))},onDragMove(d){let{active:f,over:p}=d;t.onDragMove&&n(t.onDragMove({active:f,over:p}))},onDragOver(d){let{active:f,over:p}=d;n(t.onDragOver({active:f,over:p}))},onDragEnd(d){let{active:f,over:p}=d;n(t.onDragEnd({active:f,over:p}))},onDragCancel(d){let{active:f,over:p}=d;n(t.onDragCancel({active:f,over:p}))}}),[n,t])),!i)return null;let c=D.default.createElement(D.default.Fragment,null,D.default.createElement(Au,{id:o,value:r.draggable}),D.default.createElement(Tu,{id:l,announcement:s}));return a?(0,Za.createPortal)(c,a):c}var Ve;(function(e){e.DragStart="dragStart",e.DragMove="dragMove",e.DragEnd="dragEnd",e.DragCancel="dragCancel",e.DragOver="dragOver",e.RegisterDroppable="registerDroppable",e.SetDroppableDisabled="setDroppableDisabled",e.UnregisterDroppable="unregisterDroppable"})(Ve||(Ve={}));function Ln(){}function eo(e,t){return(0,D.useMemo)(()=>({sensor:e,options:t??{}}),[e,t])}function Cn(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return(0,D.useMemo)(()=>[...t].filter(o=>o!=null),[...t])}var Ut=Object.freeze({x:0,y:0});function Us(e,t){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function yg(e,t){let a=Mr(e);if(!a)return"0 0";let o={x:(a.x-t.left)/t.width*100,y:(a.y-t.top)/t.height*100};return o.x+"% "+o.y+"%"}function zs(e,t){let{data:{value:a}}=e,{data:{value:o}}=t;return a-o}function kg(e,t){let{data:{value:a}}=e,{data:{value:o}}=t;return o-a}function Ns(e){let{left:t,top:a,height:o,width:r}=e;return[{x:t,y:a},{x:t+r,y:a},{x:t,y:a+o},{x:t+r,y:a+o}]}function Nr(e,t){if(!e||e.length===0)return null;let[a]=e;return t?a[t]:a}function Ou(e,t,a){return t===void 0&&(t=e.left),a===void 0&&(a=e.top),{x:t+e.width*.5,y:a+e.height*.5}}var Xu=e=>{let{collisionRect:t,droppableRects:a,droppableContainers:o}=e,r=Ou(t,t.left,t.top),n=[];for(let s of o){let{id:l}=s,i=a.get(l);if(i){let u=Us(Ou(i),r);n.push({id:l,data:{droppableContainer:s,value:u}})}}return n.sort(zs)},vn=e=>{let{collisionRect:t,droppableRects:a,droppableContainers:o}=e,r=Ns(t),n=[];for(let s of o){let{id:l}=s,i=a.get(l);if(i){let u=Ns(i),c=r.reduce((f,p,h)=>f+Us(u[h],p),0),d=Number((c/4).toFixed(4));n.push({id:l,data:{droppableContainer:s,value:d}})}}return n.sort(zs)};function Rg(e,t){let a=Math.max(t.top,e.top),o=Math.max(t.left,e.left),r=Math.min(t.left+t.width,e.left+e.width),n=Math.min(t.top+t.height,e.top+e.height),s=r-o,l=n-a;if(o<r&&a<n){let i=t.width*t.height,u=e.width*e.height,c=s*l,d=c/(i+u-c);return Number(d.toFixed(4))}return 0}var Ws=e=>{let{collisionRect:t,droppableRects:a,droppableContainers:o}=e,r=[];for(let n of o){let{id:s}=n,l=a.get(s);if(l){let i=Rg(l,t);i>0&&r.push({id:s,data:{droppableContainer:n,value:i}})}}return r.sort(kg)};function Pg(e,t){let{top:a,left:o,bottom:r,right:n}=t;return a<=e.y&&e.y<=r&&o<=e.x&&e.x<=n}var $u=e=>{let{droppableContainers:t,droppableRects:a,pointerCoordinates:o}=e;if(!o)return[];let r=[];for(let n of t){let{id:s}=n,l=a.get(s);if(l&&Pg(o,l)){let u=Ns(l).reduce((d,f)=>d+Us(o,f),0),c=Number((u/4).toFixed(4));r.push({id:s,data:{droppableContainer:n,value:c}})}}return r.sort(zs)};function Dg(e,t,a){return{...e,scaleX:t&&a?t.width/a.width:1,scaleY:t&&a?t.height/a.height:1}}function ju(e,t){return e&&t?{x:e.left-t.left,y:e.top-t.top}:Ut}function Mg(e){return function(a){for(var o=arguments.length,r=new Array(o>1?o-1:0),n=1;n<o;n++)r[n-1]=arguments[n];return r.reduce((s,l)=>({...s,top:s.top+e*l.y,bottom:s.bottom+e*l.y,left:s.left+e*l.x,right:s.right+e*l.x}),{...a})}}var Ag=Mg(1);function Yu(e){if(e.startsWith("matrix3d(")){let t=e.slice(9,-1).split(/, /);return{x:+t[12],y:+t[13],scaleX:+t[0],scaleY:+t[5]}}else if(e.startsWith("matrix(")){let t=e.slice(7,-1).split(/, /);return{x:+t[4],y:+t[5],scaleX:+t[0],scaleY:+t[3]}}return null}function Tg(e,t,a){let o=Yu(t);if(!o)return e;let{scaleX:r,scaleY:n,x:s,y:l}=o,i=e.left-s-(1-r)*parseFloat(a),u=e.top-l-(1-n)*parseFloat(a.slice(a.indexOf(" ")+1)),c=r?e.width/r:e.width,d=n?e.height/n:e.height;return{width:c,height:d,top:u,right:i+c,bottom:u+d,left:i}}var Eg={ignoreTransform:!1};function to(e,t){t===void 0&&(t=Eg);let a=e.getBoundingClientRect();if(t.ignoreTransform){let{transform:u,transformOrigin:c}=lt(e).getComputedStyle(e);u&&(a=Tg(a,u,c))}let{top:o,left:r,width:n,height:s,bottom:l,right:i}=a;return{top:o,left:r,width:n,height:s,bottom:l,right:i}}function Bu(e){return to(e,{ignoreTransform:!0})}function Og(e){let t=e.innerWidth,a=e.innerHeight;return{top:0,left:0,right:t,bottom:a,width:t,height:a}}function Bg(e,t){return t===void 0&&(t=lt(e).getComputedStyle(e)),t.position==="fixed"}function Fg(e,t){t===void 0&&(t=lt(e).getComputedStyle(e));let a=/(auto|scroll|overlay)/;return["overflow","overflowX","overflowY"].some(r=>{let n=t[r];return typeof n=="string"?a.test(n):!1})}function qr(e,t){let a=[];function o(r){if(t!=null&&a.length>=t||!r)return a;if(hn(r)&&r.scrollingElement!=null&&!a.includes(r.scrollingElement))return a.push(r.scrollingElement),a;if(!Bo(r)||Es(r)||a.includes(r))return a;let n=lt(e).getComputedStyle(r);return r!==e&&Fg(r,n)&&a.push(r),Bg(r,n)?a:o(r.parentNode)}return e?o(e):a}function Zu(e){let[t]=qr(e,1);return t??null}function Os(e){return!kr||!e?null:Ga(e)?e:gn(e)?hn(e)||e===Ka(e).scrollingElement?window:Bo(e)?e:null:null}function Ju(e){return Ga(e)?e.scrollX:e.scrollLeft}function Qu(e){return Ga(e)?e.scrollY:e.scrollTop}function qs(e){return{x:Ju(e),y:Qu(e)}}var je;(function(e){e[e.Forward=1]="Forward",e[e.Backward=-1]="Backward"})(je||(je={}));function ed(e){return!kr||!e?!1:e===document.scrollingElement}function td(e){let t={x:0,y:0},a=ed(e)?{height:window.innerHeight,width:window.innerWidth}:{height:e.clientHeight,width:e.clientWidth},o={x:e.scrollWidth-a.width,y:e.scrollHeight-a.height},r=e.scrollTop<=t.y,n=e.scrollLeft<=t.x,s=e.scrollTop>=o.y,l=e.scrollLeft>=o.x;return{isTop:r,isLeft:n,isBottom:s,isRight:l,maxScroll:o,minScroll:t}}var Ng={x:.2,y:.2};function qg(e,t,a,o,r){let{top:n,left:s,right:l,bottom:i}=a;o===void 0&&(o=10),r===void 0&&(r=Ng);let{isTop:u,isBottom:c,isLeft:d,isRight:f}=td(e),p={x:0,y:0},h={x:0,y:0},g={height:t.height*r.y,width:t.width*r.x};return!u&&n<=t.top+g.height?(p.y=je.Backward,h.y=o*Math.abs((t.top+g.height-n)/g.height)):!c&&i>=t.bottom-g.height&&(p.y=je.Forward,h.y=o*Math.abs((t.bottom-g.height-i)/g.height)),!f&&l>=t.right-g.width?(p.x=je.Forward,h.x=o*Math.abs((t.right-g.width-l)/g.width)):!d&&s<=t.left+g.width&&(p.x=je.Backward,h.x=o*Math.abs((t.left+g.width-s)/g.width)),{direction:p,speed:h}}function _g(e){if(e===document.scrollingElement){let{innerWidth:n,innerHeight:s}=window;return{top:0,left:0,right:n,bottom:s,width:n,height:s}}let{top:t,left:a,right:o,bottom:r}=e.getBoundingClientRect();return{top:t,left:a,right:o,bottom:r,width:e.clientWidth,height:e.clientHeight}}function ad(e){return e.reduce((t,a)=>$a(t,qs(a)),Ut)}function Hg(e){return e.reduce((t,a)=>t+Ju(a),0)}function Ug(e){return e.reduce((t,a)=>t+Qu(a),0)}function od(e,t){if(t===void 0&&(t=to),!e)return;let{top:a,left:o,bottom:r,right:n}=t(e);Zu(e)&&(r<=0||n<=0||a>=window.innerHeight||o>=window.innerWidth)&&e.scrollIntoView({block:"center",inline:"center"})}var zg=[["x",["left","right"],Hg],["y",["top","bottom"],Ug]],Tr=class{constructor(t,a){this.rect=void 0,this.width=void 0,this.height=void 0,this.top=void 0,this.bottom=void 0,this.right=void 0,this.left=void 0;let o=qr(a),r=ad(o);this.rect={...t},this.width=t.width,this.height=t.height;for(let[n,s,l]of zg)for(let i of s)Object.defineProperty(this,i,{get:()=>{let u=l(o),c=r[n]-u;return this.rect[i]+c},enumerable:!0});Object.defineProperty(this,"rect",{enumerable:!1})}},Ja=class{constructor(t){this.target=void 0,this.listeners=[],this.removeAll=()=>{this.listeners.forEach(a=>{var o;return(o=this.target)==null?void 0:o.removeEventListener(...a)})},this.target=t}add(t,a,o){var r;(r=this.target)==null||r.addEventListener(t,a,o),this.listeners.push([t,a,o])}};function Wg(e){let{EventTarget:t}=lt(e);return e instanceof t?e:Ka(e)}function Bs(e,t){let a=Math.abs(e.x),o=Math.abs(e.y);return typeof t=="number"?Math.sqrt(a**2+o**2)>t:"x"in t&&"y"in t?a>t.x&&o>t.y:"x"in t?a>t.x:"y"in t?o>t.y:!1}var Ft;(function(e){e.Click="click",e.DragStart="dragstart",e.Keydown="keydown",e.ContextMenu="contextmenu",e.Resize="resize",e.SelectionChange="selectionchange",e.VisibilityChange="visibilitychange"})(Ft||(Ft={}));function Fu(e){e.preventDefault()}function Vg(e){e.stopPropagation()}var pe;(function(e){e.Space="Space",e.Down="ArrowDown",e.Right="ArrowRight",e.Left="ArrowLeft",e.Up="ArrowUp",e.Esc="Escape",e.Enter="Enter",e.Tab="Tab"})(pe||(pe={}));var rd={start:[pe.Space,pe.Enter],cancel:[pe.Esc],end:[pe.Space,pe.Enter,pe.Tab]},Gg=(e,t)=>{let{currentCoordinates:a}=t;switch(e.code){case pe.Right:return{...a,x:a.x+25};case pe.Left:return{...a,x:a.x-25};case pe.Down:return{...a,y:a.y+25};case pe.Up:return{...a,y:a.y-25}}},Aa=class{constructor(t){this.props=void 0,this.autoScrollEnabled=!1,this.referenceCoordinates=void 0,this.listeners=void 0,this.windowListeners=void 0,this.props=t;let{event:{target:a}}=t;this.props=t,this.listeners=new Ja(Ka(a)),this.windowListeners=new Ja(lt(a)),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleCancel=this.handleCancel.bind(this),this.attach()}attach(){this.handleStart(),this.windowListeners.add(Ft.Resize,this.handleCancel),this.windowListeners.add(Ft.VisibilityChange,this.handleCancel),setTimeout(()=>this.listeners.add(Ft.Keydown,this.handleKeyDown))}handleStart(){let{activeNode:t,onStart:a}=this.props,o=t.node.current;o&&od(o),a(Ut)}handleKeyDown(t){if(qo(t)){let{active:a,context:o,options:r}=this.props,{keyboardCodes:n=rd,coordinateGetter:s=Gg,scrollBehavior:l="smooth"}=r,{code:i}=t;if(n.end.includes(i)){this.handleEnd(t);return}if(n.cancel.includes(i)){this.handleCancel(t);return}let{collisionRect:u}=o.current,c=u?{x:u.left,y:u.top}:Ut;this.referenceCoordinates||(this.referenceCoordinates=c);let d=s(t,{active:a,context:o.current,currentCoordinates:c});if(d){let f=ja(d,c),p={x:0,y:0},{scrollableAncestors:h}=o.current;for(let g of h){let m=t.code,{isTop:b,isRight:x,isLeft:L,isBottom:C,maxScroll:S,minScroll:v}=td(g),y=_g(g),w={x:Math.min(m===pe.Right?y.right-y.width/2:y.right,Math.max(m===pe.Right?y.left:y.left+y.width/2,d.x)),y:Math.min(m===pe.Down?y.bottom-y.height/2:y.bottom,Math.max(m===pe.Down?y.top:y.top+y.height/2,d.y))},E=m===pe.Right&&!x||m===pe.Left&&!L,I=m===pe.Down&&!C||m===pe.Up&&!b;if(E&&w.x!==d.x){let R=g.scrollLeft+f.x,M=m===pe.Right&&R<=S.x||m===pe.Left&&R>=v.x;if(M&&!f.y){g.scrollTo({left:R,behavior:l});return}M?p.x=g.scrollLeft-R:p.x=m===pe.Right?g.scrollLeft-S.x:g.scrollLeft-v.x,p.x&&g.scrollBy({left:-p.x,behavior:l});break}else if(I&&w.y!==d.y){let R=g.scrollTop+f.y,M=m===pe.Down&&R<=S.y||m===pe.Up&&R>=v.y;if(M&&!f.x){g.scrollTo({top:R,behavior:l});return}M?p.y=g.scrollTop-R:p.y=m===pe.Down?g.scrollTop-S.y:g.scrollTop-v.y,p.y&&g.scrollBy({top:-p.y,behavior:l});break}}this.handleMove(t,$a(ja(d,this.referenceCoordinates),p))}}}handleMove(t,a){let{onMove:o}=this.props;t.preventDefault(),o(a)}handleEnd(t){let{onEnd:a}=this.props;t.preventDefault(),this.detach(),a()}handleCancel(t){let{onCancel:a}=this.props;t.preventDefault(),this.detach(),a()}detach(){this.listeners.removeAll(),this.windowListeners.removeAll()}};Aa.activators=[{eventName:"onKeyDown",handler:(e,t,a)=>{let{keyboardCodes:o=rd,onActivation:r}=t,{active:n}=a,{code:s}=e.nativeEvent;if(o.start.includes(s)){let l=n.activatorNode.current;return l&&e.target!==l?!1:(e.preventDefault(),r?.({event:e.nativeEvent}),!0)}return!1}}];function Nu(e){return!!(e&&"distance"in e)}function qu(e){return!!(e&&"delay"in e)}var Er=class{constructor(t,a,o){var r;o===void 0&&(o=Wg(t.event.target)),this.props=void 0,this.events=void 0,this.autoScrollEnabled=!0,this.document=void 0,this.activated=!1,this.initialCoordinates=void 0,this.timeoutId=null,this.listeners=void 0,this.documentListeners=void 0,this.windowListeners=void 0,this.props=t,this.events=a;let{event:n}=t,{target:s}=n;this.props=t,this.events=a,this.document=Ka(s),this.documentListeners=new Ja(this.document),this.listeners=new Ja(o),this.windowListeners=new Ja(lt(s)),this.initialCoordinates=(r=Mr(n))!=null?r:Ut,this.handleStart=this.handleStart.bind(this),this.handleMove=this.handleMove.bind(this),this.handleEnd=this.handleEnd.bind(this),this.handleCancel=this.handleCancel.bind(this),this.handleKeydown=this.handleKeydown.bind(this),this.removeTextSelection=this.removeTextSelection.bind(this),this.attach()}attach(){let{events:t,props:{options:{activationConstraint:a,bypassActivationConstraint:o}}}=this;if(this.listeners.add(t.move.name,this.handleMove,{passive:!1}),this.listeners.add(t.end.name,this.handleEnd),t.cancel&&this.listeners.add(t.cancel.name,this.handleCancel),this.windowListeners.add(Ft.Resize,this.handleCancel),this.windowListeners.add(Ft.DragStart,Fu),this.windowListeners.add(Ft.VisibilityChange,this.handleCancel),this.windowListeners.add(Ft.ContextMenu,Fu),this.documentListeners.add(Ft.Keydown,this.handleKeydown),a){if(o!=null&&o({event:this.props.event,activeNode:this.props.activeNode,options:this.props.options}))return this.handleStart();if(qu(a)){this.timeoutId=setTimeout(this.handleStart,a.delay),this.handlePending(a);return}if(Nu(a)){this.handlePending(a);return}}this.handleStart()}detach(){this.listeners.removeAll(),this.windowListeners.removeAll(),setTimeout(this.documentListeners.removeAll,50),this.timeoutId!==null&&(clearTimeout(this.timeoutId),this.timeoutId=null)}handlePending(t,a){let{active:o,onPending:r}=this.props;r(o,t,this.initialCoordinates,a)}handleStart(){let{initialCoordinates:t}=this,{onStart:a}=this.props;t&&(this.activated=!0,this.documentListeners.add(Ft.Click,Vg,{capture:!0}),this.removeTextSelection(),this.documentListeners.add(Ft.SelectionChange,this.removeTextSelection),a(t))}handleMove(t){var a;let{activated:o,initialCoordinates:r,props:n}=this,{onMove:s,options:{activationConstraint:l}}=n;if(!r)return;let i=(a=Mr(t))!=null?a:Ut,u=ja(r,i);if(!o&&l){if(Nu(l)){if(l.tolerance!=null&&Bs(u,l.tolerance))return this.handleCancel();if(Bs(u,l.distance))return this.handleStart()}if(qu(l)&&Bs(u,l.tolerance))return this.handleCancel();this.handlePending(l,u);return}t.cancelable&&t.preventDefault(),s(i)}handleEnd(){let{onAbort:t,onEnd:a}=this.props;this.detach(),this.activated||t(this.props.active),a()}handleCancel(){let{onAbort:t,onCancel:a}=this.props;this.detach(),this.activated||t(this.props.active),a()}handleKeydown(t){t.code===pe.Esc&&this.handleCancel()}removeTextSelection(){var t;(t=this.document.getSelection())==null||t.removeAllRanges()}},Kg={cancel:{name:"pointercancel"},move:{name:"pointermove"},end:{name:"pointerup"}},_o=class extends Er{constructor(t){let{event:a}=t,o=Ka(a.target);super(t,Kg,o)}};_o.activators=[{eventName:"onPointerDown",handler:(e,t)=>{let{nativeEvent:a}=e,{onActivation:o}=t;return!a.isPrimary||a.button!==0?!1:(o?.({event:a}),!0)}}];var Xg={move:{name:"mousemove"},end:{name:"mouseup"}},_s;(function(e){e[e.RightClick=2]="RightClick"})(_s||(_s={}));var Or=class extends Er{constructor(t){super(t,Xg,Ka(t.event.target))}};Or.activators=[{eventName:"onMouseDown",handler:(e,t)=>{let{nativeEvent:a}=e,{onActivation:o}=t;return a.button===_s.RightClick?!1:(o?.({event:a}),!0)}}];var Fs={cancel:{name:"touchcancel"},move:{name:"touchmove"},end:{name:"touchend"}},Br=class extends Er{constructor(t){super(t,Fs)}static setup(){return window.addEventListener(Fs.move.name,t,{capture:!1,passive:!1}),function(){window.removeEventListener(Fs.move.name,t)};function t(){}}};Br.activators=[{eventName:"onTouchStart",handler:(e,t)=>{let{nativeEvent:a}=e,{onActivation:o}=t,{touches:r}=a;return r.length>1?!1:(o?.({event:a}),!0)}}];var Ar;(function(e){e[e.Pointer=0]="Pointer",e[e.DraggableRect=1]="DraggableRect"})(Ar||(Ar={}));var bn;(function(e){e[e.TreeOrder=0]="TreeOrder",e[e.ReversedTreeOrder=1]="ReversedTreeOrder"})(bn||(bn={}));function $g(e){let{acceleration:t,activator:a=Ar.Pointer,canScroll:o,draggingRect:r,enabled:n,interval:s=5,order:l=bn.TreeOrder,pointerCoordinates:i,scrollableAncestors:u,scrollableAncestorRects:c,delta:d,threshold:f}=e,p=Yg({delta:d,disabled:!n}),[h,g]=Pu(),m=(0,D.useRef)({x:0,y:0}),b=(0,D.useRef)({x:0,y:0}),x=(0,D.useMemo)(()=>{switch(a){case Ar.Pointer:return i?{top:i.y,bottom:i.y,left:i.x,right:i.x}:null;case Ar.DraggableRect:return r}},[a,r,i]),L=(0,D.useRef)(null),C=(0,D.useCallback)(()=>{let v=L.current;if(!v)return;let y=m.current.x*b.current.x,w=m.current.y*b.current.y;v.scrollBy(y,w)},[]),S=(0,D.useMemo)(()=>l===bn.TreeOrder?[...u].reverse():u,[l,u]);(0,D.useEffect)(()=>{if(!n||!u.length||!x){g();return}for(let v of S){if(o?.(v)===!1)continue;let y=u.indexOf(v),w=c[y];if(!w)continue;let{direction:E,speed:I}=qg(v,w,x,t,f);for(let R of["x","y"])p[R][E[R]]||(I[R]=0,E[R]=0);if(I.x>0||I.y>0){g(),L.current=v,h(C,s),m.current=I,b.current=E;return}}m.current={x:0,y:0},b.current={x:0,y:0},g()},[t,C,o,g,n,s,JSON.stringify(x),JSON.stringify(p),h,u,S,c,JSON.stringify(f)])}var jg={x:{[je.Backward]:!1,[je.Forward]:!1},y:{[je.Backward]:!1,[je.Forward]:!1}};function Yg(e){let{delta:t,disabled:a}=e,o=Dr(t);return No(r=>{if(a||!o||!r)return jg;let n={x:Math.sign(t.x-o.x),y:Math.sign(t.y-o.y)};return{x:{[je.Backward]:r.x[je.Backward]||n.x===-1,[je.Forward]:r.x[je.Forward]||n.x===1},y:{[je.Backward]:r.y[je.Backward]||n.y===-1,[je.Forward]:r.y[je.Forward]||n.y===1}}},[a,t,o])}function Zg(e,t){let a=t!=null?e.get(t):void 0,o=a?a.node.current:null;return No(r=>{var n;return t==null?null:(n=o??r)!=null?n:null},[o,t])}function Jg(e,t){return(0,D.useMemo)(()=>e.reduce((a,o)=>{let{sensor:r}=o,n=r.activators.map(s=>({eventName:s.eventName,handler:t(s.handler,o)}));return[...a,...n]},[]),[e,t])}var Fr;(function(e){e[e.Always=0]="Always",e[e.BeforeDragging=1]="BeforeDragging",e[e.WhileDragging=2]="WhileDragging"})(Fr||(Fr={}));var Hs;(function(e){e.Optimized="optimized"})(Hs||(Hs={}));var _u=new Map;function Qg(e,t){let{dragging:a,dependencies:o,config:r}=t,[n,s]=(0,D.useState)(null),{frequency:l,measure:i,strategy:u}=r,c=(0,D.useRef)(e),d=m(),f=Fo(d),p=(0,D.useCallback)(function(b){b===void 0&&(b=[]),!f.current&&s(x=>x===null?b:x.concat(b.filter(L=>!x.includes(L))))},[f]),h=(0,D.useRef)(null),g=No(b=>{if(d&&!a)return _u;if(!b||b===_u||c.current!==e||n!=null){let x=new Map;for(let L of e){if(!L)continue;if(n&&n.length>0&&!n.includes(L.id)&&L.rect.current){x.set(L.id,L.rect.current);continue}let C=L.node.current,S=C?new Tr(i(C),C):null;L.rect.current=S,S&&x.set(L.id,S)}return x}return b},[e,n,a,d,i]);return(0,D.useEffect)(()=>{c.current=e},[e]),(0,D.useEffect)(()=>{d||p()},[a,d]),(0,D.useEffect)(()=>{n&&n.length>0&&s(null)},[JSON.stringify(n)]),(0,D.useEffect)(()=>{d||typeof l!="number"||h.current!==null||(h.current=setTimeout(()=>{p(),h.current=null},l))},[l,d,p,...o]),{droppableRects:g,measureDroppableContainers:p,measuringScheduled:n!=null};function m(){switch(u){case Fr.Always:return!1;case Fr.BeforeDragging:return a;default:return!a}}}function Vs(e,t){return No(a=>e?a||(typeof t=="function"?t(e):e):null,[t,e])}function eh(e,t){return Vs(e,t)}function th(e){let{callback:t,disabled:a}=e,o=Rr(t),r=(0,D.useMemo)(()=>{if(a||typeof window>"u"||typeof window.MutationObserver>"u")return;let{MutationObserver:n}=window;return new n(o)},[o,a]);return(0,D.useEffect)(()=>()=>r?.disconnect(),[r]),r}function In(e){let{callback:t,disabled:a}=e,o=Rr(t),r=(0,D.useMemo)(()=>{if(a||typeof window>"u"||typeof window.ResizeObserver>"u")return;let{ResizeObserver:n}=window;return new n(o)},[a]);return(0,D.useEffect)(()=>()=>r?.disconnect(),[r]),r}function ah(e){return new Tr(to(e),e)}function Hu(e,t,a){t===void 0&&(t=ah);let[o,r]=(0,D.useState)(null);function n(){r(i=>{if(!e)return null;if(e.isConnected===!1){var u;return(u=i??a)!=null?u:null}let c=t(e);return JSON.stringify(i)===JSON.stringify(c)?i:c})}let s=th({callback(i){if(e)for(let u of i){let{type:c,target:d}=u;if(c==="childList"&&d instanceof HTMLElement&&d.contains(e)){n();break}}}}),l=In({callback:n});return kt(()=>{n(),e?(l?.observe(e),s?.observe(document.body,{childList:!0,subtree:!0})):(l?.disconnect(),s?.disconnect())},[e]),o}function oh(e){let t=Vs(e);return ju(e,t)}var Uu=[];function rh(e){let t=(0,D.useRef)(e),a=No(o=>e?o&&o!==Uu&&e&&t.current&&e.parentNode===t.current.parentNode?o:qr(e):Uu,[e]);return(0,D.useEffect)(()=>{t.current=e},[e]),a}function nh(e){let[t,a]=(0,D.useState)(null),o=(0,D.useRef)(e),r=(0,D.useCallback)(n=>{let s=Os(n.target);s&&a(l=>l?(l.set(s,qs(s)),new Map(l)):null)},[]);return(0,D.useEffect)(()=>{let n=o.current;if(e!==n){s(n);let l=e.map(i=>{let u=Os(i);return u?(u.addEventListener("scroll",r,{passive:!0}),[u,qs(u)]):null}).filter(i=>i!=null);a(l.length?new Map(l):null),o.current=e}return()=>{s(e),s(n)};function s(l){l.forEach(i=>{let u=Os(i);u?.removeEventListener("scroll",r)})}},[r,e]),(0,D.useMemo)(()=>e.length?t?Array.from(t.values()).reduce((n,s)=>$a(n,s),Ut):ad(e):Ut,[e,t])}function zu(e,t){t===void 0&&(t=[]);let a=(0,D.useRef)(null);return(0,D.useEffect)(()=>{a.current=null},t),(0,D.useEffect)(()=>{let o=e!==Ut;o&&!a.current&&(a.current=e),!o&&a.current&&(a.current=null)},[e]),a.current?ja(e,a.current):Ut}function sh(e){(0,D.useEffect)(()=>{if(!kr)return;let t=e.map(a=>{let{sensor:o}=a;return o.setup==null?void 0:o.setup()});return()=>{for(let a of t)a?.()}},e.map(t=>{let{sensor:a}=t;return a}))}function lh(e,t){return(0,D.useMemo)(()=>e.reduce((a,o)=>{let{eventName:r,handler:n}=o;return a[r]=s=>{n(s,t)},a},{}),[e,t])}function nd(e){return(0,D.useMemo)(()=>e?Og(e):null,[e])}var Wu=[];function ih(e,t){t===void 0&&(t=to);let[a]=e,o=nd(a?lt(a):null),[r,n]=(0,D.useState)(Wu);function s(){n(()=>e.length?e.map(i=>ed(i)?o:new Tr(t(i),i)):Wu)}let l=In({callback:s});return kt(()=>{l?.disconnect(),s(),e.forEach(i=>l?.observe(i))},[e]),r}function sd(e){if(!e)return null;if(e.children.length>1)return e;let t=e.children[0];return Bo(t)?t:e}function uh(e){let{measure:t}=e,[a,o]=(0,D.useState)(null),r=(0,D.useCallback)(u=>{for(let{target:c}of u)if(Bo(c)){o(d=>{let f=t(c);return d?{...d,width:f.width,height:f.height}:f});break}},[t]),n=In({callback:r}),s=(0,D.useCallback)(u=>{let c=sd(u);n?.disconnect(),c&&n?.observe(c),o(c?t(c):null)},[t,n]),[l,i]=Pr(s);return(0,D.useMemo)(()=>({nodeRef:l,rect:a,setRef:i}),[a,l,i])}var dh=[{sensor:_o,options:{}},{sensor:Aa,options:{}}],ch={current:{}},xn={draggable:{measure:Bu},droppable:{measure:Bu,strategy:Fr.WhileDragging,frequency:Hs.Optimized},dragOverlay:{measure:to}},Qa=class extends Map{get(t){var a;return t!=null&&(a=super.get(t))!=null?a:void 0}toArray(){return Array.from(this.values())}getEnabled(){return this.toArray().filter(t=>{let{disabled:a}=t;return!a})}getNodeFor(t){var a,o;return(a=(o=this.get(t))==null?void 0:o.node.current)!=null?a:void 0}},fh={activatorEvent:null,active:null,activeNode:null,activeNodeRect:null,collisions:null,containerNodeRect:null,draggableNodes:new Map,droppableRects:new Map,droppableContainers:new Qa,over:null,dragOverlay:{nodeRef:{current:null},rect:null,setRef:Ln},scrollableAncestors:[],scrollableAncestorRects:[],measuringConfiguration:xn,measureDroppableContainers:Ln,windowRect:null,measuringScheduled:!1},ld={activatorEvent:null,activators:[],active:null,activeNodeRect:null,ariaDescribedById:{draggable:""},dispatch:Ln,draggableNodes:new Map,over:null,measureDroppableContainers:Ln},_r=(0,D.createContext)(ld),id=(0,D.createContext)(fh);function ph(){return{draggable:{active:null,initialCoordinates:{x:0,y:0},nodes:new Map,translate:{x:0,y:0}},droppable:{containers:new Qa}}}function mh(e,t){switch(t.type){case Ve.DragStart:return{...e,draggable:{...e.draggable,initialCoordinates:t.initialCoordinates,active:t.active}};case Ve.DragMove:return e.draggable.active==null?e:{...e,draggable:{...e.draggable,translate:{x:t.coordinates.x-e.draggable.initialCoordinates.x,y:t.coordinates.y-e.draggable.initialCoordinates.y}}};case Ve.DragEnd:case Ve.DragCancel:return{...e,draggable:{...e.draggable,active:null,initialCoordinates:{x:0,y:0},translate:{x:0,y:0}}};case Ve.RegisterDroppable:{let{element:a}=t,{id:o}=a,r=new Qa(e.droppable.containers);return r.set(o,a),{...e,droppable:{...e.droppable,containers:r}}}case Ve.SetDroppableDisabled:{let{id:a,key:o,disabled:r}=t,n=e.droppable.containers.get(a);if(!n||o!==n.key)return e;let s=new Qa(e.droppable.containers);return s.set(a,{...n,disabled:r}),{...e,droppable:{...e.droppable,containers:s}}}case Ve.UnregisterDroppable:{let{id:a,key:o}=t,r=e.droppable.containers.get(a);if(!r||o!==r.key)return e;let n=new Qa(e.droppable.containers);return n.delete(a),{...e,droppable:{...e.droppable,containers:n}}}default:return e}}function gh(e){let{disabled:t}=e,{active:a,activatorEvent:o,draggableNodes:r}=(0,D.useContext)(_r),n=Dr(o),s=Dr(a?.id);return(0,D.useEffect)(()=>{if(!t&&!o&&n&&s!=null){if(!qo(n)||document.activeElement===n.target)return;let l=r.get(s);if(!l)return;let{activatorNode:i,node:u}=l;if(!i.current&&!u.current)return;requestAnimationFrame(()=>{for(let c of[i.current,u.current]){if(!c)continue;let d=Mu(c);if(d){d.focus();break}}})}},[o,t,r,s,n]),null}function ud(e,t){let{transform:a,...o}=t;return e!=null&&e.length?e.reduce((r,n)=>n({transform:r,...o}),a):a}function hh(e){return(0,D.useMemo)(()=>({draggable:{...xn.draggable,...e?.draggable},droppable:{...xn.droppable,...e?.droppable},dragOverlay:{...xn.dragOverlay,...e?.dragOverlay}}),[e?.draggable,e?.droppable,e?.dragOverlay])}function xh(e){let{activeNode:t,measure:a,initialRect:o,config:r=!0}=e,n=(0,D.useRef)(!1),{x:s,y:l}=typeof r=="boolean"?{x:r,y:r}:r;kt(()=>{if(!s&&!l||!t){n.current=!1;return}if(n.current||!o)return;let u=t?.node.current;if(!u||u.isConnected===!1)return;let c=a(u),d=ju(c,o);if(s||(d.x=0),l||(d.y=0),n.current=!0,Math.abs(d.x)>0||Math.abs(d.y)>0){let f=Zu(u);f&&f.scrollBy({top:d.y,left:d.x})}},[t,s,l,o,a])}var wn=(0,D.createContext)({...Ut,scaleX:1,scaleY:1}),Ma;(function(e){e[e.Uninitialized=0]="Uninitialized",e[e.Initializing=1]="Initializing",e[e.Initialized=2]="Initialized"})(Ma||(Ma={}));var Sn=(0,D.memo)(function(t){var a,o,r,n;let{id:s,accessibility:l,autoScroll:i=!0,children:u,sensors:c=dh,collisionDetection:d=Ws,measuring:f,modifiers:p,...h}=t,g=(0,D.useReducer)(mh,void 0,ph),[m,b]=g,[x,L]=vg(),[C,S]=(0,D.useState)(Ma.Uninitialized),v=C===Ma.Initialized,{draggable:{active:y,nodes:w,translate:E},droppable:{containers:I}}=m,R=y!=null?w.get(y):null,M=(0,D.useRef)({initial:null,translated:null}),q=(0,D.useMemo)(()=>{var nt;return y!=null?{id:y,data:(nt=R?.data)!=null?nt:ch,rect:M}:null},[y,R]),A=(0,D.useRef)(null),[W,K]=(0,D.useState)(null),[P,_]=(0,D.useState)(null),O=Fo(h,Object.values(h)),B=Xa("DndDescribedBy",s),F=(0,D.useMemo)(()=>I.getEnabled(),[I]),j=hh(f),{droppableRects:re,measureDroppableContainers:ge,measuringScheduled:be}=Qg(F,{dragging:v,dependencies:[E.x,E.y],config:j.droppable}),G=Zg(w,y),xe=(0,D.useMemo)(()=>P?Mr(P):null,[P]),Ie=lg(),Ce=eh(G,j.draggable.measure);xh({activeNode:y!=null?w.get(y):null,config:Ie.layoutShiftCompensation,initialRect:Ce,measure:j.draggable.measure});let z=Hu(G,j.draggable.measure,Ce),oe=Hu(G?G.parentElement:null),ue=(0,D.useRef)({activatorEvent:null,active:null,activeNode:G,collisionRect:null,collisions:null,droppableRects:re,draggableNodes:w,draggingNode:null,draggingNodeRect:null,droppableContainers:I,over:null,scrollableAncestors:[],scrollAdjustedTranslate:null}),ee=I.getNodeFor((a=ue.current.over)==null?void 0:a.id),te=uh({measure:j.dragOverlay.measure}),Y=(o=te.nodeRef.current)!=null?o:G,k=v?(r=te.rect)!=null?r:z:null,H=!!(te.nodeRef.current&&te.rect),V=oh(H?null:z),T=nd(Y?lt(Y):null),$=rh(v?ee??G:null),Me=ih($),Ae=ud(p,{transform:{x:E.x-V.x,y:E.y-V.y,scaleX:1,scaleY:1},activatorEvent:P,active:q,activeNodeRect:z,containerNodeRect:oe,draggingNodeRect:k,over:ue.current.over,overlayNodeRect:te.rect,scrollableAncestors:$,scrollableAncestorRects:Me,windowRect:T}),ct=xe?$a(xe,E):null,Ao=nh($),ia=zu(Ao),Fi=zu(Ao,[z]),vt=$a(Ae,ia),ua=k?Ag(k,Ae):null,ur=q&&ua?d({active:q,collisionRect:ua,droppableRects:re,droppableContainers:F,pointerCoordinates:ct}):null,Ni=Nr(ur,"id"),[va,qi]=(0,D.useState)(null),ag=H?Ae:$a(Ae,Fi),og=Dg(ag,(n=va?.rect)!=null?n:null,z),Ps=(0,D.useRef)(null),_i=(0,D.useCallback)((nt,It)=>{let{sensor:wt,options:Ia}=It;if(A.current==null)return;let Ot=w.get(A.current);if(!Ot)return;let St=nt.nativeEvent,Zt=new wt({active:A.current,activeNode:Ot,event:St,options:Ia,context:ue,onAbort(et){if(!w.get(et))return;let{onDragAbort:Jt}=O.current,da={id:et};Jt?.(da),x({type:"onDragAbort",event:da})},onPending(et,wa,Jt,da){if(!w.get(et))return;let{onDragPending:cr}=O.current,Sa={id:et,constraint:wa,initialCoordinates:Jt,offset:da};cr?.(Sa),x({type:"onDragPending",event:Sa})},onStart(et){let wa=A.current;if(wa==null)return;let Jt=w.get(wa);if(!Jt)return;let{onDragStart:da}=O.current,dr={activatorEvent:St,active:{id:wa,data:Jt.data,rect:M}};(0,Za.unstable_batchedUpdates)(()=>{da?.(dr),S(Ma.Initializing),b({type:Ve.DragStart,initialCoordinates:et,active:wa}),x({type:"onDragStart",event:dr}),K(Ps.current),_(St)})},onMove(et){b({type:Ve.DragMove,coordinates:et})},onEnd:To(Ve.DragEnd),onCancel:To(Ve.DragCancel)});Ps.current=Zt;function To(et){return async function(){let{active:Jt,collisions:da,over:dr,scrollAdjustedTranslate:cr}=ue.current,Sa=null;if(Jt&&cr){let{cancelDrop:fr}=O.current;Sa={activatorEvent:St,active:Jt,collisions:da,delta:cr,over:dr},et===Ve.DragEnd&&typeof fr=="function"&&await Promise.resolve(fr(Sa))&&(et=Ve.DragCancel)}A.current=null,(0,Za.unstable_batchedUpdates)(()=>{b({type:et}),S(Ma.Uninitialized),qi(null),K(null),_(null),Ps.current=null;let fr=et===Ve.DragEnd?"onDragEnd":"onDragCancel";if(Sa){let Ds=O.current[fr];Ds?.(Sa),x({type:fr,event:Sa})}})}}},[w]),rg=(0,D.useCallback)((nt,It)=>(wt,Ia)=>{let Ot=wt.nativeEvent,St=w.get(Ia);if(A.current!==null||!St||Ot.dndKit||Ot.defaultPrevented)return;let Zt={active:St};nt(wt,It.options,Zt)===!0&&(Ot.dndKit={capturedBy:It.sensor},A.current=Ia,_i(wt,It))},[w,_i]),Hi=Jg(c,rg);sh(c),kt(()=>{z&&C===Ma.Initializing&&S(Ma.Initialized)},[z,C]),(0,D.useEffect)(()=>{let{onDragMove:nt}=O.current,{active:It,activatorEvent:wt,collisions:Ia,over:Ot}=ue.current;if(!It||!wt)return;let St={active:It,activatorEvent:wt,collisions:Ia,delta:{x:vt.x,y:vt.y},over:Ot};(0,Za.unstable_batchedUpdates)(()=>{nt?.(St),x({type:"onDragMove",event:St})})},[vt.x,vt.y]),(0,D.useEffect)(()=>{let{active:nt,activatorEvent:It,collisions:wt,droppableContainers:Ia,scrollAdjustedTranslate:Ot}=ue.current;if(!nt||A.current==null||!It||!Ot)return;let{onDragOver:St}=O.current,Zt=Ia.get(Ni),To=Zt&&Zt.rect.current?{id:Zt.id,rect:Zt.rect.current,data:Zt.data,disabled:Zt.disabled}:null,et={active:nt,activatorEvent:It,collisions:wt,delta:{x:Ot.x,y:Ot.y},over:To};(0,Za.unstable_batchedUpdates)(()=>{qi(To),St?.(et),x({type:"onDragOver",event:et})})},[Ni]),kt(()=>{ue.current={activatorEvent:P,active:q,activeNode:G,collisionRect:ua,collisions:ur,droppableRects:re,draggableNodes:w,draggingNode:Y,draggingNodeRect:k,droppableContainers:I,over:va,scrollableAncestors:$,scrollAdjustedTranslate:vt},M.current={initial:k,translated:ua}},[q,G,ur,ua,w,Y,k,re,I,va,$,vt]),$g({...Ie,delta:E,draggingRect:ua,pointerCoordinates:ct,scrollableAncestors:$,scrollableAncestorRects:Me});let ng=(0,D.useMemo)(()=>({active:q,activeNode:G,activeNodeRect:z,activatorEvent:P,collisions:ur,containerNodeRect:oe,dragOverlay:te,draggableNodes:w,droppableContainers:I,droppableRects:re,over:va,measureDroppableContainers:ge,scrollableAncestors:$,scrollableAncestorRects:Me,measuringConfiguration:j,measuringScheduled:be,windowRect:T}),[q,G,z,P,ur,oe,te,w,I,re,va,ge,$,Me,j,be,T]),sg=(0,D.useMemo)(()=>({activatorEvent:P,activators:Hi,active:q,activeNodeRect:z,ariaDescribedById:{draggable:B},dispatch:b,draggableNodes:w,over:va,measureDroppableContainers:ge}),[P,Hi,q,z,b,B,w,va,ge]);return D.default.createElement(Ku.Provider,{value:L},D.default.createElement(_r.Provider,{value:sg},D.default.createElement(id.Provider,{value:ng},D.default.createElement(wn.Provider,{value:og},u)),D.default.createElement(gh,{disabled:l?.restoreFocus===!1})),D.default.createElement(Sg,{...l,hiddenTextDescribedById:B}));function lg(){let nt=W?.autoScrollEnabled===!1,It=typeof i=="object"?i.enabled===!1:i===!1,wt=v&&!nt&&!It;return typeof i=="object"?{...i,enabled:wt}:{enabled:wt}}}),Lh=(0,D.createContext)(null),Vu="button",bh="Draggable";function dd(e){let{id:t,data:a,disabled:o=!1,attributes:r}=e,n=Xa(bh),{activators:s,activatorEvent:l,active:i,activeNodeRect:u,ariaDescribedById:c,draggableNodes:d,over:f}=(0,D.useContext)(_r),{role:p=Vu,roleDescription:h="draggable",tabIndex:g=0}=r??{},m=i?.id===t,b=(0,D.useContext)(m?wn:Lh),[x,L]=Pr(),[C,S]=Pr(),v=lh(s,t),y=Fo(a);kt(()=>(d.set(t,{id:t,key:n,node:x,activatorNode:C,data:y}),()=>{let E=d.get(t);E&&E.key===n&&d.delete(t)}),[d,t]);let w=(0,D.useMemo)(()=>({role:p,tabIndex:g,"aria-disabled":o,"aria-pressed":m&&p===Vu?!0:void 0,"aria-roledescription":h,"aria-describedby":c.draggable}),[o,p,g,m,h,c.draggable]);return{active:i,activatorEvent:l,activeNodeRect:u,attributes:w,isDragging:m,listeners:o?void 0:v,node:x,over:f,setNodeRef:L,setActivatorNodeRef:S,transform:b}}function Hr(){return(0,D.useContext)(id)}var Ch="Droppable",vh={timeout:25};function yn(e){let{data:t,disabled:a=!1,id:o,resizeObserverConfig:r}=e,n=Xa(Ch),{active:s,dispatch:l,over:i,measureDroppableContainers:u}=(0,D.useContext)(_r),c=(0,D.useRef)({disabled:a}),d=(0,D.useRef)(!1),f=(0,D.useRef)(null),p=(0,D.useRef)(null),{disabled:h,updateMeasurementsFor:g,timeout:m}={...vh,...r},b=Fo(g??o),x=(0,D.useCallback)(()=>{if(!d.current){d.current=!0;return}p.current!=null&&clearTimeout(p.current),p.current=setTimeout(()=>{u(Array.isArray(b.current)?b.current:[b.current]),p.current=null},m)},[m]),L=In({callback:x,disabled:h||!s}),C=(0,D.useCallback)((w,E)=>{L&&(E&&(L.unobserve(E),d.current=!1),w&&L.observe(w))},[L]),[S,v]=Pr(C),y=Fo(t);return(0,D.useEffect)(()=>{!L||!S.current||(L.disconnect(),d.current=!1,L.observe(S.current))},[S,L]),(0,D.useEffect)(()=>(l({type:Ve.RegisterDroppable,element:{id:o,key:n,disabled:a,node:S,rect:f,data:y}}),()=>l({type:Ve.UnregisterDroppable,key:n,id:o})),[o]),(0,D.useEffect)(()=>{a!==c.current.disabled&&(l({type:Ve.SetDroppableDisabled,id:o,key:n,disabled:a}),c.current.disabled=a)},[o,n,a,l]),{active:s,rect:f,isOver:i?.id===o,node:S,over:i,setNodeRef:v}}function Ih(e){let{animation:t,children:a}=e,[o,r]=(0,D.useState)(null),[n,s]=(0,D.useState)(null),l=Dr(a);return!a&&!o&&l&&r(l),kt(()=>{if(!n)return;let i=o?.key,u=o?.props.id;if(i==null||u==null){r(null);return}Promise.resolve(t(u,n)).then(()=>{r(null)})},[t,o,n]),D.default.createElement(D.default.Fragment,null,a,o?(0,D.cloneElement)(o,{ref:s}):null)}var wh={x:0,y:0,scaleX:1,scaleY:1};function Sh(e){let{children:t}=e;return D.default.createElement(_r.Provider,{value:ld},D.default.createElement(wn.Provider,{value:wh},t))}var yh={position:"fixed",touchAction:"none"},kh=e=>qo(e)?"transform 250ms ease":void 0,Rh=(0,D.forwardRef)((e,t)=>{let{as:a,activatorEvent:o,adjustScale:r,children:n,className:s,rect:l,style:i,transform:u,transition:c=kh}=e;if(!l)return null;let d=r?u:{...u,scaleX:1,scaleY:1},f={...yh,width:l.width,height:l.height,top:l.top,left:l.left,transform:yt.Transform.toString(d),transformOrigin:r&&o?yg(o,l):void 0,transition:typeof c=="function"?c(o):c,...i};return D.default.createElement(a,{className:s,style:f,ref:t},n)}),Ph=e=>t=>{let{active:a,dragOverlay:o}=t,r={},{styles:n,className:s}=e;if(n!=null&&n.active)for(let[l,i]of Object.entries(n.active))i!==void 0&&(r[l]=a.node.style.getPropertyValue(l),a.node.style.setProperty(l,i));if(n!=null&&n.dragOverlay)for(let[l,i]of Object.entries(n.dragOverlay))i!==void 0&&o.node.style.setProperty(l,i);return s!=null&&s.active&&a.node.classList.add(s.active),s!=null&&s.dragOverlay&&o.node.classList.add(s.dragOverlay),function(){for(let[i,u]of Object.entries(r))a.node.style.setProperty(i,u);s!=null&&s.active&&a.node.classList.remove(s.active)}},Dh=e=>{let{transform:{initial:t,final:a}}=e;return[{transform:yt.Transform.toString(t)},{transform:yt.Transform.toString(a)}]},Mh={duration:250,easing:"ease",keyframes:Dh,sideEffects:Ph({styles:{active:{opacity:"0"}}})};function Ah(e){let{config:t,draggableNodes:a,droppableContainers:o,measuringConfiguration:r}=e;return Rr((n,s)=>{if(t===null)return;let l=a.get(n);if(!l)return;let i=l.node.current;if(!i)return;let u=sd(s);if(!u)return;let{transform:c}=lt(s).getComputedStyle(s),d=Yu(c);if(!d)return;let f=typeof t=="function"?t:Th(t);return od(i,r.draggable.measure),f({active:{id:n,data:l.data,node:i,rect:r.draggable.measure(i)},draggableNodes:a,dragOverlay:{node:s,rect:r.dragOverlay.measure(u)},droppableContainers:o,measuringConfiguration:r,transform:d})})}function Th(e){let{duration:t,easing:a,sideEffects:o,keyframes:r}={...Mh,...e};return n=>{let{active:s,dragOverlay:l,transform:i,...u}=n;if(!t)return;let c={x:l.rect.left-s.rect.left,y:l.rect.top-s.rect.top},d={scaleX:i.scaleX!==1?s.rect.width*i.scaleX/l.rect.width:1,scaleY:i.scaleY!==1?s.rect.height*i.scaleY/l.rect.height:1},f={x:i.x-c.x,y:i.y-c.y,...d},p=r({...u,active:s,dragOverlay:l,transform:{initial:i,final:f}}),[h]=p,g=p[p.length-1];if(JSON.stringify(h)===JSON.stringify(g))return;let m=o?.({active:s,dragOverlay:l,...u}),b=l.node.animate(p,{duration:t,easing:a,fill:"forwards"});return new Promise(x=>{b.onfinish=()=>{m?.(),x()}})}}var Gu=0;function Eh(e){return(0,D.useMemo)(()=>{if(e!=null)return Gu++,Gu},[e])}var cd=D.default.memo(e=>{let{adjustScale:t=!1,children:a,dropAnimation:o,style:r,transition:n,modifiers:s,wrapperElement:l="div",className:i,zIndex:u=999}=e,{activatorEvent:c,active:d,activeNodeRect:f,containerNodeRect:p,draggableNodes:h,droppableContainers:g,dragOverlay:m,over:b,measuringConfiguration:x,scrollableAncestors:L,scrollableAncestorRects:C,windowRect:S}=Hr(),v=(0,D.useContext)(wn),y=Eh(d?.id),w=ud(s,{activatorEvent:c,active:d,activeNodeRect:f,containerNodeRect:p,draggingNodeRect:m.rect,over:b,overlayNodeRect:m.rect,scrollableAncestors:L,scrollableAncestorRects:C,transform:v,windowRect:S}),E=Vs(f),I=Ah({config:o,draggableNodes:h,droppableContainers:g,measuringConfiguration:x}),R=E?m.setRef:void 0;return D.default.createElement(Sh,null,D.default.createElement(Ih,{animation:I},d&&y?D.default.createElement(Rh,{key:y,id:d.id,ref:R,as:l,activatorEvent:c,adjustScale:t,className:i,transition:n,rect:E,style:{zIndex:u,...r},transform:w},a):null))});var qe=Z(require("react"));function fd(e,t,a){let o=e.slice();return o.splice(a<0?o.length+a:a,0,o.splice(t,1)[0]),o}function Oh(e,t){return e.reduce((a,o,r)=>{let n=t.get(o);return n&&(a[r]=n),a},Array(e.length))}function kn(e){return e!==null&&e>=0}function Bh(e,t){if(e===t)return!0;if(e.length!==t.length)return!1;for(let a=0;a<e.length;a++)if(e[a]!==t[a])return!1;return!0}function Fh(e){return typeof e=="boolean"?{draggable:e,droppable:e}:e}var pd=e=>{let{rects:t,activeIndex:a,overIndex:o,index:r}=e,n=fd(t,o,a),s=t[r],l=n[r];return!l||!s?null:{x:l.left-s.left,y:l.top-s.top,scaleX:l.width/s.width,scaleY:l.height/s.height}};var Rn={scaleX:1,scaleY:1},Dn=e=>{var t;let{activeIndex:a,activeNodeRect:o,index:r,rects:n,overIndex:s}=e,l=(t=n[a])!=null?t:o;if(!l)return null;if(r===a){let u=n[s];return u?{x:0,y:a<s?u.top+u.height-(l.top+l.height):u.top-l.top,...Rn}:null}let i=Nh(n,r,a);return r>a&&r<=s?{x:0,y:-l.height-i,...Rn}:r<a&&r>=s?{x:0,y:l.height+i,...Rn}:{x:0,y:0,...Rn}};function Nh(e,t,a){let o=e[t],r=e[t-1],n=e[t+1];return o?a<t?r?o.top-(r.top+r.height):n?n.top-(o.top+o.height):0:n?n.top-(o.top+o.height):r?o.top-(r.top+r.height):0:0}var md="Sortable",gd=qe.default.createContext({activeIndex:-1,containerId:md,disableTransforms:!1,items:[],overIndex:-1,useDragOverlay:!1,sortedRects:[],strategy:pd,disabled:{draggable:!1,droppable:!1}});function Mn(e){let{children:t,id:a,items:o,strategy:r=pd,disabled:n=!1}=e,{active:s,dragOverlay:l,droppableRects:i,over:u,measureDroppableContainers:c}=Hr(),d=Xa(md,a),f=l.rect!==null,p=(0,qe.useMemo)(()=>o.map(v=>typeof v=="object"&&"id"in v?v.id:v),[o]),h=s!=null,g=s?p.indexOf(s.id):-1,m=u?p.indexOf(u.id):-1,b=(0,qe.useRef)(p),x=!Bh(p,b.current),L=m!==-1&&g===-1||x,C=Fh(n);kt(()=>{x&&h&&c(p)},[x,p,h,c]),(0,qe.useEffect)(()=>{b.current=p},[p]);let S=(0,qe.useMemo)(()=>({activeIndex:g,containerId:d,disabled:C,disableTransforms:L,items:p,overIndex:m,useDragOverlay:f,sortedRects:Oh(p,i),strategy:r}),[g,d,C.draggable,C.droppable,L,p,m,i,f,r]);return qe.default.createElement(gd.Provider,{value:S},t)}var qh=e=>{let{id:t,items:a,activeIndex:o,overIndex:r}=e;return fd(a,o,r).indexOf(t)},_h=e=>{let{containerId:t,isSorting:a,wasDragging:o,index:r,items:n,newIndex:s,previousItems:l,previousContainerId:i,transition:u}=e;return!u||!o||l!==n&&r===s?!1:a?!0:s!==r&&t===i},Hh={duration:200,easing:"ease"},hd="transform",Uh=yt.Transition.toString({property:hd,duration:0,easing:"linear"}),zh={roleDescription:"sortable"};function Wh(e){let{disabled:t,index:a,node:o,rect:r}=e,[n,s]=(0,qe.useState)(null),l=(0,qe.useRef)(a);return kt(()=>{if(!t&&a!==l.current&&o.current){let i=r.current;if(i){let u=to(o.current,{ignoreTransform:!0}),c={x:i.left-u.left,y:i.top-u.top,scaleX:i.width/u.width,scaleY:i.height/u.height};(c.x||c.y)&&s(c)}}a!==l.current&&(l.current=a)},[t,a,o,r]),(0,qe.useEffect)(()=>{n&&s(null)},[n]),n}function An(e){let{animateLayoutChanges:t=_h,attributes:a,disabled:o,data:r,getNewIndex:n=qh,id:s,strategy:l,resizeObserverConfig:i,transition:u=Hh}=e,{items:c,containerId:d,activeIndex:f,disabled:p,disableTransforms:h,sortedRects:g,overIndex:m,useDragOverlay:b,strategy:x}=(0,qe.useContext)(gd),L=Vh(o,p),C=c.indexOf(s),S=(0,qe.useMemo)(()=>({sortable:{containerId:d,index:C,items:c},...r}),[d,r,C,c]),v=(0,qe.useMemo)(()=>c.slice(c.indexOf(s)),[c,s]),{rect:y,node:w,isOver:E,setNodeRef:I}=yn({id:s,data:S,disabled:L.droppable,resizeObserverConfig:{updateMeasurementsFor:v,...i}}),{active:R,activatorEvent:M,activeNodeRect:q,attributes:A,setNodeRef:W,listeners:K,isDragging:P,over:_,setActivatorNodeRef:O,transform:B}=dd({id:s,data:S,attributes:{...zh,...a},disabled:L.draggable}),F=Ru(I,W),j=!!R,re=j&&!h&&kn(f)&&kn(m),ge=!b&&P,be=ge&&re?B:null,xe=re?be??(l??x)({rects:g,activeNodeRect:q,activeIndex:f,overIndex:m,index:C}):null,Ie=kn(f)&&kn(m)?n({id:s,items:c,activeIndex:f,overIndex:m}):C,Ce=R?.id,z=(0,qe.useRef)({activeId:Ce,items:c,newIndex:Ie,containerId:d}),oe=c!==z.current.items,ue=t({active:R,containerId:d,isDragging:P,isSorting:j,id:s,index:C,items:c,newIndex:z.current.newIndex,previousItems:z.current.items,previousContainerId:z.current.containerId,transition:u,wasDragging:z.current.activeId!=null}),ee=Wh({disabled:!ue,index:C,node:w,rect:y});return(0,qe.useEffect)(()=>{j&&z.current.newIndex!==Ie&&(z.current.newIndex=Ie),d!==z.current.containerId&&(z.current.containerId=d),c!==z.current.items&&(z.current.items=c)},[j,Ie,d,c]),(0,qe.useEffect)(()=>{if(Ce===z.current.activeId)return;if(Ce!=null&&z.current.activeId==null){z.current.activeId=Ce;return}let Y=setTimeout(()=>{z.current.activeId=Ce},50);return()=>clearTimeout(Y)},[Ce]),{active:R,activeIndex:f,attributes:A,data:S,rect:y,index:C,newIndex:Ie,items:c,isOver:E,isSorting:j,isDragging:P,listeners:K,node:w,overIndex:m,over:_,setNodeRef:F,setActivatorNodeRef:O,setDroppableNodeRef:I,setDraggableNodeRef:W,transform:ee??xe,transition:te()};function te(){if(ee||oe&&z.current.newIndex===C)return Uh;if(!(ge&&!qo(M)||!u)&&(j||ue))return yt.Transition.toString({...u,property:hd})}}function Vh(e,t){var a,o;return typeof e=="boolean"?{draggable:e,droppable:!1}:{draggable:(a=e?.draggable)!=null?a:t.draggable,droppable:(o=e?.droppable)!=null?o:t.droppable}}function Pn(e){if(!e)return!1;let t=e.data.current;return!!(t&&"sortable"in t&&typeof t.sortable=="object"&&"containerId"in t.sortable&&"items"in t.sortable&&"index"in t.sortable)}var Gh=[pe.Down,pe.Right,pe.Up,pe.Left],Tn=(e,t)=>{let{context:{active:a,collisionRect:o,droppableRects:r,droppableContainers:n,over:s,scrollableAncestors:l}}=t;if(Gh.includes(e.code)){if(e.preventDefault(),!a||!o)return;let i=[];n.getEnabled().forEach(d=>{if(!d||d!=null&&d.disabled)return;let f=r.get(d.id);if(f)switch(e.code){case pe.Down:o.top<f.top&&i.push(d);break;case pe.Up:o.top>f.top&&i.push(d);break;case pe.Left:o.left>f.left&&i.push(d);break;case pe.Right:o.left<f.left&&i.push(d);break}});let u=vn({active:a,collisionRect:o,droppableRects:r,droppableContainers:i,pointerCoordinates:null}),c=Nr(u,"id");if(c===s?.id&&u.length>1&&(c=u[1].id),c!=null){let d=n.get(a.id),f=n.get(c),p=f?r.get(f.id):null,h=f?.node.current;if(h&&p&&d&&f){let m=qr(h).some((v,y)=>l[y]!==v),b=xd(d,f),x=Kh(d,f),L=m||!b?{x:0,y:0}:{x:x?o.width-p.width:0,y:x?o.height-p.height:0},C={x:p.left,y:p.top};return L.x&&L.y?C:ja(C,L)}}}};function xd(e,t){return!Pn(e)||!Pn(t)?!1:e.data.current.sortable.containerId===t.data.current.sortable.containerId}function Kh(e,t){return!Pn(e)||!Pn(t)||!xd(e,t)?!1:e.data.current.sortable.index<t.data.current.sortable.index}var ke=require("react");var $p=require("@deepseek-ai/dsh-client-ui-primitives");var Md=Z(require("react"),1);var at=Z(require("react"),1);var Ld=Z(require("react"),1),Xh=Object.defineProperty,Ks=(e,t)=>Xh(e,"name",{value:t,configurable:!0});function Gs(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}Ks(Gs,"setRef");function bd(...e){return t=>{let a=!1,o=e.map(r=>{let n=Gs(r,t);return!a&&typeof n=="function"&&(a=!0),n});if(a)return()=>{for(let r=0;r<o.length;r++){let n=o[r];typeof n=="function"?n():Gs(e[r],null)}}}}Ks(bd,"composeRefs");function ce(...e){return Ld.useCallback(bd(...e),e)}Ks(ce,"useComposedRefs");var $h=Object.defineProperty,Rt=(e,t)=>$h(e,"name",{value:t,configurable:!0});function it(e){let t=at.forwardRef((a,o)=>{let{children:r,...n}=a,s=null,l=!1,i=[];r=kd(r),at.Children.forEach(r,f=>{if(Sd(f)){l=!0;let p=f,h="child"in p.props?p.props.child:p.props.children;for(;Xs(h)&&typeof En=="function";)h=En(h._payload);s=Yh(p,h),i.push(s?.props?.children)}else i.push(f)}),s?s=at.cloneElement(s,void 0,i):!l&&at.Children.count(r)===1&&at.isValidElement(r)&&(s=r);let u=s?wd(s):void 0,c=ce(o,u);if(!s){if(r||r===0)throw new Error(l?Qh(e):Jh(e));return r}let d=Id(n,s.props??{});return s.type!==at.Fragment&&(d.ref=o?c:u),at.cloneElement(s,d)});return t.displayName=`${e}.Slot`,t}Rt(it,"createSlot");var Cd=it("Slot"),vd=Symbol.for("radix.slottable");function jh(e){let t=Rt(a=>"child"in a?a.children(a.child):a.children,"Slottable");return t.displayName=`${e}.Slottable`,t.__radixId=vd,t}Rt(jh,"createSlottable");var Yh=Rt((e,t)=>"child"in e.props?at.isValidElement(t)?at.cloneElement(t,void 0,e.props.children(t.props.children)):null:at.isValidElement(t)?t:null,"getSlottableElementFromSlottable");function Id(e,t){let a={...t};for(let o in t){let r=e[o],n=t[o];/^on[A-Z]/.test(o)?r&&n?a[o]=(...l)=>{let i=n(...l);return r(...l),i}:r&&(a[o]=r):o==="style"?a[o]={...r,...n}:o==="className"?a[o]=[r,n].filter(Boolean).join(" "):o==="aria-describedby"&&(a[o]=Rd(n,r))}return{...e,...a}}Rt(Id,"mergeProps");function wd(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,a=t&&"isReactWarning"in t&&t.isReactWarning;return a?e.ref:(t=Object.getOwnPropertyDescriptor(e,"ref")?.get,a=t&&"isReactWarning"in t&&t.isReactWarning,a?e.props.ref:e.props.ref||e.ref)}Rt(wd,"getElementRef");function Sd(e){return at.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===vd}Rt(Sd,"isSlottable");var Zh=Symbol.for("react.lazy");function Xs(e){return e!=null&&typeof e=="object"&&"$$typeof"in e&&e.$$typeof===Zh&&"_payload"in e&&yd(e._payload)}Rt(Xs,"isLazyComponent");function yd(e){return typeof e=="object"&&e!==null&&"then"in e}Rt(yd,"isPromiseLike");function kd(e){let t=e;for(;Xs(t)&&typeof En=="function";)t=En(t._payload);return t}Rt(kd,"useUnwrappedLazy");function Rd(...e){let t=new Set;for(let a of e)if(typeof a=="string")for(let o of String(a).trim().split(/\s+/))o&&t.add(o);return t.size>0?Array.from(t).join(" "):void 0}Rt(Rd,"concatAriaDescribedby");var Jh=Rt(e=>`${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`,"createSlotError"),Qh=Rt(e=>`${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`,"createSlottableError"),En=at[" use ".trim().toString()];function Pd(e){var t,a,o="";if(typeof e=="string"||typeof e=="number")o+=e;else if(typeof e=="object")if(Array.isArray(e)){var r=e.length;for(t=0;t<r;t++)e[t]&&(a=Pd(e[t]))&&(o&&(o+=" "),o+=a)}else for(a in e)e[a]&&(o&&(o+=" "),o+=a);return o}function Dd(){for(var e,t,a=0,o="",r=arguments.length;a<r;a++)(e=arguments[a])&&(t=Pd(e))&&(o&&(o+=" "),o+=t);return o}function de(...e){return Dd(e)}var Ad=require("react/jsx-runtime");function ex({variant:e="default",size:t="default",className:a}={}){let o=e??"default",r=t??"default";return de("kanban-button",`kanban-button--${o}`,`kanban-button--size-${r}`,a)}var ie=Md.forwardRef(({className:e,variant:t,size:a,asChild:o=!1,...r},n)=>(0,Ad.jsx)(o?Cd:"button",{className:ex({variant:t,size:a,className:e}),ref:n,...r}));ie.displayName="Button";var Zr=Z(require("react"),1);var Pe=Z(require("react"),1);var tx=Object.defineProperty,Ho=(e,t)=>tx(e,"name",{value:t,configurable:!0}),Td=!!(typeof window<"u"&&window.document&&window.document.createElement);function J(e,t,{checkForDefaultPrevented:a=!0}={}){return Ho(function(r){if(e?.(r),a===!1||!r||!r.defaultPrevented)return t?.(r)},"handleEvent")}Ho(J,"composeEventHandlers");function ax(e){if(!Td)throw new Error("Cannot access window outside of the DOM");return e?.ownerDocument?.defaultView??window}Ho(ax,"getOwnerWindow");function $s(e){if(!Td)throw new Error("Cannot access document outside of the DOM");return e?.ownerDocument??document}Ho($s,"getOwnerDocument");function Ed(e,t=!1){let{activeElement:a}=$s(e);if(!a?.nodeName)return null;if(Od(a)&&a.contentDocument)return Ed(a.contentDocument.body,t);if(t){let o=a.getAttribute("aria-activedescendant");if(o){let r=$s(a).getElementById(o);if(r)return r}}return a}Ho(Ed,"getActiveElement");function Od(e){return e.tagName==="IFRAME"}Ho(Od,"isFrame");var qt=Z(require("react"),1),js=require("react/jsx-runtime"),ox=Object.defineProperty,Nt=(e,t)=>ox(e,"name",{value:t,configurable:!0});function rx(e,t){let a=qt.createContext(t);a.displayName=e+"Context";let o=Nt(n=>{let{children:s,...l}=n,i=qt.useMemo(()=>l,Object.values(l));return(0,js.jsx)(a.Provider,{value:i,children:s})},"Provider");o.displayName=e+"Provider";function r(n,s={}){let{optional:l=!1}=s,i=qt.useContext(a);if(i)return i;if(t!==void 0)return t;if(!l)throw new Error(`\`${n}\` must be used within \`${e}\``)}return Nt(r,"useContext"),[o,r]}Nt(rx,"createContext");function ot(e,t=[]){let a=[];function o(n,s){let l=qt.createContext(s);l.displayName=n+"Context";let i=a.length;a=[...a,s];let u=Nt(d=>{let{scope:f,children:p,...h}=d,g=f?.[e]?.[i]||l,m=qt.useMemo(()=>h,Object.values(h));return(0,js.jsx)(g.Provider,{value:m,children:p})},"Provider");u.displayName=n+"Provider";function c(d,f,p={}){let{optional:h=!1}=p,g=f?.[e]?.[i]||l,m=qt.useContext(g);if(m)return m;if(s!==void 0)return s;if(!h)throw new Error(`\`${d}\` must be used within \`${n}\``)}return Nt(c,"useContext"),[u,c]}Nt(o,"createContext");let r=Nt(()=>{let n=a.map(s=>qt.createContext(s));return Nt(function(l){let i=l?.[e]||n;return qt.useMemo(()=>({[`__scope${e}`]:{...l,[e]:i}}),[l,i])},"useScope")},"createScope");return r.scopeName=e,[o,Bd(r,...t)]}Nt(ot,"createContextScope");function Bd(...e){let t=e[0];if(e.length===1)return t;let a=Nt(()=>{let o=e.map(r=>({useScope:r(),scopeName:r.scopeName}));return Nt(function(n){let s=o.reduce((l,{useScope:i,scopeName:u})=>{let d=i(n)[`__scope${u}`];return{...l,...d}},{});return qt.useMemo(()=>({[`__scope${t.scopeName}`]:s}),[s])},"useComposedScopes")},"createScope");return a.scopeName=t.scopeName,a}Nt(Bd,"composeContextScopes");var Ys=Z(require("react"),1);var Fd=Z(require("react"),1),he=globalThis?.document?Fd.useLayoutEffect:()=>{};var nx=Object.defineProperty,sx=(e,t)=>nx(e,"name",{value:t,configurable:!0}),lx=Ys[" useId ".trim().toString()]||(()=>{}),ix=0;function Pt(e){let[t,a]=Ys.useState(lx());return he(()=>{e||a(o=>o??String(ix++))},[e]),e||(t?`radix-${t}`:"")}sx(Pt,"useId");var _t=Z(require("react"),1);var On=!1;var zt=Z(require("react"),1);var Uo=Z(require("react"),1),ux=Object.defineProperty,dx=(e,t)=>ux(e,"name",{value:t,configurable:!0}),Nd=Uo[" useEffectEvent ".trim().toString()],qd=Uo[" useInsertionEffect ".trim().toString()];function Zs(e){if(typeof Nd=="function")return Nd(e);let t=Uo.useRef(()=>{throw new Error("Cannot call an event handler while rendering.")});return typeof qd=="function"?qd(()=>{t.current=e}):he(()=>{t.current=e}),Uo.useMemo(()=>((...a)=>t.current?.(...a)),[])}dx(Zs,"useEffectEvent");var cx=Object.defineProperty,Ur=(e,t)=>cx(e,"name",{value:t,configurable:!0}),fx=_t[" useInsertionEffect ".trim().toString()]||he;function ea({prop:e,defaultProp:t,onChange:a=Ur(()=>{},"onChange"),caller:o}){let[r,n,s]=Hd({defaultProp:t,onChange:a}),l=e!==void 0,i=l?e:r;if(On){let c=_t.useRef(e!==void 0);_t.useEffect(()=>{let d=c.current;d!==l&&console.warn(`${o} is changing from ${d?"controlled":"uncontrolled"} to ${l?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),c.current=l},[l,o])}let u=_t.useCallback(c=>{if(l){let d=Ud(c)?c(e):c;d!==e&&s.current?.(d)}else n(c)},[l,e,n,s]);return[i,u]}Ur(ea,"useControllableState");function Hd({defaultProp:e,onChange:t}){let[a,o]=_t.useState(e),r=_t.useRef(a),n=_t.useRef(t);return fx(()=>{n.current=t},[t]),_t.useEffect(()=>{r.current!==a&&(n.current?.(a),r.current=a)},[a,r]),[a,o,n]}Ur(Hd,"useUncontrolledState");function Ud(e){return typeof e=="function"}Ur(Ud,"isFunction");var _d=Symbol("RADIX:SYNC_STATE");function px(e,t,a,o){let{prop:r,defaultProp:n,onChange:s,caller:l}=t,i=r!==void 0,u=Zs(s);if(On){let m=zt.useRef(r!==void 0);zt.useEffect(()=>{let b=m.current;b!==i&&console.warn(`${l} is changing from ${b?"controlled":"uncontrolled"} to ${i?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),m.current=i},[i,l])}let c=[{...a,state:n}];o&&c.push(o);let[d,f]=zt.useReducer((m,b)=>{if(b.type===_d)return{...m,state:b.state};let x=e(m,b);return i&&!Object.is(x.state,m.state)&&u(x.state),x},...c),p=d.state,h=zt.useRef(p);zt.useEffect(()=>{h.current!==p&&(h.current=p,i||u(p))},[p,h,i]);let g=zt.useMemo(()=>r!==void 0?{...d,state:r}:d,[d,r]);return zt.useEffect(()=>{i&&!Object.is(r,d.state)&&f({type:_d,state:r})},[r,d.state,i]),[g,f]}Ur(px,"useControllableStateReducer");var ye=Z(require("react"),1);var zd=Z(require("react"),1),Wd=Z(require("react-dom"),1);var Vd=require("react/jsx-runtime"),mx=Object.defineProperty,gx=(e,t)=>mx(e,"name",{value:t,configurable:!0}),hx=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],fe=hx.reduce((e,t)=>{let a=it(`Primitive.${t}`),o=zd.forwardRef((r,n)=>{let{asChild:s,...l}=r,i=s?a:t;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),(0,Vd.jsx)(i,{...l,ref:n})});return o.displayName=`Primitive.${t}`,{...e,[t]:o}},{});function zr(e,t){e&&Wd.flushSync(()=>e.dispatchEvent(t))}gx(zr,"dispatchDiscreteCustomEvent");var Wr=Z(require("react"),1),xx=Object.defineProperty,Lx=(e,t)=>xx(e,"name",{value:t,configurable:!0}),Gd=Wr[" useInsertionEffect ".trim().toString()];function Ye(e){let t=Wr.useRef(e);return typeof Gd=="function"?Gd(()=>{t.current=e}):he(()=>{t.current=e}),Wr.useMemo(()=>((...a)=>t.current?.(...a)),[])}Lx(Ye,"useCallbackRef");var Xd=require("react/jsx-runtime"),bx=Object.defineProperty,Ze=(e,t)=>bx(e,"name",{value:t,configurable:!0}),Js="dismissableLayer.update",Cx="dismissableLayer.pointerDownOutside",vx="dismissableLayer.focusOutside",Kd,$d=ye.createContext({layers:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set,dismissableSurfaces:new Set}),zo=ye.forwardRef(Ze(function(t,a){let{disableOutsidePointerEvents:o=!1,deferPointerDownOutside:r=!1,onEscapeKeyDown:n,onPointerDownOutside:s,onFocusOutside:l,onInteractOutside:i,onDismiss:u,...c}=t,d=ye.useContext($d),[f,p]=ye.useState(null),h=f?.ownerDocument??globalThis?.document,[,g]=ye.useState({}),m=ce(a,p),b=Array.from(d.layers),[x]=[...d.layersWithOutsidePointerEventsDisabled].slice(-1),L=x?b.indexOf(x):-1,C=f?b.indexOf(f):-1,S=d.layersWithOutsidePointerEventsDisabled.size>0,v=C>=L,y=ye.useRef(!1),w=jd(M=>{s?.(M),i?.(M),M.defaultPrevented||u?.()},{ownerDocument:h,deferPointerDownOutside:r,isDeferredPointerDownOutsideRef:y,dismissableSurfaces:d.dismissableSurfaces,shouldHandlePointerDownOutside:ye.useCallback(M=>{if(!(M instanceof Node))return!1;let q=[...d.branches].some(A=>A.contains(M));return v&&!q},[d.branches,v])}),E=Yd(M=>{if(r&&y.current)return;let q=M.target;[...d.branches].some(W=>W.contains(q))||(l?.(M),i?.(M),M.defaultPrevented||u?.())},h),I=f?C===b.length-1:!1,R=Ye(M=>{M.key==="Escape"&&(n?.(M),!M.defaultPrevented&&u&&(M.preventDefault(),u()))});return ye.useEffect(()=>{if(I)return h.addEventListener("keydown",R,{capture:!0}),()=>h.removeEventListener("keydown",R,{capture:!0})},[h,I,R]),ye.useEffect(()=>{if(f)return o&&(d.layersWithOutsidePointerEventsDisabled.size===0&&(Kd=h.body.style.pointerEvents,h.body.style.pointerEvents="none"),d.layersWithOutsidePointerEventsDisabled.add(f)),d.layers.add(f),Qs(),()=>{o&&(d.layersWithOutsidePointerEventsDisabled.delete(f),d.layersWithOutsidePointerEventsDisabled.size===0&&(h.body.style.pointerEvents=Kd))}},[f,h,o,d]),ye.useEffect(()=>()=>{f&&(d.layers.delete(f),d.layersWithOutsidePointerEventsDisabled.delete(f),Qs())},[f,d]),ye.useEffect(()=>{let M=Ze(()=>g({}),"handleUpdate");return document.addEventListener(Js,M),()=>document.removeEventListener(Js,M)},[]),(0,Xd.jsx)(fe.div,{...c,ref:m,style:{pointerEvents:S?v?"auto":"none":void 0,...t.style},onFocusCapture:J(t.onFocusCapture,E.onFocusCapture),onBlurCapture:J(t.onBlurCapture,E.onBlurCapture),onPointerDownCapture:J(t.onPointerDownCapture,w.onPointerDownCapture)})},"DismissableLayer"));function el(){let e=ye.useContext($d),[t,a]=ye.useState(null);return ye.useEffect(()=>{if(t)return e.dismissableSurfaces.add(t),()=>{e.dismissableSurfaces.delete(t)}},[t,e.dismissableSurfaces]),a}Ze(el,"useDismissableLayerSurface");var Ix=Ze(()=>!0,"IS_TRUE");function jd(e,t){let{ownerDocument:a=globalThis?.document,deferPointerDownOutside:o=!1,isDeferredPointerDownOutsideRef:r,dismissableSurfaces:n,shouldHandlePointerDownOutside:s=Ix}=t,l=Ye(e),i=ye.useRef(!1),u=ye.useRef(!1),c=ye.useRef(new Map),d=ye.useRef(()=>{});return ye.useEffect(()=>{function f(){u.current=!1,r.current=!1,c.current.clear()}Ze(f,"resetOutsideInteraction");function p(){return Array.from(c.current.values()).some(Boolean)}Ze(p,"isOutsideInteractionIntercepted");function h(L){if(!u.current)return;let C=L.target;C instanceof Node&&[...n].some(v=>v.contains(C))||c.current.set(L.type,!0),L.type==="click"&&window.setTimeout(()=>{u.current&&d.current()},0)}Ze(h,"handleInteractionCapture");function g(L){u.current&&c.current.set(L.type,!1)}Ze(g,"handleInteractionBubble");let m=Ze(L=>{if(L.target&&!i.current){let S=function(){a.removeEventListener("click",d.current);let y=p();f(),y||tl(Cx,l,v,{discrete:!0})};var C=S;if(Ze(S,"handleAndDispatchPointerDownOutsideEvent"),!s(L.target)){a.removeEventListener("click",d.current),f(),i.current=!1;return}let v={originalEvent:L};u.current=!0,r.current=o&&L.button===0,c.current.clear(),!o||L.button!==0?S():(a.removeEventListener("click",d.current),d.current=S,a.addEventListener("click",d.current,{once:!0}))}else a.removeEventListener("click",d.current),f();i.current=!1},"handlePointerDown"),b=["pointerup","mousedown","mouseup","touchstart","touchend","click"];for(let L of b)a.addEventListener(L,h,!0),a.addEventListener(L,g);let x=window.setTimeout(()=>{a.addEventListener("pointerdown",m)},0);return()=>{window.clearTimeout(x),a.removeEventListener("pointerdown",m),a.removeEventListener("click",d.current);for(let L of b)a.removeEventListener(L,h,!0),a.removeEventListener(L,g)}},[a,l,o,r,n,s]),{onPointerDownCapture:Ze(()=>i.current=!0,"onPointerDownCapture")}}Ze(jd,"usePointerDownOutside");function Yd(e,t=globalThis?.document){let a=Ye(e),o=ye.useRef(!1);return ye.useEffect(()=>{let r=Ze(n=>{n.target&&!o.current&&tl(vx,a,{originalEvent:n},{discrete:!1})},"handleFocus");return t.addEventListener("focusin",r),()=>t.removeEventListener("focusin",r)},[t,a]),{onFocusCapture:Ze(()=>o.current=!0,"onFocusCapture"),onBlurCapture:Ze(()=>o.current=!1,"onBlurCapture")}}Ze(Yd,"useFocusOutside");function Qs(){let e=new CustomEvent(Js);document.dispatchEvent(e)}Ze(Qs,"dispatchUpdate");function tl(e,t,a,{discrete:o}){let r=a.originalEvent.target,n=new CustomEvent(e,{bubbles:!1,cancelable:!0,detail:a});t&&r.addEventListener(e,t,{once:!0}),o?zr(r,n):r.dispatchEvent(n)}Ze(tl,"handleAndDispatchCustomEvent");var Be=Z(require("react"),1);var sl=require("react/jsx-runtime"),wx=Object.defineProperty,Ue=(e,t)=>wx(e,"name",{value:t,configurable:!0}),al="focusScope.autoFocusOnMount",ol="focusScope.autoFocusOnUnmount",Zd={bubbles:!1,cancelable:!0},Wo=Be.forwardRef(Ue(function(t,a){let{loop:o=!1,trapped:r=!1,branches:n,onMountAutoFocus:s,onUnmountAutoFocus:l,...i}=t,[u,c]=Be.useState(null),d=Ye(s),f=Ye(l),p=Be.useRef(null),h=ce(a,c),g=Be.useRef(n);Be.useEffect(()=>{g.current=n});let m=Be.useCallback(L=>L?u?.contains(L)?!0:!!g.current?.some(C=>C.contains(L)):!1,[u]),b=Be.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;Be.useEffect(()=>{if(r){let v=function(I){if(b.paused||!u)return;let R=I.target;m(R)?p.current=R:pa(p.current,{select:!0})},y=function(I){if(b.paused||!u)return;let R=I.relatedTarget;R!==null&&(m(R)||pa(p.current,{select:!0}))},w=function(I){if(document.activeElement===document.body)for(let M of I)M.removedNodes.length>0&&pa(u)};var L=v,C=y,S=w;Ue(v,"handleFocusIn"),Ue(y,"handleFocusOut"),Ue(w,"handleMutations"),document.addEventListener("focusin",v),document.addEventListener("focusout",y);let E=new MutationObserver(w);return u&&E.observe(u,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",v),document.removeEventListener("focusout",y),E.disconnect()}}},[r,u,b.paused,m]),Be.useEffect(()=>{if(u){Jd.add(b);let L=document.activeElement;if(!u.contains(L)){let S=new CustomEvent(al,Zd);u.addEventListener(al,d),u.dispatchEvent(S),S.defaultPrevented||(ec(nc(il(u)),{select:!0}),document.activeElement===L&&pa(u))}return()=>{u.removeEventListener(al,d);let S=u.ownerDocument,v=CustomEvent;setTimeout(()=>{let y=new v(ol,Zd);u.addEventListener(ol,f),u.dispatchEvent(y),y.defaultPrevented||pa(L??S.body,{select:!0}),u.removeEventListener(ol,f),Jd.remove(b)},0)}}},[u,d,f,b]);let x=Be.useCallback(L=>{if(!o&&!r||b.paused)return;let C=L.key==="Tab"&&!L.altKey&&!L.ctrlKey&&!L.metaKey,S=document.activeElement;if(C&&S){let v=L.currentTarget,[y,w]=tc(v);y&&w?!L.shiftKey&&S===w?(L.preventDefault(),o&&pa(y,{select:!0})):L.shiftKey&&S===y&&(L.preventDefault(),o&&pa(w,{select:!0})):S===v&&L.preventDefault()}},[o,r,b.paused]);return(0,sl.jsx)(fe.div,{tabIndex:-1,...i,ref:h,onKeyDown:x})},"FocusScope")),Qd=Be.createContext(null);function Vr({registry:e,children:t}){return e?(0,sl.jsx)(Qd.Provider,{value:e,children:t}):t}Ue(Vr,"FocusScopeBranchProvider");function Gr(){let[e,t]=Be.useState([]),a=Be.useMemo(()=>({add:Ue(o=>t(r=>r.includes(o)?r:[...r,o]),"add"),remove:Ue(o=>t(r=>r.filter(n=>n!==o)),"remove")}),[]);return{nodes:e,registry:a}}Ue(Gr,"useFocusScopeBranchRegistry");function ll(e){let t=Be.useContext(Qd);Be.useEffect(()=>{if(!(!e||!t))return t.add(e),()=>t.remove(e)},[e,t])}Ue(ll,"useFocusScopeBranch");function ec(e,{select:t=!1}={}){let a=document.activeElement;for(let o of e)if(pa(o,{select:t}),document.activeElement!==a)return}Ue(ec,"focusFirst");function tc(e){let t=il(e),a=rl(t,e),o=rl(t.reverse(),e);return[a,o]}Ue(tc,"getTabbableEdges");function il(e){let t=[],o=e.ownerDocument.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:Ue(r=>{let n=r.tagName==="INPUT"&&r.type==="hidden";return r.disabled||r.hidden||n?NodeFilter.FILTER_SKIP:r.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP},"acceptNode")});for(;o.nextNode();)t.push(o.currentNode);return t}Ue(il,"getTabbableCandidates");function rl(e,t){let a=typeof t.checkVisibility=="function"&&t.checkVisibility({checkVisibilityCSS:!0});for(let o of e)if(!(a?!o.checkVisibility({checkVisibilityCSS:!0}):ac(o,{upTo:t})))return o}Ue(rl,"findVisible");function ac(e,{upTo:t}){if(getComputedStyle(e).visibility==="hidden")return!0;for(;e;){if(t!==void 0&&e===t)return!1;if(getComputedStyle(e).display==="none")return!0;e=e.parentElement}return!1}Ue(ac,"isHidden");function oc(e){return e.tagName==="INPUT"&&typeof e.select=="function"}Ue(oc,"isSelectableInput");function pa(e,{select:t=!1}={}){if(e&&e.focus){let o=(e.ownerDocument??document).activeElement;e.focus({preventScroll:!0}),e!==o&&oc(e)&&t&&e.select()}}Ue(pa,"focus");var Jd=rc();function rc(){let e=[];return{add(t){let a=e[0];t!==a&&a?.pause(),e=nl(e,t),e.unshift(t)},remove(t){e=nl(e,t),e[0]?.resume()}}}Ue(rc,"createFocusScopesStack");function nl(e,t){let a=[...e],o=a.indexOf(t);return o!==-1&&a.splice(o,1),a}Ue(nl,"arrayRemove");function nc(e){return e.filter(t=>t.tagName!=="A")}Ue(nc,"removeLinks");var Bn=Z(require("react"),1),sc=Z(require("react-dom"),1);var lc=require("react/jsx-runtime"),Sx=Object.defineProperty,yx=(e,t)=>Sx(e,"name",{value:t,configurable:!0}),Vo=Bn.forwardRef(yx(function(t,a){let{container:o,...r}=t,[n,s]=Bn.useState(!1);he(()=>s(!0),[]);let l=o||n&&globalThis?.document?.body;return l?sc.createPortal((0,lc.jsx)(fe.div,{...r,ref:a}),l):null},"Portal"));var rt=Z(require("react"),1);var ic=Z(require("react"),1),kx=Object.defineProperty,ma=(e,t)=>kx(e,"name",{value:t,configurable:!0});function uc(e,t){return ic.useReducer((a,o)=>t[a][o]??a,e)}ma(uc,"useStateMachine");var ga=ma(e=>{let{present:t,children:a}=e,o=dc(t),r=typeof a=="function"?a({present:o.isPresent}):rt.Children.only(a),n=cc(o.ref,fc(r));return typeof a=="function"||o.isPresent?rt.cloneElement(r,{ref:n}):null},"Presence");function dc(e){let[t,a]=rt.useState(),o=rt.useRef(null),r=rt.useRef(e),n=rt.useRef("none"),s=rt.useRef(void 0),l=e?"mounted":"unmounted",[i,u]=uc(l,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return rt.useEffect(()=>{i==="mounted"?(n.current=s.current??Go(o.current),s.current=void 0):n.current="none"},[i]),he(()=>{let c=o.current,d=r.current;if(d!==e){let p=n.current,h=Go(c);e?(s.current=h,u("MOUNT")):h==="none"||c?.display==="none"?u("UNMOUNT"):u(d&&p!==h?"ANIMATION_OUT":"UNMOUNT"),r.current=e}},[e,u]),he(()=>{if(t){let c,d=t.ownerDocument.defaultView??window,f=ma(h=>{let m=Go(o.current).includes(CSS.escape(h.animationName));if(h.target===t&&m&&(u("ANIMATION_END"),!r.current)){let b=t.style.animationFillMode;t.style.animationFillMode="forwards",c=d.setTimeout(()=>{t.style.animationFillMode==="forwards"&&(t.style.animationFillMode=b)})}},"handleAnimationEnd"),p=ma(h=>{h.target===t&&(n.current=Go(o.current))},"handleAnimationStart");return t.addEventListener("animationstart",p),t.addEventListener("animationcancel",f),t.addEventListener("animationend",f),()=>{d.clearTimeout(c),t.removeEventListener("animationstart",p),t.removeEventListener("animationcancel",f),t.removeEventListener("animationend",f)}}else u("ANIMATION_END")},[t,u]),{isPresent:["mounted","unmountSuspended"].includes(i),ref:rt.useCallback(c=>{if(c){let d=getComputedStyle(c);o.current=d,s.current=Go(d)}else o.current=null;a(c)},[])}}ma(dc,"usePresence");function ul(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}ma(ul,"setRef");function cc(...e){let t=rt.useRef(e);return t.current=e,rt.useCallback(a=>{let o=t.current,r=!1,n=o.map(s=>{let l=ul(s,a);return!r&&typeof l=="function"&&(r=!0),l});if(r)return()=>{for(let s=0;s<n.length;s++){let l=n[s];typeof l=="function"?l():ul(o[s],null)}}},[])}ma(cc,"useStableComposedRefs");function Go(e){return e?.animationName||"none"}ma(Go,"getAnimationName");function fc(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,a=t&&"isReactWarning"in t&&t.isReactWarning;return a?e.ref:(t=Object.getOwnPropertyDescriptor(e,"ref")?.get,a=t&&"isReactWarning"in t&&t.isReactWarning,a?e.props.ref:e.props.ref||e.ref)}ma(fc,"getElementRef");var pc=Z(require("react"),1),Rx=Object.defineProperty,cl=(e,t)=>Rx(e,"name",{value:t,configurable:!0}),Fn=0,Ko=null;function Px(e){return Ta(),e.children}cl(Px,"FocusGuards");function Ta(){pc.useEffect(()=>{Ko||(Ko={start:dl(),end:dl()});let{start:e,end:t}=Ko;return document.body.firstElementChild!==e&&document.body.insertAdjacentElement("afterbegin",e),document.body.lastElementChild!==t&&document.body.insertAdjacentElement("beforeend",t),Fn++,()=>{Fn===1&&(Ko?.start.remove(),Ko?.end.remove(),Ko=null),Fn=Math.max(0,Fn-1)}},[])}cl(Ta,"useFocusGuards");function dl(){let e=document.createElement("span");return e.setAttribute("data-radix-focus-guard",""),e.tabIndex=0,e.style.outline="none",e.style.opacity="0",e.style.position="fixed",e.style.pointerEvents="none",e}cl(dl,"createFocusGuard");var Lt=function(){return Lt=Object.assign||function(t){for(var a,o=1,r=arguments.length;o<r;o++){a=arguments[o];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(t[n]=a[n])}return t},Lt.apply(this,arguments)};function Nn(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]]);return a}function mc(e,t,a){if(a||arguments.length===2)for(var o=0,r=t.length,n;o<r;o++)(n||!(o in t))&&(n||(n=Array.prototype.slice.call(t,0,o)),n[o]=t[o]);return e.concat(n||Array.prototype.slice.call(t))}var zn=Z(require("react"));var ut=Z(require("react"));var ao="right-scroll-bar-position",oo="width-before-scroll-bar",fl="with-scroll-bars-hidden",pl="--removed-body-scroll-bar-size";function qn(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}var gc=require("react");function hc(e,t){var a=(0,gc.useState)(function(){return{value:e,callback:t,facade:{get current(){return a.value},set current(o){var r=a.value;r!==o&&(a.value=o,a.callback(o,r))}}}})[0];return a.callback=t,a.facade}var _n=Z(require("react"));var Dx=typeof window<"u"?_n.useLayoutEffect:_n.useEffect,xc=new WeakMap;function ml(e,t){var a=hc(t||null,function(o){return e.forEach(function(r){return qn(r,o)})});return Dx(function(){var o=xc.get(a);if(o){var r=new Set(o),n=new Set(e),s=a.current;r.forEach(function(l){n.has(l)||qn(l,null)}),n.forEach(function(l){r.has(l)||qn(l,s)})}xc.set(a,e)},[e]),a}function Mx(e){return e}function Ax(e,t){t===void 0&&(t=Mx);var a=[],o=!1,r={read:function(){if(o)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return a.length?a[a.length-1]:e},useMedium:function(n){var s=t(n,o);return a.push(s),function(){a=a.filter(function(l){return l!==s})}},assignSyncMedium:function(n){for(o=!0;a.length;){var s=a;a=[],s.forEach(n)}a={push:function(l){return n(l)},filter:function(){return a}}},assignMedium:function(n){o=!0;var s=[];if(a.length){var l=a;a=[],l.forEach(n),s=a}var i=function(){var c=s;s=[],c.forEach(n)},u=function(){return Promise.resolve().then(i)};u(),a={push:function(c){s.push(c),u()},filter:function(c){return s=s.filter(c),a}}}};return r}function gl(e){e===void 0&&(e={});var t=Ax(null);return t.options=Lt({async:!0,ssr:!1},e),t}var Lc=Z(require("react")),bc=function(e){var t=e.sideCar,a=Nn(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var o=t.read();if(!o)throw new Error("Sidecar medium not found");return Lc.createElement(o,Lt({},a))};bc.isSideCarExport=!0;function hl(e,t){return e.useMedium(t),bc}var Hn=gl();var xl=function(){},Kr=ut.forwardRef(function(e,t){var a=ut.useRef(null),o=ut.useState({onScrollCapture:xl,onWheelCapture:xl,onTouchMoveCapture:xl}),r=o[0],n=o[1],s=e.forwardProps,l=e.children,i=e.className,u=e.removeScrollBar,c=e.enabled,d=e.shards,f=e.sideCar,p=e.noRelative,h=e.noIsolation,g=e.inert,m=e.allowPinchZoom,b=e.as,x=b===void 0?"div":b,L=e.gapMode,C=Nn(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noRelative","noIsolation","inert","allowPinchZoom","as","gapMode"]),S=f,v=ml([a,t]),y=Lt(Lt({},C),r);return ut.createElement(ut.Fragment,null,c&&ut.createElement(S,{sideCar:Hn,removeScrollBar:u,shards:d,noRelative:p,noIsolation:h,inert:g,setCallbacks:n,allowPinchZoom:!!m,lockRef:a,gapMode:L}),s?ut.cloneElement(ut.Children.only(l),Lt(Lt({},y),{ref:v})):ut.createElement(x,Lt({},y,{className:i,ref:v}),l))});Kr.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};Kr.classNames={fullWidth:oo,zeroRight:ao};var Te=Z(require("react"));var $o=Z(require("react"));var Ic=Z(require("react"));var Cc;var vc=function(){if(Cc)return Cc;if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function Tx(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=vc();return t&&e.setAttribute("nonce",t),e}function Ex(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function Ox(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var Ll=function(){var e=0,t=null;return{add:function(a){e==0&&(t=Tx())&&(Ex(t,a),Ox(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}};var bl=function(){var e=Ll();return function(t,a){Ic.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&a])}};var Xr=function(){var e=bl(),t=function(a){var o=a.styles,r=a.dynamic;return e(o,r),null};return t};var Bx={left:0,top:0,right:0,gap:0},Cl=function(e){return parseInt(e||"",10)||0},Fx=function(e){var t=window.getComputedStyle(document.body),a=t[e==="padding"?"paddingLeft":"marginLeft"],o=t[e==="padding"?"paddingTop":"marginTop"],r=t[e==="padding"?"paddingRight":"marginRight"];return[Cl(a),Cl(o),Cl(r)]},vl=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return Bx;var t=Fx(e),a=document.documentElement.clientWidth,o=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,o-a+t[2]-t[0])}};var Nx=Xr(),Xo="data-scroll-locked",qx=function(e,t,a,o){var r=e.left,n=e.top,s=e.right,l=e.gap;return a===void 0&&(a="margin"),`
  .`.concat(fl,` {
   overflow: hidden `).concat(o,`;
   padding-right: `).concat(l,"px ").concat(o,`;
  }
  body[`).concat(Xo,`] {
    overflow: hidden `).concat(o,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(o,";"),a==="margin"&&`
    padding-left: `.concat(r,`px;
    padding-top: `).concat(n,`px;
    padding-right: `).concat(s,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(l,"px ").concat(o,`;
    `),a==="padding"&&"padding-right: ".concat(l,"px ").concat(o,";")].filter(Boolean).join(""),`
  }

  .`).concat(ao,` {
    right: `).concat(l,"px ").concat(o,`;
  }

  .`).concat(oo,` {
    margin-right: `).concat(l,"px ").concat(o,`;
  }

  .`).concat(ao," .").concat(ao,` {
    right: 0 `).concat(o,`;
  }

  .`).concat(oo," .").concat(oo,` {
    margin-right: 0 `).concat(o,`;
  }

  body[`).concat(Xo,`] {
    `).concat(pl,": ").concat(l,`px;
  }
`)},wc=function(){var e=parseInt(document.body.getAttribute(Xo)||"0",10);return isFinite(e)?e:0},_x=function(){$o.useEffect(function(){return document.body.setAttribute(Xo,(wc()+1).toString()),function(){var e=wc()-1;e<=0?document.body.removeAttribute(Xo):document.body.setAttribute(Xo,e.toString())}},[])},Il=function(e){var t=e.noRelative,a=e.noImportant,o=e.gapMode,r=o===void 0?"margin":o;_x();var n=$o.useMemo(function(){return vl(r)},[r]);return $o.createElement(Nx,{styles:qx(n,!t,r,a?"":"!important")})};var wl=!1;if(typeof window<"u")try{$r=Object.defineProperty({},"passive",{get:function(){return wl=!0,!0}}),window.addEventListener("test",$r,$r),window.removeEventListener("test",$r,$r)}catch{wl=!1}var $r,ro=wl?{passive:!1}:!1;var Hx=function(e){return e.tagName==="TEXTAREA"},Sc=function(e,t){if(!(e instanceof Element))return!1;var a=window.getComputedStyle(e);return a[t]!=="hidden"&&!(a.overflowY===a.overflowX&&!Hx(e)&&a[t]==="visible")},Ux=function(e){return Sc(e,"overflowY")},zx=function(e){return Sc(e,"overflowX")},Sl=function(e,t){var a=t.ownerDocument,o=t;do{typeof ShadowRoot<"u"&&o instanceof ShadowRoot&&(o=o.host);var r=yc(e,o);if(r){var n=kc(e,o),s=n[1],l=n[2];if(s>l)return!0}o=o.parentNode}while(o&&o!==a.body);return!1},Wx=function(e){var t=e.scrollTop,a=e.scrollHeight,o=e.clientHeight;return[t,a,o]},Vx=function(e){var t=e.scrollLeft,a=e.scrollWidth,o=e.clientWidth;return[t,a,o]},yc=function(e,t){return e==="v"?Ux(t):zx(t)},kc=function(e,t){return e==="v"?Wx(t):Vx(t)},Gx=function(e,t){return e==="h"&&t==="rtl"?-1:1},Rc=function(e,t,a,o,r){var n=Gx(e,window.getComputedStyle(t).direction),s=n*o,l=a.target,i=t.contains(l),u=!1,c=s>0,d=0,f=0;do{if(!l)break;var p=kc(e,l),h=p[0],g=p[1],m=p[2],b=g-m-n*h;(h||b)&&yc(e,l)&&(d+=b,f+=h);var x=l.parentNode;l=x&&x.nodeType===Node.DOCUMENT_FRAGMENT_NODE?x.host:x}while(!i&&l!==document.body||i&&(t.contains(l)||t===l));return(c&&(r&&Math.abs(d)<1||!r&&s>d)||!c&&(r&&Math.abs(f)<1||!r&&-s>f))&&(u=!0),u};var Un=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},Pc=function(e){return[e.deltaX,e.deltaY]},Dc=function(e){return e&&"current"in e?e.current:e},Kx=function(e,t){return e[0]===t[0]&&e[1]===t[1]},Xx=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},$x=0,jo=[];function Mc(e){var t=Te.useRef([]),a=Te.useRef([0,0]),o=Te.useRef(),r=Te.useState($x++)[0],n=Te.useState(Xr)[0],s=Te.useRef(e);Te.useEffect(function(){s.current=e},[e]),Te.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(r));var g=mc([e.lockRef.current],(e.shards||[]).map(Dc),!0).filter(Boolean);return g.forEach(function(m){return m.classList.add("allow-interactivity-".concat(r))}),function(){document.body.classList.remove("block-interactivity-".concat(r)),g.forEach(function(m){return m.classList.remove("allow-interactivity-".concat(r))})}}},[e.inert,e.lockRef.current,e.shards]);var l=Te.useCallback(function(g,m){if("touches"in g&&g.touches.length===2||g.type==="wheel"&&g.ctrlKey)return!s.current.allowPinchZoom;var b=Un(g),x=a.current,L="deltaX"in g?g.deltaX:x[0]-b[0],C="deltaY"in g?g.deltaY:x[1]-b[1],S,v=g.target,y=Math.abs(L)>Math.abs(C)?"h":"v";if("touches"in g&&y==="h"&&v.type==="range")return!1;var w=window.getSelection(),E=w&&w.anchorNode,I=E?E===v||E.contains(v):!1;if(I)return!1;var R=Sl(y,v);if(!R)return!0;if(R?S=y:(S=y==="v"?"h":"v",R=Sl(y,v)),!R)return!1;if(!o.current&&"changedTouches"in g&&(L||C)&&(o.current=S),!S)return!0;var M=o.current||S;return Rc(M,m,g,M==="h"?L:C,!0)},[]),i=Te.useCallback(function(g){var m=g;if(!(!jo.length||jo[jo.length-1]!==n)){var b="deltaY"in m?Pc(m):Un(m),x=t.current.filter(function(S){return S.name===m.type&&(S.target===m.target||m.target===S.shadowParent)&&Kx(S.delta,b)})[0];if(x&&x.should){m.cancelable&&m.preventDefault();return}if(!x){var L=(s.current.shards||[]).map(Dc).filter(Boolean).filter(function(S){return S.contains(m.target)}),C=L.length>0?l(m,L[0]):!s.current.noIsolation;C&&m.cancelable&&m.preventDefault()}}},[]),u=Te.useCallback(function(g,m,b,x){var L={name:g,delta:m,target:b,should:x,shadowParent:jx(b)};t.current.push(L),setTimeout(function(){t.current=t.current.filter(function(C){return C!==L})},1)},[]),c=Te.useCallback(function(g){a.current=Un(g),o.current=void 0},[]),d=Te.useCallback(function(g){u(g.type,Pc(g),g.target,l(g,e.lockRef.current))},[]),f=Te.useCallback(function(g){u(g.type,Un(g),g.target,l(g,e.lockRef.current))},[]);Te.useEffect(function(){return jo.push(n),e.setCallbacks({onScrollCapture:d,onWheelCapture:d,onTouchMoveCapture:f}),document.addEventListener("wheel",i,ro),document.addEventListener("touchmove",i,ro),document.addEventListener("touchstart",c,ro),function(){jo=jo.filter(function(g){return g!==n}),document.removeEventListener("wheel",i,ro),document.removeEventListener("touchmove",i,ro),document.removeEventListener("touchstart",c,ro)}},[]);var p=e.removeScrollBar,h=e.inert;return Te.createElement(Te.Fragment,null,h?Te.createElement(n,{styles:Xx(r)}):null,p?Te.createElement(Il,{noRelative:e.noRelative,gapMode:e.gapMode}):null)}function jx(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}var Ac=hl(Hn,Mc);var Tc=zn.forwardRef(function(e,t){return zn.createElement(Kr,Lt({},e,{ref:t,sideCar:Ac}))});Tc.classNames=Kr.classNames;var no=Tc;var Yx=function(e){if(typeof document>"u")return null;var t=Array.isArray(e)?e[0]:e;return t.ownerDocument.body},Yo=new WeakMap,Wn=new WeakMap,Vn={},yl=0,Ec=function(e){return e&&(e.host||Ec(e.parentNode))},Zx=function(e,t){return t.map(function(a){if(e.contains(a))return a;var o=Ec(a);return o&&e.contains(o)?o:(console.error("aria-hidden",a,"in not contained inside",e,". Doing nothing"),null)}).filter(function(a){return!!a})},Jx=function(e,t,a,o){var r=Zx(t,Array.isArray(e)?e:[e]);Vn[a]||(Vn[a]=new WeakMap);var n=Vn[a],s=[],l=new Set,i=new Set(r),u=function(d){!d||l.has(d)||(l.add(d),u(d.parentNode))};r.forEach(u);var c=function(d){!d||i.has(d)||Array.prototype.forEach.call(d.children,function(f){if(l.has(f))c(f);else try{var p=f.getAttribute(o),h=p!==null&&p!=="false",g=(Yo.get(f)||0)+1,m=(n.get(f)||0)+1;Yo.set(f,g),n.set(f,m),s.push(f),g===1&&h&&Wn.set(f,!0),m===1&&f.setAttribute(a,"true"),h||f.setAttribute(o,"true")}catch(b){console.error("aria-hidden: cannot operate on ",f,b)}})};return c(t),l.clear(),yl++,function(){s.forEach(function(d){var f=Yo.get(d)-1,p=n.get(d)-1;Yo.set(d,f),n.set(d,p),f||(Wn.has(d)||d.removeAttribute(o),Wn.delete(d)),p||d.removeAttribute(a)}),yl--,yl||(Yo=new WeakMap,Yo=new WeakMap,Wn=new WeakMap,Vn={})}},Zo=function(e,t,a){a===void 0&&(a="data-aria-hidden");var o=Array.from(Array.isArray(e)?e:[e]),r=t||Yx(e);return r?(o.push.apply(o,Array.from(r.querySelectorAll("[aria-live], script"))),Jx(o,r,a,"aria-hidden")):function(){return null}};var ze=require("react/jsx-runtime"),Qx=Object.defineProperty,Dt=(e,t)=>Qx(e,"name",{value:t,configurable:!0}),Rl="Dialog",[Oc,VS]=ot(Rl),[eL,ta]=Oc(Rl),Bc=Dt(e=>{let{__scopeDialog:t,children:a,open:o,defaultOpen:r,onOpenChange:n,modal:s=!0}=e,l=Pe.useRef(null),i=Pe.useRef(null),{nodes:u,registry:c}=Gr(),[d,f]=ea({prop:o,defaultProp:r??!1,onChange:n,caller:Rl}),[p,h]=Pe.useState(0),[g,m]=Pe.useState(0);return(0,ze.jsx)(eL,{scope:t,triggerRef:l,contentRef:i,contentId:Pt(),titleId:Pt(),descriptionId:Pt(),titlePresent:p>0,descriptionPresent:g>0,setTitleCount:h,setDescriptionCount:m,open:d,onOpenChange:f,onOpenToggle:Pe.useCallback(()=>f(b=>!b),[f]),modal:s,branchNodes:u,branchRegistry:c,children:a})},"Dialog");var Fc="DialogPortal",[tL,Nc]=Oc(Fc,{forceMount:void 0}),qc=Dt(e=>{let{__scopeDialog:t,forceMount:a,children:o,container:r}=e,n=ta(Fc,t);return(0,ze.jsx)(tL,{scope:t,forceMount:a,children:Pe.Children.map(o,s=>(0,ze.jsx)(ga,{present:a||n.open,children:(0,ze.jsx)(Vo,{asChild:!0,container:r,children:s})}))})},"DialogPortal"),kl="DialogOverlay",Pl=Pe.forwardRef(Dt(function(t,a){let o=Nc(kl,t.__scopeDialog),{forceMount:r=o.forceMount,...n}=t,s=ta(kl,t.__scopeDialog);return s.modal?(0,ze.jsx)(ga,{present:r||s.open,children:(0,ze.jsx)(oL,{...n,ref:a})}):null},"DialogOverlay")),aL=it("DialogOverlay.RemoveScroll"),oL=Pe.forwardRef(Dt(function(t,a){let{__scopeDialog:o,...r}=t,n=ta(kl,o),s=el(),l=ce(a,s);return(0,ze.jsx)(no,{as:aL,allowPinchZoom:!0,shards:Pe.useMemo(()=>[n.contentRef,...n.branchNodes.map(i=>({current:i}))],[n.contentRef,n.branchNodes]),children:(0,ze.jsx)(fe.div,{"data-state":Tl(n.open),...r,ref:l,style:{pointerEvents:"auto",...r.style}})})},"DialogOverlayImpl")),jr="DialogContent",Dl=Pe.forwardRef(Dt(function(t,a){let o=Nc(jr,t.__scopeDialog),{forceMount:r=o.forceMount,...n}=t,s=ta(jr,t.__scopeDialog);return(0,ze.jsx)(ga,{present:r||s.open,children:s.modal?(0,ze.jsx)(rL,{...n,ref:a}):(0,ze.jsx)(nL,{...n,ref:a})})},"DialogContent")),rL=Pe.forwardRef(Dt(function(t,a){let o=ta(jr,t.__scopeDialog),r=Pe.useRef(null),n=ce(a,o.contentRef,r);return Pe.useEffect(()=>{let s=r.current;if(s)return Zo(s)},[]),(0,ze.jsx)(_c,{...t,ref:n,trapFocus:o.open,disableOutsidePointerEvents:o.open,onCloseAutoFocus:J(t.onCloseAutoFocus,s=>{s.preventDefault(),o.triggerRef.current?.focus()}),onPointerDownOutside:J(t.onPointerDownOutside,s=>{let l=s.detail.originalEvent,i=l.button===0&&l.ctrlKey===!0;(l.button===2||i)&&s.preventDefault()}),onFocusOutside:J(t.onFocusOutside,s=>s.preventDefault())})},"DialogContentModal")),nL=Pe.forwardRef(Dt(function(t,a){let o=ta(jr,t.__scopeDialog),r=Pe.useRef(!1),n=Pe.useRef(!1);return(0,ze.jsx)(_c,{...t,ref:a,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:s=>{t.onCloseAutoFocus?.(s),s.defaultPrevented||(r.current||o.triggerRef.current?.focus(),s.preventDefault()),r.current=!1,n.current=!1},onInteractOutside:s=>{t.onInteractOutside?.(s),s.defaultPrevented||(r.current=!0,s.detail.originalEvent.type==="pointerdown"&&(n.current=!0));let l=s.target;o.triggerRef.current?.contains(l)&&s.preventDefault(),s.detail.originalEvent.type==="focusin"&&n.current&&s.preventDefault()}})},"DialogContentNonModal")),_c=Pe.forwardRef(Dt(function(t,a){let{__scopeDialog:o,trapFocus:r,onOpenAutoFocus:n,onCloseAutoFocus:s,"aria-describedby":l,children:i,...u}=t,c=ta(jr,o);return Ta(),(0,ze.jsx)(Vr,{registry:c.branchRegistry,children:(0,ze.jsx)(Wo,{asChild:!0,loop:!0,trapped:r,branches:c.branchNodes,onMountAutoFocus:n,onUnmountAutoFocus:s,children:(0,ze.jsx)(zo,{role:"dialog",id:c.contentId,"aria-labelledby":c.titlePresent?c.titleId:void 0,"aria-describedby":c.descriptionPresent?Uc(l,c.descriptionId):l,"data-state":Tl(c.open),...u,ref:a,deferPointerDownOutside:!0,onDismiss:()=>c.onOpenChange(!1),children:i})})})},"DialogContentImpl")),Ml=Pe.forwardRef(Dt(function(t,a){let{__scopeDialog:o,...r}=t,n=ta("DialogTitle",o),{setTitleCount:s}=n;return he(()=>(s(l=>l+1),()=>s(l=>l-1)),[s]),(0,ze.jsx)(fe.h2,{id:n.titleId,...r,ref:a})},"DialogTitle")),Al=Pe.forwardRef(Dt(function(t,a){let{__scopeDialog:o,...r}=t,n=ta("DialogDescription",o),{setDescriptionCount:s}=n;return he(()=>(s(l=>l+1),()=>s(l=>l-1)),[s]),(0,ze.jsx)(fe.p,{id:n.descriptionId,...r,ref:a})},"DialogDescription")),sL="DialogClose",Hc=Pe.forwardRef(Dt(function(t,a){let{__scopeDialog:o,...r}=t,n=ta(sL,o);return(0,ze.jsx)(fe.button,{type:"button",...r,ref:a,onClick:J(t.onClick,()=>n.onOpenChange(!1))})},"DialogClose"));function Uc(...e){let t=new Set;for(let a of e)if(typeof a=="string")for(let o of String(a).trim().split(/\s+/))o&&t.add(o);return t.size>0?Array.from(t).join(" "):void 0}Dt(Uc,"concatAriaDescribedby");function Tl(e){return e?"open":"closed"}Dt(Tl,"getState");var Gn=require("react");var Yr={dateLocale:"ru-RU",workspace:"\u0420\u0430\u0431\u043E\u0447\u0430\u044F \u043F\u0430\u043F\u043A\u0430",selectWorkspace:"\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0440\u0430\u0431\u043E\u0447\u0443\u044E \u043F\u0430\u043F\u043A\u0443",selectWorkspaceHint:"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0440\u0430\u0431\u043E\u0447\u0443\u044E \u043F\u0430\u043F\u043A\u0443, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0438 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0435\u0451 \u0437\u0430\u0434\u0430\u0447\u0438.",noWorkspaces:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0440\u0430\u0431\u043E\u0447\u0438\u0445 \u043F\u0430\u043F\u043E\u043A. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043F\u0430\u043F\u043A\u0443 \u0432 \u043B\u0435\u0432\u043E\u0439 \u043F\u0430\u043D\u0435\u043B\u0438.",loadingWorkspaces:"\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u0440\u0430\u0431\u043E\u0447\u0438\u0435 \u043F\u0430\u043F\u043A\u0438\u2026",searchCards:"\u041F\u043E\u0438\u0441\u043A \u0437\u0430\u0434\u0430\u0447",cardNoLongerExists:"\u042D\u0442\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0430. \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043D\u0435\u043B\u044C\u0437\u044F.",searchPlaceholder:"\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E, \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044E, \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u044F\u043C \u0438\u043B\u0438 ID\u2026",clearSearch:"\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u043F\u043E\u0438\u0441\u043A",searchResults:"\u041D\u0430\u0439\u0434\u0435\u043D\u043E \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A: {count}",matchComment:"\u0421\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u0432 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438",images:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",discardImagesDesc:"\u041D\u0435\u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043D\u044B\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0438 \u043D\u0435\u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0439 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043D\u0435 \u043F\u043E\u043F\u0430\u0434\u0443\u0442 \u0432 \u0447\u0430\u0442. \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u0431\u0435\u0437 \u043D\u0438\u0445?",addImages:"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",imagesEmpty:"\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u0441\u044E\u0434\u0430 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F, \u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0438\u0437 \u0431\u0443\u0444\u0435\u0440\u0430 \u0438\u043B\u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u0430\u0439\u043B\u044B.",imagesHint:"PNG, JPEG, WebP \xB7 \u0434\u043E {size} \u041C\u0438\u0411 \u043A\u0430\u0436\u0434\u043E\u0435 \xB7 \u043D\u0435 \u0431\u043E\u043B\u044C\u0448\u0435 {count}",imagesSaveHint:"\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u0441\u0440\u0430\u0437\u0443.",imagesDraftHint:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u044F\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0437\u0430\u0434\u0430\u0447\u0438. \u041F\u0440\u0438 \u043E\u0442\u043C\u0435\u043D\u0435 \u043E\u043D\u0438 \u043D\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0442\u0441\u044F.",imagesUnavailable:"\u0412 \u044D\u0442\u043E\u0439 \u043F\u0430\u043F\u043A\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F \u043D\u0430 \u0437\u0430\u043F\u0438\u0441\u044C \u0438 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0443 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439 \u0432 DSH.",imageUploading:"\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C\u2026",imagePending:"\u041E\u0436\u0438\u0434\u0430\u0435\u0442 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0437\u0430\u0434\u0430\u0447\u0438",imageLoadFailed:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",loadingImage:"\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435\u2026",imageUploadFailed:"\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438",imageUploadPartial:"\u0417\u0430\u0434\u0430\u0447\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430, \u043D\u043E \u0447\u0430\u0441\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439 \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043B\u0430\u0441\u044C. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0443.",imageInvalidType:"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 PNG, JPEG \u0438\u043B\u0438 WebP.",imageTooLarge:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043F\u0443\u0441\u0442\u043E\u0435 \u0438\u043B\u0438 \u0431\u043E\u043B\u044C\u0448\u0435 {size} \u041C\u0438\u0411.",imageTooMany:"\u0412 \u043E\u0434\u043D\u0443 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u043C\u043E\u0436\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u0435 \u0431\u043E\u043B\u044C\u0448\u0435 {count} \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439.",imagePreview:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 {number}",imageRemove:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 {number}",imageRemoveFailed:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443.",imageRemoving:"\u0423\u0434\u0430\u043B\u044F\u0435\u043C\u2026",retry:"\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C",remove:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C",imagesChatHint:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u044D\u0442\u043E\u0439 \u0437\u0430\u0434\u0430\u0447\u0438 ({count}) \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B \u0432 \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A \u0447\u0430\u0442\u0430.",chatImagesUnavailable:"\u042D\u0442\u0430 \u0432\u0435\u0440\u0441\u0438\u044F DSH \u043D\u0435 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0432 \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A \u0447\u0430\u0442\u0430.",chatImagesBusy:"\u0427\u0430\u0442 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u0447\u0443\u0442\u044C \u043F\u043E\u0437\u0436\u0435.",actImageAdded:"\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",actImageRemoved:"\u0423\u0434\u0430\u043B\u0435\u043D\u043E \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",boardTab:"\u041A\u0430\u043D\u0431\u0430\u043D",loading:"\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u043A\u0430\u043D\u0431\u0430\u043D\u2026",loadFailed:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043A\u0430\u043D\u0431\u0430\u043D: ",actionFailed:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435: ",actionRetry:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443.",confirmDelete:"\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435",discardChanges:"\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",discardCommentDesc:"\u041D\u0435\u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0439 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043D\u0435 \u043F\u043E\u043F\u0430\u0434\u0451\u0442 \u0432 \u0447\u0430\u0442. \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u0431\u0435\u0437 \u043D\u0435\u0433\u043E?",discardAndContinue:"\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u0431\u0435\u0437 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F",discardChangesDesc:"\u0415\u0441\u0442\u044C \u043D\u0435\u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0438\u043B\u0438 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439. \u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0431\u0435\u0437 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F?",deleteCardDesc:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0438 \u0435\u0451 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438? \u042D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C.",deleteColumnDesc:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \xAB{column}\xBB? \u0415\u0451 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u044F\u0442\u0441\u044F \u0432 \u043F\u0435\u0440\u0432\u0443\u044E \u043E\u0441\u0442\u0430\u0432\u0448\u0443\u044E\u0441\u044F \u043A\u043E\u043B\u043E\u043D\u043A\u0443.",deleteLabelDesc:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043C\u0435\u0442\u043A\u0443 \xAB{label}\xBB? \u041E\u043D\u0430 \u0431\u0443\u0434\u0435\u0442 \u0441\u043D\u044F\u0442\u0430 \u0441\u043E \u0432\u0441\u0435\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A.",clearFilter:"\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440",noMatchingCards:"\u041D\u0435\u0442 \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0449\u0438\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A",refresh:"\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043A\u0430\u043D\u0431\u0430\u043D",settings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",columnEdit:"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043A\u043E\u043B\u043E\u043D\u043A\u0438",labelEdit:"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043C\u0435\u0442\u043A\u0438",emptyColumn:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A",addCard:"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443",dragSort:"\u041F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0438",cardKeyboardHelp:"Enter \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443. \u041F\u0440\u043E\u0431\u0435\u043B \u043F\u043E\u0434\u043D\u0438\u043C\u0430\u0435\u0442 \u0435\u0451, \u0441\u0442\u0440\u0435\u043B\u043A\u0438 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0430\u044E\u0442, \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u0439 \u043F\u0440\u043E\u0431\u0435\u043B \u043E\u043F\u0443\u0441\u043A\u0430\u0435\u0442, Esc \u043E\u0442\u043C\u0435\u043D\u044F\u0435\u0442 \u043F\u0435\u0440\u0435\u043D\u043E\u0441.",columnName:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043B\u043E\u043D\u043A\u0438",labelName:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043C\u0435\u0442\u043A\u0438",labelColor:"\u0426\u0432\u0435\u0442 \u043C\u0435\u0442\u043A\u0438",newLabelColor:"\u0426\u0432\u0435\u0442 \u043D\u043E\u0432\u043E\u0439 \u043C\u0435\u0442\u043A\u0438",deleteLabel:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043C\u0435\u0442\u043A\u0443",editCard:"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443",taskDetails:"\u0421\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u043E \u0437\u0430\u0434\u0430\u0447\u0435",resizeTaskDetails:"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0448\u0438\u0440\u0438\u043D\u0443 \u043F\u0430\u043D\u0435\u043B\u0438 \u0437\u0430\u0434\u0430\u0447\u0438",resizeTaskDetailsHint:"\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u0433\u0440\u0430\u043D\u0438\u0446\u0443 \u0438\u043B\u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0441\u0442\u0440\u0435\u043B\u043A\u0438 \u0432\u043B\u0435\u0432\u043E \u0438 \u0432\u043F\u0440\u0430\u0432\u043E. Home \u2014 \u0443\u0436\u0435, End \u2014 \u0448\u0438\u0440\u0435.",fieldTitle:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",fieldId:"ID \u0437\u0430\u0434\u0430\u0447\u0438",titlePlaceholder:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",fieldLabel:"\u041C\u0435\u0442\u043A\u0430",noLabel:"\u0411\u0435\u0437 \u043C\u0435\u0442\u043A\u0438",fieldPriority:"\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442",noPriority:"\u0411\u0435\u0437 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u0430",fieldDueDate:"\u0421\u0440\u043E\u043A",fieldCompletedDate:"\u0414\u0430\u0442\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F",completedDateUnknown:"\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430",completedDateUnknownHint:"\u0412\u0440\u0435\u043C\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u044D\u0442\u043E\u0439 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043D\u0435 \u0437\u0430\u043F\u0438\u0441\u0430\u043D\u043E.",today:"\u0421\u0435\u0433\u043E\u0434\u043D\u044F",tomorrow:"\u0417\u0430\u0432\u0442\u0440\u0430",nextWeek:"\u0427\u0435\u0440\u0435\u0437 \u043D\u0435\u0434\u0435\u043B\u044E",clearDate:"\u0423\u0431\u0440\u0430\u0442\u044C \u0434\u0430\u0442\u0443",dueToday:"\u0421\u0440\u043E\u043A \u0441\u0435\u0433\u043E\u0434\u043D\u044F",overdue:"\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043E",overdueDays:"\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043E \u043D\u0430 {days} \u0434\u043D.",shortDate:"{day} {month}",yearDate:"{day} {month} {year}",dueDateFilter:"\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u0441\u0440\u043E\u043A\u0443",completedColumn:"\u041A\u043E\u043B\u043E\u043D\u043A\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F",noCompletedColumn:"\u041D\u0435 \u0432\u044B\u0431\u0440\u0430\u043D\u0430",completedColumnHint:"\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0432 \u044D\u0442\u043E\u0439 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0441\u0447\u0438\u0442\u0430\u044E\u0442\u0441\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D\u043D\u044B\u043C\u0438 \u0438 \u043D\u0435 \u043F\u043E\u043F\u0430\u0434\u0430\u044E\u0442 \u0432 \u0444\u0438\u043B\u044C\u0442\u0440\u044B \xAB\u0421\u0440\u043E\u043A \u0441\u0435\u0433\u043E\u0434\u043D\u044F\xBB \u0438 \xAB\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043E\xBB. \u0423 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A, \u0443\u0436\u0435 \u043D\u0430\u0445\u043E\u0434\u044F\u0449\u0438\u0445\u0441\u044F \u0432 \u043D\u043E\u0432\u043E\u0439 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F, \u0434\u0430\u0442\u0430 \u0431\u0443\u0434\u0435\u0442 \u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430.",completed:"\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430",incomplete:"\u041D\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430",completionStatus:"\u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F",feedback:"\u041E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0432\u044F\u0437\u044C \xB7 GitHub",actDueDate:"\u0421\u0440\u043E\u043A: {from} \u2192 {to}",actCompletedColumn:"\u041A\u043E\u043B\u043E\u043D\u043A\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F: {from} \u2192 {to}",fieldNote:"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",notePlaceholder:"\u041E\u043F\u0438\u0448\u0438\u0442\u0435 \u0437\u0430\u0434\u0430\u0447\u0443 \u0432 Markdown\u2026",editNote:"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C",finishEditingNote:"\u0417\u0430\u043A\u043E\u043D\u0447\u0438\u0442\u044C \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",markdownEditHint:"\u0418\u0441\u0445\u043E\u0434\u043D\u044B\u0439 Markdown \xB7 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F",emptyNote:"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043F\u043E\u043A\u0430 \u043D\u0435\u0442. \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C\xBB, \u0447\u0442\u043E\u0431\u044B \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0435\u0433\u043E.",copyCode:"\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043A\u043E\u0434",copiedCode:"\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E",footnotes:"\u0421\u043D\u043E\u0441\u043A\u0438",commentsTitle:"\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438",commentEmpty:"\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442",commentPlaceholder:"\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439\u2026",sendComment:"\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439",cancel:"\u041E\u0442\u043C\u0435\u043D\u0430",save:"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",chatWithAgent:"\u041E\u0431\u0441\u0443\u0434\u0438\u0442\u044C \u0432 \u043D\u043E\u0432\u043E\u043C \u0447\u0430\u0442\u0435",delete:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C",add:"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",close:"\u0417\u0430\u043A\u0440\u044B\u0442\u044C",columnEditDesc:"\u041F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u0439\u0442\u0435 \u043A\u043E\u043B\u043E\u043D\u043A\u0438 \u0437\u0430 \u043B\u0435\u0432\u044B\u0439 \u043A\u0440\u0430\u0439. \u041D\u0430\u0437\u0432\u0430\u043D\u0438\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438.",boardLists:"\u041A\u043E\u043B\u043E\u043D\u043A\u0438 \u043A\u0430\u043D\u0431\u0430\u043D\u0430",newColumnPlaceholder:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0439 \u043A\u043E\u043B\u043E\u043D\u043A\u0438",labelEditDesc:"\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438\u043B\u0438 \u0446\u0432\u0435\u0442 \u0434\u043B\u044F \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F. \u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438.",boardLabels:"\u041C\u0435\u0442\u043A\u0438 \u0437\u0430\u0434\u0430\u0447",noLabelsHint:"\u041C\u0435\u0442\u043E\u043A \u043F\u043E\u043A\u0430 \u043D\u0435\u0442. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043F\u0435\u0440\u0432\u0443\u044E \u043D\u0438\u0436\u0435.",newLabelPlaceholder:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0439 \u043C\u0435\u0442\u043A\u0438",priorityFilter:"\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u0443",labelFilter:"\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u043C\u0435\u0442\u043A\u0435",all:"\u0412\u0441\u0435",warnings:"\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F \u043E \u0434\u0430\u043D\u043D\u044B\u0445",dismiss:"\u041F\u043E\u043D\u044F\u0442\u043D\u043E",activityTitle:"\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439",activityEmpty:"\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442",actorHuman:"\u0412\u044B",actorAgent:"\u0410\u0433\u0435\u043D\u0442",actCreated:"\u0421\u043E\u0437\u0434\u0430\u043D\u0430 \u0432 \xAB{column}\xBB, \u043C\u0435\u0442\u043A\u0430 {label}, \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442 {priority}",actMoved:"\u0418\u0437 \xAB{from}\xBB \u0432 \xAB{to}\xBB",actLabel:"\u041C\u0435\u0442\u043A\u0430: {from} \u2192 {to}",actLabelSet:"\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0430 \u043C\u0435\u0442\u043A\u0430 {to}",actLabelCleared:"\u0421\u043D\u044F\u0442\u0430 \u043C\u0435\u0442\u043A\u0430 {from}",actPriority:"\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442: {from} \u2192 {to}",actPrioritySet:"\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442 {to}",actPriorityCleared:"\u0421\u043D\u044F\u0442 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442 {from}",actTitle:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435: \xAB{from}\xBB \u2192 \xAB{to}\xBB",actNote:"\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",actComment:"\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439",actDeleted:"\u0423\u0434\u0430\u043B\u0435\u043D\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430",actColumnAdded:"\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u043A\u043E\u043B\u043E\u043D\u043A\u0430 \xAB{column}\xBB",actColumnRenamed:"\u041A\u043E\u043B\u043E\u043D\u043A\u0430 \xAB{from}\xBB \u2192 \xAB{to}\xBB",actColumnDeleted:"\u0423\u0434\u0430\u043B\u0435\u043D\u0430 \u043A\u043E\u043B\u043E\u043D\u043A\u0430 \xAB{column}\xBB",actLabelAdded:"\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u043C\u0435\u0442\u043A\u0430 \xAB{label}\xBB",actLabelRenamed:"\u041C\u0435\u0442\u043A\u0430 \xAB{from}\xBB \u2192 \xAB{to}\xBB",actLabelDeleted:"\u0423\u0434\u0430\u043B\u0435\u043D\u0430 \u043C\u0435\u0442\u043A\u0430 \xAB{label}\xBB",actLabelColor:"\u0426\u0432\u0435\u0442 \u043C\u0435\u0442\u043A\u0438 \xAB{label}\xBB: {from} \u2192 {to}",noValue:"\u041D\u0435\u0442",taskPickerTitle:"\u0417\u0430\u0434\u0430\u0447\u0438 \u043A\u0430\u043D\u0431\u0430\u043D\u0430",taskPickerSearch:"\u041F\u043E\u0438\u0441\u043A \u0437\u0430\u0434\u0430\u0447\u0438 \u043F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E, \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044E \u0438\u043B\u0438 ID\u2026",taskPickerEmpty:"\u0412 \u044D\u0442\u043E\u0439 \u0440\u0430\u0431\u043E\u0447\u0435\u0439 \u043F\u0430\u043F\u043A\u0435 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447.",taskPickerNoMatches:"\u041F\u043E \u044D\u0442\u043E\u043C\u0443 \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \u0437\u0430\u0434\u0430\u0447 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E.",taskPickerLoading:"\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u0437\u0430\u0434\u0430\u0447\u0438\u2026",taskPickerError:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0438 \u043A\u0430\u043D\u0431\u0430\u043D\u0430.",taskPickerRetry:"\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0443",taskPickerHint:"\u2191\u2193 \u2014 \u0432\u044B\u0431\u043E\u0440 \xB7 Enter \u2014 \u0432\u0441\u0442\u0430\u0432\u0438\u0442\u044C \xB7 Ctrl+Click \u2014 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \xB7 Esc \u2014 \u0437\u0430\u043A\u0440\u044B\u0442\u044C",taskPickerCards:"\u041A\u0430\u0440\u0442\u043E\u0447\u0435\u043A: {count}",taskPickerInsertSelected:"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0435 ({count})",taskPickerWorkspace:"\u0417\u0430\u0434\u0430\u0447\u0438 \u0440\u0430\u0431\u043E\u0447\u0435\u0439 \u043F\u0430\u043F\u043A\u0438: {workspace}",taskPickerUnavailable:"\u0414\u043B\u044F \u044D\u0442\u043E\u0439 \u0441\u0435\u0441\u0441\u0438\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0440\u0430\u0431\u043E\u0447\u0430\u044F \u043F\u0430\u043F\u043A\u0430 \u043A\u0430\u043D\u0431\u0430\u043D\u0430.",taskPickerInsert:"\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443 \u0432 \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A",taskPickerMulti:"\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0437\u0430\u0434\u0430\u0447"};var zc="russian-kanban",so=null,El=null;function Vc(e){let t=e.get("locale");t!==void 0&&(so=t,e.effect(()=>t.register(zc,{ru:Yr,en:Yr,zh:Yr}),"russian-kanban: Russian dictionary"),El=t.bind(zc))}function ft(e){return El?El(e):Yr[e]??e}var iL=e=>so&&typeof so.subscribe=="function"?so.subscribe(e):()=>{},Wc=()=>so&&typeof so.getSnapshot=="function"?so.getSnapshot():null;function we(){let e=(0,Gn.useSyncExternalStore)(iL,Wc,Wc);return(0,Gn.useCallback)(t=>ft(t),[e])}var bt=require("react/jsx-runtime"),Jo=Bc;var uL=qc;var Gc=Zr.forwardRef(({className:e,...t},a)=>(0,bt.jsx)(Pl,{ref:a,className:de("kanban-portal kanban-dialog-overlay",e),...t}));Gc.displayName=Pl.displayName;var Jr=Zr.forwardRef(({className:e,children:t,...a},o)=>{let r=we();return(0,bt.jsxs)(uL,{children:[(0,bt.jsx)(Gc,{}),(0,bt.jsxs)(Dl,{ref:o,className:de("kanban-portal kanban-dialog-content",e),...a,children:[t,(0,bt.jsxs)(Hc,{className:"kanban-dialog-close",children:[(0,bt.jsx)($e,{className:"kanban-dialog-close-icon"}),(0,bt.jsx)("span",{className:"kanban-sr-only",children:r("close")})]})]})]})});Jr.displayName=Dl.displayName;var lo=({className:e,...t})=>(0,bt.jsx)("div",{className:de("kanban-dialog-header",e),...t});lo.displayName="DialogHeader";var io=({className:e,...t})=>(0,bt.jsx)("div",{className:de("kanban-dialog-body",e),...t});io.displayName="DialogBody";var uo=({className:e,...t})=>(0,bt.jsx)("div",{className:de("kanban-dialog-footer",e),...t});uo.displayName="DialogFooter";var co=Zr.forwardRef(({className:e,...t},a)=>(0,bt.jsx)(Ml,{ref:a,className:de("kanban-dialog-title",e),...t}));co.displayName=Ml.displayName;var Qr=Zr.forwardRef(({className:e,...t},a)=>(0,bt.jsx)(Al,{ref:a,className:de("kanban-dialog-description",e),...t}));Qr.displayName=Al.displayName;var pt=Z(require("react"),1);var Xc=require("react-dom"),$c=require("@deepseek-ai/dsh-client-ui-primitives");var Mt=require("react/jsx-runtime"),jc="dsh-kanban:card-drawer-width",dL=720,Ol=420;function cL(){try{let e=Number(window.localStorage.getItem(jc));if(Number.isFinite(e)&&e>0)return e}catch{}return dL}function Kc(e){try{window.localStorage.setItem(jc,String(e))}catch{}}var Bl=pt.forwardRef(({open:e,onClose:t,title:a,className:o,children:r,id:n,style:s,...l},i)=>{let u=pt.useRef(null);pt.useImperativeHandle(i,()=>u.current,[e]),(0,$c.useModalLayer)(u,e,t);let c=we(),d=pt.useId(),f=n??d,p=`${d}-resize-hint`,[h,g]=pt.useState(cL),[m,b]=pt.useState(()=>window.innerWidth),[x,L]=pt.useState(!1),C=pt.useRef(null),S=m<=600,v=Math.min(1e3,m-64),y=I=>Math.max(Ol,Math.min(v,I)),w=S?m:y(h);pt.useEffect(()=>{let I=()=>{C.current&&(g(C.current.preferredWidth),C.current=null,L(!1)),b(window.innerWidth)};return window.addEventListener("resize",I),()=>window.removeEventListener("resize",I)},[]);function E(I,R){let M=C.current;!M||M.pointerId!==I.pointerId||(C.current=null,L(!1),R?g(M.preferredWidth):Kc(M.lastWidth),I.currentTarget.hasPointerCapture(I.pointerId)&&I.currentTarget.releasePointerCapture(I.pointerId))}return e?(0,Xc.createPortal)((0,Mt.jsxs)(Mt.Fragment,{children:[(0,Mt.jsx)("div",{className:"kanban-portal kanban-dialog-overlay","aria-hidden":"true",onClick:t}),(0,Mt.jsxs)("div",{...l,ref:u,role:"dialog","aria-modal":"true","aria-label":a,tabIndex:-1,"data-state":"open",id:f,className:de("kanban-portal kanban-dialog-content kanban-drawer-content",o),style:{...s,width:w},"data-resizing":x||void 0,children:[r,!S&&(0,Mt.jsxs)(Mt.Fragment,{children:[(0,Mt.jsx)("div",{className:"kanban-drawer-resize",role:"separator",tabIndex:0,"aria-label":c("resizeTaskDetails"),"aria-describedby":p,"aria-orientation":"vertical","aria-valuemin":Ol,"aria-valuemax":v,"aria-valuenow":w,"aria-controls":f,title:c("resizeTaskDetailsHint"),onPointerDown:I=>{I.button!==0||C.current||(I.preventDefault(),I.currentTarget.focus(),I.currentTarget.setPointerCapture(I.pointerId),C.current={pointerId:I.pointerId,x:I.clientX,width:w,preferredWidth:h,lastWidth:w},L(!0))},onPointerMove:I=>{let R=C.current;if(!R||R.pointerId!==I.pointerId)return;let M=y(R.width+R.x-I.clientX);R.lastWidth=M,g(M)},onPointerUp:I=>E(I,!1),onPointerCancel:I=>E(I,!0),onLostPointerCapture:I=>E(I,!0),onKeyDown:I=>{let R;if(I.key==="ArrowLeft")R=y(w+32);else if(I.key==="ArrowRight")R=y(w-32);else if(I.key==="Home")R=Ol;else if(I.key==="End")R=v;else return;I.preventDefault(),g(R),Kc(R)}}),(0,Mt.jsx)("span",{id:p,className:"kanban-sr-only",children:c("resizeTaskDetailsHint")})]}),(0,Mt.jsx)("button",{type:"button",className:"kanban-dialog-close","aria-label":c("close"),onClick:t,children:(0,Mt.jsx)($e,{className:"kanban-dialog-close-icon"})})]})]}),document.body):null});Bl.displayName="DrawerContent";var Yc=Z(require("react"),1);var Zc=require("react/jsx-runtime"),Ht=Yc.forwardRef(({className:e,type:t,...a},o)=>(0,Zc.jsx)("input",{type:t,className:de("kanban-input",e),ref:o,...a}));Ht.displayName="Input";var ef=Z(require("react"),1);var Jc=Z(require("react"),1);var Qc=require("react/jsx-runtime"),fL=Object.defineProperty,pL=(e,t)=>fL(e,"name",{value:t,configurable:!0}),Fl=Jc.forwardRef(pL(function(t,a){return(0,Qc.jsx)(fe.label,{...t,ref:a,onMouseDown:o=>{o.target.closest("button, input, select, textarea")||(t.onMouseDown?.(o),!o.defaultPrevented&&o.detail>1&&o.preventDefault())}})},"Label"));var tf=require("react/jsx-runtime"),mt=ef.forwardRef(({className:e,...t},a)=>(0,tf.jsx)(Fl,{ref:a,className:de("kanban-label",e),...t}));mt.displayName=Fl.displayName;var Na=Z(require("react"),1);var U=Z(require("react"),1),jl=Z(require("react-dom"),1);var gL=Object.defineProperty,hL=(e,t)=>gL(e,"name",{value:t,configurable:!0});function Kn(e,[t,a]){return Math.min(a,Math.max(t,e))}hL(Kn,"clamp");var Wt=Z(require("react"),1);var $n=require("react/jsx-runtime"),Ke=Z(require("react"),1);var Ea=require("react/jsx-runtime");var xL=Object.defineProperty,Ge=(e,t)=>xL(e,"name",{value:t,configurable:!0});function fo(e){let t=e+"CollectionProvider",[a,o]=ot(t),[r,n]=a(t,{collectionRef:{current:null},itemMap:new Map}),s=Ge(g=>{let{scope:m,children:b}=g,x=Wt.useRef(null),L=Wt.useRef(new Map).current;return(0,$n.jsx)(r,{scope:m,itemMap:L,collectionRef:x,children:b})},"CollectionProvider");s.displayName=t;let l=e+"CollectionSlot",i=it(l),u=Wt.forwardRef((g,m)=>{let{scope:b,children:x}=g,L=n(l,b),C=ce(m,L.collectionRef);return(0,$n.jsx)(i,{ref:C,children:x})});u.displayName=l;let c=e+"CollectionItemSlot",d="data-radix-collection-item",f=it(c),p=Wt.forwardRef((g,m)=>{let{scope:b,children:x,...L}=g,C=Wt.useRef(null),S=ce(m,C),v=n(c,b);return Wt.useEffect(()=>(v.itemMap.set(C,{ref:C,...L}),()=>{v.itemMap.delete(C)})),(0,$n.jsx)(f,{[d]:"",ref:S,children:x})});p.displayName=c;function h(g){let m=n(e+"CollectionConsumer",g);return Wt.useCallback(()=>{let x=m.collectionRef.current;if(!x)return[];let L=Array.from(x.querySelectorAll(`[${d}]`));return Array.from(m.itemMap.values()).sort((v,y)=>L.indexOf(v.ref.current)-L.indexOf(y.ref.current))},[m.collectionRef,m.itemMap])}return Ge(h,"useCollection"),[{Provider:s,Slot:u,ItemSlot:p},h,o]}Ge(fo,"createCollection");var af=new WeakMap,_e,At,Xn=(At=class extends Map{constructor(a){super(a);Vi(this,_e);Ms(this,_e,[...super.keys()]),af.set(this,!0)}set(a,o){return af.get(this)&&!this.has(a)&&tt(this,_e).push(a),super.set(a,o),this}insert(a,o,r){let n=this.has(o),s=n?this.size:this.size+1,l=Nl(a),i=l>=0?Math.min(l,s-1):Math.max(s+l,0);if(n?tt(this,_e).indexOf(o)===i:i===this.size)return this.set(o,r),this;let u=tt(this,_e).filter(d=>d!==o);u.splice(i,0,o);let c=u.map(d=>[d,d===o?r:this.get(d)]);this.clear();for(let[d,f]of c)this.set(d,f);return this}with(a,o,r){let n=new At(this);return n.insert(a,o,r),n}before(a){let o=tt(this,_e).indexOf(a)-1;if(!(o<0))return this.entryAt(o)}setBefore(a,o,r){let n=tt(this,_e).indexOf(a);if(n===-1)return this;let s=tt(this,_e).indexOf(o),l=s!==-1&&s<n?n-1:n;return this.insert(l,o,r)}after(a){let o=tt(this,_e).indexOf(a);if(o=o===-1||o===this.size-1?-1:o+1,o!==-1)return this.entryAt(o)}setAfter(a,o,r){let n=tt(this,_e).indexOf(a);if(n===-1)return this;let s=tt(this,_e).indexOf(o),l=s!==-1&&s<=n?n:n+1;return this.insert(l,o,r)}first(){return this.entryAt(0)}last(){return this.entryAt(-1)}clear(){return Ms(this,_e,[]),super.clear()}delete(a){let o=super.delete(a);return o&&tt(this,_e).splice(tt(this,_e).indexOf(a),1),o}deleteAt(a){let o=this.keyAt(a);return o!==void 0?this.delete(o):!1}at(a){let o=jn(tt(this,_e),a);if(o!==void 0)return this.get(o)}entryAt(a){let o=jn(tt(this,_e),a);if(o!==void 0)return[o,this.get(o)]}indexOf(a){return tt(this,_e).indexOf(a)}keyAt(a){return jn(tt(this,_e),a)}from(a,o){let r=this.indexOf(a);if(r===-1)return;let n=r+o;return n<0&&(n=0),n>=this.size&&(n=this.size-1),this.at(n)}keyFrom(a,o){let r=this.indexOf(a);if(r===-1)return;let n=r+o;return n<0&&(n=0),n>=this.size&&(n=this.size-1),this.keyAt(n)}find(a,o){let r=0;for(let n of this){if(Reflect.apply(a,o,[n,r,this]))return n;r++}}findIndex(a,o){let r=0;for(let n of this){if(Reflect.apply(a,o,[n,r,this]))return r;r++}return-1}filter(a,o){let r=[],n=0;for(let s of this)Reflect.apply(a,o,[s,n,this])&&r.push(s),n++;return new At(r)}map(a,o){let r=[],n=0;for(let s of this)r.push([s[0],Reflect.apply(a,o,[s,n,this])]),n++;return new At(r)}reduce(...a){let[o,r]=a,n=a.length>1;if(!n&&this.size===0)throw new TypeError("Reduce of empty OrderedDict with no initial value");let s=0,l=r;for(let i of this)s===0&&!n?l=i:l=Reflect.apply(o,this,[l,i,s,this]),s++;return l}reduceRight(...a){let[o,r]=a,n=a.length>1;if(!n&&this.size===0)throw new TypeError("Reduce of empty OrderedDict with no initial value");let s=r;for(let l=this.size-1;l>=0;l--){let i=this.entryAt(l);l===this.size-1&&!n?s=i:s=Reflect.apply(o,this,[s,i,l,this])}return s}sort(a){if(typeof a!="function")throw new TypeError("OrderedDict.sort requires a compare function");let o=[...this.entries()].sort(a);this.clear();for(let[r,n]of o)this.set(r,n);return this}toSorted(a){if(typeof a!="function")throw new TypeError("OrderedDict.toSorted requires a compare function");let o=[...this.entries()].sort(a);return new At(o)}toReversed(){let a=new At;for(let o=this.size-1;o>=0;o--){let r=this.keyAt(o),n=this.get(r);a.set(r,n)}return a}toSpliced(...a){let o=[...this.entries()];return o.splice(...a),new At(o)}slice(a,o){let r=new At;for(let n of tt(this,_e).slice(a,o))r.set(n,this.get(n));return r}every(a,o){let r=0;for(let n of this){if(!Reflect.apply(a,o,[n,r,this]))return!1;r++}return!0}some(a,o){let r=0;for(let n of this){if(Reflect.apply(a,o,[n,r,this]))return!0;r++}return!1}},_e=new WeakMap,Ge(At,"OrderedDict"),At);function jn(e,t){if("at"in Array.prototype)return Array.prototype.at.call(e,t);let a=of(e,t);return a===-1?void 0:e[a]}Ge(jn,"at");function of(e,t){let a=e.length,o=Nl(t),r=o>=0?o:a+o;return r<0||r>=a?-1:r}Ge(of,"toSafeIndex");function Nl(e){return e!==e||e===0?0:Math.trunc(e)}Ge(Nl,"toSafeInteger");function LL(e){let t=e+"CollectionProvider",[a,o]=ot(t),[r,n]=a(t);r.displayName=e+"CollectionStableContextProvider";let[s,l]=a(t);s.displayName=e+"CollectionStatefulContextProvider";let i=Ge(({state:v,...y})=>v?(0,Ea.jsx)(c,{...y,state:v}):(0,Ea.jsx)(u,{...y}),"CollectionProvider");i.displayName=t;let u=Ge(v=>{let y=x();return(0,Ea.jsx)(c,{...v,state:y})},"CollectionInit");u.displayName=e+"CollectionInit";let c=Ge(v=>{let{scope:y,children:w,state:E}=v,I=Ke.useRef(null),[R,M]=Ke.useState(null),q=ce(I,M),[A,W]=E,K=Ke.useRef(new Xn),P=Ke.useCallback(()=>{let _=K.current;return sf(_)||_.sort(Yn),_},[]);return Ke.useEffect(()=>{if(!R)return;let _=lf(()=>{W(O=>{let B=O.toSorted(Yn);return B.some(([j],re)=>O.keyAt(re)!==j)?B:O})});return _.observe(R,{childList:!0,subtree:!0}),()=>{_.disconnect()}},[R,W]),(0,Ea.jsx)(r,{scope:y,collectionElementRef:q,collectionElementRefObject:I,getCollection:P,setCollection:W,registryRef:K,children:(0,Ea.jsx)(s,{scope:y,collectionElement:R,collection:A,children:w})})},"CollectionProviderImpl");c.displayName=e+"CollectionProviderImpl";let d=e+"CollectionSlot",f=it(d),p=Ke.forwardRef((v,y)=>{let{scope:w,children:E}=v,I=n(d,w),R=ce(y,I.collectionElementRef);return(0,Ea.jsx)(f,{ref:R,children:E})});p.displayName=d;let h=e+"CollectionItemSlot",g="data-radix-collection-item",m=it(h),b=Ke.forwardRef((v,y)=>{let{scope:w,children:E,...I}=v,R=Ke.useRef(null),M=n(h,w),{setCollection:q,registryRef:A}=M,W=Ke.useRef(I);rf(W.current,I)||(W.current=I);let K=W.current,P=Ke.useCallback(B=>{let F=A.current;B?F.set(B,{...W.current,element:B}):R.current&&F.delete(R.current)},[A]),_=ce(y,P,R);he(()=>{let B=R.current,F=A.current;B&&F.has(B)&&F.set(B,{...K,element:B})},[K,A]);let O=Ke.useRef(null);return Ke.useEffect(()=>{let B=R.current,F=O.current;(F?.element??null)===B&&(!B||F?.itemData===K)||(O.current=B?{element:B,itemData:K}:null,q(j=>{let re=new Xn(j);return F&&F.element!==B&&re.delete(F.element),B&&re.set(B,{...K,element:B}),re.sort(Yn)}))}),Ke.useEffect(()=>()=>{let B=O.current;O.current=null,B&&q(F=>{if(!F.has(B.element))return F;let j=new Xn(F);return j.delete(B.element),j})},[q]),(0,Ea.jsx)(m,{[g]:"",ref:_,children:E})});b.displayName=h;function x(){return Ke.useState(new Xn)}Ge(x,"useInitCollection");function L(v){let{collection:y}=l(e+"CollectionConsumer",v);return y}Ge(L,"useCollection");function C(v){let{getCollection:y}=n(e+"CollectionConsumer",v);return y}return Ge(C,"useGetCollection"),[{Provider:i,Slot:p,ItemSlot:b},{createCollectionScope:o,useCollection:L,useGetCollection:C,useInitCollection:x}]}Ge(LL,"createCollection");function rf(e,t){if(e===t)return!0;if(typeof e!="object"||typeof t!="object"||e==null||t==null)return!1;let a=Object.keys(e),o=Object.keys(t);if(a.length!==o.length)return!1;for(let r of a)if(!Object.prototype.hasOwnProperty.call(t,r)||e[r]!==t[r])return!1;return!0}Ge(rf,"shallowEqual");function nf(e,t){return!!(t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_PRECEDING)}Ge(nf,"isElementPreceding");function sf(e){let t;for(let a of e.keys()){if(t){let o=t.compareDocumentPosition(a);if(!(o&Node.DOCUMENT_POSITION_DISCONNECTED)&&o&Node.DOCUMENT_POSITION_PRECEDING)return!1}t=a}return!0}Ge(sf,"isInDocumentOrder");function Yn(e,t){return!e[1].element||!t[1].element?0:nf(e[1].element,t[1].element)?-1:1}Ge(Yn,"sortByDocumentPosition");function lf(e){return new MutationObserver(a=>{for(let o of a)if(o.type==="childList"){e();return}})}Ge(lf,"getChildListObserver");var Zn=Z(require("react"),1),vL=require("react/jsx-runtime"),bL=Object.defineProperty,CL=(e,t)=>bL(e,"name",{value:t,configurable:!0}),IL={LTR:"ltr",RTL:"rtl"},wL=Zn.createContext(void 0);function po(e){let t=Zn.useContext(wL);return e||t||IL.LTR}CL(po,"useDirection");var dt=Z(require("react"),1);var cf=["top","right","bottom","left"];var aa=Math.min,Vt=Math.max,tn=Math.round,an=Math.floor,oa=e=>({x:e,y:e}),SL={left:"right",right:"left",bottom:"top",top:"bottom"};function ql(e,t,a){return Vt(e,aa(t,a))}function ra(e,t){return typeof e=="function"?e(t):e}function ha(e){return e.split("-")[0]}function mo(e){return e.split("-")[1]}function Qn(e){return e==="x"?"y":"x"}function es(e){return e==="y"?"height":"width"}function Gt(e){let t=e[0];return t==="t"||t==="b"?"y":"x"}function ts(e){return Qn(Gt(e))}function ff(e,t,a){a===void 0&&(a=!1);let o=mo(e),r=ts(e),n=es(r),s=r==="x"?o===(a?"end":"start")?"right":"left":o==="start"?"bottom":"top";return t.reference[n]>t.floating[n]&&(s=en(s)),[s,en(s)]}function pf(e){let t=en(e);return[Jn(e),t,Jn(t)]}function Jn(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}var uf=["left","right"],df=["right","left"],yL=["top","bottom"],kL=["bottom","top"];function RL(e,t,a){switch(e){case"top":case"bottom":return a?t?df:uf:t?uf:df;case"left":case"right":return t?yL:kL;default:return[]}}function mf(e,t,a,o){let r=mo(e),n=RL(ha(e),a==="start",o);return r&&(n=n.map(s=>s+"-"+r),t&&(n=n.concat(n.map(Jn)))),n}function en(e){let t=ha(e);return SL[t]+e.slice(t.length)}function PL(e){var t,a,o,r;return{top:(t=e.top)!=null?t:0,right:(a=e.right)!=null?a:0,bottom:(o=e.bottom)!=null?o:0,left:(r=e.left)!=null?r:0}}function _l(e){return typeof e!="number"?PL(e):{top:e,right:e,bottom:e,left:e}}function go(e){let{x:t,y:a,width:o,height:r}=e;return{width:o,height:r,top:a,left:t,right:t+o,bottom:a+r,x:t,y:a}}function gf(e,t,a){let{reference:o,floating:r}=e,n=Gt(t),s=ts(t),l=es(s),i=ha(t),u=n==="y",c=o.x+o.width/2-r.width/2,d=o.y+o.height/2-r.height/2,f=o[l]/2-r[l]/2,p;switch(i){case"top":p={x:c,y:o.y-r.height};break;case"bottom":p={x:c,y:o.y+o.height};break;case"right":p={x:o.x+o.width,y:d};break;case"left":p={x:o.x-r.width,y:d};break;default:p={x:o.x,y:o.y}}let h=mo(t);return h&&(p[s]+=f*(h==="end"?1:-1)*(a&&u?-1:1)),p}async function Lf(e,t){var a;t===void 0&&(t={});let{x:o,y:r,platform:n,rects:s,elements:l,strategy:i}=e,{boundary:u="clippingAncestors",rootBoundary:c="viewport",elementContext:d="floating",altBoundary:f=!1,padding:p=0}=ra(t,e),h=_l(p),m=l[f?d==="floating"?"reference":"floating":d],b=go(await n.getClippingRect({element:(a=await(n.isElement==null?void 0:n.isElement(m)))==null||a?m:m.contextElement||await(n.getDocumentElement==null?void 0:n.getDocumentElement(l.floating)),boundary:u,rootBoundary:c,strategy:i})),x=d==="floating"?{x:o,y:r,width:s.floating.width,height:s.floating.height}:s.reference,L=await(n.getOffsetParent==null?void 0:n.getOffsetParent(l.floating)),C=await(n.isElement==null?void 0:n.isElement(L))&&await(n.getScale==null?void 0:n.getScale(L))||{x:1,y:1},S=go(n.convertOffsetParentRelativeRectToViewportRelativeRect?await n.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:x,offsetParent:L,strategy:i}):x);return{top:(b.top-S.top+h.top)/C.y,bottom:(S.bottom-b.bottom+h.bottom)/C.y,left:(b.left-S.left+h.left)/C.x,right:(S.right-b.right+h.right)/C.x}}var DL=50,bf=async(e,t,a)=>{let{placement:o="bottom",strategy:r="absolute",middleware:n=[],platform:s}=a,l=s.detectOverflow?s:{...s,detectOverflow:Lf},i=await(s.isRTL==null?void 0:s.isRTL(t)),u=await s.getElementRects({reference:e,floating:t,strategy:r}),{x:c,y:d}=gf(u,o,i),f=o,p=0,h={};for(let g=0;g<n.length;g++){let m=n[g];if(!m)continue;let{name:b,fn:x}=m,{x:L,y:C,data:S,reset:v}=await x({x:c,y:d,initialPlacement:o,placement:f,strategy:r,middlewareData:h,rects:u,platform:l,elements:{reference:e,floating:t}});c=L??c,d=C??d,h[b]={...h[b],...S},v&&p<DL&&(p++,typeof v=="object"&&(v.placement&&(f=v.placement),v.rects&&(u=v.rects===!0?await s.getElementRects({reference:e,floating:t,strategy:r}):v.rects),{x:c,y:d}=gf(u,f,i)),g=-1)}return{x:c,y:d,placement:f,strategy:r,middlewareData:h}},Cf=e=>({name:"arrow",options:e,async fn(t){let{x:a,y:o,placement:r,rects:n,platform:s,elements:l,middlewareData:i}=t,{element:u,padding:c=0}=ra(e,t)||{};if(u==null)return{};let d=_l(c),f={x:a,y:o},p=ts(r),h=es(p),g=await s.getDimensions(u),m=p==="y",b=m?"top":"left",x=m?"bottom":"right",L=m?"clientHeight":"clientWidth",C=n.reference[h]+n.reference[p]-f[p]-n.floating[h],S=f[p]-n.reference[p],v=await(s.getOffsetParent==null?void 0:s.getOffsetParent(u)),y=v?v[L]:0;(!y||!await(s.isElement==null?void 0:s.isElement(v)))&&(y=l.floating[L]||n.floating[h]);let w=C/2-S/2,E=y/2-g[h]/2-1,I=aa(d[b],E),R=aa(d[x],E),M=y-g[h]-R,q=y/2-g[h]/2+w,A=ql(I,q,M),W=!i.arrow&&mo(r)!=null&&q!==A&&n.reference[h]/2-(q<I?I:R)-g[h]/2<0,K=W?q<I?q-I:q-M:0;return{[p]:f[p]+K,data:{[p]:A,centerOffset:q-A-K,...W&&{alignmentOffset:K}},reset:W}}});var vf=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var a,o;let{placement:r,middlewareData:n,rects:s,initialPlacement:l,platform:i,elements:u}=t,{mainAxis:c=!0,crossAxis:d=!0,fallbackPlacements:f,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:h="none",flipAlignment:g=!0,...m}=ra(e,t);if((a=n.arrow)!=null&&a.alignmentOffset)return{};let b=ha(r),x=Gt(l),L=ha(l)===l,C=await(i.isRTL==null?void 0:i.isRTL(u.floating)),S=f||(L||!g?[en(l)]:pf(l)),v=h!=="none";!f&&v&&S.push(...mf(l,g,h,C));let y=[l,...S],w=await i.detectOverflow(t,m),E=[],I=((o=n.flip)==null?void 0:o.overflows)||[];if(c&&E.push(w[b]),d){let A=ff(r,s,C);E.push(w[A[0]],w[A[1]])}if(I=[...I,{placement:r,overflows:E}],!E.every(A=>A<=0)){var R,M;let A=(((R=n.flip)==null?void 0:R.index)||0)+1,W=y[A];if(W&&(!(d==="alignment"?x!==Gt(W):!1)||I.every(_=>Gt(_.placement)===x?_.overflows[0]>0:!0)))return{data:{index:A,overflows:I},reset:{placement:W}};let K=(M=I.filter(P=>P.overflows[0]<=0).sort((P,_)=>P.overflows[1]-_.overflows[1])[0])==null?void 0:M.placement;if(!K)switch(p){case"bestFit":{var q;let P=(q=I.filter(_=>{if(v){let O=Gt(_.placement);return O===x||O==="y"}return!0}).map(_=>[_.placement,_.overflows.filter(O=>O>0).reduce((O,B)=>O+B,0)]).sort((_,O)=>_[1]-O[1])[0])==null?void 0:q[0];P&&(K=P);break}case"initialPlacement":K=l;break}if(r!==K)return{reset:{placement:K}}}return{}}}};function hf(e,t){return{top:e.top-t.height,right:e.right-t.width,bottom:e.bottom-t.height,left:e.left-t.width}}function xf(e){return cf.some(t=>e[t]>=0)}var If=function(e){return e===void 0&&(e={}),{name:"hide",options:e,async fn(t){let{rects:a,platform:o}=t,{strategy:r="referenceHidden",...n}=ra(e,t);switch(r){case"referenceHidden":{let s=await o.detectOverflow(t,{...n,elementContext:"reference"}),l=hf(s,a.reference);return{data:{referenceHiddenOffsets:l,referenceHidden:xf(l)}}}case"escaped":{let s=await o.detectOverflow(t,{...n,altBoundary:!0}),l=hf(s,a.floating);return{data:{escapedOffsets:l,escaped:xf(l)}}}default:return{}}}}};var wf=new Set(["left","top"]);async function ML(e,t){let{placement:a,platform:o,elements:r}=e,n=await(o.isRTL==null?void 0:o.isRTL(r.floating)),s=ha(a),l=mo(a),i=Gt(a)==="y",u=wf.has(s)?-1:1,c=n&&i?-1:1,d=ra(t,e),{mainAxis:f,crossAxis:p,alignmentAxis:h}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return l&&typeof h=="number"&&(p=l==="end"?h*-1:h),i?{x:p*c,y:f*u}:{x:f*u,y:p*c}}var Sf=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var a,o;let{x:r,y:n,placement:s,middlewareData:l}=t,i=await ML(t,e);return s===((a=l.offset)==null?void 0:a.placement)&&(o=l.arrow)!=null&&o.alignmentOffset?{}:{x:r+i.x,y:n+i.y,data:{...i,placement:s}}}}},yf=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){let{x:a,y:o,placement:r,platform:n}=t,{mainAxis:s=!0,crossAxis:l=!1,limiter:i={fn:x=>{let{x:L,y:C}=x;return{x:L,y:C}}},...u}=ra(e,t),c={x:a,y:o},d=await n.detectOverflow(t,u),f=Gt(r),p=Qn(f),h=c[p],g=c[f],m=(x,L)=>ql(L+d[x==="y"?"top":"left"],L,L-d[x==="y"?"bottom":"right"]);s&&(h=m(p,h)),l&&(g=m(f,g));let b=i.fn({...t,[p]:h,[f]:g});return{...b,data:{x:b.x-a,y:b.y-o,enabled:{[p]:s,[f]:l}}}}}},kf=function(e){return e===void 0&&(e={}),{options:e,fn(t){var a,o;let{x:r,y:n,placement:s,rects:l,middlewareData:i}=t,{offset:u=0,mainAxis:c=!0,crossAxis:d=!0}=ra(e,t),f={x:r,y:n},p=Gt(s),h=Qn(p),g=f[h],m=f[p],b=ra(u,t),x=typeof b=="number"?{mainAxis:b,crossAxis:0}:{mainAxis:(a=b.mainAxis)!=null?a:0,crossAxis:(o=b.crossAxis)!=null?o:0};if(c){let S=h==="y"?"height":"width",v=l.reference[h]-l.floating[S]+x.mainAxis,y=l.reference[h]+l.reference[S]-x.mainAxis;g<v?g=v:g>y&&(g=y)}if(d){var L,C;let S=h==="y"?"width":"height",v=wf.has(ha(s)),y=l.reference[p]-l.floating[S]+(v&&((L=i.offset)==null?void 0:L[p])||0)+(v?0:x.crossAxis),w=l.reference[p]+l.reference[S]+(v?0:((C=i.offset)==null?void 0:C[p])||0)-(v?x.crossAxis:0);m<y?m=y:m>w&&(m=w)}return{[h]:g,[p]:m}}}},Rf=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){let{placement:a,rects:o,platform:r,elements:n}=t,{apply:s=()=>{},...l}=ra(e,t),i=await r.detectOverflow(t,l),u=ha(a),c=mo(a),d=Gt(a)==="y",{width:f,height:p}=o.floating,h,g;u==="top"||u==="bottom"?(h=u,g=c===(await(r.isRTL==null?void 0:r.isRTL(n.floating))?"start":"end")?"left":"right"):(g=u,h=c==="end"?"top":"bottom");let m=p-i.top-i.bottom,b=f-i.left-i.right,x=aa(p-i[h],m),L=aa(f-i[g],b),C=t.middlewareData.shift,S=!C,v=x,y=L;C!=null&&C.enabled.x&&(y=b),C!=null&&C.enabled.y&&(v=m),S&&!c&&(d?y=f-2*Vt(i.left,i.right):v=p-2*Vt(i.top,i.bottom)),await s({...t,availableWidth:y,availableHeight:v});let w=await r.getDimensions(n.floating);return f!==w.width||p!==w.height?{reset:{rects:!0}}:{}}}};function as(){return typeof window<"u"}function Lo(e){return Df(e)?(e.nodeName||"").toLowerCase():"#document"}function gt(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function na(e){var t;return(t=(Df(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function Df(e){return as()?e instanceof Node||e instanceof gt(e).Node:!1}function Kt(e){return as()?e instanceof Element||e instanceof gt(e).Element:!1}function xa(e){return as()?e instanceof HTMLElement||e instanceof gt(e).HTMLElement:!1}function Pf(e){return!as()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof gt(e).ShadowRoot}function on(e){let{overflow:t,overflowX:a,overflowY:o,display:r}=Xt(e);return/auto|scroll|overlay|hidden|clip/.test(t+o+a)&&r!=="inline"&&r!=="contents"}function Mf(e){return/^(table|td|th)$/.test(Lo(e))}function rn(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}var AL=/transform|translate|scale|rotate|perspective|filter/,TL=/paint|layout|strict|content/,ho=e=>!!e&&e!=="none",Hl;function os(e){let t=Kt(e)?Xt(e):e;return ho(t.transform)||ho(t.translate)||ho(t.scale)||ho(t.rotate)||ho(t.perspective)||!rs()&&(ho(t.backdropFilter)||ho(t.filter))||AL.test(t.willChange||"")||TL.test(t.contain||"")}function Af(e){let t=Oa(e);for(;xa(t)&&!Qo(t);){if(os(t))return t;if(rn(t))return null;t=Oa(t)}return null}function rs(){return Hl==null&&(Hl=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Hl}function Qo(e){return/^(html|body|#document)$/.test(Lo(e))}function Xt(e){return gt(e).getComputedStyle(e)}function nn(e){return Kt(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Oa(e){if(Lo(e)==="html")return e;let t=e.assignedSlot||e.parentNode||Pf(e)&&e.host||na(e);return Pf(t)?t.host:t}function Tf(e){let t=Oa(e);return Qo(t)?(e.ownerDocument||e).body:xa(t)&&on(t)?t:Tf(t)}function xo(e,t,a){var o;t===void 0&&(t=[]),a===void 0&&(a=!0);let r=Tf(e),n=r===((o=e.ownerDocument)==null?void 0:o.body),s=gt(r);if(n){let l=ns(s);return t.concat(s,s.visualViewport||[],on(r)?r:[],l&&a?xo(l):[])}else return t.concat(r,xo(r,[],a))}function ns(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Bf(e){let t=Xt(e),a=parseFloat(t.width)||0,o=parseFloat(t.height)||0,r=xa(e),n=r?e.offsetWidth:a,s=r?e.offsetHeight:o,l=tn(a)!==n||tn(o)!==s;return l&&(a=n,o=s),{width:a,height:o,$:l}}function zl(e){return Kt(e)?e:e.contextElement}function er(e){let t=zl(e);if(!xa(t))return oa(1);let a=t.getBoundingClientRect(),{width:o,height:r,$:n}=Bf(t),s=(n?tn(a.width):a.width)/o,l=(n?tn(a.height):a.height)/r;return(!s||!Number.isFinite(s))&&(s=1),(!l||!Number.isFinite(l))&&(l=1),{x:s,y:l}}var EL=oa(0);function Ff(e){let t=gt(e);return!rs()||!t.visualViewport?EL:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function OL(e,t,a){return t===void 0&&(t=!1),!!a&&t&&a===gt(e)}function bo(e,t,a,o){t===void 0&&(t=!1),a===void 0&&(a=!1);let r=e.getBoundingClientRect(),n=zl(e),s=oa(1);t&&(o?Kt(o)&&(s=er(o)):s=er(e));let l=OL(n,a,o)?Ff(n):oa(0),i=(r.left+l.x)/s.x,u=(r.top+l.y)/s.y,c=r.width/s.x,d=r.height/s.y;if(n&&o){let f=gt(n),p=Kt(o)?gt(o):o,h=f,g=ns(h);for(;g&&p!==h;){let m=er(g),b=g.getBoundingClientRect(),x=Xt(g),L=b.left+(g.clientLeft+parseFloat(x.paddingLeft))*m.x,C=b.top+(g.clientTop+parseFloat(x.paddingTop))*m.y;i*=m.x,u*=m.y,c*=m.x,d*=m.y,i+=L,u+=C,h=gt(g),g=ns(h)}}return go({width:c,height:d,x:i,y:u})}function ss(e,t){let a=nn(e).scrollLeft;return t?t.left+a:bo(na(e)).left+a}function Nf(e,t){let a=e.getBoundingClientRect(),o=a.left+t.scrollLeft-ss(e,a),r=a.top+t.scrollTop;return{x:o,y:r}}function BL(e){let{elements:t,rect:a,offsetParent:o,strategy:r}=e,n=r==="fixed",s=na(o),l=t?rn(t.floating):!1;if(o===s||l&&n)return a;let i={scrollLeft:0,scrollTop:0},u=oa(1),c=oa(0),d=xa(o);if((d||!n)&&((Lo(o)!=="body"||on(s))&&(i=nn(o)),d)){let p=bo(o);u=er(o),c.x=p.x+o.clientLeft,c.y=p.y+o.clientTop}let f=s&&!d&&!n?Nf(s,i):oa(0);return{width:a.width*u.x,height:a.height*u.y,x:a.x*u.x-i.scrollLeft*u.x+c.x+f.x,y:a.y*u.y-i.scrollTop*u.y+c.y+f.y}}function FL(e){return e.getClientRects?Array.from(e.getClientRects()):[]}function NL(e){let t=nn(e),a=e.ownerDocument.body,o=Vt(e.scrollWidth,e.clientWidth,a.scrollWidth,a.clientWidth),r=Vt(e.scrollHeight,e.clientHeight,a.scrollHeight,a.clientHeight),n=-t.scrollLeft+ss(e),s=-t.scrollTop;return Xt(a).direction==="rtl"&&(n+=Vt(e.clientWidth,a.clientWidth)-o),{width:o,height:r,x:n,y:s}}var qL=25;function _L(e,t,a){a===void 0&&(a="viewport");let o=a==="layoutViewport",r=gt(e),n=na(e),s=r.visualViewport,l=n.clientWidth,i=n.clientHeight,u=0,c=0;if(s){let f=!rs()||t==="fixed";o?f||(u=-s.offsetLeft,c=-s.offsetTop):(l=s.width,i=s.height,f&&(u=s.offsetLeft,c=s.offsetTop))}if(ss(n)<=0){let f=n.ownerDocument,p=f.body,h=getComputedStyle(p),g=f.compatMode==="CSS1Compat"&&parseFloat(h.marginLeft)+parseFloat(h.marginRight)||0,m=Math.abs(n.clientWidth-p.clientWidth-g),b=getComputedStyle(n).scrollbarGutter==="stable both-edges"?m/2:m;b<=qL&&(l-=b)}return{width:l,height:i,x:u,y:c}}function HL(e,t){let a=bo(e,!0,t==="fixed"),o=a.top+e.clientTop,r=a.left+e.clientLeft,n=er(e),s=e.clientWidth*n.x,l=e.clientHeight*n.y,i=r*n.x,u=o*n.y;return{width:s,height:l,x:i,y:u}}function Ef(e,t,a){let o;if(t==="viewport"||t==="layoutViewport")o=_L(e,a,t);else if(t==="document")o=NL(na(e));else if(Kt(t))o=HL(t,a);else{let r=Ff(e);o={x:t.x-r.x,y:t.y-r.y,width:t.width,height:t.height}}return go(o)}function UL(e,t){let a=t.get(e);if(a)return a;let o=xo(e,[],!1).filter(l=>Kt(l)&&Lo(l)!=="body"),r=null,n=Xt(e).position==="fixed",s=n?Oa(e):e;for(;Kt(s)&&!Qo(s);){let l=Xt(s),i=os(s),u=r?r.position:n?"fixed":"";!i&&(u==="fixed"||u==="absolute"&&l.position==="static")?o=o.filter(d=>d!==s):r=l,s=Oa(s)}return t.set(e,o),o}function zL(e){let{element:t,boundary:a,rootBoundary:o,strategy:r}=e,s=[...a==="clippingAncestors"?rn(t)?[]:UL(t,this._c):[].concat(a),o],l=Ef(t,s[0],r),i=l.top,u=l.right,c=l.bottom,d=l.left;for(let f=1;f<s.length;f++){let p=Ef(t,s[f],r);i=Vt(p.top,i),u=aa(p.right,u),c=aa(p.bottom,c),d=Vt(p.left,d)}return{width:u-d,height:c-i,x:d,y:i}}function WL(e){let{width:t,height:a}=Bf(e);return{width:t,height:a}}function VL(e,t,a){let o=xa(t),r=na(t),n=a==="fixed",s=bo(e,!0,n,t),l={scrollLeft:0,scrollTop:0},i=oa(0);if((o||!n)&&((Lo(t)!=="body"||on(r))&&(l=nn(t)),o)){let f=bo(t,!0,n,t);i.x=f.x+t.clientLeft,i.y=f.y+t.clientTop}!o&&r&&(i.x=ss(r));let u=r&&!o&&!n?Nf(r,l):oa(0),c=s.left+l.scrollLeft-i.x-u.x,d=s.top+l.scrollTop-i.y-u.y;return{x:c,y:d,width:s.width,height:s.height}}function Ul(e){return Xt(e).position==="static"}function Of(e,t){if(!xa(e)||Xt(e).position==="fixed")return null;if(t)return t(e);let a=e.offsetParent;return na(e)===a&&(a=a.ownerDocument.body),a}function qf(e,t){let a=gt(e);if(rn(e))return a;if(!xa(e)){let r=Oa(e);for(;r&&!Qo(r);){if(Kt(r)&&!Ul(r))return r;r=Oa(r)}return a}let o=Of(e,t);for(;o&&Mf(o)&&Ul(o);)o=Of(o,t);return o&&Qo(o)&&Ul(o)&&!os(o)?a:o||Af(e)||a}var GL=async function(e){let t=this.getOffsetParent||qf,a=this.getDimensions,o=await a(e.floating);return{reference:VL(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function KL(e){return Xt(e).direction==="rtl"}var _f={convertOffsetParentRelativeRectToViewportRelativeRect:BL,getDocumentElement:na,getClippingRect:zL,getOffsetParent:qf,getElementRects:GL,getClientRects:FL,getDimensions:WL,getScale:er,isElement:Kt,isRTL:KL};function Hf(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function XL(e,t,a){let o=null,r,n=na(e);function s(){var c;clearTimeout(r),(c=o)==null||c.disconnect(),o=null}function l(c,d){c===void 0&&(c=!1),d===void 0&&(d=1),s();let f=e.getBoundingClientRect(),{left:p,top:h,width:g,height:m}=f;if(c||t(),!g||!m)return;let b=an(h),x=an(n.clientWidth-(p+g)),L=an(n.clientHeight-(h+m)),C=an(p),v={rootMargin:-b+"px "+-x+"px "+-L+"px "+-C+"px",threshold:Vt(0,aa(1,d))||1},y=!0;function w(E){let I=E[0].intersectionRatio;if(!Hf(f,e.getBoundingClientRect()))return l();if(I!==d){if(!y)return l();I?l(!1,I):r=setTimeout(()=>{l(!1,1e-7)},1e3)}y=!1}try{o=new IntersectionObserver(w,{...v,root:n.ownerDocument})}catch{o=new IntersectionObserver(w,v)}o.observe(e)}let i=gt(e),u=()=>l(a);return i.addEventListener("resize",u),l(!0),()=>{i.removeEventListener("resize",u),s()}}function Wl(e,t,a,o){o===void 0&&(o={});let{ancestorScroll:r=!0,ancestorResize:n=!0,elementResize:s=typeof ResizeObserver=="function",layoutShift:l=typeof IntersectionObserver=="function",animationFrame:i=!1}=o,u=zl(e),c=r||n?[...u?xo(u):[],...t?xo(t):[]]:[];c.forEach(b=>{r&&b.addEventListener("scroll",a),n&&b.addEventListener("resize",a)});let d=u&&l?XL(u,a,n):null,f=-1,p=null;s&&(p=new ResizeObserver(b=>{let[x]=b;x&&x.target===u&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var L;(L=p)==null||L.observe(t)})),a()}),u&&!i&&p.observe(u),t&&p.observe(t));let h,g=i?bo(e):null;i&&m();function m(){let b=bo(e);g&&!Hf(g,b)&&a(),g=b,h=requestAnimationFrame(m)}return a(),()=>{var b;c.forEach(x=>{r&&x.removeEventListener("scroll",a),n&&x.removeEventListener("resize",a)}),d?.(),(b=p)==null||b.disconnect(),p=null,i&&cancelAnimationFrame(h)}}var Uf=Sf;var zf=yf,Wf=vf,Vf=Rf,Gf=If,Vl=Cf;var Kf=kf,Gl=(e,t,a)=>{let o=new Map,r=a??{},n={..._f,...r.platform,_c:o};return bf(e,t,{...r,platform:n})};var We=Z(require("react"),1),$f=require("react"),jf=Z(require("react-dom"),1),$L=typeof document<"u",jL=function(){},ls=$L?$f.useLayoutEffect:jL;function is(e,t){if(e===t)return!0;if(typeof e!=typeof t)return!1;if(typeof e=="function"&&e.toString()===t.toString())return!0;let a,o,r;if(e&&t&&typeof e=="object"){if(Array.isArray(e)){if(a=e.length,a!==t.length)return!1;for(o=a;o--!==0;)if(!is(e[o],t[o]))return!1;return!0}if(r=Object.keys(e),a=r.length,a!==Object.keys(t).length)return!1;for(o=a;o--!==0;)if(!{}.hasOwnProperty.call(t,r[o]))return!1;for(o=a;o--!==0;){let n=r[o];if(!(n==="_owner"&&e.$$typeof)&&!is(e[n],t[n]))return!1}return!0}return e!==e&&t!==t}function Yf(e){return typeof window>"u"?1:(e.ownerDocument.defaultView||window).devicePixelRatio||1}function Xf(e,t){let a=Yf(e);return Math.round(t*a)/a}function Kl(e){let t=We.useRef(e);return ls(()=>{t.current=e}),t}function Zf(e){e===void 0&&(e={});let{placement:t="bottom",strategy:a="absolute",middleware:o=[],platform:r,elements:{reference:n,floating:s}={},transform:l=!0,whileElementsMounted:i,open:u}=e,[c,d]=We.useState({x:0,y:0,strategy:a,placement:t,middlewareData:{},isPositioned:!1}),[f,p]=We.useState(o);is(f,o)||p(o);let[h,g]=We.useState(null),[m,b]=We.useState(null),x=We.useCallback(_=>{_!==v.current&&(v.current=_,g(_))},[]),L=We.useCallback(_=>{_!==y.current&&(y.current=_,b(_))},[]),C=n||h,S=s||m,v=We.useRef(null),y=We.useRef(null),w=We.useRef(c),E=i!=null,I=Kl(i),R=Kl(r),M=Kl(u),q=We.useCallback(()=>{if(!v.current||!y.current)return;let _={placement:t,strategy:a,middleware:f};R.current&&(_.platform=R.current),Gl(v.current,y.current,_).then(O=>{let B={...O,isPositioned:M.current!==!1};A.current&&!is(w.current,B)&&(w.current=B,jf.flushSync(()=>{d(B)}))})},[f,t,a,R,M]);ls(()=>{u===!1&&w.current.isPositioned&&(w.current.isPositioned=!1,d(_=>({..._,isPositioned:!1})))},[u]);let A=We.useRef(!1);ls(()=>(A.current=!0,()=>{A.current=!1}),[]),ls(()=>{if(C&&(v.current=C),S&&(y.current=S),C&&S){if(I.current)return I.current(C,S,q);q()}},[C,S,q,I,E]);let W=We.useMemo(()=>({reference:v,floating:y,setReference:x,setFloating:L}),[x,L]),K=We.useMemo(()=>({reference:C,floating:S}),[C,S]),P=We.useMemo(()=>{let _={position:a,left:0,top:0};if(!K.floating)return _;let O=Xf(K.floating,c.x),B=Xf(K.floating,c.y);return l?{..._,transform:"translate("+O+"px, "+B+"px)",...Yf(K.floating)>=1.5&&{willChange:"transform"}}:{position:a,left:O,top:B}},[a,l,K.floating,c.x,c.y]);return We.useMemo(()=>({...c,update:q,refs:W,elements:K,floatingStyles:P}),[c,q,W,K,P])}var YL=e=>{function t(a){return{}.hasOwnProperty.call(a,"current")}return{name:"arrow",options:e,fn(a){let{element:o,padding:r}=typeof e=="function"?e(a):e;return o&&t(o)?o.current!=null?Vl({element:o.current,padding:r}).fn(a):{}:o?Vl({element:o,padding:r}).fn(a):{}}}},Jf=(e,t)=>{let a=Uf(e);return{name:a.name,fn:a.fn,options:[e,t]}},Qf=(e,t)=>{let a=zf(e);return{name:a.name,fn:a.fn,options:[e,t]}},ep=(e,t)=>({fn:Kf(e).fn,options:[e,t]}),tp=(e,t)=>{let a=Wf(e);return{name:a.name,fn:a.fn,options:[e,t]}},ap=(e,t)=>{let a=Vf(e);return{name:a.name,fn:a.fn,options:[e,t]}};var op=(e,t)=>{let a=Gf(e);return{name:a.name,fn:a.fn,options:[e,t]}};var rp=(e,t)=>{let a=YL(e);return{name:a.name,fn:a.fn,options:[e,t]}};var np=Z(require("react"),1);var ZL=Object.defineProperty,JL=(e,t)=>ZL(e,"name",{value:t,configurable:!0});function Xl(e){let[t,a]=np.useState(void 0);return he(()=>{if(e){a({width:e.offsetWidth,height:e.offsetHeight});let o=0,r=new ResizeObserver(n=>{if(!Array.isArray(n)||!n.length)return;let s=n[0];window.cancelAnimationFrame(o),o=window.requestAnimationFrame(()=>{let l,i;if("borderBoxSize"in s){let u=s.borderBoxSize,c=Array.isArray(u)?u[0]:u;l=c.inlineSize,i=c.blockSize}else l=e.offsetWidth,i=e.offsetHeight;a({width:l,height:i})})});return r.observe(e,{box:"border-box"}),()=>{window.cancelAnimationFrame(o),r.unobserve(e)}}else a(void 0)},[e]),t}JL(Xl,"useSize");var tr=require("react/jsx-runtime"),QL=Object.defineProperty,Ba=(e,t)=>QL(e,"name",{value:t,configurable:!0});var sp={Partial:"partial",Always:"always"},lp={Optimized:"optimized",Always:"always"},ip="Popper",[up,ar]=ot(ip),[eb,dp]=up(ip),us=Ba(e=>{let{__scopePopper:t,children:a}=e,[o,r]=dt.useState(null),[n,s]=dt.useState(void 0);return(0,tr.jsx)(eb,{scope:t,anchor:o,onAnchorChange:r,placementState:n,setPlacementState:s,children:a})},"Popper"),tb="PopperAnchor",ds=dt.forwardRef(Ba(function(t,a){let{__scopePopper:o,virtualRef:r,...n}=t,s=dp(tb,o),l=dt.useRef(null),i=s.onAnchorChange,u=dt.useCallback(g=>{l.current=g,g&&i(g)},[i]),c=ce(a,u),d=dt.useRef(null);dt.useEffect(()=>{if(!r)return;let g=d.current;d.current=r.current,g!==d.current&&i(d.current)});let f=s.placementState&&fs(s.placementState),p=f?.[0],h=f?.[1];return r?null:(0,tr.jsx)(fe.div,{"data-radix-popper-side":p,"data-radix-popper-align":h,...n,ref:c})},"PopperAnchor")),cp="PopperContent",[ab,Ky]=up(cp),cs=dt.forwardRef(Ba(function(t,a){let{__scopePopper:o,side:r="bottom",sideOffset:n=0,align:s="center",alignOffset:l=0,arrowPadding:i=0,avoidCollisions:u=!0,collisionBoundary:c=[],collisionPadding:d=0,sticky:f=sp.Partial,hideWhenDetached:p=!1,updatePositionStrategy:h=lp.Optimized,onPlaced:g,...m}=t,b=dp(cp,o),[x,L]=dt.useState(null),C=ce(a,L),[S,v]=dt.useState(null),y=Xl(S),w=y?.width??0,E=y?.height??0,I=r+(s!=="center"?"-"+s:""),R=typeof d=="number"?d:{top:0,right:0,bottom:0,left:0,...d},M=Array.isArray(c)?c:[c],q=M.length>0,A={padding:R,boundary:M.filter(fp),altBoundary:q},{refs:W,floatingStyles:K,placement:P,isPositioned:_,middlewareData:O}=Zf({strategy:"fixed",placement:I,whileElementsMounted:Ba((...Ce)=>Wl(...Ce,{animationFrame:h===lp.Always}),"whileElementsMounted"),elements:{reference:b.anchor},middleware:[Jf({mainAxis:n+E,alignmentAxis:l}),u&&Qf({mainAxis:!0,crossAxis:!1,...f===sp.Partial?{limiter:ep()}:{},...A}),u&&tp({...A}),ap({...A,apply:Ba(({elements:Ce,rects:z,availableWidth:oe,availableHeight:ue})=>{let{width:ee,height:te}=z.reference,Y=Ce.floating.style;Y.setProperty("--radix-popper-available-width",`${oe}px`),Y.setProperty("--radix-popper-available-height",`${ue}px`),Y.setProperty("--radix-popper-anchor-width",`${ee}px`),Y.setProperty("--radix-popper-anchor-height",`${te}px`)},"apply")}),S&&rp({element:S,padding:i}),ob({arrowWidth:w,arrowHeight:E}),p&&op(q?{strategy:"referenceHidden",...A}:{strategy:"referenceHidden",padding:A.padding,altBoundary:A.altBoundary})]}),B=b.setPlacementState;he(()=>(B(P),()=>{B(void 0)}),[P,B]);let[F,j]=fs(P),re=Ye(g);he(()=>{_&&re?.()},[_,re]);let ge=O.arrow?.x,be=O.arrow?.y,G=O.arrow?.centerOffset!==0,[xe,Ie]=dt.useState();return he(()=>{x&&Ie(window.getComputedStyle(x).zIndex)},[x]),(0,tr.jsx)("div",{ref:W.setFloating,"data-radix-popper-content-wrapper":"",style:{...K,transform:_?K.transform:"translate(0, -200%)",minWidth:"max-content",zIndex:xe,"--radix-popper-transform-origin":[O.transformOrigin?.x,O.transformOrigin?.y].join(" "),...O.hide?.referenceHidden&&{visibility:"hidden",pointerEvents:"none"}},dir:t.dir,children:(0,tr.jsx)(ab,{scope:o,placedSide:F,placedAlign:j,onArrowChange:v,arrowX:ge,arrowY:be,shouldHideArrow:G,children:(0,tr.jsx)(fe.div,{"data-side":F,"data-align":j,...m,ref:C,style:{...m.style,animation:_?m.style?.animation:"none"}})})})},"PopperContent"));function fp(e){return e!==null}Ba(fp,"isNotNull");var ob=Ba(e=>({name:"transformOrigin",options:e,fn(t){let{placement:a,rects:o,middlewareData:r}=t,s=r.arrow?.centerOffset!==0,l=s?0:e.arrowWidth,i=s?0:e.arrowHeight,[u,c]=fs(a),d={start:"0%",center:"50%",end:"100%"}[c],f=(r.arrow?.x??0)+l/2,p=(r.arrow?.y??0)+i/2,h="",g="";return u==="bottom"?(h=s?d:`${f}px`,g=`${-i}px`):u==="top"?(h=s?d:`${f}px`,g=`${o.floating.height+i}px`):u==="right"?(h=`${-i}px`,g=s?d:`${p}px`):u==="left"&&(h=`${o.floating.width+i}px`,g=s?d:`${p}px`),{data:{x:h,y:g}}}}),"transformOrigin");function fs(e){let[t,a="center"]=e.split("-");return[t,a]}Ba(fs,"getSideAndAlignFromPlacement");var rb=Z(require("react"),1);var nb=require("react/jsx-runtime");var mp=Object.freeze({position:"absolute",border:0,width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",wordWrap:"normal"});var Q=require("react/jsx-runtime"),lb=Object.defineProperty,me=(e,t)=>lb(e,"name",{value:t,configurable:!0}),gp={ItemAligned:"item-aligned",Popper:"popper"},ib={LTR:"ltr",RTL:"rtl"},ub=[" ","Enter","ArrowUp","ArrowDown"],db=[" ","Enter"],or="Select",[ms,gs,cb]=fo(or),[vo,gk]=ot(or,[cb,ar]),Yl=ar(),[fb,Fa]=vo(or),[pb,mb]=vo(or);function Cp(e){let{__scopeSelect:t,children:a,open:o,defaultOpen:r,onOpenChange:n,value:s,defaultValue:l,onValueChange:i,dir:u,name:c,autoComplete:d,disabled:f,required:p,form:h,internal_do_not_use_render:g}=e,m=Yl(t),[b,x]=U.useState(null),[L,C]=U.useState(null),[S,v]=U.useState(!1),y=po(u),[w,E]=ea({prop:o,defaultProp:r??!1,onChange:n,caller:or}),[I,R]=ea({prop:s,defaultProp:l,onChange:i,caller:or}),M=U.useRef(null),q=U.useRef(!1),[A,W]=U.useState(null),K=me(G=>{W({value:G,hasConsumerStoppedPropagation:q.current}),R(G)},"handleUserSelect"),P=U.useRef(I);U.useEffect(()=>{let G=h?b?.ownerDocument.getElementById(h):b?.form;if(G instanceof HTMLFormElement){let xe=me(()=>R(P.current),"reset");return G.addEventListener("reset",xe),()=>G.removeEventListener("reset",xe)}},[h,b,R]);let _=b?!!h||!!b.closest("form"):!0,[O,B]=U.useState(new Set),F=Pt(),j=Array.from(O).map(G=>G.props.value).join(";"),re=U.useCallback(G=>{B(xe=>new Set(xe).add(G))},[]),ge=U.useCallback(G=>{B(xe=>{let Ie=new Set(xe);return Ie.delete(G),Ie})},[]),be={required:p,trigger:b,onTriggerChange:x,valueNode:L,onValueNodeChange:C,valueNodeHasChildren:S,onValueNodeHasChildrenChange:v,contentId:F,value:I,onValueChange:R,hasConsumerStoppedPropagationRef:q,userSelection:A,onUserSelect:K,open:w,onOpenChange:E,dir:y,triggerPointerDownPosRef:M,disabled:f,name:c,autoComplete:d,form:h,nativeOptions:O,nativeSelectKey:j,isFormControl:_};return(0,Q.jsx)(us,{...m,children:(0,Q.jsx)(fb,{scope:t,...be,children:(0,Q.jsx)(ms.Provider,{scope:t,children:(0,Q.jsx)(pb,{scope:t,onNativeOptionAdd:re,onNativeOptionRemove:ge,children:Ap(g)?g(be):a})})})})}me(Cp,"SelectProvider");var vp=me(e=>{let{__scopeSelect:t,children:a,...o}=e;return(0,Q.jsx)(Cp,{__scopeSelect:t,...o,internal_do_not_use_render:({isFormControl:r})=>(0,Q.jsxs)(Q.Fragment,{children:[a,r?(0,Q.jsx)(Ab,{__scopeSelect:t}):null]})})},"Select"),gb="SelectTrigger",Zl=U.forwardRef(me(function(t,a){let{__scopeSelect:o,disabled:r=!1,...n}=t,s=Yl(o),l=Fa(gb,o),i=l.disabled||r,u=ce(a,l.onTriggerChange),c=gs(o),d=U.useRef("touch"),[f,p,h]=ni(m=>{let b=c().filter(C=>!C.disabled),x=b.find(C=>C.value===l.value),L=si(b,m,x);L!==void 0&&l.onUserSelect(L.value)}),g=me(m=>{i||(l.onOpenChange(!0),h()),m&&(l.triggerPointerDownPosRef.current={x:Math.round(m.pageX),y:Math.round(m.pageY)})},"handleOpen");return(0,Q.jsx)(ds,{asChild:!0,...s,children:(0,Q.jsx)(fe.button,{type:"button",role:"combobox","aria-controls":l.open?l.contentId:void 0,"aria-expanded":l.open,"aria-required":l.required,"aria-autocomplete":"none",dir:l.dir,"data-state":l.open?"open":"closed",disabled:i,"data-disabled":i?"":void 0,"data-placeholder":sn(l.value)?"":void 0,...n,ref:u,onClick:J(n.onClick,m=>{m.currentTarget.focus(),d.current!=="mouse"&&g(m)}),onPointerDown:J(n.onPointerDown,m=>{d.current=m.pointerType;let b=m.target;b.hasPointerCapture(m.pointerId)&&b.releasePointerCapture(m.pointerId),m.button===0&&m.ctrlKey===!1&&m.pointerType==="mouse"&&(g(m),m.preventDefault())}),onKeyDown:J(n.onKeyDown,m=>{let b=f.current!=="";!(m.ctrlKey||m.altKey||m.metaKey)&&m.key.length===1&&(l.hasConsumerStoppedPropagationRef.current=m.isPropagationStopped(),p(m.key)),!(b&&m.key===" ")&&ub.includes(m.key)&&(g(),m.preventDefault())})})})},"SelectTrigger")),hb="SelectValue",Ip=U.forwardRef(me(function(t,a){let{__scopeSelect:o,className:r,style:n,children:s,placeholder:l="",...i}=t,u=Fa(hb,o),{onValueNodeHasChildrenChange:c}=u,d=s!==void 0,f=ce(a,u.onValueNodeChange);he(()=>{c(d)},[c,d]);let p=sn(u.value);return(0,Q.jsx)(fe.span,{...i,asChild:p?!1:i.asChild,ref:f,style:{pointerEvents:"none"},children:(0,Q.jsx)(U.Fragment,{children:p?l:s},p?"placeholder":"value")})},"SelectValue")),wp=U.forwardRef(me(function(t,a){let{__scopeSelect:o,children:r,...n}=t;return(0,Q.jsx)(fe.span,{"aria-hidden":!0,...n,ref:a,children:r||"\u25BC"})},"SelectIcon")),xb="SelectPortal",[Lb,bb]=vo(xb,{forceMount:void 0}),Sp=me(e=>{let{__scopeSelect:t,forceMount:a,...o}=e;return(0,Q.jsx)(Lb,{scope:e.__scopeSelect,forceMount:a,children:(0,Q.jsx)(Vo,{asChild:!0,...o})})},"SelectPortal"),Co="SelectContent",Jl=U.forwardRef(me(function(t,a){let o=bb(Co,t.__scopeSelect),{forceMount:r=o.forceMount,...n}=t,s=Fa(Co,t.__scopeSelect),[l,i]=U.useState();return he(()=>{i(new DocumentFragment)},[]),(0,Q.jsx)(ga,{present:r||s.open,children:({present:u})=>u?(0,Q.jsx)(Ib,{...n,ref:a}):(0,Q.jsx)(Cb,{...n,fragment:l})})},"SelectContent")),Cb=U.forwardRef(me(function(t,a){let{__scopeSelect:o,children:r,fragment:n}=t;return n?jl.createPortal((0,Q.jsx)(yp,{scope:o,children:(0,Q.jsx)(ms.Slot,{scope:o,children:(0,Q.jsx)("div",{ref:a,children:r})})}),n):null},"SelectContentFragment")),$t=10,[yp,Io]=vo(Co),vb=it("SelectContent.RemoveScroll"),Ib=U.forwardRef(me(function(t,a){let{__scopeSelect:o}=t,{position:r=gp.ItemAligned,onCloseAutoFocus:n,onEscapeKeyDown:s,onPointerDownOutside:l,side:i,sideOffset:u,align:c,alignOffset:d,arrowPadding:f,collisionBoundary:p,collisionPadding:h,sticky:g,hideWhenDetached:m,avoidCollisions:b,...x}=t,L=Fa(Co,o),[C,S]=U.useState(null),[v,y]=U.useState(null),w=ce(a,S),[E,I]=U.useState(null),[R,M]=U.useState(null),q=gs(o),[A,W]=U.useState(!1),K=U.useRef(!1),P=U.useRef(!1),_=U.useRef(!1);U.useEffect(()=>{if(C)return Zo(C)},[C]),Ta();let O=U.useCallback(z=>{let[oe,...ue]=q().map(Y=>Y.ref.current),[ee]=ue.slice(-1),te=document.activeElement;for(let Y of z)if(Y===te||(Y?.scrollIntoView({block:"nearest"}),Y===oe&&v&&(v.scrollTop=0),Y===ee&&v&&(v.scrollTop=v.scrollHeight),Y?.focus(),document.activeElement!==te))return},[q,v]),B=U.useCallback(()=>O([E,C]),[O,E,C]);U.useEffect(()=>{A&&B()},[A,B]);let{onOpenChange:F,triggerPointerDownPosRef:j}=L;U.useEffect(()=>{if(C){let z={x:0,y:0},oe=me(ee=>{z={x:Math.abs(Math.round(ee.pageX)-(j.current?.x??0)),y:Math.abs(Math.round(ee.pageY)-(j.current?.y??0))}},"handlePointerMove"),ue=me(ee=>{z.x<=10&&z.y<=10?ee.preventDefault():ee.composedPath().includes(C)||F(!1),document.removeEventListener("pointermove",oe),j.current=null},"handlePointerUp");return j.current!==null&&(document.addEventListener("pointermove",oe),document.addEventListener("pointerup",ue,{capture:!0,once:!0})),()=>{document.removeEventListener("pointermove",oe),document.removeEventListener("pointerup",ue,{capture:!0})}}},[C,F,j]),U.useEffect(()=>{let z=me(()=>F(!1),"close");return window.addEventListener("blur",z),window.addEventListener("resize",z),()=>{window.removeEventListener("blur",z),window.removeEventListener("resize",z)}},[F]);let[re,ge]=ni(z=>{let oe=q().filter(te=>!te.disabled),ue=oe.find(te=>te.ref.current===document.activeElement),ee=si(oe,z,ue);ee&&setTimeout(()=>ee.ref.current?.focus())}),be=U.useCallback((z,oe,ue)=>{let ee=!P.current;ee&&(P.current=!0);let te=!K.current&&!ue;L.value!==void 0&&L.value===oe||te?(I(z),te&&(K.current=!0)):ee&&I(z)},[L.value]),G=U.useCallback(()=>C?.focus(),[C]),xe=U.useCallback((z,oe,ue)=>{if(!z)return;let ee=!_.current;ee&&(_.current=!0);let te=!K.current&&!ue;(L.value!==void 0&&L.value===oe||te||ee)&&M(z)},[L.value]),Ie=r===gp.Popper?hp:wb,Ce=Ie===hp?{side:i,sideOffset:u,align:c,alignOffset:d,arrowPadding:f,collisionBoundary:p,collisionPadding:h,sticky:g,hideWhenDetached:m,avoidCollisions:b}:{};return(0,Q.jsx)(yp,{scope:o,content:C,viewport:v,onViewportChange:y,itemRefCallback:be,selectedItem:E,onItemLeave:G,itemTextRefCallback:xe,focusSelectedItem:B,selectedItemText:R,position:r,isPositioned:A,searchRef:re,children:(0,Q.jsx)(no,{as:vb,allowPinchZoom:!0,children:(0,Q.jsx)(Wo,{asChild:!0,trapped:L.open,onMountAutoFocus:z=>{z.preventDefault()},onUnmountAutoFocus:J(n,z=>{L.trigger?.focus({preventScroll:!0}),z.preventDefault()}),children:(0,Q.jsx)(zo,{asChild:!0,disableOutsidePointerEvents:!0,onEscapeKeyDown:s,onPointerDownOutside:l,onFocusOutside:z=>z.preventDefault(),onDismiss:()=>L.onOpenChange(!1),children:(0,Q.jsx)(Ie,{role:"listbox",id:L.contentId,"data-state":L.open?"open":"closed",dir:L.dir,onContextMenu:z=>z.preventDefault(),...x,...Ce,onPlaced:()=>W(!0),ref:w,style:{display:"flex",flexDirection:"column",outline:"none",...x.style},onKeyDown:J(x.onKeyDown,z=>{let oe=z.ctrlKey||z.altKey||z.metaKey;if(z.key==="Tab"&&z.preventDefault(),!oe&&z.key.length===1&&ge(z.key),["ArrowUp","ArrowDown","Home","End"].includes(z.key)){let ee=q().filter(te=>!te.disabled).map(te=>te.ref.current);if(["ArrowUp","End"].includes(z.key)&&(ee=ee.slice().reverse()),["ArrowUp","ArrowDown"].includes(z.key)){let te=z.target,Y=ee.indexOf(te);ee=ee.slice(Y+1)}setTimeout(()=>O(ee)),z.preventDefault()}})})})})})})},"SelectContentImpl")),wb=U.forwardRef(me(function(t,a){let{__scopeSelect:o,onPlaced:r,...n}=t,s=Fa(Co,o),l=Io(Co,o),[i,u]=U.useState(null),[c,d]=U.useState(null),f=ce(a,d),p=gs(o),h=U.useRef(!1),g=U.useRef(!0),{viewport:m,selectedItem:b,selectedItemText:x,focusSelectedItem:L}=l,C=U.useCallback(()=>{if(s.trigger&&s.valueNode&&i&&c&&m&&b&&x){let w=s.trigger.getBoundingClientRect(),E=c.getBoundingClientRect(),I=s.valueNode.getBoundingClientRect(),R=x.getBoundingClientRect();if(s.dir!==ib.RTL){let ue=R.left-E.left,ee=I.left-ue,te=w.left-ee,Y=w.width+te,k=Math.max(Y,E.width),H=window.innerWidth-$t,V=Kn(ee,[$t,Math.max($t,H-k)]);i.style.minWidth=Y+"px",i.style.left=V+"px"}else{let ue=E.right-R.right,ee=window.innerWidth-I.right-ue,te=window.innerWidth-w.right-ee,Y=w.width+te,k=Math.max(Y,E.width),H=window.innerWidth-$t,V=Kn(ee,[$t,Math.max($t,H-k)]);i.style.minWidth=Y+"px",i.style.right=V+"px"}let M=p(),q=window.innerHeight-$t*2,A=m.scrollHeight,W=window.getComputedStyle(c),K=parseInt(W.borderTopWidth,10),P=parseInt(W.paddingTop,10),_=parseInt(W.borderBottomWidth,10),O=parseInt(W.paddingBottom,10),B=K+P+A+O+_,F=Math.min(b.offsetHeight*5,B),j=window.getComputedStyle(m),re=parseInt(j.paddingTop,10),ge=parseInt(j.paddingBottom,10),be=w.top+w.height/2-$t,G=q-be,xe=b.offsetHeight/2,Ie=b.offsetTop+xe,Ce=K+P+Ie,z=B-Ce;if(Ce<=be){let ue=M.length>0&&b===M[M.length-1].ref.current;i.style.bottom="0px";let ee=c.clientHeight-m.offsetTop-m.offsetHeight,te=Math.max(G,xe+(ue?ge:0)+ee+_),Y=Ce+te;i.style.height=Y+"px"}else{let ue=M.length>0&&b===M[0].ref.current;i.style.top="0px";let te=Math.max(be,K+m.offsetTop+(ue?re:0)+xe)+z;i.style.height=te+"px",m.scrollTop=Ce-be+m.offsetTop}i.style.margin=`${$t}px 0`,i.style.minHeight=F+"px",i.style.maxHeight=q+"px",r?.(),requestAnimationFrame(()=>h.current=!0)}},[p,s.trigger,s.valueNode,i,c,m,b,x,s.dir,r]);he(()=>C(),[C]);let[S,v]=U.useState();he(()=>{c&&v(window.getComputedStyle(c).zIndex)},[c]);let y=U.useCallback(w=>{w&&g.current===!0&&(C(),L?.(),g.current=!1)},[C,L]);return(0,Q.jsx)(Sb,{scope:o,contentWrapper:i,shouldExpandOnScrollRef:h,onScrollButtonChange:y,children:(0,Q.jsx)("div",{ref:u,style:{display:"flex",flexDirection:"column",position:"fixed",zIndex:S},children:(0,Q.jsx)(fe.div,{...n,ref:f,style:{boxSizing:"border-box",maxHeight:"100%",...n.style}})})})},"SelectItemAlignedPosition")),hp=U.forwardRef(me(function(t,a){let{__scopeSelect:o,align:r="start",collisionPadding:n=$t,...s}=t,l=Yl(o);return(0,Q.jsx)(cs,{...l,...s,ref:a,align:r,collisionPadding:n,style:{boxSizing:"border-box",...s.style,"--radix-select-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-select-content-available-width":"var(--radix-popper-available-width)","--radix-select-content-available-height":"var(--radix-popper-available-height)","--radix-select-trigger-width":"var(--radix-popper-anchor-width)","--radix-select-trigger-height":"var(--radix-popper-anchor-height)"}})},"SelectPopperPosition")),[Sb,Ql]=vo(Co,{}),xp="SelectViewport",kp=U.forwardRef(me(function(t,a){let{__scopeSelect:o,nonce:r,...n}=t,s=Io(xp,o),l=Ql(xp,o),i=ce(a,s.onViewportChange),u=U.useRef(0);return(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)("style",{dangerouslySetInnerHTML:{__html:"[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"},nonce:r}),(0,Q.jsx)(ms.Slot,{scope:o,children:(0,Q.jsx)(fe.div,{"data-radix-select-viewport":"",role:"presentation",...n,ref:i,style:{position:"relative",flex:1,overflow:"hidden auto",...n.style},onScroll:J(n.onScroll,c=>{let d=c.currentTarget,{contentWrapper:f,shouldExpandOnScrollRef:p}=l;if(p?.current&&f){let h=Math.abs(u.current-d.scrollTop);if(h>0){let g=window.innerHeight-$t*2,m=parseFloat(f.style.minHeight),b=parseFloat(f.style.height),x=Math.max(m,b);if(x<g){let L=x+h,C=Math.min(g,L),S=L-C;f.style.height=C+"px",f.style.bottom==="0px"&&(d.scrollTop=S>0?S:0,f.style.justifyContent="flex-end")}}}u.current=d.scrollTop})})})]})},"SelectViewport")),yb="SelectGroup",[hk,kb]=vo(yb);var Rb="SelectLabel",ei=U.forwardRef(me(function(t,a){let{__scopeSelect:o,...r}=t,n=kb(Rb,o);return(0,Q.jsx)(fe.div,{id:n.id,...r,ref:a})},"SelectLabel")),$l="SelectItem",[Pb,Rp]=vo($l),ti=U.forwardRef(me(function(t,a){let{__scopeSelect:o,value:r,disabled:n=!1,textValue:s,...l}=t,i=Fa($l,o),u=Io($l,o),c=i.value===r,[d,f]=U.useState(s??""),[p,h]=U.useState(!1),g=Ye(C=>u.itemRefCallback?.(C,r,n)),m=ce(a,g),b=Pt(),x=U.useRef("touch");function L(C){i.hasConsumerStoppedPropagationRef.current=C.isPropagationStopped(),i.onUserSelect(r),i.onOpenChange(!1)}return me(L,"handleSelect"),(0,Q.jsx)(Pb,{scope:o,value:r,disabled:n,textId:b,isSelected:c,onItemTextChange:U.useCallback(C=>{f(S=>S||(C?.textContent??"").trim())},[]),children:(0,Q.jsx)(ms.ItemSlot,{scope:o,value:r,disabled:n,textValue:d,children:(0,Q.jsx)(fe.div,{role:"option","aria-labelledby":b,"data-highlighted":p?"":void 0,"aria-selected":c&&p,"data-state":c?"checked":"unchecked","aria-disabled":n||void 0,"data-disabled":n?"":void 0,tabIndex:n?void 0:-1,...l,ref:m,onFocus:J(l.onFocus,()=>h(!0)),onBlur:J(l.onBlur,()=>h(!1)),onClick:J(l.onClick,C=>{n||x.current!=="mouse"&&L(C)}),onPointerUp:J(l.onPointerUp,C=>{n||x.current==="mouse"&&L(C)}),onPointerDown:J(l.onPointerDown,C=>{x.current=C.pointerType}),onPointerMove:J(l.onPointerMove,C=>{x.current=C.pointerType,n?u.onItemLeave?.():x.current==="mouse"&&C.currentTarget.focus({preventScroll:!0})}),onPointerLeave:J(l.onPointerLeave,C=>{C.currentTarget===document.activeElement&&u.onItemLeave?.()}),onKeyDown:J(l.onKeyDown,C=>{n||C.target!==C.currentTarget||u.searchRef?.current!==""&&C.key===" "||(db.includes(C.key)&&L(C),C.key===" "&&C.preventDefault())})})})})},"SelectItem")),ps="SelectItemText",Pp=U.forwardRef(me(function(t,a){let{__scopeSelect:o,className:r,style:n,...s}=t,l=Fa(ps,o),i=Io(ps,o),u=Rp(ps,o),c=mb(ps,o),[d,f]=U.useState(null),p=Ye(L=>i.itemTextRefCallback?.(L,u.value,u.disabled)),h=ce(a,f,u.onItemTextChange,p),g=d?.textContent,m=U.useMemo(()=>(0,Q.jsx)("option",{value:u.value,disabled:u.disabled,children:g},u.value),[u.disabled,u.value,g]),{onNativeOptionAdd:b,onNativeOptionRemove:x}=c;return he(()=>(b(m),()=>x(m)),[b,x,m]),(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(fe.span,{id:u.textId,...s,ref:h}),u.isSelected&&l.valueNode&&!l.valueNodeHasChildren&&!sn(l.value)?jl.createPortal(s.children,l.valueNode):null]})},"SelectItemText")),Db="SelectItemIndicator",Dp=U.forwardRef(me(function(t,a){let{__scopeSelect:o,...r}=t;return Rp(Db,o).isSelected?(0,Q.jsx)(fe.span,{"aria-hidden":!0,...r,ref:a}):null},"SelectItemIndicator")),Lp="SelectScrollUpButton",ai=U.forwardRef(me(function(t,a){let o=Io(Lp,t.__scopeSelect),r=Ql(Lp,t.__scopeSelect),[n,s]=U.useState(!1),l=ce(a,r.onScrollButtonChange);return he(()=>{if(o.viewport&&o.isPositioned){let u=function(){let d=c.scrollTop>0;s(d)};var i=u;me(u,"handleScroll");let c=o.viewport;return u(),c.addEventListener("scroll",u),()=>c.removeEventListener("scroll",u)}},[o.viewport,o.isPositioned]),n?(0,Q.jsx)(Mp,{...t,ref:l,onAutoScroll:()=>{let{viewport:i,selectedItem:u}=o;i&&u&&(i.scrollTop=i.scrollTop-u.offsetHeight)}}):null},"SelectScrollUpButton")),bp="SelectScrollDownButton",oi=U.forwardRef(me(function(t,a){let o=Io(bp,t.__scopeSelect),r=Ql(bp,t.__scopeSelect),[n,s]=U.useState(!1),l=ce(a,r.onScrollButtonChange);return he(()=>{if(o.viewport&&o.isPositioned){let u=function(){let d=c.scrollHeight-c.clientHeight,f=Math.ceil(c.scrollTop)<d;s(f)};var i=u;me(u,"handleScroll");let c=o.viewport;return u(),c.addEventListener("scroll",u),()=>c.removeEventListener("scroll",u)}},[o.viewport,o.isPositioned]),n?(0,Q.jsx)(Mp,{...t,ref:l,onAutoScroll:()=>{let{viewport:i,selectedItem:u}=o;i&&u&&(i.scrollTop=i.scrollTop+u.offsetHeight)}}):null},"SelectScrollDownButton")),Mp=U.forwardRef(me(function(t,a){let{__scopeSelect:o,onAutoScroll:r,...n}=t,s=Io("SelectScrollButton",o),l=U.useRef(null),i=gs(o),u=U.useCallback(()=>{l.current!==null&&(window.clearInterval(l.current),l.current=null)},[]);return U.useEffect(()=>()=>u(),[u]),he(()=>{i().find(d=>d.ref.current===document.activeElement)?.ref.current?.scrollIntoView({block:"nearest"})},[i]),(0,Q.jsx)(fe.div,{"aria-hidden":!0,...n,ref:a,style:{flexShrink:0,...n.style},onPointerDown:J(n.onPointerDown,()=>{l.current===null&&(l.current=window.setInterval(r,50))}),onPointerMove:J(n.onPointerMove,()=>{s.onItemLeave?.(),l.current===null&&(l.current=window.setInterval(r,50))}),onPointerLeave:J(n.onPointerLeave,()=>{u()})})},"SelectScrollButtonImpl")),ri=U.forwardRef(me(function(t,a){let{__scopeSelect:o,...r}=t;return(0,Q.jsx)(fe.div,{"aria-hidden":!0,...r,ref:a})},"SelectSeparator"));var Mb="SelectBubbleInput",Ab=U.forwardRef(me(function({__scopeSelect:t,...a},o){let r=Fa(Mb,t),{value:n,onValueChange:s,required:l,disabled:i,name:u,autoComplete:c,form:d,userSelection:f}=r,{nativeOptions:p,nativeSelectKey:h}=r,g=U.useRef(null),m=ce(o,g),b=n??"",x=U.useRef(b),L=U.useRef(f),C=U.useRef(!1),S=Array.from(p).some(v=>(v.props.value??"")==="");return U.useEffect(()=>{let v=g.current;if(!v)return;let y=window.HTMLSelectElement.prototype,E=Object.getOwnPropertyDescriptor(y,"value").set,I=f!==null&&f!==L.current;L.current=f;let R=x.current!==b;x.current=b;let M=I&&R;if(I&&!R&&f.value!==b&&!f.hasConsumerStoppedPropagation&&E){C.current=!0;try{E.call(v,f.value),v.dispatchEvent(new Event("change",{bubbles:!0}))}finally{C.current=!1,E.call(v,b)}return}let q=M&&!f.hasConsumerStoppedPropagation;if(R&&E){let A=new Event("change",{bubbles:q});E.call(v,b),v.dispatchEvent(A)}},[b,f]),(0,Q.jsxs)(fe.select,{"aria-hidden":!0,required:l,tabIndex:-1,name:u,autoComplete:c,disabled:i,form:d,onChange:v=>{C.current||s(v.target.value)},...a,style:{...mp,...a.style},ref:m,defaultValue:b,children:[sn(n)&&!S?(0,Q.jsx)("option",{value:""}):null,Array.from(p)]},h)},"SelectBubbleInput"));function Ap(e){return typeof e=="function"}me(Ap,"isFunction");function sn(e){return e===""||e===void 0}me(sn,"shouldShowPlaceholder");function ni(e){let t=Ye(e),a=U.useRef(""),o=U.useRef(0),r=U.useCallback(s=>{let l=a.current+s;t(l);function i(u){a.current=u,window.clearTimeout(o.current),u!==""&&(o.current=window.setTimeout(()=>i(""),1e3))}me(i,"updateSearch"),i(l)},[t]),n=U.useCallback(()=>{a.current="",window.clearTimeout(o.current)},[]);return U.useEffect(()=>()=>window.clearTimeout(o.current),[]),[a,r,n]}me(ni,"useTypeaheadSearch");function si(e,t,a){let r=t.length>1&&Array.from(t).every(u=>u===t[0])?t[0]:t,n=a?e.indexOf(a):-1,s=Tp(e,Math.max(n,0));r.length===1&&(s=s.filter(u=>u!==a));let i=s.find(u=>u.textValue.toLowerCase().startsWith(r.toLowerCase()));return i!==a?i:void 0}me(si,"findNextItem");function Tp(e,t){return e.map((a,o)=>e[(t+o)%e.length])}me(Tp,"wrapArray");var He=require("react/jsx-runtime"),ln=vp;var un=Ip,rr=Na.forwardRef(({className:e,children:t,...a},o)=>(0,He.jsxs)(Zl,{ref:o,className:de("kanban-select-trigger",e),...a,children:[t,(0,He.jsx)(wp,{asChild:!0,children:(0,He.jsx)(ka,{className:"kanban-select-icon"})})]}));rr.displayName=Zl.displayName;var Ep=Na.forwardRef(({className:e,...t},a)=>(0,He.jsx)(ai,{ref:a,className:de("kanban-select-scroll-button",e),...t,children:(0,He.jsx)(gr,{className:"kanban-select-scroll-icon"})}));Ep.displayName=ai.displayName;var Op=Na.forwardRef(({className:e,...t},a)=>(0,He.jsx)(oi,{ref:a,className:de("kanban-select-scroll-button",e),...t,children:(0,He.jsx)(ka,{className:"kanban-select-scroll-icon"})}));Op.displayName=oi.displayName;var nr=Na.forwardRef(({className:e,children:t,position:a="popper",...o},r)=>(0,He.jsx)(Sp,{children:(0,He.jsxs)(Jl,{ref:r,className:de("kanban-portal kanban-select-content",a==="popper"&&"kanban-select-content--popper",e),position:a,...o,children:[(0,He.jsx)(Ep,{}),(0,He.jsx)(kp,{className:de("kanban-select-viewport",a==="popper"&&"kanban-select-viewport--popper"),children:t}),(0,He.jsx)(Op,{})]})}));nr.displayName=Jl.displayName;var Eb=Na.forwardRef(({className:e,...t},a)=>(0,He.jsx)(ei,{ref:a,className:de("kanban-select-label",e),...t}));Eb.displayName=ei.displayName;var La=Na.forwardRef(({className:e,children:t,...a},o)=>(0,He.jsxs)(ti,{ref:o,className:de("kanban-select-item",e),...a,children:[(0,He.jsx)("span",{className:"kanban-select-item-indicator",children:(0,He.jsx)(Dp,{children:(0,He.jsx)(st,{className:"kanban-select-check"})})}),(0,He.jsx)(Pp,{children:t})]}));La.displayName=ti.displayName;var Ob=Na.forwardRef(({className:e,...t},a)=>(0,He.jsx)(ri,{ref:a,className:de("kanban-select-separator",e),...t}));Ob.displayName=ri.displayName;var Bp=Z(require("react"),1);var Fp=require("react/jsx-runtime"),hs=Bp.forwardRef(({className:e,...t},a)=>(0,Fp.jsx)("textarea",{className:de("kanban-textarea",e),ref:a,...t}));hs.displayName="Textarea";var Tt={high:{label:"P0",color:"var(--dsw-alias-state-error-primary)"},medium:{label:"P1",color:"var(--dsw-alias-state-warn-primary)"},low:{label:"P2",color:"var(--dsw-alias-state-business-primary)"}},xs=["high","medium","low"],Np="var(--dsw-alias-label-tertiary)";function qp(e,t){return t?e.find(a=>a.name===t)?.color??Np:Np}var Ls=require("react");function wo(e=new Date,t=0){let a=new Date(e);return a.setDate(a.getDate()+t),`${String(a.getFullYear()).padStart(4,"0")}-${String(a.getMonth()+1).padStart(2,"0")}-${String(a.getDate()).padStart(2,"0")}`}function li(e,t){let a=o=>{let[r,n,s]=o.split("-").map(Number),l=new Date(0);return l.setUTCFullYear(r,n-1,s),l.getTime()/864e5};return a(t)-a(e)}function ii(e,t,a,o){return t?!e.dueDate||e.columnId===a?!1:t==="today"?e.dueDate===o:e.dueDate<o:!0}function _p(e,t,a){let[o,r,n]=e.split("-");return a(o===t.slice(0,4)?"shortDate":"yearDate").replace("{year}",o).replace("{month}",String(Number(r))).replace("{day}",String(Number(n)))}function Hp(){let[e,t]=(0,Ls.useState)(()=>wo());return(0,Ls.useEffect)(()=>{let a,o=()=>{clearTimeout(a);let r=new Date;t(wo(r));let n=new Date(r);n.setHours(24,0,0,0),a=setTimeout(o,n.getTime()-r.getTime()+100)};return o(),window.addEventListener("focus",o),document.addEventListener("visibilitychange",o),()=>{clearTimeout(a),window.removeEventListener("focus",o),document.removeEventListener("visibilitychange",o)}},[]),e}var Je=(e,t)=>e.replace(/\{(\w+)\}/g,(a,o)=>t[o]??""),ui=e=>e==="high"||e==="medium"||e==="low"?Tt[e].label:"";function Up(e,t){let a=e.meta||{},o=t("noValue"),r=e.from??null,n=e.to??null;switch(e.type){case"card_created":{let s=a.label??o,l=a.priority&&ui(a.priority)||o;return Je(t("actCreated"),{column:a.column??"",label:s,priority:l})}case"card_moved":return Je(t("actMoved"),{from:r??o,to:n??o});case"card_label_changed":return r==null&&n!=null?Je(t("actLabelSet"),{to:n}):r!=null&&n==null?Je(t("actLabelCleared"),{from:r}):Je(t("actLabel"),{from:r??o,to:n??o});case"card_priority_changed":{let s=r?ui(r)||r:o,l=n?ui(n)||n:o;return r==null&&n!=null?Je(t("actPrioritySet"),{to:l}):r!=null&&n==null?Je(t("actPriorityCleared"),{from:s}):Je(t("actPriority"),{from:s,to:l})}case"card_due_date_changed":return Je(t("actDueDate"),{from:r??o,to:n??o});case"board_completed_column_changed":return Je(t("actCompletedColumn"),{from:a.fromColumn??r??o,to:a.toColumn??n??o});case"card_title_changed":return Je(t("actTitle"),{from:r??o,to:n??o});case"card_note_changed":return t("actNote");case"card_comment_added":return t("actComment");case"card_image_added":return t("actImageAdded");case"card_image_removed":return t("actImageRemoved");case"card_deleted":return t("actDeleted");case"column_added":return Je(t("actColumnAdded"),{column:a.column??""});case"column_renamed":return Je(t("actColumnRenamed"),{from:r??o,to:n??o});case"column_deleted":return Je(t("actColumnDeleted"),{column:a.column??""});case"label_added":return Je(t("actLabelAdded"),{label:a.label??""});case"label_renamed":return Je(t("actLabelRenamed"),{from:r??o,to:n??o});case"label_deleted":return Je(t("actLabelDeleted"),{label:a.label??""});case"label_color_changed":return Je(t("actLabelColor"),{label:a.label??"",from:r??o,to:n??o});default:return e.type}}var bs=e=>String(e).padStart(2,"0");function sr(e){let t=new Date(e);return Number.isNaN(t.getTime())?e:`${t.getFullYear()}-${bs(t.getMonth()+1)}-${bs(t.getDate())} ${bs(t.getHours())}:${bs(t.getMinutes())}`}var Ee=require("react");var Gp=require("@deepseek-ai/dsh-client-ui-primitives");function So(e,t={},a="default"){return fetch("/api/kanban",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({method:e,args:{...t,workspaceId:a}})}).then(zp)}async function zp(e){let t;try{t=await e.json()}catch{throw new Error(`Kanban request failed (${e.status})`)}if(!e.ok||t.error)throw new Error(t.error||`Kanban request failed (${e.status})`);return t}function Cs(e,t,a){return"/api/kanban/image?"+new URLSearchParams({workspaceId:e,cardId:t,attachmentId:a})}function Wp(e,t,a,o){return fetch("/api/kanban/image/upload?"+new URLSearchParams({workspaceId:e,cardId:t}),{method:"POST",headers:{"content-type":a.type},body:a,signal:o}).then(zp)}async function Vp(e,t,a,o){let r=[];for(let[n,s]of a.entries()){let l=await fetch(Cs(e,t,s.attachmentId),{signal:o});if(!l.ok)throw new Error(`Image ${n+1}: HTTP ${l.status}`);let i=await l.blob();if(!i.size||!["image/png","image/jpeg","image/webp"].includes(i.type))throw new Error(`Image ${n+1}: invalid image response`);let u=i.type==="image/jpeg"?"jpg":i.type.slice(6);r.push(new File([i],`${t}-${n+1}.${u}`,{type:i.type}))}return r}var se=require("react/jsx-runtime");function Bb({file:e}){let[t,a]=(0,Ee.useState)("");return(0,Ee.useEffect)(()=>{let o=URL.createObjectURL(e);return a(o),()=>URL.revokeObjectURL(o)},[e]),t?(0,se.jsx)("img",{src:t,alt:""}):null}function Fb({src:e,label:t,onOpen:a}){let o=we(),[r,n]=(0,Ee.useState)("loading"),[s,l]=(0,Ee.useState)(0);return(0,se.jsx)("div",{className:"kanban-image-preview",children:r==="error"?(0,se.jsxs)("div",{className:"kanban-image-message",role:"status",children:[(0,se.jsx)("span",{children:o("imageLoadFailed")}),(0,se.jsxs)(ie,{variant:"ghost",size:"sm",onClick:()=>{n("loading"),l(i=>i+1)},children:[(0,se.jsx)(Pa,{}),o("retry")]})]}):(0,se.jsxs)(se.Fragment,{children:[(0,se.jsx)("button",{type:"button",className:"kanban-image-open","aria-label":t,disabled:r!=="ready",onClick:a,children:(0,se.jsx)("img",{src:`${e}&retry=${s}`,alt:t,onLoad:()=>n("ready"),onError:()=>n("error")})}),r==="loading"&&(0,se.jsxs)("span",{className:"kanban-image-message",role:"status",children:[(0,se.jsx)(ca,{className:"kanban-animate-spin"}),o("loadingImage")]})]})})}var Kp=(0,Ee.forwardRef)(function({workspaceId:t,cardId:a,images:o,limits:r,disabled:n,onUpload:s,onRemove:l,onBusyChange:i,onPendingChange:u},c){let d=we(),f=(0,Ee.useId)(),p=(0,Ee.useRef)(null),[h,g]=(0,Ee.useState)([]),m=(0,Ee.useRef)([]),b=(0,Ee.useRef)(0),x=(0,Ee.useRef)(!0),L=(0,Ee.useRef)(new AbortController),C=(0,Ee.useRef)(!1),[S,v]=(0,Ee.useState)(null),[y,w]=(0,Ee.useState)(""),[E,I]=(0,Ee.useState)(!1),[R,M]=(0,Ee.useState)(null);(0,Ee.useEffect)(()=>(x.current=!0,L.current=new AbortController,()=>{x.current=!1,L.current.abort()}),[]);let q=P=>{x.current&&(m.current=P,g(P),u(P.length>0))},A=async(P,_=m.current)=>{if(C.current)return!1;C.current=!0,i(!0),w("");let O=!0;try{for(let B of _){if(!x.current)return!1;q(m.current.map(F=>F.key===B.key?{...F,state:"uploading",error:void 0}:F));try{await s(P,B.file,L.current.signal),q(m.current.filter(F=>F.key!==B.key))}catch(F){if(O=!1,!x.current)return!1;q(m.current.map(j=>j.key===B.key?{...j,state:"error",error:String(F instanceof Error?F.message:F)}:j))}}return O}finally{C.current=!1,x.current&&i(!1)}},W=P=>{if(!r||n||C.current||!P.length)return;if(w(""),o.length+m.current.length+P.length>r.maxImagesPerCard){w(d("imageTooMany").replace("{count}",String(r.maxImagesPerCard)));return}for(let O of P){if(!r.mediaTypes.includes(O.type)){w(d("imageInvalidType"));return}if(!O.size||O.size>r.maxImageBytes){w(d("imageTooLarge").replace("{size}",String(Math.floor(r.maxImageBytes/1048576))));return}}let _=P.map(O=>({key:++b.current,file:O,state:"pending"}));q([...m.current,..._]),a&&A(a,_)};(0,Ee.useImperativeHandle)(c,()=>({uploadPending:A,addFiles:W}));let K=async P=>{if(!(!a||n||C.current)){C.current=!0,i(!0),v(P.attachmentId),w("");try{if(!await l(a,P.attachmentId))throw new Error(d("imageRemoveFailed"))}catch(_){x.current&&w(String(_ instanceof Error?_.message:_))}finally{C.current=!1,x.current&&(v(null),i(!1))}}};return(0,se.jsxs)("section",{className:`kanban-images${E?" is-dragging":""}`,"aria-labelledby":f,onDragOver:P=>{P.dataTransfer.types.includes("Files")&&(P.preventDefault(),P.stopPropagation(),r&&!n&&I(!0))},onDragLeave:P=>{(!(P.relatedTarget instanceof Node)||!P.currentTarget.contains(P.relatedTarget))&&I(!1)},onDrop:P=>{P.dataTransfer.types.includes("Files")&&(P.preventDefault(),P.stopPropagation(),I(!1),W(Array.from(P.dataTransfer.files)))},children:[(0,se.jsxs)("div",{className:"kanban-field-label",children:[(0,se.jsxs)("span",{id:f,children:[d("images")," ",(0,se.jsxs)("span",{className:"kanban-tabular",children:["(",o.length+h.length,")"]})]}),(0,se.jsxs)(ie,{variant:"ghost",size:"sm",disabled:n||!r,onClick:()=>p.current?.click(),children:[(0,se.jsx)(xr,{}),d("addImages")]}),(0,se.jsx)("input",{ref:p,type:"file",accept:r?.mediaTypes.join(",")??"image/png,image/jpeg,image/webp",multiple:!0,hidden:!0,disabled:n||!r,"aria-label":d("addImages"),onChange:P=>{W(Array.from(P.currentTarget.files??[])),P.currentTarget.value=""}})]}),!r&&(0,se.jsx)("p",{className:"kanban-muted-small",children:d("imagesUnavailable")}),r&&(0,se.jsx)("p",{className:"kanban-muted-small",children:d("imagesHint").replace("{size}",String(Math.floor(r.maxImageBytes/1048576))).replace("{count}",String(r.maxImagesPerCard))}),y&&(0,se.jsx)("p",{className:"kanban-dialog-error",role:"alert",children:y}),!o.length&&!h.length&&r&&(0,se.jsx)("div",{className:"kanban-image-empty",children:d("imagesEmpty")}),(o.length>0||h.length>0)&&(0,se.jsxs)("div",{className:"kanban-image-grid",children:[o.map((P,_)=>(0,se.jsxs)("div",{className:"kanban-image-tile",children:[(0,se.jsx)(Fb,{src:Cs(t,a,P.attachmentId),label:d("imagePreview").replace("{number}",String(_+1)),onOpen:()=>M(P)}),(0,se.jsxs)(ie,{variant:"ghost",size:"sm",disabled:n||S!==null,"aria-label":d("imageRemove").replace("{number}",String(_+1)),onClick:()=>{K(P)},children:[S===P.attachmentId?(0,se.jsx)(ca,{className:"kanban-animate-spin"}):(0,se.jsx)($e,{}),S===P.attachmentId?d("imageRemoving"):d("remove")]})]},P.attachmentId)),h.map(P=>(0,se.jsxs)("div",{className:"kanban-image-tile",children:[(0,se.jsx)("div",{className:"kanban-image-preview",children:(0,se.jsx)(Bb,{file:P.file})}),(0,se.jsxs)("div",{className:"kanban-image-draft-info",children:[(0,se.jsx)("span",{className:"kanban-image-filename",title:P.file.name,children:P.file.name}),(0,se.jsx)("span",{role:P.state==="error"?"alert":"status",className:P.state==="error"?"kanban-error":"kanban-muted-small",children:P.state==="uploading"?d("imageUploading"):P.state==="error"?`${d("imageUploadFailed")}: ${P.error}`:d("imagePending")}),(0,se.jsxs)("div",{className:"kanban-image-draft-actions",children:[P.state==="error"&&a&&(0,se.jsxs)(ie,{size:"sm",variant:"ghost",disabled:n,onClick:()=>{A(a,[P])},children:[(0,se.jsx)(Pa,{}),d("retry")]}),(0,se.jsxs)(ie,{size:"sm",variant:"ghost",disabled:n,"aria-label":`${d("remove")}: ${P.file.name}`,onClick:()=>q(m.current.filter(_=>_.key!==P.key)),children:[(0,se.jsx)($e,{}),d("remove")]})]})]})]},P.key))]}),r&&(0,se.jsx)("p",{className:"kanban-muted-small",children:d(a?"imagesSaveHint":"imagesDraftHint")}),R&&(0,se.jsx)(Gp.ImageLightbox,{src:Cs(t,a,R.attachmentId),alt:d("images"),labels:{dialog:d("images"),close:d("close")},onClose:()=>M(null)})]})});var ba=require("react/jsx-runtime");function Xp({activities:e}){let t=we();if(e.length===0)return(0,ba.jsx)("p",{className:"kanban-muted-small",children:t("activityEmpty")});let a=[...e].reverse();return(0,ba.jsx)("ol",{className:"kanban-activity-list",children:a.map(o=>{let r=o.source==="agent",n=t(r?"actorAgent":"actorHuman");return(0,ba.jsxs)("li",{className:"kanban-activity-item",children:[(0,ba.jsx)("span",{className:`kanban-activity-dot ${r?"is-agent":"is-human"}`,"aria-hidden":"true"}),(0,ba.jsxs)("p",{className:"kanban-activity-description",children:[(0,ba.jsx)("span",{className:`kanban-activity-actor ${r?"is-agent":"is-human"}`,children:n})," ",Up(o,t)]}),(0,ba.jsx)("time",{className:"kanban-activity-time kanban-tabular",dateTime:o.ts,title:sr(o.ts),children:sr(o.ts)})]},o.id)})})}var N=require("react/jsx-runtime");function jp({workspaceId:e="default",imageLimits:t=null,images:a=[],onUploadImage:o,onRemoveImage:r,open:n,error:s,card:l,completed:i,completedAt:u,labels:c,comments:d,activities:f,onOpenChange:p,onSave:h,onAddComment:g,onDelete:m,onChatWithAgent:b}){let x=we(),L=(0,ke.useId)(),C=(0,ke.useRef)(null),S=(0,ke.useRef)(null),[v,y]=(0,ke.useState)(!l),[w,E]=(0,ke.useState)({id:"",title:"",note:"",label:"",priority:"",dueDate:""}),[I,R]=(0,ke.useState)(""),[M,q]=(0,ke.useState)(!1),A=(0,ke.useRef)(!1),[W,K]=(0,ke.useState)(""),[P,_]=(0,ke.useState)(null),O=(0,ke.useRef)(null),B=(0,ke.useRef)(w),F=(0,ke.useRef)(null),[j,re]=(0,ke.useState)(!1),[ge,be]=(0,ke.useState)(!1),[G,xe]=(0,ke.useState)(0),Ie=(0,ke.useRef)(void 0),Ce=(0,ke.useRef)(!1),z=(0,ke.useRef)(void 0),oe=M||j,ue=(0,ke.useRef)(!0);(0,ke.useEffect)(()=>(ue.current=!0,()=>{ue.current=!1}),[]),(0,ke.useLayoutEffect)(()=>{let T=Ie.current;if(Ie.current=n?l?.id??"":void 0,!(T===""&&l&&(Ce.current||z.current===l.id))&&n){let $={id:l?.id??"",title:l?.title??"",note:l?.note??"",label:l?.label??"",priority:l?.priority??"",dueDate:l?.dueDate??""};B.current=$,E($),R(""),K(""),_(null),be(!1),re(!1),xe(Me=>Me+1),z.current=void 0,y(!l)}},[n,l?.id]),(0,ke.useEffect)(()=>{P&&O.current?.focus()},[P]);let ee=ge||!!I.trim()||Object.keys(w).some(T=>w[T]!==B.current[T]),te=T=>{if(!(A.current||j)){if(!T&&P){_(null);return}if(!T&&ee){_("discard");return}p(T)}},Y=async T=>{if(A.current||j)return!1;A.current=!0,q(!0),K("");try{let $=await T();return $===!1&&K(x("actionRetry")),$!==!1}catch($){return K(x("actionFailed")+String($ instanceof Error?$.message:$)),!1}finally{A.current=!1,q(!1)}},k=async()=>{if(C.current?.reportValidity()){if(I.trim()||ge){_("chat");return}await Y(()=>b(w))&&p(!1)}},H=T=>E($=>({...$,...T})),V=async()=>{let T=I.trim();!l||!T||T.length>2e3||await Y(()=>g(l.id,T))&&R("")};return(0,N.jsx)(Jo,{open:n,onOpenChange:te,children:(0,N.jsxs)(Bl,{open:n,onClose:()=>te(!1),title:x(l?"taskDetails":"addCard"),"aria-describedby":void 0,onPaste:T=>{let $=Array.from(T.clipboardData.files);$.length&&t&&!oe&&!P&&(T.preventDefault(),F.current?.addFiles($))},children:[(0,N.jsxs)(lo,{children:[(0,N.jsx)(co,{children:x(l?"taskDetails":"addCard")}),l&&(0,N.jsxs)("span",{className:"kanban-field-id",children:[x("fieldId"),": ",l.id]})]}),(0,N.jsxs)(io,{className:"kanban-form-stack",children:[(s||W)&&(0,N.jsx)("p",{className:"kanban-dialog-error",role:"alert",children:s||W}),(0,N.jsxs)("div",{className:"kanban-form-field",children:[(0,N.jsx)(mt,{htmlFor:`${L}-title`,className:"kanban-field-label",children:x("fieldTitle")}),(0,N.jsx)(Ht,{"data-modal-autofocus":!0,id:`${L}-title`,value:w.title,placeholder:x("titlePlaceholder"),maxLength:120,disabled:oe||!!P,onChange:T=>H({title:T.target.value})})]}),(0,N.jsxs)("div",{className:"kanban-form-row",children:[(0,N.jsxs)("div",{className:"kanban-form-field",children:[(0,N.jsx)(mt,{htmlFor:`${L}-label`,children:x("fieldLabel")}),(0,N.jsxs)(ln,{disabled:oe||!!P,value:w.label||"__none__",onValueChange:T=>H({label:T==="__none__"?"":T}),children:[(0,N.jsx)(rr,{id:`${L}-label`,children:(0,N.jsx)(un,{placeholder:x("noLabel")})}),(0,N.jsxs)(nr,{children:[(0,N.jsx)(La,{value:"__none__",children:x("noLabel")}),c.map(T=>(0,N.jsx)(La,{value:T.name,children:T.name},T.name))]})]})]}),(0,N.jsxs)("div",{className:"kanban-form-field",children:[(0,N.jsx)(mt,{htmlFor:`${L}-priority`,children:x("fieldPriority")}),(0,N.jsxs)(ln,{disabled:oe||!!P,value:w.priority||"__none__",onValueChange:T=>H({priority:T==="__none__"?"":T}),children:[(0,N.jsx)(rr,{id:`${L}-priority`,children:(0,N.jsx)(un,{placeholder:x("noPriority")})}),(0,N.jsxs)(nr,{children:[(0,N.jsx)(La,{value:"__none__",children:x("noPriority")}),xs.map(T=>{let $=Tt[T];return(0,N.jsx)(La,{value:T,children:(0,N.jsxs)("span",{className:"kanban-inline-priority",children:[(0,N.jsx)("span",{className:"kanban-priority-dot",style:{background:$.color}}),$.label]})},T)})]})]})]})]}),(0,N.jsxs)("div",{className:l?"kanban-form-row kanban-date-fields":void 0,children:[(0,N.jsxs)("div",{className:"kanban-form-field",children:[(0,N.jsx)(mt,{htmlFor:`${L}-due-date`,children:x("fieldDueDate")}),(0,N.jsxs)("div",{className:"kanban-due-date-controls",children:[(0,N.jsx)(Ht,{ref:C,id:`${L}-due-date`,type:"date",min:"0001-01-01",max:"9999-12-31",value:w.dueDate,disabled:oe||!!P,onChange:T=>H({dueDate:T.target.value})}),(0,N.jsxs)("div",{className:"kanban-date-shortcuts",children:[[["today",0],["tomorrow",1],["nextWeek",7]].map(([T,$])=>(0,N.jsx)(ie,{type:"button",variant:"ghost",size:"sm",disabled:oe||!!P,onClick:()=>H({dueDate:wo(new Date,$)}),children:x(T)},T)),(0,N.jsx)(ie,{type:"button",variant:"ghost",size:"sm",disabled:oe||!!P||!w.dueDate,onClick:()=>H({dueDate:""}),children:x("clearDate")})]})]})]}),l&&(0,N.jsxs)("div",{className:"kanban-form-field",children:[(0,N.jsx)(mt,{htmlFor:`${L}-completed-date`,children:x("fieldCompletedDate")}),(0,N.jsx)("output",{id:`${L}-completed-date`,className:"kanban-completed-date","aria-describedby":i&&!u?`${L}-completed-date-hint`:void 0,children:i?u?(0,N.jsx)("time",{dateTime:u,children:sr(u)}):x("completedDateUnknown"):"\u2014"}),i&&!u&&(0,N.jsx)("p",{id:`${L}-completed-date-hint`,className:"kanban-muted-small",children:x("completedDateUnknownHint")})]})]}),(0,N.jsxs)("div",{className:"kanban-form-field",children:[(0,N.jsxs)("div",{className:"kanban-field-label",children:[(0,N.jsx)(mt,{id:`${L}-note-label`,htmlFor:v?`${L}-note`:void 0,children:x("fieldNote")}),(0,N.jsxs)(ie,{variant:"ghost",size:"sm",disabled:oe||!!P,"aria-controls":`${L}-description`,onClick:()=>{y(!v),v||requestAnimationFrame(()=>S.current?.focus())},children:[v?(0,N.jsx)(st,{}):(0,N.jsx)(vr,{}),x(v?"finishEditingNote":"editNote")]})]}),(0,N.jsx)("div",{id:`${L}-description`,children:v?(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(hs,{ref:S,id:`${L}-note`,className:"kanban-markdown-source",value:w.note,placeholder:x("notePlaceholder"),rows:12,maxLength:2e3,disabled:oe||!!P,onChange:T=>H({note:T.target.value})}),(0,N.jsxs)("p",{className:"kanban-note-hint",children:[x("markdownEditHint")," ",(0,N.jsxs)("span",{className:"kanban-tabular",children:[w.note.length,"/2000"]})]})]}):(0,N.jsx)("div",{className:"kanban-markdown-preview",role:"region","aria-labelledby":`${L}-note-label`,children:w.note.trim()?(0,N.jsx)($p.MarkdownText,{text:w.note,labels:{code:{copyLabel:x("copyCode"),copiedLabel:x("copiedCode")},footnotes:x("footnotes")}}):(0,N.jsx)("p",{className:"kanban-muted-small",children:x("emptyNote")})})})]}),(0,N.jsx)(Kp,{ref:F,workspaceId:e,cardId:w.id||l?.id,images:a,limits:t,disabled:oe||!!P,onUpload:o??(async()=>{throw new Error(x("imagesUnavailable"))}),onRemove:r??(async()=>!1),onBusyChange:re,onPendingChange:T=>{be(T),T||K($=>$===x("imageUploadPartial")?"":$)}},G),l&&(0,N.jsxs)("div",{className:"kanban-comments-box",children:[(0,N.jsxs)(mt,{htmlFor:`${L}-comment`,children:[x("commentsTitle")," ",(0,N.jsxs)("span",{className:"kanban-tabular",children:["(",d.length,")"]})]}),(0,N.jsx)("div",{className:"kanban-comments-scroll","aria-live":"polite",children:d.length===0?(0,N.jsx)("p",{className:"kanban-muted-small",children:x("commentEmpty")}):(0,N.jsx)("ol",{className:"kanban-comment-list",children:d.map(T=>{let $=T.source==="agent";return(0,N.jsxs)("li",{className:"kanban-comment-item",children:[(0,N.jsxs)("div",{className:"kanban-comment-meta",children:[(0,N.jsx)("span",{className:`kanban-activity-actor ${$?"is-agent":"is-human"}`,children:x($?"actorAgent":"actorHuman")}),(0,N.jsx)("time",{className:"kanban-activity-time kanban-tabular",dateTime:T.createdAt,children:sr(T.createdAt)})]}),(0,N.jsx)("p",{className:"kanban-comment-content",children:T.content})]},T.id)})})}),(0,N.jsxs)("div",{className:"kanban-comment-composer",children:[(0,N.jsx)(hs,{id:`${L}-comment`,value:I,placeholder:x("commentPlaceholder"),rows:3,maxLength:2e3,disabled:oe||!!P,onChange:T=>R(T.target.value),onKeyDown:T=>{(T.metaKey||T.ctrlKey)&&T.key==="Enter"&&(T.preventDefault(),V())}}),(0,N.jsxs)(ie,{type:"button",variant:"outline",disabled:oe||!!P||!I.trim(),onClick:()=>{V()},children:[(0,N.jsx)(Ir,{className:"kanban-icon"}),x("sendComment")]})]})]}),l&&(0,N.jsxs)("div",{className:"kanban-activity-box",children:[(0,N.jsx)(mt,{className:"kanban-muted-small",children:x("activityTitle")}),(0,N.jsx)("div",{className:"kanban-activity-scroll",children:(0,N.jsx)(Xp,{activities:f})})]})]}),(0,N.jsx)(uo,{children:P?(0,N.jsxs)("div",{className:"kanban-dialog-confirm",children:[(0,N.jsx)("p",{role:"alert",children:x(P==="discard"?"discardChangesDesc":P==="delete"?"deleteCardDesc":ge?"discardImagesDesc":"discardCommentDesc")}),(0,N.jsxs)("div",{className:"kanban-confirm-actions",children:[(0,N.jsx)(ie,{ref:O,variant:"outline",disabled:oe,onClick:()=>_(null),children:x("cancel")}),(0,N.jsx)(ie,{variant:"destructive",disabled:oe,onClick:async()=>{if(P==="discard"){p(!1);return}if(P==="delete"){l&&m&&await Y(()=>m(l))&&p(!1);return}await Y(()=>b(w))&&p(!1)},children:x(P==="discard"?"discardChanges":P==="delete"?"confirmDelete":"discardAndContinue")})]})]}):(0,N.jsxs)(N.Fragment,{children:[l&&m&&(0,N.jsxs)(ie,{variant:"ghost",className:"kanban-dialog-delete",disabled:oe,onClick:()=>_("delete"),children:[(0,N.jsx)(Bt,{className:"kanban-icon"}),x("delete")]}),(0,N.jsxs)(ie,{variant:"outline",disabled:oe||!w.title.trim()&&!w.note.trim(),onClick:()=>{k()},children:[(0,N.jsx)(fa,{className:"kanban-icon"}),x("chatWithAgent")]}),(0,N.jsx)(ie,{disabled:oe||!w.title.trim(),onClick:async()=>{C.current?.reportValidity()&&await Y(async()=>{Ce.current=!w.id;let T;try{T=await h(w),Ce.current&&typeof T=="object"&&(z.current=T.cardId)}finally{Ce.current=!1}if(!ue.current||T===!1)return!1;let $={...w,...typeof T=="object"?{id:T.cardId}:{}};if(E($),B.current=$,ge&&(!$.id||!await F.current?.uploadPending($.id))){ue.current&&K(x("imageUploadPartial"));return}ue.current&&!I.trim()&&p(!1)})},children:x("save")})]})})]})})}var Zp=require("react");var Yp=require("react/jsx-runtime");function Nb({variant:e,className:t}={}){return de("kanban-badge",`kanban-badge--${e??"default"}`,t)}function di({className:e,variant:t,...a}){return(0,Yp.jsx)("div",{className:Nb({variant:t,className:e}),...a})}var yo=Z(require("react"),1);var ko=require("react/jsx-runtime"),ci=yo.forwardRef(({className:e,...t},a)=>(0,ko.jsx)("div",{ref:a,className:de("kanban-card",e),...t}));ci.displayName="Card";var qb=yo.forwardRef(({className:e,...t},a)=>(0,ko.jsx)("div",{ref:a,className:de("kanban-card-header",e),...t}));qb.displayName="CardHeader";var _b=yo.forwardRef(({className:e,...t},a)=>(0,ko.jsx)("div",{ref:a,className:de("kanban-ui-card-title",e),...t}));_b.displayName="CardTitle";var Hb=yo.forwardRef(({className:e,...t},a)=>(0,ko.jsx)("div",{ref:a,className:de("kanban-card-description",e),...t}));Hb.displayName="CardDescription";var fi=yo.forwardRef(({className:e,...t},a)=>(0,ko.jsx)("div",{ref:a,className:de("kanban-card-content",e),...t}));fi.displayName="CardContent";var Ub=yo.forwardRef(({className:e,...t},a)=>(0,ko.jsx)("div",{ref:a,className:de("kanban-card-footer",e),...t}));Ub.displayName="CardFooter";var Oe=require("react/jsx-runtime");function pi({card:e,labels:t,completed:a=!1,today:o=wo(),query:r=""}){let n=we(),s=r.trim().toLowerCase(),l=s&&!e.title.toLowerCase().includes(s)&&!e.note.toLowerCase().includes(s)?e.comments.find(h=>h.content.toLowerCase().includes(s))?.content:void 0,i=l?l.slice(Math.max(0,l.toLowerCase().indexOf(s)-24),l.toLowerCase().indexOf(s)+s.length+70):"",u=e.images?.length??0,c=e.priority?Tt[e.priority]:null,d=qp(t,e.label),f=a?"completed":e.dueDate===o?"today":e.dueDate&&e.dueDate<o?"overdue":"future",p=e.dueDate?f==="today"?n("dueToday"):f==="overdue"?n("overdueDays").replace("{days}",String(li(e.dueDate,o))):_p(e.dueDate,o,n):"";return(0,Oe.jsx)(ci,{className:"kanban-card",children:(0,Oe.jsxs)(fi,{className:"kanban-sortable-card-content",children:[(e.label||c)&&(0,Oe.jsxs)("div",{className:"kanban-card-meta",children:[e.label&&(0,Oe.jsxs)(di,{variant:"secondary",className:"kanban-card-badge",children:[(0,Oe.jsx)("span",{className:"kanban-label-dot",style:{background:d},"aria-hidden":"true"}),e.label]}),c&&(0,Oe.jsxs)(di,{variant:"secondary",className:"kanban-card-badge",children:[(0,Oe.jsx)("span",{className:"kanban-label-dot",style:{background:c.color},"aria-hidden":"true"}),c.label]})]}),(0,Oe.jsx)("p",{className:"kanban-card-title",children:e.title}),e.note&&(0,Oe.jsx)("p",{className:"kanban-card-note",children:e.note}),l&&(0,Oe.jsxs)("p",{className:"kanban-search-match",children:[n("matchComment"),": ",i]}),(e.dueDate||e.comments.length>0||u>0)&&(0,Oe.jsxs)("div",{className:"kanban-card-status-row",children:[e.dueDate&&(0,Oe.jsxs)("span",{className:`kanban-card-due-date is-${f}`,title:`${n("fieldDueDate")}: ${e.dueDate}${a?` \xB7 ${n("completed")}`:""}`,children:[(0,Oe.jsx)(za,{"aria-hidden":"true"}),(0,Oe.jsx)("span",{children:p})]}),u>0&&(0,Oe.jsxs)("span",{className:"kanban-card-comment-count","aria-label":`${n("images")}: ${u}`,title:`${n("images")}: ${u}`,children:[(0,Oe.jsx)(Lr,{"aria-hidden":"true"}),(0,Oe.jsx)("span",{className:"kanban-tabular",children:u})]}),e.comments.length>0&&(0,Oe.jsxs)("span",{className:"kanban-card-comment-count",title:`${n("commentsTitle")}: ${e.comments.length}`,"aria-label":`${n("commentsTitle")}: ${e.comments.length}`,children:[(0,Oe.jsx)(fa,{"aria-hidden":"true"}),(0,Oe.jsx)("span",{className:"kanban-tabular",children:e.comments.length})]})]})]})})}function Jp({card:e,labels:t,completed:a,today:o=wo(),query:r,onOpen:n}){let s=we(),l=(0,Zp.useId)(),{attributes:i,listeners:u,setNodeRef:c,transform:d,transition:f,isDragging:p}=An({id:e.id,data:{type:"card",cardId:e.id,columnId:e.columnId}});return(0,Oe.jsxs)("div",{ref:c,style:{transform:yt.Transform.toString(d),transition:f},...i,...u,"aria-label":e.title,"aria-describedby":l,onKeyDown:h=>{h.key==="Enter"&&!p?(h.preventDefault(),n(e)):u?.onKeyDown?.(h)},onClick:h=>{h.currentTarget.focus(),n(e)},className:`kanban-sortable-card${p?" is-dragging":""}`,children:[(0,Oe.jsxs)("span",{id:l,className:"kanban-sr-only",children:[s("cardKeyboardHelp"),e.dueDate&&` ${s("fieldDueDate")}: ${e.dueDate}. ${a?s("completed"):e.dueDate===o?s("dueToday"):e.dueDate<o?s("overdueDays").replace("{days}",String(li(e.dueDate,o))):""}`]}),(0,Oe.jsx)(pi,{card:e,labels:t,completed:a,today:o,query:r})]})}var Et=require("react/jsx-runtime");function Qp({column:e,cards:t,totalCount:a,filtered:o,labels:r,completed:n,today:s,query:l,onAddCard:i,onOpenCard:u}){let{setNodeRef:c,isOver:d}=yn({id:e.id,data:{type:"column"}}),{active:f,over:p}=Hr(),h=we(),g=f?.data.current?.type==="card"&&(d||p?.data.current?.columnId===e.id);return(0,Et.jsxs)("div",{ref:c,className:`kanban-column${g?" is-over":""}`,children:[(0,Et.jsxs)("div",{className:"kanban-column-header",children:[(0,Et.jsx)("h3",{className:"kanban-column-title",children:e.title}),(0,Et.jsx)("span",{className:"kanban-column-count",children:o?`${t.length} / ${a}`:t.length})]}),(0,Et.jsxs)("div",{className:"kanban-column-cards",children:[(0,Et.jsx)(Mn,{items:t.map(m=>m.id),strategy:Dn,children:t.map(m=>(0,Et.jsx)(Jp,{card:m,labels:r,completed:n,today:s,query:l,onOpen:u},m.id))}),t.length===0&&(0,Et.jsx)("p",{className:"kanban-column-empty",children:h(o?"noMatchingCards":"emptyColumn")})]}),(0,Et.jsx)("div",{className:"kanban-column-footer",children:(0,Et.jsxs)(ie,{variant:"ghost",size:"sm",className:"kanban-add-card",onClick:()=>i(e),children:[(0,Et.jsx)(Wa,{className:"kanban-icon"}),h("addCard")]})})]})}var ht=require("react");var le=require("react/jsx-runtime");function zb({column:e,value:t,onValueChange:a,onCommit:o,onDelete:r,canDelete:n,disabled:s}){let{attributes:l,listeners:i,setNodeRef:u,transform:c,transition:d,isDragging:f}=An({id:e.id,disabled:s}),p=we();return(0,le.jsxs)("div",{ref:u,style:{transform:yt.Transform.toString(c),transition:d},className:"kanban-editor-row","data-dragging":f||void 0,children:[(0,le.jsx)("button",{...l,...i,className:"kanban-drag-handle",disabled:s,"aria-label":`${p("dragSort")}: ${e.title}`,children:(0,le.jsx)(hr,{className:"kanban-icon"})}),(0,le.jsx)(Ht,{className:"kanban-editor-name","aria-label":`${p("columnName")}: ${e.title}`,value:t,disabled:s,maxLength:40,onChange:h=>a(h.target.value),onBlur:o,onKeyDown:h=>{h.key==="Enter"&&h.target.blur()}}),(0,le.jsx)(ie,{variant:"ghost",size:"icon",className:"kanban-icon-button kanban-editor-delete","aria-label":`${p("delete")}: ${e.title}`,disabled:s||!n,onClick:r,children:(0,le.jsx)(Bt,{className:"kanban-icon"})})]})}function em({open:e,error:t,columns:a,completedColumnId:o,onSetCompletedColumn:r,onOpenChange:n,onReorder:s,onRename:l,onDelete:i,onAdd:u}){let c=we(),d=(0,ht.useId)(),f=(0,ht.useId)(),[p,h]=(0,ht.useState)({}),[g,m]=(0,ht.useState)(""),[b,x]=(0,ht.useState)(!1),L=(0,ht.useRef)(!1),[C,S]=(0,ht.useState)(""),[v,y]=(0,ht.useState)(null),w=(0,ht.useRef)(null),E=Cn(eo(_o,{activationConstraint:{distance:8}}),eo(Aa,{coordinateGetter:Tn}));(0,ht.useEffect)(()=>{e&&(h(Object.fromEntries(a.map(A=>[A.id,A.title]))),m(""),S(""),y(null))},[e]),(0,ht.useEffect)(()=>{v&&w.current?.focus()},[v]);let I=async A=>{if(L.current)return!1;L.current=!0,x(!0),S("");try{let W=await A();return W===!1&&S(c("actionRetry")),W!==!1}catch(W){return S(c("actionFailed")+String(W instanceof Error?W.message:W)),!1}finally{L.current=!1,x(!1)}},R=async()=>{let A=g.trim();A&&await I(()=>u(A))&&m("")},M=A=>{let W=(p[A]??"").trim(),K=a.find(P=>P.id===A);K&&W&&W!==K.title&&I(()=>l(A,W))},q=A=>{let{active:W,over:K}=A;K&&W.id!==K.id&&I(()=>s(String(W.id),String(K.id)))};return(0,le.jsx)(Jo,{open:e,onOpenChange:A=>{if(!L.current){if(!A&&v){y(null);return}n(A)}},children:(0,le.jsxs)(Jr,{className:"kanban-dialog-medium kanban-editor-dialog",children:[(0,le.jsxs)(lo,{children:[(0,le.jsx)(co,{children:c("columnEdit")}),(0,le.jsx)(Qr,{children:c("columnEditDesc")})]}),(0,le.jsxs)(io,{className:"kanban-editor-body",children:[(t||C)&&(0,le.jsx)("p",{className:"kanban-dialog-error",role:"alert",children:t||C}),(0,le.jsxs)("section",{className:"kanban-editor-section","aria-label":c("boardLists"),children:[(0,le.jsxs)("h3",{className:"kanban-editor-caption",children:[c("boardLists")," ",(0,le.jsx)("span",{children:a.length})]}),(0,le.jsx)(Sn,{sensors:E,collisionDetection:Xu,onDragEnd:q,children:(0,le.jsx)(Mn,{items:a.map(A=>A.id),strategy:Dn,children:(0,le.jsx)("div",{className:"kanban-editor-list",children:a.map(A=>(0,le.jsx)(zb,{column:A,value:p[A.id]??A.title,onValueChange:W=>h(K=>({...K,[A.id]:W})),onCommit:()=>M(A.id),onDelete:()=>y(A),disabled:b||!!v,canDelete:a.length>1},A.id))})})})]}),(0,le.jsxs)("div",{className:"kanban-editor-setting",children:[(0,le.jsxs)("div",{className:"kanban-editor-setting-copy",children:[(0,le.jsx)(mt,{htmlFor:d,children:c("completedColumn")}),(0,le.jsx)("p",{id:`${d}-hint`,className:"kanban-muted-small",children:c("completedColumnHint")})]}),(0,le.jsxs)(ln,{value:o||"__none__",disabled:b||!!v,onValueChange:A=>{I(()=>r(A==="__none__"?null:A))},children:[(0,le.jsx)(rr,{id:d,"aria-describedby":`${d}-hint`,children:(0,le.jsx)(un,{})}),(0,le.jsxs)(nr,{children:[(0,le.jsx)(La,{value:"__none__",children:c("noCompletedColumn")}),a.map(A=>(0,le.jsx)(La,{value:A.id,children:A.title},A.id))]})]})]})]}),(0,le.jsx)(uo,{children:v?(0,le.jsxs)("div",{className:"kanban-dialog-confirm",children:[(0,le.jsx)("p",{role:"alert",children:c("deleteColumnDesc").replace("{column}",v.title)}),(0,le.jsxs)("div",{className:"kanban-confirm-actions",children:[(0,le.jsx)(ie,{ref:w,variant:"outline",disabled:b,onClick:()=>y(null),children:c("cancel")}),(0,le.jsx)(ie,{variant:"destructive",disabled:b,onClick:async()=>{await I(()=>i(v.id))&&y(null)},children:c("confirmDelete")})]})]}):(0,le.jsxs)("div",{className:"kanban-editor-add",children:[(0,le.jsx)(mt,{htmlFor:f,children:c("newColumnPlaceholder")}),(0,le.jsxs)("div",{className:"kanban-editor-add-row",children:[(0,le.jsx)("span",{className:"kanban-editor-add-icon","aria-hidden":"true",children:(0,le.jsx)(Wa,{className:"kanban-icon"})}),(0,le.jsx)(Ht,{id:f,value:g,disabled:b,placeholder:c("newColumnPlaceholder"),"aria-label":c("newColumnPlaceholder"),maxLength:40,onChange:A=>m(A.target.value),onKeyDown:A=>{A.key==="Enter"&&(A.preventDefault(),R())}}),(0,le.jsx)(ie,{size:"sm",className:"kanban-editor-add-button",disabled:b||!g.trim(),onClick:()=>{R()},children:c("add")})]})]})})]})})}var xt=require("react");var ve=require("react/jsx-runtime");function tm({open:e,error:t,labels:a,onOpenChange:o,onAdd:r,onUpdate:n,onDelete:s}){let l=we(),i=(0,xt.useId)(),[u,c]=(0,xt.useState)({}),[d,f]=(0,xt.useState)(""),[p,h]=(0,xt.useState)("#38bdf8"),[g,m]=(0,xt.useState)(!1),b=(0,xt.useRef)(!1),[x,L]=(0,xt.useState)(""),[C,S]=(0,xt.useState)(null),v=(0,xt.useRef)(null);(0,xt.useEffect)(()=>{e&&(c(Object.fromEntries(a.map(I=>[I.name,{name:I.name,color:I.color}]))),f(""),h("#38bdf8"),L(""),S(null))},[e]),(0,xt.useEffect)(()=>{C&&v.current?.focus()},[C]);let y=async I=>{if(b.current)return!1;b.current=!0,m(!0),L("");try{let R=await I();return R===!1&&L(l("actionRetry")),R!==!1}catch(R){return L(l("actionFailed")+String(R instanceof Error?R.message:R)),!1}finally{b.current=!1,m(!1)}},w=async()=>{let I=d.trim();I&&await y(()=>r(I,p))&&f("")},E=I=>{let R=u[I];if(!R)return;let M=a.find(A=>A.name===I),q=R.name.trim();M&&q&&(q!==I||R.color!==M.color)&&y(()=>n(I,q,R.color))};return(0,ve.jsx)(Jo,{open:e,onOpenChange:I=>{if(!b.current){if(!I&&C){S(null);return}o(I)}},children:(0,ve.jsxs)(Jr,{className:"kanban-dialog-medium kanban-editor-dialog",children:[(0,ve.jsxs)(lo,{children:[(0,ve.jsx)(co,{children:l("labelEdit")}),(0,ve.jsx)(Qr,{children:l("labelEditDesc")})]}),(0,ve.jsxs)(io,{className:"kanban-editor-body",children:[(t||x)&&(0,ve.jsx)("p",{className:"kanban-dialog-error",role:"alert",children:t||x}),(0,ve.jsxs)("section",{className:"kanban-editor-section","aria-label":l("boardLabels"),children:[(0,ve.jsxs)("h3",{className:"kanban-editor-caption",children:[l("boardLabels")," ",(0,ve.jsx)("span",{children:a.length})]}),(0,ve.jsxs)("div",{className:"kanban-editor-list",children:[a.length===0&&(0,ve.jsxs)("div",{className:"kanban-editor-empty",children:[(0,ve.jsx)(yr,{className:"kanban-icon","aria-hidden":"true"}),(0,ve.jsx)("p",{children:l("noLabelsHint")})]}),a.map(I=>{let R=u[I.name]??{name:I.name,color:I.color};return(0,ve.jsxs)("div",{className:"kanban-editor-row",children:[(0,ve.jsx)("input",{type:"color","aria-label":`${l("labelColor")}: ${I.name}`,title:`${l("labelColor")}: ${I.name}`,value:R.color,disabled:g||!!C,className:"kanban-color-input",onChange:M=>c(q=>({...q,[I.name]:{...R,color:M.target.value}})),onBlur:()=>E(I.name)}),(0,ve.jsx)(Ht,{className:"kanban-editor-name","aria-label":`${l("labelName")}: ${I.name}`,value:R.name,disabled:g||!!C,maxLength:20,onChange:M=>c(q=>({...q,[I.name]:{...R,name:M.target.value}})),onBlur:()=>E(I.name),onKeyDown:M=>{M.key==="Enter"&&M.target.blur()}}),(0,ve.jsx)(ie,{variant:"ghost",size:"icon",className:"kanban-icon-button kanban-editor-delete","aria-label":`${l("deleteLabel")}: ${I.name}`,disabled:g||!!C,onClick:()=>S(I.name),children:(0,ve.jsx)(Bt,{className:"kanban-icon"})})]},I.name)})]})]})]}),(0,ve.jsx)(uo,{children:C?(0,ve.jsxs)("div",{className:"kanban-dialog-confirm",children:[(0,ve.jsx)("p",{role:"alert",children:l("deleteLabelDesc").replace("{label}",C)}),(0,ve.jsxs)("div",{className:"kanban-confirm-actions",children:[(0,ve.jsx)(ie,{ref:v,variant:"outline",disabled:g,onClick:()=>S(null),children:l("cancel")}),(0,ve.jsx)(ie,{variant:"destructive",disabled:g,onClick:async()=>{await y(()=>s(C))&&S(null)},children:l("confirmDelete")})]})]}):(0,ve.jsxs)("div",{className:"kanban-editor-add",children:[(0,ve.jsx)(mt,{htmlFor:i,children:l("newLabelPlaceholder")}),(0,ve.jsxs)("div",{className:"kanban-editor-add-row",children:[(0,ve.jsx)("input",{type:"color","aria-label":l("newLabelColor"),title:l("newLabelColor"),value:p,disabled:g,className:"kanban-color-input",onChange:I=>h(I.target.value)}),(0,ve.jsx)(Ht,{id:i,value:d,disabled:g,placeholder:l("newLabelPlaceholder"),"aria-label":l("newLabelPlaceholder"),maxLength:20,onChange:I=>f(I.target.value),onKeyDown:I=>{I.key==="Enter"&&(I.preventDefault(),w())}}),(0,ve.jsx)(ie,{size:"sm",className:"kanban-editor-add-button",disabled:g||!d.trim(),onClick:()=>{w()},children:l("add")})]})]})})]})})}var sa=require("react/jsx-runtime");function am({query:e,onQueryChange:t,label:a,placeholder:o,children:r,actions:n}){let s=we();return(0,sa.jsxs)("div",{className:"kanban-search-row",children:[(0,sa.jsxs)("div",{className:"kanban-search-field",children:[(0,sa.jsx)(Va,{"aria-hidden":"true"}),(0,sa.jsx)(Ht,{type:"search","aria-label":a,placeholder:o,maxLength:200,value:e,onChange:l=>t(l.target.value)}),e&&(0,sa.jsx)(ie,{variant:"ghost",size:"icon","aria-label":s("clearSearch"),onClick:()=>t(""),children:(0,sa.jsx)($e,{})})]}),(0,sa.jsx)("div",{className:"kanban-toolbar",children:r}),n&&(0,sa.jsx)("div",{className:"kanban-toolbar-settings",children:n})]})}var cn=Z(require("react"),1);var jt=Z(require("react"),1);var ne=Z(require("react"),1);var Qe=Z(require("react"),1);var Vb=Z(require("react"),1),vs=Z(require("react"),1),Wb=Object.defineProperty,gi=(e,t)=>Wb(e,"name",{value:t,configurable:!0}),mi=!1;function om(){let[e,t]=vs.useState(mi);return vs.useEffect(()=>{mi||(mi=!0,t(!0))},[]),e}gi(om,"useIsHydrated");var rm=Vb[" useSyncExternalStore ".trim().toString()];function nm(){return()=>{}}gi(nm,"subscribe");function sm(){return rm(nm,()=>!0,()=>!1)}gi(sm,"useIsHydratedModern");var lm=typeof rm=="function"?sm:om;var qa=require("react/jsx-runtime"),Gb=Object.defineProperty,Ro=(e,t)=>Gb(e,"name",{value:t,configurable:!0}),hi="rovingFocusGroup.onEntryFocus",Kb={bubbles:!1,cancelable:!0},Is="RovingFocusGroup",[xi,um,Xb]=fo(Is),[$b,Li]=ot(Is,[Xb]),im={Vertical:"vertical",Horizontal:"horizontal"},jb={LTR:"ltr",RTL:"rtl"},[Yb,Zb]=$b(Is),dm=Qe.forwardRef(Ro(function(t,a){return(0,qa.jsx)(xi.Provider,{scope:t.__scopeRovingFocusGroup,children:(0,qa.jsx)(xi.Slot,{scope:t.__scopeRovingFocusGroup,children:(0,qa.jsx)(Jb,{...t,ref:a})})})},"RovingFocusGroup")),Jb=Qe.forwardRef(Ro(function(t,a){let{__scopeRovingFocusGroup:o,orientation:r,loop:n=!1,dir:s,currentTabStopId:l,defaultCurrentTabStopId:i,onCurrentTabStopIdChange:u,onEntryFocus:c,preventScrollOnEntryFocus:d=!1,...f}=t,p=Qe.useRef(null),h=ce(a,p),g=po(s),[m,b]=ea({prop:l,defaultProp:i??null,onChange:u,caller:Is}),[x,L]=Qe.useState(!1),C=Ye(c),S=um(o),v=Qe.useRef(!1),[y,w]=Qe.useState(0);return Qe.useEffect(()=>{let E=p.current;if(E)return E.addEventListener(hi,C),()=>E.removeEventListener(hi,C)},[C]),(0,qa.jsx)(Yb,{scope:o,orientation:r,dir:g,loop:n,currentTabStopId:m,onItemFocus:Qe.useCallback(E=>b(E),[b]),onItemShiftTab:Qe.useCallback(()=>L(!0),[]),onFocusableItemAdd:Qe.useCallback(()=>w(E=>E+1),[]),onFocusableItemRemove:Qe.useCallback(()=>w(E=>E-1),[]),children:(0,qa.jsx)(fe.div,{tabIndex:x||y===0?-1:0,"data-orientation":r,...f,ref:h,style:{outline:"none",...t.style},onMouseDown:J(t.onMouseDown,()=>{v.current=!0}),onFocus:J(t.onFocus,E=>{let I=!v.current;if(E.target===E.currentTarget&&I&&!x){let R=new CustomEvent(hi,Kb);if(E.currentTarget.dispatchEvent(R),!R.defaultPrevented){let M=S().filter(P=>P.focusable),q=M.find(P=>P.active),A=M.find(P=>P.id===m),K=[q,A,...M].filter(Boolean).map(P=>P.ref.current);bi(K,d)}}v.current=!1}),onBlur:J(t.onBlur,()=>L(!1))})})},"RovingFocusGroupImpl")),Qb="RovingFocusGroupItem",cm=Qe.forwardRef(Ro(function(t,a){let{__scopeRovingFocusGroup:o,focusable:r=!0,active:n=!1,tabStopId:s,children:l,...i}=t,u=Pt(),c=s||u,d=Zb(Qb,o),f=d.currentTabStopId===c,p=um(o),{onFocusableItemAdd:h,onFocusableItemRemove:g,currentTabStopId:m}=d,b=lm();return he(()=>{if(!(!b||!r))return h(),()=>g()},[b,r,h,g]),Qe.useEffect(()=>{if(!(b||!r))return h(),()=>g()},[b,r,h,g]),(0,qa.jsx)(xi.ItemSlot,{scope:o,id:c,focusable:r,active:n,children:(0,qa.jsx)(fe.span,{tabIndex:f?0:-1,"data-orientation":d.orientation,...i,ref:a,onMouseDown:J(t.onMouseDown,x=>{r?d.onItemFocus(c):x.preventDefault()}),onFocus:J(t.onFocus,()=>d.onItemFocus(c)),onKeyDown:J(t.onKeyDown,x=>{if(x.key==="Tab"&&x.shiftKey){d.onItemShiftTab();return}if(x.target!==x.currentTarget)return;let L=pm(x,d.orientation,d.dir);if(L!==void 0){if(x.metaKey||x.ctrlKey||x.altKey||x.shiftKey)return;x.preventDefault();let S=p().filter(v=>v.focusable).map(v=>v.ref.current);if(L==="last")S.reverse();else if(L==="prev"||L==="next"){L==="prev"&&S.reverse();let v=S.indexOf(x.currentTarget);S=d.loop?mm(S,v+1):S.slice(v+1)}setTimeout(()=>bi(S))}}),children:typeof l=="function"?l({isCurrentTabStop:f,hasTabStop:m!=null}):l})})},"RovingFocusGroupItem")),eC={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function fm(e,t){return t!==jb.RTL?e:e==="ArrowLeft"?"ArrowRight":e==="ArrowRight"?"ArrowLeft":e}Ro(fm,"getDirectionAwareKey");function pm(e,t,a){let o=fm(e.key,a);if(!(t===im.Vertical&&["ArrowLeft","ArrowRight"].includes(o))&&!(t===im.Horizontal&&["ArrowUp","ArrowDown"].includes(o)))return eC[o]}Ro(pm,"getFocusIntent");function bi(e,t=!1){let a=document.activeElement;for(let o of e)if(o===a||(o.focus({preventScroll:t}),document.activeElement!==a))return}Ro(bi,"focusFirst");function mm(e,t){return e.map((a,o)=>e[(t+o)%e.length])}Ro(mm,"wrapArray");var Re=require("react/jsx-runtime"),aC=Object.defineProperty,De=(e,t)=>aC(e,"name",{value:t,configurable:!0});var Ci=["Enter"," "],oC=["ArrowDown","PageUp","Home"],hm=["ArrowUp","PageDown","End"],rC=[...oC,...hm],gP={ltr:[...Ci,"ArrowRight"],rtl:[...Ci,"ArrowLeft"]};var Ss="Menu",[vi,nC,sC]=fo(Ss),[Po,wi]=ot(Ss,[sC,ar,Li]),Si=ar(),xm=Li(),[lC,dn]=Po(Ss),[iC,yi]=Po(Ss),Lm=De(e=>{let{__scopeMenu:t,open:a=!1,children:o,dir:r,onOpenChange:n,modal:s=!0}=e,l=Si(t),[i,u]=ne.useState(null),c=ne.useRef(!1),d=Ye(n),f=po(r);return ne.useEffect(()=>{let p=De(()=>{c.current=!0,document.addEventListener("pointerdown",h,{capture:!0,once:!0}),document.addEventListener("pointermove",h,{capture:!0,once:!0})},"handleKeyDown"),h=De(()=>c.current=!1,"handlePointer");return document.addEventListener("keydown",p,{capture:!0}),()=>{document.removeEventListener("keydown",p,{capture:!0}),document.removeEventListener("pointerdown",h,{capture:!0}),document.removeEventListener("pointermove",h,{capture:!0})}},[]),ne.useEffect(()=>{if(!a)return;let p=De(()=>d(!1),"handleBlur");return window.addEventListener("blur",p),()=>window.removeEventListener("blur",p)},[a,d]),(0,Re.jsx)(us,{...l,children:(0,Re.jsx)(lC,{scope:t,open:a,onOpenChange:d,content:i,onContentChange:u,children:(0,Re.jsx)(iC,{scope:t,onClose:ne.useCallback(()=>d(!1),[d]),isUsingKeyboardRef:c,dir:f,modal:s,children:o})})})},"Menu"),bm=ne.forwardRef(De(function(t,a){let{__scopeMenu:o,...r}=t,n=Si(o);return(0,Re.jsx)(ds,{...n,...r,ref:a})},"MenuAnchor")),Cm="MenuPortal",[uC,dC]=Po(Cm,{forceMount:void 0}),vm=De(e=>{let{__scopeMenu:t,forceMount:a,children:o,container:r}=e,n=dn(Cm,t);return(0,Re.jsx)(uC,{scope:t,forceMount:a,children:(0,Re.jsx)(ga,{present:a||n.open,children:(0,Re.jsx)(Vo,{asChild:!0,container:r,children:o})})})},"MenuPortal"),_a="MenuContent",[cC,Im]=Po(_a),wm=ne.forwardRef(De(function(t,a){let o=dC(_a,t.__scopeMenu),{forceMount:r=o.forceMount,...n}=t,s=dn(_a,t.__scopeMenu),l=yi(_a,t.__scopeMenu);return(0,Re.jsx)(vi.Provider,{scope:t.__scopeMenu,children:(0,Re.jsx)(ga,{present:r||s.open,children:(0,Re.jsx)(vi.Slot,{scope:t.__scopeMenu,children:l.modal?(0,Re.jsx)(fC,{...n,ref:a}):(0,Re.jsx)(pC,{...n,ref:a})})})})},"MenuContent")),fC=ne.forwardRef(De(function(t,a){let o=dn(_a,t.__scopeMenu),r=ne.useRef(null),n=ce(a,r);return ne.useEffect(()=>{let s=r.current;if(s)return Zo(s)},[]),(0,Re.jsx)(Sm,{...t,ref:n,trapFocus:o.open,disableOutsidePointerEvents:o.open,disableOutsideScroll:!0,onFocusOutside:J(t.onFocusOutside,s=>s.preventDefault(),{checkForDefaultPrevented:!1}),onDismiss:()=>o.onOpenChange(!1)})},"MenuRootContentModal")),pC=ne.forwardRef(De(function(t,a){let o=dn(_a,t.__scopeMenu);return(0,Re.jsx)(Sm,{...t,ref:a,trapFocus:!1,disableOutsidePointerEvents:!1,disableOutsideScroll:!1,onDismiss:()=>o.onOpenChange(!1)})},"MenuRootContentNonModal")),mC=it("MenuContent.ScrollLock"),Sm=ne.forwardRef(De(function(t,a){let{__scopeMenu:o,loop:r=!1,trapFocus:n,onOpenAutoFocus:s,onCloseAutoFocus:l,disableOutsidePointerEvents:i,onEntryFocus:u,onEscapeKeyDown:c,onPointerDownOutside:d,onFocusOutside:f,onInteractOutside:p,onDismiss:h,disableOutsideScroll:g,...m}=t,b=dn(_a,o),x=yi(_a,o),L=Si(o),C=xm(o),S=nC(o),[v,y]=ne.useState(null),w=ne.useRef(null),[E,I]=ne.useState(null);ll(E);let{nodes:R,registry:M}=Gr(),q=!!(n||g),A=ce(a,w,b.onContentChange,I),W=ne.useRef(0),K=ne.useRef(""),P=ne.useRef(0),_=ne.useRef(null),O=ne.useRef("right"),B=ne.useRef(0),F=ne.useMemo(()=>g?[w,...R.map(G=>({current:G}))]:[],[w,R,g]),j=g?no:ne.Fragment,re=g?{as:mC,allowPinchZoom:!0,shards:F}:void 0,ge=De(G=>{let xe=K.current+G,Ie=S().filter(Y=>!Y.disabled),Ce=document.activeElement,z=Ie.find(Y=>Y.ref.current===Ce)?.textValue,oe=Ie.map(Y=>Y.textValue),ue=Tm(oe,xe,z),ee=Ie.find(Y=>Y.textValue===ue)?.ref.current;function te(Y){K.current=Y,window.clearTimeout(W.current),Y!==""&&(W.current=window.setTimeout(()=>te(""),1e3))}De(te,"updateSearch"),te(xe),ee&&setTimeout(()=>ee.focus())},"handleTypeaheadSearch");ne.useEffect(()=>()=>window.clearTimeout(W.current),[]),Ta();let be=ne.useCallback(G=>O.current===_.current?.side&&Om(G,_.current?.area),[]);return(0,Re.jsx)(cC,{scope:o,searchRef:K,onItemEnter:ne.useCallback(G=>{be(G)&&G.preventDefault()},[be]),onItemLeave:ne.useCallback(G=>{be(G)||(w.current?.focus(),y(null))},[be]),onTriggerLeave:ne.useCallback(G=>{be(G)&&G.preventDefault()},[be]),pointerGraceTimerRef:P,onPointerGraceIntentChange:ne.useCallback(G=>{_.current=G},[]),children:(0,Re.jsx)(Vr,{registry:q?M:null,children:(0,Re.jsx)(j,{...re,children:(0,Re.jsx)(Wo,{asChild:!0,trapped:n,branches:R,onMountAutoFocus:J(s,G=>{G.preventDefault(),w.current?.focus({preventScroll:!0})}),onUnmountAutoFocus:l,children:(0,Re.jsx)(zo,{asChild:!0,disableOutsidePointerEvents:i,onEscapeKeyDown:c,onPointerDownOutside:d,onFocusOutside:f,onInteractOutside:p,onDismiss:h,children:(0,Re.jsx)(dm,{asChild:!0,...C,dir:x.dir,orientation:"vertical",loop:r,currentTabStopId:v,onCurrentTabStopIdChange:y,onEntryFocus:J(u,G=>{x.isUsingKeyboardRef.current||G.preventDefault()}),preventScrollOnEntryFocus:!0,children:(0,Re.jsx)(cs,{role:"menu","aria-orientation":"vertical","data-state":Pm(b.open),"data-radix-menu-content":"",dir:x.dir,...L,...m,ref:A,style:{outline:"none",...m.style},onKeyDown:J(m.onKeyDown,G=>{let Ie=G.target.closest("[data-radix-menu-content]")===G.currentTarget,Ce=G.ctrlKey||G.altKey||G.metaKey,z=G.key.length===1;Ie&&(G.key==="Tab"&&G.preventDefault(),!Ce&&z&&ge(G.key));let oe=w.current;if(G.target!==oe||!rC.includes(G.key))return;G.preventDefault();let ee=S().filter(te=>!te.disabled).map(te=>te.ref.current);hm.includes(G.key)&&ee.reverse(),Mm(ee)}),onBlur:J(t.onBlur,G=>{G.currentTarget.contains(G.target)||(window.clearTimeout(W.current),K.current="")}),onPointerMove:J(t.onPointerMove,ws(G=>{let xe=G.target,Ie=B.current!==G.clientX;if(G.currentTarget.contains(xe)&&Ie){let Ce=G.clientX>B.current?"right":"left";O.current=Ce,B.current=G.clientX}}))})})})})})})})},"MenuContentImpl"));var ym=ne.forwardRef(De(function(t,a){let{__scopeMenu:o,...r}=t;return(0,Re.jsx)(fe.div,{...r,ref:a})},"MenuLabel")),Ii="MenuItem",gm="menu.itemSelect",km=ne.forwardRef(De(function(t,a){let{disabled:o=!1,onSelect:r,...n}=t,s=ne.useRef(null),l=yi(Ii,t.__scopeMenu),i=Im(Ii,t.__scopeMenu),u=ce(a,s),c=ne.useRef(!1),d=De(()=>{let f=s.current;if(!o&&f){let p=new CustomEvent(gm,{bubbles:!0,cancelable:!0});f.addEventListener(gm,h=>r?.(h),{once:!0}),zr(f,p),p.defaultPrevented?c.current=!1:l.onClose()}},"handleSelect");return(0,Re.jsx)(gC,{...n,ref:u,disabled:o,onClick:J(t.onClick,d),onPointerDown:f=>{t.onPointerDown?.(f),c.current=!0},onPointerUp:J(t.onPointerUp,f=>{c.current||f.currentTarget?.click()}),onKeyDown:J(t.onKeyDown,f=>{o||f.target!==f.currentTarget||i.searchRef.current!==""&&f.key===" "||Ci.includes(f.key)&&(f.currentTarget.click(),f.preventDefault())})})},"MenuItem")),gC=ne.forwardRef(De(function(t,a){let{__scopeMenu:o,disabled:r=!1,textValue:n,...s}=t,l=Im(Ii,o),i=xm(o),u=ne.useRef(null),c=ce(a,u),[d,f]=ne.useState(!1),[p,h]=ne.useState("");return ne.useEffect(()=>{let g=u.current;g&&h((g.textContent??"").trim())},[s.children]),(0,Re.jsx)(vi.ItemSlot,{scope:o,disabled:r,textValue:n??p,children:(0,Re.jsx)(cm,{asChild:!0,...i,focusable:!r,children:(0,Re.jsx)(fe.div,{role:"menuitem","data-highlighted":d?"":void 0,"aria-disabled":r||void 0,"data-disabled":r?"":void 0,...s,ref:c,onPointerMove:J(t.onPointerMove,ws(g=>{r?l.onItemLeave(g):(l.onItemEnter(g),g.defaultPrevented||g.currentTarget.focus({preventScroll:!0}))})),onPointerLeave:J(t.onPointerLeave,ws(g=>l.onItemLeave(g))),onFocus:J(t.onFocus,()=>f(!0)),onBlur:J(t.onBlur,()=>f(!1))})})})},"MenuItemImpl"));var hC="MenuRadioGroup",[hP,xP]=Po(hC,{value:void 0,onValueChange:De(()=>{},"onValueChange")});var xC="MenuItemIndicator",[LP,bP]=Po(xC,{checked:!1});var Rm=ne.forwardRef(De(function(t,a){let{__scopeMenu:o,...r}=t;return(0,Re.jsx)(fe.div,{role:"separator","aria-orientation":"horizontal",...r,ref:a})},"MenuSeparator"));var LC="MenuSub",[CP,vP]=Po(LC);function Pm(e){return e?"open":"closed"}De(Pm,"getOpenState");function Dm(e){return e==="indeterminate"}De(Dm,"isIndeterminate");function bC(e){return Dm(e)?"indeterminate":e?"checked":"unchecked"}De(bC,"getCheckedState");function Mm(e){let t=document.activeElement;for(let a of e)if(a===t||(a.focus(),document.activeElement!==t))return}De(Mm,"focusFirst");function Am(e,t){return e.map((a,o)=>e[(t+o)%e.length])}De(Am,"wrapArray");function Tm(e,t,a){let r=t.length>1&&Array.from(t).every(u=>u===t[0])?t[0]:t,n=a?e.indexOf(a):-1,s=Am(e,Math.max(n,0));r.length===1&&(s=s.filter(u=>u!==a));let i=s.find(u=>u.toLowerCase().startsWith(r.toLowerCase()));return i!==a?i:void 0}De(Tm,"getNextMatch");function Em(e,t){let{x:a,y:o}=e,r=!1;for(let n=0,s=t.length-1;n<t.length;s=n++){let l=t[n],i=t[s],u=l.x,c=l.y,d=i.x,f=i.y;c>o!=f>o&&a<(d-u)*(o-c)/(f-c)+u&&(r=!r)}return r}De(Em,"isPointInPolygon");function Om(e,t){if(!t)return!1;let a={x:e.clientX,y:e.clientY};return Em(a,t)}De(Om,"isPointerInGraceArea");function ws(e){return t=>t.pointerType==="mouse"?e(t):void 0}De(ws,"whenMouse");var la=require("react/jsx-runtime"),vC=Object.defineProperty,Do=(e,t)=>vC(e,"name",{value:t,configurable:!0}),ki="DropdownMenu",[IC,qP]=ot(ki,[wi]),Mo=wi(),[wC,Bm]=IC(ki),Fm=Do(e=>{let{__scopeDropdownMenu:t,children:a,dir:o,open:r,defaultOpen:n,onOpenChange:s,modal:l=!0}=e,i=Mo(t),u=jt.useRef(null),[c,d]=ea({prop:r,defaultProp:n??!1,onChange:s,caller:ki});return(0,la.jsx)(wC,{scope:t,triggerId:Pt(),triggerRef:u,contentId:Pt(),open:c,onOpenChange:d,onOpenToggle:jt.useCallback(()=>d(f=>!f),[d]),modal:l,children:(0,la.jsx)(Lm,{...i,open:c,onOpenChange:d,dir:o,modal:l,children:a})})},"DropdownMenu"),SC="DropdownMenuTrigger",Nm=jt.forwardRef(Do(function(t,a){let{__scopeDropdownMenu:o,disabled:r=!1,...n}=t,s=Bm(SC,o),l=Mo(o),i=ce(a,s.triggerRef);return(0,la.jsx)(bm,{asChild:!0,...l,children:(0,la.jsx)(fe.button,{type:"button",id:s.triggerId,"aria-haspopup":"menu","aria-expanded":s.open,"aria-controls":s.open?s.contentId:void 0,"data-state":s.open?"open":"closed","data-disabled":r?"":void 0,disabled:r,...n,ref:i,onPointerDown:J(t.onPointerDown,u=>{!r&&u.button===0&&u.ctrlKey===!1&&(s.onOpenToggle(),s.open||u.preventDefault())}),onKeyDown:J(t.onKeyDown,u=>{r||(["Enter"," "].includes(u.key)&&s.onOpenToggle(),u.key==="ArrowDown"&&s.onOpenChange(!0),["Enter"," ","ArrowDown"].includes(u.key)&&u.preventDefault())})})})},"DropdownMenuTrigger")),qm=Do(e=>{let{__scopeDropdownMenu:t,...a}=e,o=Mo(t);return(0,la.jsx)(vm,{...o,...a})},"DropdownMenuPortal"),yC="DropdownMenuContent",Ri=jt.forwardRef(Do(function(t,a){let{__scopeDropdownMenu:o,...r}=t,n=Bm(yC,o),s=Mo(o),l=jt.useRef(!1);return(0,la.jsx)(wm,{id:n.contentId,"aria-labelledby":n.triggerId,...s,...r,ref:a,onCloseAutoFocus:J(t.onCloseAutoFocus,i=>{l.current||n.triggerRef.current?.focus(),l.current=!1,i.preventDefault()}),onInteractOutside:J(t.onInteractOutside,i=>{let u=i.detail.originalEvent,c=u.button===0&&u.ctrlKey===!0,d=u.button===2||c;(!n.modal||d)&&(l.current=!0)}),style:{...t.style,"--radix-dropdown-menu-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-dropdown-menu-content-available-width":"var(--radix-popper-available-width)","--radix-dropdown-menu-content-available-height":"var(--radix-popper-available-height)","--radix-dropdown-menu-trigger-width":"var(--radix-popper-anchor-width)","--radix-dropdown-menu-trigger-height":"var(--radix-popper-anchor-height)"}})},"DropdownMenuContent"));var Pi=jt.forwardRef(Do(function(t,a){let{__scopeDropdownMenu:o,...r}=t,n=Mo(o);return(0,la.jsx)(ym,{...n,...r,ref:a})},"DropdownMenuLabel")),Di=jt.forwardRef(Do(function(t,a){let{__scopeDropdownMenu:o,...r}=t,n=Mo(o);return(0,la.jsx)(km,{...n,...r,ref:a})},"DropdownMenuItem"));var Mi=jt.forwardRef(Do(function(t,a){let{__scopeDropdownMenu:o,...r}=t,n=Mo(o);return(0,la.jsx)(Rm,{...n,...r,ref:a})},"DropdownMenuSeparator"));var lr=require("react/jsx-runtime"),Ha=Fm,Ua=Nm;var Ca=cn.forwardRef(({className:e,sideOffset:t=4,...a},o)=>(0,lr.jsx)(qm,{children:(0,lr.jsx)(Ri,{ref:o,sideOffset:t,className:de("kanban-portal kanban-dropdown-content",e),...a})}));Ca.displayName=Ri.displayName;var Ct=cn.forwardRef(({className:e,inset:t,...a},o)=>(0,lr.jsx)(Di,{ref:o,className:de("kanban-dropdown-item",t&&"kanban-dropdown-item--inset",e),...a}));Ct.displayName=Di.displayName;var RC=cn.forwardRef(({className:e,inset:t,...a},o)=>(0,lr.jsx)(Pi,{ref:o,className:de("kanban-dropdown-label",t&&"kanban-dropdown-label--inset",e),...a}));RC.displayName=Pi.displayName;var Ai=cn.forwardRef(({className:e,...t},a)=>(0,lr.jsx)(Mi,{ref:a,className:de("kanban-dropdown-separator",e),...t}));Ai.displayName=Mi.displayName;var Yt=require("react/jsx-runtime");function _m({label:e,value:t,onValueChange:a,options:o}){let r=t!==o[0]?.value;return(0,Yt.jsxs)(Ha,{children:[(0,Yt.jsx)(Ua,{asChild:!0,children:(0,Yt.jsx)(ie,{variant:"ghost",size:"icon",className:`kanban-toolbar-button${r?" is-active":""}`,title:e,"aria-label":e,"aria-pressed":r,children:(0,Yt.jsx)(Ra,{className:"kanban-icon"})})}),(0,Yt.jsx)(Ca,{align:"start",children:o.map(n=>(0,Yt.jsxs)(Ct,{role:"menuitemradio","aria-checked":t===n.value,onSelect:()=>a(n.value),children:[(0,Yt.jsx)("span",{className:"kanban-filter-check",children:t===n.value&&(0,Yt.jsx)(st,{className:"kanban-icon"})}),n.leading,n.label,n.count!==void 0&&(0,Yt.jsx)("span",{className:"kanban-filter-count",children:n.count})]},n.value))})]})}function Ti(e,t=""){let a=t.trim().toLowerCase();return a?[e.id,e.title,e.note,...(e.comments||[]).map(o=>o.content)].some(o=>typeof o=="string"&&o.toLowerCase().includes(a)):!0}function Hm(e,t,a,o){if(a.files.length){if(!o?.createDrafts||!o.releaseDraftAttachments||!t.addAttachments)throw new Error(ft("chatImagesUnavailable"));let r=o.createDrafts(e,a.files,!0);try{if(!t.addAttachments(r.map(n=>n.id)))throw new Error(ft("chatImagesBusy"))}catch(n){throw o.releaseDraftAttachments(r),n}}t.setDraft(a.text)}var Ei=new Map,Oi=0,ys=new Set;function Um(e,t,a=[]){Ei.set(e,{text:t,files:a}),Oi++;for(let o of ys)o()}function zm(e){let t=Ei.get(e);if(t==null)return null;Ei.delete(e),Oi++;for(let a of ys)a();return t}function Wm(e){return ys.add(e),()=>{ys.delete(e)}}function Vm(){return Oi}function Gm(e){let t=(e.id??"").trim(),a=(e.title??"").trim(),o=(e.note??"").trim(),r=(e.label??"").trim(),n=[];return t&&n.push(ft("fieldId")+": "+t),a&&n.push(a),r&&n.push(ft("fieldLabel")+": "+r),e.dueDate&&n.push(ft("fieldDueDate")+": "+e.dueDate),e.completed!==void 0&&n.push(ft("completionStatus")+": "+ft(e.completed?"completed":"incomplete")),e.completed&&n.push(ft("fieldCompletedDate")+": "+(e.completedAt||ft("completedDateUnknown"))),o&&n.push(o),e.imageCount&&n.push(ft("imagesChatHint").replace("{count}",String(e.imageCount))),n.join(`

`)}var X=require("react/jsx-runtime");function Km(e,t,a,o,r){let n=e.find(m=>m.id===t);if(!n)return{cards:e,toIndex:-1};let s=e.filter(m=>m.columnId===n.columnId).findIndex(m=>m.id===t);if(o===t&&n.columnId===a)return{cards:e,toIndex:s};let l=e.filter(m=>m.id!==t),i=l.filter(m=>m.columnId===a),u=o?i.findIndex(m=>m.id===o):-1,c=u<0?i.length:u+(r?1:0),d=[...l],f=i[c],p=i[i.length-1],h=f?d.indexOf(f):p?d.indexOf(p)+1:d.length;return d.splice(h,0,{...n,columnId:a}),{cards:d.every((m,b)=>m.id===e[b]?.id&&m.columnId===e[b]?.columnId)?e:d,toIndex:c}}function Xm({workspaceId:e,onCreateConversation:t}){let a=we(),[o,r]=(0,Le.useState)(null),[n,s]=(0,Le.useState)(null),[l,i]=(0,Le.useState)(""),[u,c]=(0,Le.useState)(""),[d,f]=(0,Le.useState)([]),[p,h]=(0,Le.useState)(null),[g,m]=(0,Le.useState)(null),[b,x]=(0,Le.useState)(!1),[L,C]=(0,Le.useState)(!1),[S,v]=(0,Le.useState)(!1),y=Hp(),[w,E]=(0,Le.useState)(""),[I,R]=(0,Le.useState)(""),[M,q]=(0,Le.useState)(null),A=(0,Le.useRef)(o),W=(0,Le.useRef)(null),K=(0,Le.useRef)(!1);K.current=!!(g||b||L||W.current);let P=(0,Le.useRef)(e),_=(0,Le.useRef)(null);(0,Le.useEffect)(()=>()=>{_.current?.abort()},[e]);let O=(0,Le.useRef)(0),B=(0,Le.useRef)(0);A.current=o,P.current=e;let F=Cn(eo(Or,{activationConstraint:{distance:8}}),eo(Br,{activationConstraint:{delay:250,tolerance:5}}),eo(Aa,{coordinateGetter:Tn})),j=(0,Le.useCallback)((k,H,V)=>{P.current!==H||V<B.current||(B.current=V,k&&k.board&&(r({...k.board,completedColumnId:k.board.completedColumnId??null,cards:Array.isArray(k.board.cards)?k.board.cards.map(T=>({...T,dueDate:T.dueDate??null,completedAt:T.completedAt??null,comments:Array.isArray(T.comments)?T.comments:[],images:Array.isArray(T.images)?T.images:[]})):[],activities:Array.isArray(k.board.activities)?k.board.activities:[]}),c("")),k&&"imageLimits"in k&&s(k.persisted===!1?null:k.imageLimits??null),Array.isArray(k&&k.warnings)&&k.warnings.length>0&&f(T=>[...T,...k.warnings]))},[]),re=(0,Le.useCallback)(async(k,H={})=>{let V=++O.current;c("");try{let T=await So(k,H,e);return j(T,e,V),!0}catch(T){return c(a("actionFailed")+String(T&&T.message||T)),!1}},[e,j,a]),ge=(0,Le.useRef)(null),be=(0,Le.useCallback)((k=!0)=>{if(ge.current)return ge.current;let H=++O.current;k&&v(!0);let V=So("get",{},e).then(T=>{(k||!K.current)&&j(T,e,H)}).catch(T=>{k&&P.current===e&&c(a("loadFailed")+String(T&&T.message||T))}).finally(()=>{ge.current===V&&(ge.current=null),k&&P.current===e&&v(!1)});return ge.current=V,V},[e,j,a]);(0,Le.useEffect)(()=>{if(!o||g||b||L)return;let k=()=>{document.visibilityState==="visible"&&!W.current&&be(!1)},H=window.setInterval(k,2e3),V=()=>k();return document.addEventListener("visibilitychange",V),window.addEventListener("online",k),()=>{window.clearInterval(H),document.removeEventListener("visibilitychange",V),window.removeEventListener("online",k)}},[o!==null,g,b,L,be]),(0,Le.useEffect)(()=>{let k=!0,H=++O.current;return r(null),s(null),i(""),q(null),R(""),E(""),m(null),h(null),c(""),f([]),So("get",{},e).then(V=>{k&&j(V,e,H)}).catch(V=>{k&&c(a("loadFailed")+String(V&&V.message||V))}),()=>{k=!1}},[e,j,a]),(0,Le.useEffect)(()=>{o&&q(k=>k&&!o.labels.some(H=>H.name===k)?null:k)},[o?.labels]);let G=(0,Le.useCallback)(k=>{let H=$u(k),V=H.length>0?H:Ws(k),T=Nr(V,"id");if(T==null)return[];if(new Set((o?.columns??[]).map(Me=>Me.id)).has(String(T))){let Me=(o?.cards??[]).filter(Ae=>Ae.columnId===T).map(Ae=>Ae.id);if(Me.length>0){let Ae=vn({...k,droppableContainers:k.droppableContainers.filter(ct=>ct.id!==T&&Me.includes(String(ct.id)))});Ae.length>0&&(T=Ae[0].id)}}return[{id:T}]},[o]),xe=k=>{let H=A.current;if(!H||H.cards===k)return;let V={...H,cards:k};A.current=V,r(V)},Ie=k=>{if(k.active.data.current?.type!=="card")return;let H=A.current,V=H?.cards.find(T=>T.id===k.active.id);!V||!H||(W.current=H.cards,h(V))},Ce=({active:k,over:H})=>{let V=A.current;if(!H||!V||k.data.current?.type!=="card")return;let T=String(k.id),$=V.cards.find(ia=>ia.id===T),Me=V.cards.find(ia=>ia.id===H.id),Ae=Me?.columnId??(H.data.current?.type==="column"?String(H.id):null);if(!$||!Ae||$.columnId===Ae)return;let ct=k.rect.current.translated,Ao=!!(Me&&ct&&ct.top+ct.height/2>H.rect.top+H.rect.height/2);xe(Km(V.cards,T,Ae,Me?.id??null,Ao).cards)},z=({active:k,over:H})=>{let V=A.current,T=W.current;if(W.current=null,!H||!V||k.data.current?.type!=="card"){T&&xe(T),h(null);return}let $=String(k.id),Me=V.cards.find(vt=>vt.id===H.id),Ae=Me?.columnId??(H.data.current?.type==="column"?String(H.id):null);if(!Ae){T&&xe(T),h(null);return}let ct=k.rect.current.translated,Ao=!!(Me&&ct&&ct.top+ct.height/2>H.rect.top+H.rect.height/2),ia=Km(V.cards,$,Ae,Me?.id??null,Ao);xe(ia.cards),h(null),(!T||ia.cards.some((vt,ua)=>vt.id!==T[ua]?.id||vt.columnId!==T[ua]?.columnId))&&re("moveCard",{id:$,columnId:Ae,toIndex:ia.toIndex}).then(vt=>{vt||be()})},oe=()=>{W.current&&xe(W.current),W.current=null,h(null)},ue=async k=>{if(!g)return!1;let H=A.current?.cards.find(Ae=>Ae.id===(k.id||g.card?.id));if((k.id||g.card?.id)&&!H)throw new Error(a("cardNoLongerExists"));let V=H?{id:H.id}:{columnId:g.columnId,title:k.title,note:k.note,label:k.label||void 0,priority:k.priority||void 0,dueDate:k.dueDate||null};H&&(k.title!==H.title&&(V.title=k.title),k.note!==H.note&&(V.note=k.note),k.label!==(H.label??"")&&(V.label=k.label),k.priority!==(H.priority??"")&&(V.priority=k.priority),k.dueDate!==(H.dueDate??"")&&(V.dueDate=k.dueDate||null));let T=++O.current;c("");let $=await So(H?"updateCard":"addCard",V,e);if(j($,e,T),P.current!==e)return!1;let Me=H?.id??$.cardId;if(!Me)return!0;if(!H){let Ae=$.board?.cards.find(ct=>ct.id===Me);Ae&&m({card:Ae,columnId:Ae.columnId})}return{cardId:Me}},ee=async(k,H,V)=>{let T=++O.current,$=await Wp(e,k,H,V);if($.persisted===!1)throw new Error(a("actionRetry"));j($,e,T)},te=(0,Le.useCallback)(async k=>{let H=A.current,V=H?.cards.find($=>$.id===k.id),T=Gm({...k,imageCount:V?.images?.length,completedAt:V?.completedAt,completed:V&&H?.completedColumnId?V.columnId===H.completedColumnId:void 0});if(!T)return!1;c("");try{_.current?.abort();let $=new AbortController;_.current=$;let Me=await Vp(e,V?.id??"",V?.images??[],AbortSignal.any([$.signal,AbortSignal.timeout(3e4)]));return $.signal.aborted?!1:await t(e,{text:T,files:Me},$.signal)}catch($){return c(a("actionFailed")+String($&&$.message||$)),!1}},[t,e,a]);if(!o)return(0,X.jsx)("div",{className:"kanban-root kanban-loading",children:u?(0,X.jsxs)("div",{role:"alert",children:[(0,X.jsx)("p",{className:"kanban-error",children:u}),(0,X.jsx)(ie,{variant:"outline",onClick:()=>be(),disabled:S,children:a("retry")})]}):(0,X.jsx)("p",{className:"kanban-muted-text",children:a("loading")})});let Y=o.cards.find(k=>k.id===g?.card?.id);return(0,X.jsxs)("div",{className:"kanban-root kanban-view",children:[u&&!g&&!b&&!L&&(0,X.jsx)("p",{className:"kanban-error",role:"alert",children:u}),(0,X.jsxs)(am,{query:l,onQueryChange:i,label:a("searchCards"),placeholder:a("searchPlaceholder"),actions:(0,X.jsxs)(Ha,{children:[(0,X.jsx)(Ua,{asChild:!0,children:(0,X.jsx)(ie,{variant:"ghost",size:"icon",className:"kanban-toolbar-button kanban-toolbar-settings",title:a("settings"),"aria-label":a("settings"),children:(0,X.jsx)(wr,{className:"kanban-icon"})})}),(0,X.jsxs)(Ca,{align:"end",children:[(0,X.jsxs)(Ct,{disabled:S,onSelect:()=>be(),children:[(0,X.jsx)(Pa,{className:S?"kanban-animate-spin":void 0}),a("refresh")]}),(0,X.jsxs)(Ct,{onClick:()=>{c(""),x(!0)},children:[(0,X.jsx)(Cr,{className:"kanban-icon"}),a("columnEdit")]}),(0,X.jsxs)(Ct,{onClick:()=>{c(""),C(!0)},children:[(0,X.jsx)(Oo,{className:"kanban-icon"}),a("labelEdit")]}),(0,X.jsx)(Ai,{}),(0,X.jsx)(Ct,{asChild:!0,children:(0,X.jsxs)("a",{href:"https://github.com/alpacachen/dsh-kanban/issues/new/choose",target:"_blank",rel:"noopener noreferrer",children:[(0,X.jsx)(fa,{className:"kanban-icon"}),a("feedback")]})})]})]}),children:[(0,X.jsx)(_m,{label:a("priorityFilter"),value:I,onValueChange:R,options:[{value:"",label:a("all")},...xs.map(k=>({value:k,label:Tt[k].label,leading:(0,X.jsx)("span",{className:"kanban-priority-dot",style:{background:Tt[k].color}})}))]}),(0,X.jsxs)(Ha,{children:[(0,X.jsx)(Ua,{asChild:!0,children:(0,X.jsx)(ie,{variant:"ghost",size:"icon",className:`kanban-toolbar-button${M!==null?" is-active":""}`,title:M===null?a("labelFilter"):`${a("labelFilter")}: ${M||a("noLabel")}`,"aria-label":a("labelFilter"),"aria-pressed":M!==null,children:(0,X.jsx)(Oo,{className:"kanban-icon"})})}),(0,X.jsxs)(Ca,{align:"start",children:[(0,X.jsxs)(Ct,{role:"menuitemradio","aria-checked":M===null,onSelect:()=>q(null),children:[(0,X.jsx)("span",{className:"kanban-filter-check",children:M===null&&(0,X.jsx)(st,{className:"kanban-icon"})}),a("all")]}),(0,X.jsxs)(Ct,{role:"menuitemradio","aria-checked":M==="",onSelect:()=>q(""),children:[(0,X.jsx)("span",{className:"kanban-filter-check",children:M===""&&(0,X.jsx)(st,{className:"kanban-icon"})}),a("noLabel")]}),o.labels.map(k=>(0,X.jsxs)(Ct,{role:"menuitemradio","aria-checked":M===k.name,onSelect:()=>q(k.name),children:[(0,X.jsx)("span",{className:"kanban-filter-check",children:M===k.name&&(0,X.jsx)(st,{className:"kanban-icon"})}),(0,X.jsx)("span",{className:"kanban-label-dot",style:{background:k.color}}),k.name]},k.name))]})]}),(0,X.jsxs)(Ha,{children:[(0,X.jsx)(Ua,{asChild:!0,children:(0,X.jsx)(ie,{variant:"ghost",size:"icon",className:`kanban-toolbar-button${w?" is-active":""}`,title:a("dueDateFilter"),"aria-label":a("dueDateFilter"),"aria-pressed":!!w,children:(0,X.jsx)(za,{className:"kanban-icon"})})}),(0,X.jsx)(Ca,{align:"start",children:["","today","overdue"].map(k=>(0,X.jsxs)(Ct,{role:"menuitemradio","aria-checked":w===k,onSelect:()=>E(k),children:[(0,X.jsx)("span",{className:"kanban-filter-check",children:w===k&&(0,X.jsx)(st,{className:"kanban-icon"})}),a(k==="today"?"dueToday":k==="overdue"?"overdue":"all")]},k))})]})]}),(l.trim()||I||M!==null||w)&&(0,X.jsxs)("div",{className:"kanban-filter-summary","aria-label":a("clearFilter"),children:[l.trim()&&(0,X.jsx)("span",{className:"kanban-muted-small",role:"status",children:a("searchResults").replace("{count}",String(o.cards.filter(k=>Ti(k,l)&&(!I||k.priority===I)&&(M===null||(k.label??"")===M)&&ii(k,w,o.completedColumnId,y)).length))}),w&&(0,X.jsxs)(ie,{variant:"ghost",size:"sm",className:"kanban-filter-chip","aria-label":`${a("clearFilter")}: ${a(w==="today"?"dueToday":"overdue")}`,onClick:()=>E(""),children:[a(w==="today"?"dueToday":"overdue"),(0,X.jsx)($e,{className:"kanban-tiny-icon","aria-hidden":"true"})]}),I&&(0,X.jsxs)(ie,{variant:"ghost",size:"sm",className:"kanban-filter-chip","aria-label":`${a("clearFilter")}: ${Tt[I].label}`,onClick:()=>R(""),children:[a("fieldPriority"),": ",Tt[I].label,(0,X.jsx)($e,{className:"kanban-tiny-icon","aria-hidden":"true"})]}),M!==null&&(0,X.jsxs)(ie,{variant:"ghost",size:"sm",className:"kanban-filter-chip","aria-label":`${a("clearFilter")}: ${M||a("noLabel")}`,onClick:()=>q(null),children:[a("fieldLabel"),": ",M||a("noLabel"),(0,X.jsx)($e,{className:"kanban-tiny-icon","aria-hidden":"true"})]})]}),d.length>0&&(0,X.jsxs)("div",{className:"kanban-warning",children:[(0,X.jsxs)("div",{className:"kanban-warning-body",children:[(0,X.jsx)("p",{className:"kanban-warning-title",children:a("warnings")}),d.map((k,H)=>(0,X.jsx)("p",{className:"kanban-warning-item",children:k},H))]}),(0,X.jsx)(ie,{variant:"ghost",size:"sm",className:"kanban-warning-dismiss",onClick:()=>f([]),children:a("dismiss")})]}),(0,X.jsxs)(Sn,{sensors:F,collisionDetection:G,onDragStart:Ie,onDragOver:Ce,onDragEnd:z,onDragCancel:oe,children:[(0,X.jsx)("div",{className:"kanban-content",children:(0,X.jsx)("div",{className:"kanban-board-scroll",children:o.columns.map(k=>{let H=o.cards.filter(V=>V.columnId===k.id&&Ti(V,l)&&(!I||V.priority===I)&&(M===null||(V.label??"")===M)&&(V.id===p?.id||ii(V,w,o.completedColumnId,y)));return(0,X.jsx)(Qp,{column:k,cards:H,totalCount:o.cards.filter(V=>V.columnId===k.id).length,filtered:!!(I||w||l.trim())||M!==null,completed:k.id===o.completedColumnId,today:y,labels:o.labels,query:l,onAddCard:V=>{c(""),m({card:null,columnId:V.id})},onOpenCard:V=>{c(""),m({card:V,columnId:V.columnId})}},k.id)})})}),(0,X.jsx)(cd,{children:p?(0,X.jsx)("div",{className:"kanban-drag-preview",children:(0,X.jsx)(pi,{card:p,labels:o.labels,completed:p.columnId===o.completedColumnId,today:y})}):null})]}),(0,X.jsx)(jp,{workspaceId:e,imageLimits:n,images:Y?.images??[],onUploadImage:ee,onRemoveImage:(k,H)=>re("removeImage",{id:k,attachmentId:H}),error:u,open:g!==null,card:g?.card??null,labels:o.labels,completed:!!(Y&&Y.columnId===o.completedColumnId),completedAt:Y?.completedAt??null,comments:Y?.comments??[],activities:g?.card?o.activities.filter(k=>k.cardId===g.card.id):[],onOpenChange:k=>{k||m(null)},onSave:ue,onAddComment:(k,H)=>re("addComment",{id:k,content:H}),onDelete:k=>re("deleteCard",{id:k.id}),onChatWithAgent:te},e),(0,X.jsx)(em,{error:u,open:b,columns:o.columns,completedColumnId:o.completedColumnId,onSetCompletedColumn:k=>re("setCompletedColumn",{columnId:k}),onOpenChange:x,onReorder:(k,H)=>{let V=o.columns.findIndex(T=>T.id===H);return V>=0?re("moveColumn",{id:k,toIndex:V}):Promise.resolve(!1)},onRename:(k,H)=>re("renameColumn",{id:k,title:H}),onDelete:k=>re("deleteColumn",{id:k}),onAdd:k=>re("addColumn",{title:k})}),(0,X.jsx)(tm,{error:u,open:L,labels:o.labels,onOpenChange:C,onAdd:(k,H)=>re("addLabel",{name:k,color:H}),onUpdate:(k,H,V)=>re("updateLabel",{name:k,newName:H,color:V}),onDelete:k=>re("deleteLabel",{name:k})})]})}var Xe=require("react/jsx-runtime"),Bi="dsh-kanban:workspace";function $m({useWorkspaces:e,useSessions:t,onCreateConversation:a}){let o=we(),{items:r,phase:n,state:s,error:l}=e(p=>p),i=t(p=>Object.values(p.byId).find(h=>(h.retainedBy.mainView??0)>0)?.id),[u,c]=(0,ks.useState)(()=>{try{return localStorage.getItem(Bi)??""}catch{return""}}),d=r.find(p=>p.workspaceId===u)??r.find(p=>i&&p.sessionIds.includes(i))??(r.length===1?r[0]:void 0),f=d?.workspaceId??"";return(0,ks.useEffect)(()=>{if(n==="ready"){c(f);try{f?localStorage.setItem(Bi,f):localStorage.removeItem(Bi)}catch{}}},[f,n]),(0,Xe.jsx)("section",{className:"kanban-root kanban-panel","data-kanban-mode":"kanban","aria-label":o("boardTab"),children:(0,Xe.jsxs)("div",{className:"kanban-panel-body",children:[(0,Xe.jsxs)("header",{className:"kanban-panel-header",children:[(0,Xe.jsx)("h1",{children:(0,Xe.jsxs)(Ha,{children:[(0,Xe.jsx)(Ua,{asChild:!0,children:(0,Xe.jsxs)("button",{type:"button",className:"kanban-workspace-trigger",disabled:!r.length,"aria-label":`${o("selectWorkspace")}: ${d?.title??o("boardTab")}`,title:d?.title,children:[(0,Xe.jsx)(Qt,{"aria-hidden":"true"}),(0,Xe.jsx)("span",{children:d?.title??o("selectWorkspace")}),(0,Xe.jsx)(ka,{"aria-hidden":"true"})]})}),(0,Xe.jsx)(Ca,{align:"start",className:"kanban-workspace-menu",children:r.map(p=>(0,Xe.jsxs)(Ct,{"aria-current":f===p.workspaceId?"page":void 0,title:p.title,onSelect:()=>{p.workspaceId!==f&&c(p.workspaceId)},children:[(0,Xe.jsx)("span",{className:"kanban-workspace-name",children:p.title}),f===p.workspaceId&&(0,Xe.jsx)(st,{"aria-hidden":"true",className:"kanban-icon"})]},p.workspaceId))})]})}),(0,Xe.jsx)("span",{className:"kanban-panel-mode","aria-label":o("boardTab"),children:o("boardTab")})]}),d?(0,Xe.jsx)(Xm,{workspaceId:d.workspaceId,onCreateConversation:a},f):(0,Xe.jsx)("div",{className:"kanban-panel-empty",role:s==="error"?"alert":"status",children:s==="error"?`${o("loadFailed")}${l?.message??""}`:o(n!=="ready"?"loadingWorkspaces":r.length?"selectWorkspaceHint":"noWorkspaces")})]})})}var ir=require("react");var Rs=require("react/jsx-runtime");function jm({sessionId:e,inputActions:t,attachmentDrafts:a}){let o=(0,ir.useSyncExternalStore)(Wm,Vm),[r,n]=(0,ir.useState)(null),s=we(),l=i=>{try{Hm(e,t,i,a),n(null)}catch(u){n({sessionId:e,draft:i,message:String(u instanceof Error?u.message:u)})}};return(0,ir.useEffect)(()=>{if(!e||!t?.setDraft)return;let i=zm(e);i&&l(i)},[o,e,t,a]),!r||r.sessionId!==e?null:(0,Rs.jsxs)("div",{role:"alert",className:"kanban-dialog-error",children:[s("actionFailed"),r.message,(0,Rs.jsx)(ie,{variant:"ghost",size:"sm",onClick:()=>l(r.draft),children:s("retry")})]})}var Fe=require("react");function Ym(e,t){if(!Number.isInteger(t)||t<0||t>e.length)return null;let o=e.slice(0,t).match(/(?:^|\s)\*([^\s*]*)$/);if(!o)return null;let r=t-o[1].length-1;return r>0&&/[\p{L}\p{N}_]/u.test(e[r-1])?null:{start:r,end:t,query:o[1]}}function PC(e,t){let a=t.trim().toLocaleLowerCase("ru");return a?e.cards.filter(o=>[o.id,o.title,o.note,o.label??"",...o.comments.map(r=>r.content)].some(r=>r.toLocaleLowerCase("ru").includes(a))):e.cards}function Zm(e,t=""){let a=new Set(PC(e,t).map(o=>o.id));return e.columns.map(o=>({id:o.id,title:o.title,cards:e.cards.filter(r=>r.columnId===o.id&&a.has(r.id))}))}function Jm(e){return`[kanban:${e.id}] ${e.title.replace(/[\r\n]+/g," ").trim()}`}var Se=require("react/jsx-runtime");function Qm({sessionId:e,useInput:t,inputActions:a,useWorkspaces:o,useSessions:r,replaceToken:n}){let s=we(),l=t(O=>O.draft),i=t(O=>O.phase),u=r(O=>O.byId[e]),c=o(O=>{let B=O.items.find(F=>F.sessionIds.includes(e))??(u?.cwd?O.items.find(F=>F.path===u.cwd):void 0);return B?{workspaceId:B.workspaceId,title:B.title}:void 0}),d=c?.workspaceId,[f,p]=(0,Fe.useState)({board:null,error:"",loading:!1}),[h,g]=(0,Fe.useState)(0),[m,b]=(0,Fe.useState)(new Set),[x,L]=(0,Fe.useState)(null),C=(0,Fe.useRef)(null),S=(0,Fe.useRef)(null),v=(0,Fe.useRef)(null),y=(0,Fe.useRef)(0),w=i==="plain"?Ym(l,l.length):null,E=w?`${w.start}:${w.end}:${w.query}`:null,I=!!(w&&E!==x&&d);(0,Fe.useEffect)(()=>{if(!w||!d)return;let O=a.captureInsertion();S.current={start:Math.min(w.start,O.start),end:Math.max(w.start,O.end),draftRev:O.draftRev}},[E]),(0,Fe.useEffect)(()=>{L(null),b(new Set),g(0)},[d]),(0,Fe.useEffect)(()=>{if(!I||!d)return;let O=new AbortController,B=++y.current;return p(F=>({...F,loading:!0,error:""})),So("get",{},d).then(F=>{O.signal.aborted||y.current!==B||!F.board||p({board:F.board,loading:!1,error:""})}).catch(F=>{O.signal.aborted||y.current!==B||p(j=>({...j,loading:!1,error:String(F?.message??F)}))}),()=>{O.abort()}},[d,E,I]);let R=(0,Fe.useMemo)(()=>f.board?Zm(f.board,w?.query??""):[],[f.board,w?.query]),M=(0,Fe.useMemo)(()=>R.flatMap(O=>O.cards),[R]),q=(0,Fe.useRef)(h);q.current=h;let A=(0,Fe.useRef)(m);A.current=m,(0,Fe.useEffect)(()=>{g(0)},[E]),(0,Fe.useEffect)(()=>{C.current?.querySelector(`[data-task-index="${h}"]`)?.scrollIntoView({block:"nearest"})},[h]);let W=()=>{E&&L(E),b(new Set)},K=O=>{let B=S.current;if(!O.length||!B)return;let F=O.map(Jm).join(`
`)+`
`;n(F,B)&&W()},P=O=>{b(B=>{let F=new Set(B);return F.has(O.id)?F.delete(O.id):F.add(O.id),F})};if((0,Fe.useEffect)(()=>{if(!I)return;let O=F=>{if(!F.isComposing){if(F.key==="Escape"){F.preventDefault(),F.stopPropagation(),W();return}M.length&&(F.key==="ArrowDown"||F.key==="ArrowUp"?(F.preventDefault(),F.stopPropagation(),g(j=>(j+(F.key==="ArrowDown"?1:-1)+M.length)%M.length)):F.key==="Enter"&&!F.ctrlKey&&!F.metaKey&&!F.altKey&&(F.preventDefault(),F.stopPropagation(),K(A.current.size?M.filter(j=>A.current.has(j.id)):[M[q.current]])))}};document.addEventListener("keydown",O,!0);let B=F=>{!(F.target instanceof Node)||v.current?.contains(F.target)||F.target.closest?.("[data-composer-card]")||W()};return document.addEventListener("pointerdown",B,!0),()=>{document.removeEventListener("keydown",O,!0),document.removeEventListener("pointerdown",B,!0)}},[I,E,M.length,m]),!I||!d)return null;let _=-1;return(0,Se.jsxs)("div",{ref:v,className:"kanban-task-picker",role:"dialog","aria-label":s("taskPickerTitle"),children:[(0,Se.jsxs)("header",{className:"kanban-task-picker-header",children:[(0,Se.jsx)(br,{"aria-hidden":"true"}),(0,Se.jsx)("strong",{children:s("taskPickerTitle")}),(0,Se.jsx)("span",{title:c?.title,children:c?.title}),(0,Se.jsx)("button",{type:"button","aria-label":s("close"),title:s("close"),onMouseDown:O=>{O.preventDefault(),W()},children:(0,Se.jsx)($e,{"aria-hidden":"true"})})]}),(0,Se.jsxs)("div",{className:"kanban-task-picker-search",children:[(0,Se.jsx)(Va,{"aria-hidden":"true"}),(0,Se.jsx)("span",{children:w?.query?`*${w.query}`:s("taskPickerSearch")})]}),f.error&&(0,Se.jsxs)("div",{className:"kanban-task-picker-message",role:"alert",children:[s("taskPickerError")," ",f.error]}),!f.error&&f.loading&&!f.board&&(0,Se.jsx)("div",{className:"kanban-task-picker-message",role:"status",children:s("taskPickerLoading")}),!f.error&&f.board&&M.length===0&&(0,Se.jsx)("div",{className:"kanban-task-picker-message",role:"status",children:s(f.board.cards.length?"taskPickerNoMatches":"taskPickerEmpty")}),M.length>0&&(0,Se.jsx)("div",{ref:C,className:"kanban-task-picker-list",role:"listbox","aria-label":s("taskPickerTitle"),tabIndex:-1,children:R.map(O=>O.cards.length>0&&(0,Se.jsxs)("section",{className:"kanban-task-picker-group","aria-label":O.title,children:[(0,Se.jsxs)("h3",{children:[O.title,(0,Se.jsx)("span",{children:O.cards.length})]}),O.cards.map(B=>{_+=1;let F=_,j=h===F,re=m.has(B.id);return(0,Se.jsxs)("div",{"data-task-index":F,role:"option","aria-selected":j,className:`kanban-task-picker-row${j?" is-active":""}${re?" is-checked":""}`,onMouseMove:()=>g(F),onMouseDown:ge=>{ge.preventDefault(),ge.ctrlKey||ge.metaKey?P(B):K([B])},children:[(0,Se.jsx)("button",{type:"button",className:"kanban-task-picker-check","aria-label":`${s("taskPickerMulti")}: ${B.title}`,"aria-pressed":re,onMouseDown:ge=>{ge.preventDefault(),ge.stopPropagation(),P(B)},children:re?(0,Se.jsx)(Da,{"aria-hidden":"true"}):(0,Se.jsx)(Sr,{"aria-hidden":"true"})}),(0,Se.jsxs)("span",{className:"kanban-task-picker-row-body",children:[(0,Se.jsx)("strong",{children:B.title}),(0,Se.jsxs)("small",{children:[B.id,B.label?` \xB7 ${B.label}`:"",B.priority?` \xB7 ${Tt[B.priority].label}`:""]})]})]},B.id)})]},O.id))}),(0,Se.jsxs)("footer",{className:"kanban-task-picker-footer",children:[(0,Se.jsx)("span",{children:s("taskPickerHint")}),m.size>0&&(0,Se.jsx)("button",{type:"button",className:"kanban-task-picker-add",onMouseDown:O=>{O.preventDefault(),K(M.filter(B=>m.has(B.id)))},children:s("taskPickerInsertSelected").replace("{count}",String(m.size))})]})]})}var eg={name:"russian-kanban",inject:["slots","locale","layout","sessions","uiWorkspace","conversation"],apply(e){Vc(e);let t=e.get("slots");if(t===void 0)return;let a=e.uiWorkspace,o=e.get("sessions"),r=e.layout,n=new AbortController,s=e.get("conversation"),l=async(i,u,c)=>{if(u.files.length&&(!s?.createDrafts||!s.releaseDraftAttachments))throw new Error(ft("chatImagesUnavailable"));let d=AbortSignal.any([c,n.signal,r.beginNavigation()]);if(d.aborted)return!1;let f=await o.create({workspaceId:i});return d.aborted?!1:(Um(f,u.text,u.files),a.openSession(f),!0)};t.inject("main",()=>t.register({name:"main",key:"kanban"},i=>(0,fn.createElement)($m,{...i,onCreateConversation:l}))),t.inject("sidebar.panellist",()=>t.register({name:"sidebar.panellist",id:"kanban",order:30,label:()=>ft("boardTab")},({size:i})=>(0,fn.createElement)(Qt,{size:i,strokeWidth:1.5}))),t.inject("conversation.input.overlay",()=>t.register({name:"conversation.input.overlay",id:"russian-kanban-task-picker",order:20},i=>(0,fn.createElement)(Qm,{...i,replaceToken:(u,c)=>{let d=o.scope(i.sessionId);return d?.bail(d,"slash/input-insert-text",{text:u,span:c})===!0}}))),t.inject("conversation.input.dock",()=>t.register({name:"conversation.input.dock",id:"kanban-chat-draft",order:100},i=>(0,fn.createElement)(jm,{...i,attachmentDrafts:s}))),e.effect(()=>()=>{n.abort(),r.panelInfo.getSnapshot().activePanelId==="kanban"&&r.selectPanel(null)})}};var tg="data-dsh-kanban-style";if(typeof document<"u"){let e=document.querySelector("style["+tg+"]");e||(e=document.createElement("style"),e.setAttribute(tg,""),document.head.appendChild(e)),e.textContent=Gi}var DC=eg;
/*! Bundled license information:

lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs:
lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs:
lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs:
lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs:
lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs:
lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs:
lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs:
lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs:
lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs:
lucide-react/dist/esm/context.mjs:
lucide-react/dist/esm/Icon.mjs:
lucide-react/dist/esm/createLucideIcon.mjs:
lucide-react/dist/esm/icons/calendar-days.mjs:
lucide-react/dist/esm/icons/check.mjs:
lucide-react/dist/esm/icons/chevron-down.mjs:
lucide-react/dist/esm/icons/chevron-up.mjs:
lucide-react/dist/esm/icons/funnel.mjs:
lucide-react/dist/esm/icons/grip-vertical.mjs:
lucide-react/dist/esm/icons/image-plus.mjs:
lucide-react/dist/esm/icons/image.mjs:
lucide-react/dist/esm/icons/list-todo.mjs:
lucide-react/dist/esm/icons/list.mjs:
lucide-react/dist/esm/icons/loader-circle.mjs:
lucide-react/dist/esm/icons/message-square.mjs:
lucide-react/dist/esm/icons/panels-top-left.mjs:
lucide-react/dist/esm/icons/pencil.mjs:
lucide-react/dist/esm/icons/plus.mjs:
lucide-react/dist/esm/icons/refresh-cw.mjs:
lucide-react/dist/esm/icons/search.mjs:
lucide-react/dist/esm/icons/send.mjs:
lucide-react/dist/esm/icons/settings-2.mjs:
lucide-react/dist/esm/icons/square-check-big.mjs:
lucide-react/dist/esm/icons/square.mjs:
lucide-react/dist/esm/icons/tag.mjs:
lucide-react/dist/esm/icons/tags.mjs:
lucide-react/dist/esm/icons/trash.mjs:
lucide-react/dist/esm/icons/x.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.66.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/

    return (module.exports && module.exports.default) || module.exports
  },
})