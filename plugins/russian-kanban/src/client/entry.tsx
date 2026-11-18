import css from "./styles.css"
import { KanbanPlugin } from "./plugin"

// One namespaced stylesheet; only the host's native token-based styles are bundled.
const STYLE_TAG = "data-dsh-kanban-style"
if (typeof document !== "undefined") {
  let el = document.querySelector<HTMLStyleElement>("style[" + STYLE_TAG + "]")
  if (!el) {
    el = document.createElement("style")
    el.setAttribute(STYLE_TAG, "")
    document.head.appendChild(el)
  }
  el.textContent = css
}

export default KanbanPlugin
