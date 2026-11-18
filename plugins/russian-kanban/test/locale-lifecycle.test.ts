import type { Context } from "@deepseek-ai/cordis"
import { describe, expect, it, vi } from "vitest"
import { ru } from "../src/client/lib/ru"

describe("Russian locale lifecycle", () => {
  it("registers one current dictionary with safe en/zh fallbacks and releases it on disposal", async () => {
    const dictionaries = new Map<string, Record<string, string>>()
    const locale = {
      register(namespace: string, languages: Record<string, Record<string, string>>) {
        if (dictionaries.has(namespace)) throw new Error(`Duplicate dictionary: ${namespace}`)
        dictionaries.set(namespace, languages.ru)
        return () => dictionaries.delete(namespace)
      },
      bind: (namespace: string) => (key: string) => dictionaries.get(namespace)?.[key] ?? key,
    }
    const disposers: (() => void)[] = []
    const ctx = {
      get: () => locale,
      effect: (effect: () => () => void) => disposers.push(effect()),
    } as unknown as Context
    vi.resetModules()
    const initial = await import("../src/client/lib/i18n")
    initial.installLocale(ctx)
    expect(dictionaries.size).toBe(1)
    expect(initial.t("taskDetails")).toBe("Сведения о задаче")
    expect(initial.t("boardTab")).toBe("Канбан")
    for (const [key, value] of Object.entries(dictionaries.get("russian-kanban")!)) {
      expect(value, key).toBeTruthy()
      expect(value, key).not.toMatch(/[\p{Script=Han}]/u)
    }
    disposers.reverse().forEach(dispose => dispose())
    expect(dictionaries.size).toBe(0)
    expect(ru.taskPickerTitle).toBe("Задачи канбана")
  })
})
