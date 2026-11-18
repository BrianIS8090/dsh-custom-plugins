import assert from "node:assert/strict"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const dictionary = JSON.parse(readFileSync(new URL("../locale/ru.json", import.meta.url), "utf8"))
assert.equal(dictionary.meta.title, "Канбан")
assert.match(dictionary.meta.description, /\*/)
const ruSource = readFileSync(new URL("../src/client/lib/ru.ts", import.meta.url), "utf8")
const dictionaryKeys = new Set([...ruSource.matchAll(/^  ([A-Za-z][A-Za-z0-9_]*):/gm)].map(match => match[1]))
for (const key of ["boardTab", "taskDetails", "taskPickerTitle", "taskPickerInsertSelected", "chatWithAgent"]) {
  assert(dictionaryKeys.has(key), `missing board locale key ${key}`)
}
assert(!ruSource.includes("const zh"), "the fork must not fall back to upstream Chinese")

const files = []
const walk = directory => {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) walk(path)
    else if (/\.(?:ts|tsx)$/.test(path)) files.push(path)
  }
}
walk(join(root, "src/client"))
const used = new Set()
for (const file of files) {
  const text = readFileSync(file, "utf8")
  for (const match of text.matchAll(/\bt\(\s*["'`]([A-Za-z][A-Za-z0-9_]*)["'`]\s*\)/g)) used.add(match[1])
}
for (const key of used) assert(dictionaryKeys.has(key), `locale key ${key} is used but not translated`)
assert(!files.some(file => /Workflow/.test(file)), "the board-only client must not import the upstream Workflow UI")

console.log(`Russian locale: ${used.size} referenced keys, ${dictionaryKeys.size} supplied keys`)
