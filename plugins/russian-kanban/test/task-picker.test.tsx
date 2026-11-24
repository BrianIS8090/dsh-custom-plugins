import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { TaskPicker } from "../src/client/components/TaskPicker"
import { t } from "../src/client/lib/i18n"

const board = {
  completedColumnId: "done",
  columns: [{ id: "todo", title: "К выполнению" }, { id: "done", title: "Готово" }],
  labels: [], activities: [],
  cards: [
    { id: "k1", columnId: "todo", title: "Починить ошибку", note: "", label: null, priority: "high", comments: [], images: [] },
    { id: "k2", columnId: "done", title: "Подготовить отчёт", note: "", label: null, priority: null, comments: [], images: [] },
  ],
}

function renderPicker(draft = "*", replaceToken = vi.fn(() => true)) {
  const view = render(<TaskPicker
    sessionId={"session-1" as any}
    useInput={(selector: any) => selector({ draft, phase: "plain" })}
    inputActions={{ captureInsertion: () => ({ start: draft.length, end: draft.length, draftRev: 7 }) } as any}
    useWorkspaces={(selector: any) => selector({ items: [{ workspaceId: "ws", path: "C:/project", title: "Проект", sessionIds: ["session-1"] }] })}
    useSessions={(selector: any) => selector({ byId: { "session-1": { cwd: "C:/project" } } })}
    replaceToken={replaceToken}
  />)
  return { ...view, replaceToken }
}

afterEach(() => vi.restoreAllMocks())

describe("* task picker", () => {
  it("loads cards for the current workspace and groups them by column", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, json: async () => ({ board }) } as Response)
    renderPicker()
    expect(await screen.findByText("Починить ошибку")).toBeTruthy()
    expect(screen.getByRole("heading", { name: "К выполнению1" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Готово1" })).toBeTruthy()
    expect(JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body)).args.workspaceId).toBe("ws")
  })

  it("inserts a stable reference at the current draft revision, without executing a task", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, json: async () => ({ board }) } as Response)
    const { replaceToken } = renderPicker("*ошиб")
    expect(await screen.findByText("Починить ошибку")).toBeTruthy()
    expect(screen.queryByText("Подготовить отчёт")).toBeNull()
    fireEvent.keyDown(document, { key: "Enter" })
    expect(replaceToken).toHaveBeenCalledExactlyOnceWith("[kanban:k1] Починить ошибку\n", { start: 0, end: 5, draftRev: 7 })
    expect(screen.queryByRole("dialog", { name: t("taskPickerTitle") })).toBeNull()
  })

  it("supports selecting several cards with Ctrl+Click and adds them together", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, json: async () => ({ board }) } as Response)
    const { replaceToken } = renderPicker()
    await screen.findByText("Починить ошибку")
    fireEvent.mouseDown(screen.getByText("Починить ошибку"), { ctrlKey: true })
    fireEvent.mouseDown(screen.getByText("Подготовить отчёт"), { ctrlKey: true })
    fireEvent.mouseDown(screen.getByRole("button", { name: t("taskPickerInsertSelected").replace("{count}", "2") }))
    expect(replaceToken).toHaveBeenCalledWith("[kanban:k1] Починить ошибку\n[kanban:k2] Подготовить отчёт\n", expect.objectContaining({ draftRev: 7 }))
  })

  it("supports keyboard navigation, Enter and Escape", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, json: async () => ({ board }) } as Response)
    const { replaceToken } = renderPicker()
    await screen.findByText("Починить ошибку")
    fireEvent.keyDown(document, { key: "ArrowDown" })
    expect(screen.getByRole("option", { name: /Подготовить отчёт/ }).getAttribute("aria-selected")).toBe("true")
    fireEvent.keyDown(document, { key: "Enter" })
    expect(replaceToken).toHaveBeenCalledWith("[kanban:k2] Подготовить отчёт\n", expect.objectContaining({ draftRev: 7 }))
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("closes on Escape without changing the draft", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, json: async () => ({ board }) } as Response)
    const { replaceToken } = renderPicker()
    await screen.findByText("Починить ошибку")
    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByRole("dialog")).toBeNull()
    expect(replaceToken).not.toHaveBeenCalled()
  })

  it("does not open for an asterisk inside a word or Markdown emphasis", () => {
    renderPicker("слово*часть")
    expect(screen.queryByRole("dialog")).toBeNull()
    renderPicker("**жирный**")
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})
