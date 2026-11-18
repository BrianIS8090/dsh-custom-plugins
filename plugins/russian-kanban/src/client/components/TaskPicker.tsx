import { useEffect, useMemo, useRef, useState } from "react"
import { CheckSquare, ListTodo, Search, Square, X } from "lucide-react"
import type { PropsRuntime } from "@deepseek-ai/dsh-client-ui-slots"
import type { TokenSpan } from "@deepseek-ai/dsh-client-ui-conversation/client"
import { callKanban } from "@/lib/api"
import { useT } from "@/lib/i18n"
import { cardReference, findTaskQuery, groupTasks } from "@/lib/task-query"
import { PRIORITY_META } from "@/lib/constants"
import type { Board, Card } from "@/lib/types"

export interface TaskPickerProps extends PropsRuntime<"conversation.input.overlay"> {
  /** Uses DSH's revision-guarded input mutation, not direct DOM editing. */
  replaceToken: (text: string, span: TokenSpan) => boolean
}

export function TaskPicker({ sessionId, useInput, inputActions, useWorkspaces, useSessions, replaceToken }: TaskPickerProps) {
  const t = useT()
  const draft = useInput(state => state.draft)
  const phase = useInput(state => state.phase)
  const currentSession = useSessions(state => state.byId[sessionId])
  const workspace = useWorkspaces(state => {
    const current = state.items.find(item => item.sessionIds.includes(sessionId))
      ?? (currentSession?.cwd ? state.items.find(item => item.path === currentSession.cwd) : undefined)
    return current ? { workspaceId: current.workspaceId, title: current.title } : undefined
  })
  const workspaceId = workspace?.workspaceId
  const [state, setState] = useState<{ board: Board | null; error: string; loading: boolean }>({ board: null, error: "", loading: false })
  const [highlight, setHighlight] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [dismissed, setDismissed] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const spanRef = useRef<TokenSpan | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const generation = useRef(0)
  const hit = phase === "plain" ? findTaskQuery(draft, draft.length) : null
  const tokenKey = hit ? `${hit.start}:${hit.end}:${hit.query}` : null
  const open = Boolean(hit && tokenKey !== dismissed && workspaceId)

  useEffect(() => {
    if (!hit || !workspaceId) return
    const captured = inputActions.captureInsertion()
    spanRef.current = { start: Math.min(hit.start, captured.start), end: Math.max(hit.start, captured.end), draftRev: captured.draftRev }
  }, [tokenKey])

  useEffect(() => {
    setDismissed(null)
    setSelected(new Set())
    setHighlight(0)
  }, [workspaceId])

  useEffect(() => {
    if (!open || !workspaceId) return
    const controller = new AbortController()
    const id = ++generation.current
    setState(previous => ({ ...previous, loading: true, error: "" }))
    callKanban("get", {}, workspaceId).then(result => {
      if (controller.signal.aborted || generation.current !== id || !result.board) return
      setState({ board: result.board, loading: false, error: "" })
    }).catch(error => {
      if (controller.signal.aborted || generation.current !== id) return
      setState(previous => ({ ...previous, loading: false, error: String(error?.message ?? error) }))
    })
    return () => { controller.abort() }
  }, [workspaceId, tokenKey, open])

  const groups = useMemo(() => state.board ? groupTasks(state.board, hit?.query ?? "") : [], [state.board, hit?.query])
  const visible = useMemo(() => groups.flatMap(group => group.cards), [groups])
  const highlightedRef = useRef(highlight)
  highlightedRef.current = highlight
  const selectedRef = useRef(selected)
  selectedRef.current = selected
  useEffect(() => { setHighlight(0) }, [tokenKey])
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-task-index="${highlight}"]`)?.scrollIntoView({ block: "nearest" })
  }, [highlight])

  const close = () => { if (tokenKey) setDismissed(tokenKey); setSelected(new Set()) }
  const insert = (cards: Card[]) => {
    const span = spanRef.current
    if (!cards.length || !span) return
    const text = cards.map(cardReference).join("\n") + "\n"
    if (replaceToken(text, span)) close()
  }
  const toggle = (card: Card) => {
    setSelected(previous => {
      const next = new Set(previous)
      if (next.has(card.id)) next.delete(card.id)
      else next.add(card.id)
      return next
    })
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.isComposing) return
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); return }
      if (!visible.length) return
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        event.stopPropagation()
        setHighlight(current => (current + (event.key === "ArrowDown" ? 1 : -1) + visible.length) % visible.length)
      } else if (event.key === "Enter" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault()
        event.stopPropagation()
        insert(selectedRef.current.size ? visible.filter(card => selectedRef.current.has(card.id)) : [visible[highlightedRef.current]])
      }
    }
    document.addEventListener("keydown", onKey, true)
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Node) || menuRef.current?.contains(event.target)) return
      // Keep the same composer area alive; an outside pointer press closes the task menu.
      if ((event.target as Element).closest?.("[data-composer-card]")) return
      close()
    }
    document.addEventListener("pointerdown", onPointer, true)
    return () => {
      document.removeEventListener("keydown", onKey, true)
      document.removeEventListener("pointerdown", onPointer, true)
    }
  }, [open, tokenKey, visible.length, selected])

  if (!open || !workspaceId) return null
  let index = -1
  return <div ref={menuRef} className="kanban-task-picker" role="dialog" aria-label={t("taskPickerTitle")}>
    <header className="kanban-task-picker-header">
      <ListTodo aria-hidden="true" />
      <strong>{t("taskPickerTitle")}</strong>
      <span title={workspace?.title}>{workspace?.title}</span>
      <button type="button" aria-label={t("close")} title={t("close")} onMouseDown={event => { event.preventDefault(); close() }}><X aria-hidden="true" /></button>
    </header>
    <div className="kanban-task-picker-search"><Search aria-hidden="true" /><span>{hit?.query ? `*${hit.query}` : t("taskPickerSearch")}</span></div>
    {state.error && <div className="kanban-task-picker-message" role="alert">{t("taskPickerError")} {state.error}</div>}
    {!state.error && state.loading && !state.board && <div className="kanban-task-picker-message" role="status">{t("taskPickerLoading")}</div>}
    {!state.error && state.board && visible.length === 0 && <div className="kanban-task-picker-message" role="status">
      {t(state.board.cards.length ? "taskPickerNoMatches" : "taskPickerEmpty")}
    </div>}
    {visible.length > 0 && <div ref={listRef} className="kanban-task-picker-list" role="listbox" aria-label={t("taskPickerTitle")}
      tabIndex={-1}>
      {groups.map(group => group.cards.length > 0 && <section key={group.id} className="kanban-task-picker-group" aria-label={group.title}>
        <h3>{group.title}<span>{group.cards.length}</span></h3>
        {group.cards.map(card => {
          index += 1
          const rowIndex = index
          const active = highlight === rowIndex
          const checked = selected.has(card.id)
          return <div key={card.id} data-task-index={rowIndex} role="option" aria-selected={active}
            className={`kanban-task-picker-row${active ? " is-active" : ""}${checked ? " is-checked" : ""}`}
            onMouseMove={() => setHighlight(rowIndex)}
            onMouseDown={event => {
              event.preventDefault()
              if (event.ctrlKey || event.metaKey) toggle(card)
              else insert([card])
            }}>
            <button type="button" className="kanban-task-picker-check" aria-label={`${t("taskPickerMulti")}: ${card.title}`} aria-pressed={checked}
              onMouseDown={event => { event.preventDefault(); event.stopPropagation(); toggle(card) }}>
              {checked ? <CheckSquare aria-hidden="true" /> : <Square aria-hidden="true" />}
            </button>
            <span className="kanban-task-picker-row-body"><strong>{card.title}</strong><small>{card.id}{card.label ? ` · ${card.label}` : ""}{card.priority ? ` · ${PRIORITY_META[card.priority].label}` : ""}</small></span>
          </div>
        })}
      </section>)}
    </div>}
    <footer className="kanban-task-picker-footer">
      <span>{t("taskPickerHint")}</span>
      {selected.size > 0 && <button type="button" className="kanban-task-picker-add" onMouseDown={event => { event.preventDefault(); insert(visible.filter(card => selected.has(card.id))) }}>
        {t("taskPickerInsertSelected").replace("{count}", String(selected.size))}
      </button>}
    </footer>
  </div>
}
