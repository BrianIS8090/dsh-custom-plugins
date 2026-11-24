import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { KanbanPanel } from "../src/client/KanbanPanel"
import { KanbanPlugin } from "../src/client/plugin"
import { consumeDraft } from "../src/client/lib/chat-bridge"
import { t } from "../src/client/lib/i18n"

const workspaces = [
  { workspaceId: "a", title: "Alpha", path: "/projects/a", sessionIds: ["current"] },
  { workspaceId: "b", title: "Beta", path: "/projects/b", sessionIds: [] },
]
const props = (items = workspaces, current = "current") => ({
  useWorkspaces: (select: any) => select({ items, phase: "ready", state: "idle" }),
  useSessions: (select: any) => select({ byId: current ? { [current]: { id: current, retainedBy: { mainView: 1 } } } : {} }),
  onCreateConversation: vi.fn(),
}) as any

beforeEach(() => localStorage.clear())
afterEach(() => { vi.restoreAllMocks(); consumeDraft("fresh-session") })

describe("Russian global board", () => {
  it("opens the title menu with the keyboard and restores focus on Escape without changing workspaces", async () => {
    const user = userEvent.setup()
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, json: async () => ({ board: { columns: [], cards: [], labels: [], activities: [] } }) } as Response)
    render(<KanbanPanel {...props()} />)
    await screen.findByRole("searchbox")
    const trigger = screen.getByRole("button", { name: `${t("selectWorkspace")}: Alpha`, expanded: false })
    trigger.focus()
    await user.keyboard("{Enter}")
    expect(await screen.findByRole("menu")).toBeTruthy()
    expect(screen.getByRole("menuitem", { name: "Alpha", current: "page" })).toBeTruthy()
    expect(screen.queryByText("/projects/a")).toBeNull()
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("defaults to the current workspace, switches to a workspace without sessions and remembers it", async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, init) => {
      const id = JSON.parse(String(init?.body)).args.workspaceId
      return { ok: true, json: async () => ({ board: { columns: [{ id: "todo", title: `Доска ${id}` }], cards: [], labels: [], activities: [] } }) } as Response
    })
    const view = render(<KanbanPanel {...props()} />)
    await screen.findByText("Доска a")
    await user.click(screen.getByRole("button", { name: `${t("selectWorkspace")}: Alpha` }))
    await user.click(screen.getByRole("menuitem", { name: "Beta" }))
    await screen.findByText("Доска b")
    expect(localStorage.getItem("dsh-kanban:workspace")).toBe("b")
    view.unmount()
    render(<KanbanPanel {...props()} />)
    await screen.findByText("Доска b")
  })

  it("does not request a default board while workspaces are loading or unselected", () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
    const view = render(<KanbanPanel {...props([], "")} />)
    expect(screen.getByRole("status").textContent).toBe(t("noWorkspaces"))
    view.rerender(<KanbanPanel {...props([], "")} useWorkspaces={((select: any) => select({ items: [], phase: "pending", state: "loading" })) as any} />)
    expect(screen.getByRole("status").textContent).toBe(t("loadingWorkspaces"))
    view.rerender(<KanbanPanel {...props(workspaces, "")} />)
    expect(screen.getByRole("status").textContent).toBe(t("selectWorkspaceHint"))
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

function plugin() {
  const registrations: any[] = [], disposers: (() => void)[] = []
  const layout = { beginNavigation: vi.fn(() => new AbortController().signal), panelInfo: { getSnapshot: () => ({ activePanelId: null }) }, selectPanel: vi.fn() }
  const sessions = { create: vi.fn(async () => "fresh-session"), scope: vi.fn() }
  const uiWorkspace = { openSession: vi.fn() }
  const ctx = {
    layout, sessions, uiWorkspace,
    get: (name: string) => name === "sessions" ? sessions : name === "slots" ? {
      inject: (_name: string, setup: () => void) => setup(),
      register: (meta: unknown, Component: any) => { registrations.push({ meta, Component }); return () => {} },
    } : undefined,
    effect: (setup: () => (() => void)) => { disposers.push(setup()) },
  }
  KanbanPlugin.apply(ctx as any)
  const create = registrations.find(({ meta }) => meta.name === "main").Component({}).props.onCreateConversation
  return { registrations, create, sessions, uiWorkspace, layout, dispose: () => disposers.reverse().forEach((off) => off()) }
}

describe("panel and task-menu registration", () => {
  it("registers the board, sidebar, star picker and draft injector without Workflow", () => {
    const installed = plugin()
    expect(installed.registrations.map(({ meta }) => meta.name)).toEqual(["main", "sidebar.panellist", "conversation.input.overlay", "conversation.input.dock"])
    expect(installed.registrations.find(({ meta }) => meta.name === "main").meta.key).toBe(installed.registrations.find(({ meta }) => meta.name === "sidebar.panellist").meta.id)
    expect(installed.registrations.find(({ meta }) => meta.name === "conversation.input.overlay").meta.id).toBe("russian-kanban-task-picker")
    installed.dispose()
  })

  it("creates a new conversation only after the card action is invoked", async () => {
    const installed = plugin()
    expect(installed.sessions.create).not.toHaveBeenCalled()
    await installed.create("b", { text: "Черновик задачи", files: [] }, new AbortController().signal)
    expect(installed.sessions.create).toHaveBeenCalledExactlyOnceWith({ workspaceId: "b" })
    expect(installed.uiWorkspace.openSession).toHaveBeenCalledExactlyOnceWith("fresh-session")
    expect(consumeDraft("fresh-session")).toEqual({ text: "Черновик задачи", files: [] })
    installed.dispose()
  })
})
