import React from "react"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { KanbanView } from "../src/client/KanbanView"
import { t } from "../src/client/lib/i18n"
import type { Board, Card } from "../src/client/lib/types"

const makeCard = (id: string, title: string): Card => ({
  id, title, columnId: "todo", note: "", label: null, priority: null, dueDate: null,
  completedAt: null, createdAt: null, createdBy: "agent", comments: [], images: [],
})
const makeBoard = (...cards: Card[]): Board => ({
  completedColumnId: null,
  columns: [{ id: "todo", title: "К выполнению" }],
  labels: [], cards, activities: [],
})

async function flush() {
  await act(async () => { await vi.advanceTimersByTimeAsync(0) })
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("live board updates", () => {
  it("shows a card created by an agent without a page refresh", async () => {
    let board = makeBoard(makeCard("k1", "Уже на доске"))
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => ({
      ok: true, json: async () => ({ board }),
    } as Response))
    vi.useFakeTimers()
    render(<KanbanView workspaceId={"default" as any} onCreateConversation={vi.fn()} />)
    await flush()
    expect(screen.getByText("Уже на доске")).toBeTruthy()

    board = makeBoard(makeCard("k1", "Уже на доске"), makeCard("k2", "Создано агентом"))
    await act(async () => { await vi.advanceTimersByTimeAsync(2000) })
    expect(screen.getByText("Создано агентом")).toBeTruthy()
  })

  it("refreshes when the browser tab becomes visible again", async () => {
    let board = makeBoard(makeCard("k1", "До скрытия"))
    let visibility = "visible"
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => visibility })
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => ({
      ok: true, json: async () => ({ board }),
    } as Response))
    vi.useFakeTimers()
    render(<KanbanView workspaceId={"default" as any} onCreateConversation={vi.fn()} />)
    await flush()
    expect(screen.getByText("До скрытия")).toBeTruthy()

    board = makeBoard(makeCard("k1", "До скрытия"), makeCard("k2", "Изменилось в фоне"))
    visibility = "hidden"
    fireEvent(document, new Event("visibilitychange"))
    await act(async () => { await vi.advanceTimersByTimeAsync(4000) })
    expect(screen.queryByText("Изменилось в фоне")).toBeNull()

    visibility = "visible"
    fireEvent(document, new Event("visibilitychange"))
    await flush()
    expect(screen.getByText("Изменилось в фоне")).toBeTruthy()
  })

  it("does not overwrite an unsent comment while the card dialog is open", async () => {
    let board = makeBoard(makeCard("k1", "Редактируемая задача"))
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => ({
      ok: true, json: async () => ({ board }),
    } as Response))
    vi.useFakeTimers()
    render(<KanbanView workspaceId={"default" as any} onCreateConversation={vi.fn()} />)
    await flush()
    fireEvent.click(screen.getByRole("button", { name: "Редактируемая задача" }))
    const comment = screen.getByLabelText(new RegExp(t("commentsTitle"))) as HTMLTextAreaElement
    fireEvent.change(comment, { target: { value: "Черновик, который нельзя потерять" } })

    board = makeBoard(makeCard("k1", "Редактируемая задача"), makeCard("k2", "Появилась позже"))
    await act(async () => { await vi.advanceTimersByTimeAsync(2500) })
    expect(screen.queryByText("Появилась позже")).toBeNull()
    expect(comment.value).toBe("Черновик, который нельзя потерять")

    fireEvent.click(screen.getByRole("button", { name: t("close"), exact: true }))
    fireEvent.click(screen.getByRole("button", { name: t("discardChanges"), exact: true }))
    await act(async () => { await vi.advanceTimersByTimeAsync(2000) })
    expect(screen.getByText("Появилась позже")).toBeTruthy()
  })
})
