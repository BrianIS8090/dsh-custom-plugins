import { createElement as h } from "react"
import type { Context } from "@deepseek-ai/cordis"
import type { PropsRuntime } from "@deepseek-ai/dsh-client-ui-slots"
import type { ISessions } from "@deepseek-ai/dsh-api-session-controller/client"
import type { WorkspaceId } from "@deepseek-ai/dsh-api-workspace-controller/client"
import { PanelsTopLeft } from "lucide-react"
import type {} from "@deepseek-ai/dsh-client-ui-sidebar/client"
import type {} from "@deepseek-ai/dsh-client-ui-layout/client"
import type {} from "@deepseek-ai/dsh-client-ui-conversation/client"
import { KanbanPanel } from "./KanbanPanel"
import { ChatDraftInjector } from "./components/ChatDraftInjector"
import { TaskPicker } from "./components/TaskPicker"
import { queueDraft, type AttachmentDrafts } from "./lib/chat-bridge"
import { installLocale, t } from "./lib/i18n"

export const KanbanPlugin = {
  name: "russian-kanban",
  inject: ["slots", "locale", "layout", "sessions", "uiWorkspace", "conversation"],
  apply(ctx: Context) {
    installLocale(ctx)
    const slots = ctx.get("slots")
    if (slots === undefined) return
    const uiWorkspace = ctx.uiWorkspace
    const sessions = ctx.get("sessions") as ISessions
    const layout = ctx.layout
    const lifetime = new AbortController()
    // These draft lifecycle methods are available in the installed DSH; guard them at use time.
    const attachmentDrafts = ctx.get("conversation") as AttachmentDrafts | undefined
    const onCreateConversation = async (workspaceId: WorkspaceId, draft: { text: string; files: File[] }, signal: AbortSignal) => {
      if (draft.files.length && (!attachmentDrafts?.createDrafts || !attachmentDrafts.releaseDraftAttachments)) throw new Error(t("chatImagesUnavailable"))
      const navigation = AbortSignal.any([signal, lifetime.signal, layout.beginNavigation()])
      if (navigation.aborted) return false
      // Do not reuse a blank session: it may already contain the user's draft.
      const sessionId = await sessions.create({ workspaceId })
      if (navigation.aborted) return false
      queueDraft(sessionId, draft.text, draft.files)
      uiWorkspace.openSession(sessionId)
      return true
    }
    slots.inject("main", () =>
      slots.register(
        { name: "main", key: "kanban" },
        (props: PropsRuntime<"main">) => h(KanbanPanel, { ...props, onCreateConversation }),
      ),
    )
    slots.inject("sidebar.panellist", () => slots.register(
      { name: "sidebar.panellist", id: "kanban", order: 30, label: () => t("boardTab") },
      ({ size }: PropsRuntime<"sidebar.panellist">) => h(PanelsTopLeft, { size, strokeWidth: 1.5 }),
    ))
    // A task selection is a reference in an editable draft, never an execution request.
    slots.inject("conversation.input.overlay", () => slots.register(
      { name: "conversation.input.overlay", id: "russian-kanban-task-picker", order: 20 },
      (props: PropsRuntime<"conversation.input.overlay">) => h(TaskPicker, {
        ...props,
        replaceToken: (text, span) => {
          const sessionContext = sessions.scope(props.sessionId)
          return sessionContext?.bail(sessionContext, "slash/input-insert-text", { text, span }) === true
        },
      }),
    ))
    // Keep a session-scoped injector mounted to fill queued drafts in new sessions.
    slots.inject("conversation.input.dock", () =>
      slots.register(
        { name: "conversation.input.dock", id: "kanban-chat-draft", order: 100 },
        (props: PropsRuntime<"conversation.input.dock">) => h(ChatDraftInjector, { ...props, attachmentDrafts }),
      ),
    )
    ctx.effect(() => () => {
      lifetime.abort()
      if (layout.panelInfo.getSnapshot().activePanelId === "kanban") layout.selectPanel(null)
    })
  },
}
