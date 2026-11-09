# Agent Teams Monitor

Private Harness Web UI plugin for observing an Agent Team on a live, infinite canvas.

## Features

- Obsidian-like canvas with LEAD at the centre and teammates on chronological planetary orbits.
- Collision-free card layout and card-free routed message edges with directional pulses.
- Infinite pan/zoom, fit-to-team, reduced-motion support, and automatic Harness light/dark themes.
- Agent cards with unique role aliases, purpose, task, live status, model, reasoning effort, and the latest peer message.
- Model-coloured agent names: DeepSeek blue, Kimi/Moonshot orange, GPT/OpenAI green.
- Right sidebar with a live, lazy-loaded agent chat and a read-only overview.
- Left **Main chat** panel mirroring the current conversation, with Markdown rendering.
- Chat filter: only inter-agent communication, tool calls excluded, oldest message first with automatic follow of the newest one.
- Bottom strip with active agents, provider-reported tokens, agent time, and team messages.

## How it works

The Host half registers the `agentTeamMonitor` session projection. It folds provider usage, active/model/tool time, accepted peer messages, Team member metadata, and the latest `request/header` model selection.

The Client half combines that projection with the existing `agentTeam`, `modelSelection`, and session status data. Agent chats use `sessions.retain()` and the selected member's `binding.eventSource`; `loadOlder()` pages earlier history without changing the main conversation. No polling or changes to the experimental Agent Teams package are used.

Token totals use only provider-reported `totalTokens`; `unreportedTotal` counts responses without an exact total. Forked agents exclude inherited history. The projection stores the latest 80 peer messages per member while aggregate counters cover the full log.

## Installation

The package is installed as a local Harness bundle. Point `plugin_manager` at the checkout directory:

```text
plugin_manager install_bundle target=<absolute path to this directory>
```

Then select **Team** beside Chat and Trajectory in a conversation that belongs to an Agent Team Lead.

## Validation

```text
node --test --test-isolation=none test/projection.test.js test/schema.test.js
node test/static-validation.cjs
node test/canvas-validation.cjs
node test/chat-scroll.cjs
```

## Structure

| Path | Purpose |
|---|---|
| `client.js` | Canvas, routing, sidebar, chats, Markdown, theme styling |
| `projection.js` | Host session projection fold |
| `schema.js` | Dependency-free persisted state and wire validation |
| `index.js` | Cordis bundle entry |
| `test/` | Projection, geometry, identity, chat, and static checks |
