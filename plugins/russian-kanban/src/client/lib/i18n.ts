import { useCallback, useSyncExternalStore } from "react"
import type { Context } from "@deepseek-ai/cordis"
import type {} from "@deepseek-ai/dsh-client-locale/client"
import { ru } from "./ru"

const NS = "russian-kanban"
type Dict = Record<string, string>

declare module "@deepseek-ai/dsh-client-ui-slots" {
  interface LocaleNamespaceMap { "russian-kanban": string }
}

let localeService: any = null
let boundT: ((key: string) => string) | null = null

export function installLocale(ctx: Context) {
  const locale = ctx.get("locale")
  if (locale === undefined) return
  localeService = locale
  ctx.effect(() => locale.register(NS, { ru, en: ru, zh: ru }), "russian-kanban: Russian dictionary")
  boundT = locale.bind(NS)
}

/** Translation outside React, for example in slot label thunks. */
export function t(key: string): string {
  if (boundT) return boundT(key)
  return ru[key] ?? key
}

const subscribe = (cb: () => void): (() => void) => {
  if (localeService && typeof localeService.subscribe === "function") return localeService.subscribe(cb)
  return () => {}
}
const getSnapshot = (): unknown => {
  if (localeService && typeof localeService.getSnapshot === "function") return localeService.getSnapshot()
  return null
}

/** Provider-authored text falls back through Russian rather than upstream Chinese. */
export function resolveText(text: string | Readonly<Record<string, string>>): string {
  return localeService?.resolveText?.(text) ?? (typeof text === "string" ? text : text.ru ?? Object.values(text)[0] ?? "")
}

/** Subscribe to locale changes and return the current translator. */
export function useT(): (key: string) => string {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return useCallback((key: string) => t(key), [snapshot])
}
