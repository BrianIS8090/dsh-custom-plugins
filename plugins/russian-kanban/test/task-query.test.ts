import { describe, expect, it } from "vitest"
import { cardReference, filterTaskCards, findTaskQuery, groupTasks } from "../src/client/lib/task-query"
import type { Board, Card } from "../src/client/lib/types"

const card = (id: string, title: string, columnId: string, note = "", comments: string[] = []): Card => ({
  id, title, columnId, note, comments: comments.map(content => ({ id, content, source: "human", createdAt: "" })),
  label: null, priority: null, dueDate: null, completedAt: null, createdAt: null, createdBy: null, images: [],
})
const board: Board = {
  completedColumnId: "done",
  columns: [{ id: "todo", title: "К выполнению" }, { id: "doing", title: "В работе" }, { id: "done", title: "Готово" }],
  labels: [], activities: [],
  cards: [card("k1", "Починить вход", "todo", "Ошибка 401"), card("k2", "Сделать отчёт", "doing", "", ["Спросить дату"]), card("k3", "Завершённое", "done")],
}

describe("findTaskQuery", () => {
  it.each([
    ["*", { start: 0, end: 1, query: "" }],
    ["*доро", { start: 0, end: 5, query: "доро" }],
    ["Сделай *k5", { start: 7, end: 10, query: "k5" }],
    ["Первая строка\n*отчёт", { start: 14, end: 20, query: "отчёт" }],
  ])("detects a task token in %j", (draft, expected) => {
    expect(findTaskQuery(draft, draft.length)).toEqual(expected)
  })

  it.each(["**жирный**", "слово*часть", "*пробел после", "2 * 3", "email@example.com"]) (
    "does not treat ordinary asterisks as a trigger: %s", draft => {
      expect(findTaskQuery(draft, draft.length)).toBeNull()
    },
  )

  it("uses the actual caret rather than the end of the draft", () => {
    expect(findTaskQuery("*abc text", 1)).toEqual({ start: 0, end: 1, query: "" })
    expect(findTaskQuery("", 0)).toBeNull()
  })
})

describe("task catalog", () => {
  it("groups matching cards by their original columns", () => {
    const groups = groupTasks(board)
    expect(groups.map(group => [group.title, group.cards.length])).toEqual([["К выполнению", 1], ["В работе", 1], ["Готово", 1]])
    expect(groupTasks(board, "отчёт")[0].cards).toEqual([])
    expect(groupTasks(board, "отчёт")[1].cards.map(card => card.id)).toEqual(["k2"])
    expect(groupTasks(board, "401")[0].cards.map(card => card.id)).toEqual(["k1"])
    expect(groupTasks(board, "дату")[1].cards.map(card => card.id)).toEqual(["k2"])
    expect(filterTaskCards(board, "K1").map(card => card.id)).toEqual(["k1"])
  })

  it("inserts a stable id and a readable one-line title", () => {
    expect(cardReference(card("k7", "Задача\nс переносом", "todo"))).toBe("[kanban:k7] Задача с переносом")
  })
})
