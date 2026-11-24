# Agent War Room / Штаб агентов

A native Harness conversation view that turns four real subagents into one decision room.

## Roles and flow

1. **Researcher** gathers a fact brief with links and data limitations.
2. **Architect** turns it into a complete Markdown solution.
3. **Skeptic** and **Source verifier** independently attack the draft and check its load-bearing claims.
4. The Architect revises the same document, the Skeptic makes a second attack, and the Architect produces the final version.

The screen contains role cards, one chronological decision feed, the evolving document with per-version navigation and changed-block highlighting, and a separate source list. It does not show four separate chats, reasoning traces, or runtime context. The root declares `data-conversation-composer-overlay`, which is the installed Conversation shell's supported full-height view contract; the feed and document then own their scrollports while the composer overlays the bottom of the view.

## Run

In a root Agent Team Lead session, submit:

```text
/war-room <question or decision>
```

Then select **Штаб / War Room** beside Chat and Trajectory. The command only starts work; the Host runner owns completion. The `war_room` tool provides the same operation to the model and returns the final Markdown artifact.

A later command starts another run; completed runs remain reconstructable from ordinary Session events. The active question is the latest root run. Four agents use fresh in-process children with `maxDepth: 1`, which permits these direct children but no nested delegation; no shared plugin files are used.

## Data model

`agentWarRoom` is a pure Session projection. A root `command/run` or `war_room` tool call identifies a run. Child initial tasks carry a compact `[WAR_ROOM run=… role=…]` marker. Assistant text becomes facts, objections, verification, or Architect document versions. URLs are collected only from agent-authored text, never from raw tool arguments or tool-result pages. A source is marked reviewed only after it occurs in the verifier's explicit `## Проверенные источники` list; merely citing a URL is not verification.

Only the last 72 child moves, six Architect versions, and 120 sources per Session are retained. The projection is excluded from sidebar summaries. No private Session event types are introduced.

## Limits

- This version does not read or write VK Teams and does not upload to Cloud.
- It cannot resume an interrupted Host-side orchestration after a Harness restart; the already committed child Sessions and artifact versions remain visible.
- The current UI shows the latest run, not a run-history selector.
- Source verification is performed by the verifier agent; the UI distinguishes cited from verifier-reviewed sources without claiming independent machine verification.

## Validation

```text
npm test
```

Tests cover projection identity, inherited-log isolation, bounded artifacts and sources, result extraction, browser imports/theme tokens, syntax, and the two-round orchestration contract.
