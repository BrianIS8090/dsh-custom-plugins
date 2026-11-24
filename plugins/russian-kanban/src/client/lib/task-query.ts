import type { Board, Card } from "./types"

export interface TaskQuery {
  start: number
  end: number
  query: string
}

/** A standalone `*prefix` token, never an asterisk inside a word or Markdown emphasis. */
export function findTaskQuery(draft: string, caret: number): TaskQuery | null {
  if (!Number.isInteger(caret) || caret < 0 || caret > draft.length) return null
  const prefix = draft.slice(0, caret)
  const token = prefix.match(/(?:^|\s)\*([^\s*]*)$/)
  if (!token) return null
  const start = caret - token[1].length - 1
  if (start > 0 && /[\p{L}\p{N}_]/u.test(draft[start - 1])) return null
  return { start, end: caret, query: token[1] }
}

export function filterTaskCards(board: Board, query: string): Card[] {
  const needle = query.trim().toLocaleLowerCase("ru")
  if (!needle) return board.cards
  return board.cards.filter((card) => [card.id, card.title, card.note, card.label ?? "", ...card.comments.map(comment => comment.content)]
    .some(value => value.toLocaleLowerCase("ru").includes(needle)))
}

/** Column order and card order are retained from the board itself. */
export function groupTasks(board: Board, query = ""): { id: string; title: string; cards: Card[] }[] {
  const matches = new Set(filterTaskCards(board, query).map(card => card.id))
  return board.columns.map(column => ({
    id: column.id,
    title: column.title,
    cards: board.cards.filter(card => card.columnId === column.id && matches.has(card.id)),
  }))
}

export function cardReference(card: Pick<Card, "id" | "title">): string {
  return `[kanban:${card.id}] ${card.title.replace(/[\r\n]+/g, " ").trim()}`
}
