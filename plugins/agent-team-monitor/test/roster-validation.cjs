// Regression check for the DSH Team projection contract introduced after the
// monitor was written: agentTeam keeps tasks/mode, while the live roster comes
// from recursive subagentCatalog projections.
const fs = require('node:fs');
const assert = require('node:assert/strict');

const script = fs.readFileSync(__dirname + '/../client.js', 'utf8');
const start = script.indexOf('function catalogRoster');
const end = script.indexOf('function collectMessages');
assert.ok(start > 0 && end > start, 'client.js layout changed: cannot slice roster source');
const rosterSource = script.slice(start, end);
const { mergeMembers, missingCatalogIds } = new Function('EMPTY_LIST', `${rosterSource};return {mergeMembers,missingCatalogIds}`)([]);

const team = { enabled: true, tasks: [] };
const leadMonitor = { teamMembers: [] };
const projectionsBySession = {
  lead: {
    values: {
      agentTeam: team,
      subagentCatalog: [
        { id: 'child-research', createdAt: 200, mode: 'continuable', label: 'Research the API', name: 'researcher' },
      ],
    },
  },
  'child-research': {
    values: {
      subagentCatalog: [
        { id: 'child-review', createdAt: 300, mode: 'continuable', label: 'Review the result', name: 'reviewer' },
      ],
    },
  },
  'child-review': { values: { subagentCatalog: [] } },
};

const current = mergeMembers(team, leadMonitor, projectionsBySession, 'lead');
assert.deepEqual(current.members.map(member => [member.id, member.name, member.role]), [
  ['lead', 'lead', 'lead'],
  ['child-research', 'researcher', 'teammate'],
  ['child-review', 'researcher/reviewer', 'teammate'],
], 'the current DSH projections must populate the lead and recursive teammates');
assert.equal(current.members[1].metadata.description, 'Research the API');
assert.equal(current.members[1].sortCreated, 200);
assert.equal(current.members[2].parentId, 'child-research');
assert.equal(current.members[2].mode, 'continuable');
assert.deepEqual(missingCatalogIds('lead', {}), ['lead'], 'an unopened root catalog must be requested');
assert.deepEqual(missingCatalogIds('lead', projectionsBySession), [], 'fully loaded catalogs must not be requested again');

// A later catalog publication must change the derived roster on the next read;
// this is the stale-panel half of the original failure.
projectionsBySession.lead.values.subagentCatalog = [
  ...projectionsBySession.lead.values.subagentCatalog,
  { id: 'child-test', createdAt: 400, mode: 'continuable', label: 'Test the fix', name: 'tester' },
];
assert.deepEqual(missingCatalogIds('lead', projectionsBySession), ['child-test'], 'only the newly discovered catalog must be requested');
const updated = mergeMembers(team, leadMonitor, projectionsBySession, 'lead');
assert.deepEqual(updated.members.map(member => member.id), ['lead', 'child-research', 'child-review', 'child-test']);

// Legacy Team projections remain readable while a profile is being upgraded.
const legacy = mergeMembers({
  members: [
    { id: 'lead', name: 'lead', role: 'lead', phase: 'active' },
    { id: 'old-child', name: 'old-agent', role: 'teammate', phase: 'active' },
  ],
  tasks: [],
}, { teamMembers: [] }, {}, 'lead');
assert.deepEqual(legacy.members.map(member => member.id), ['lead', 'old-child']);

console.log('Roster validation passed: current recursive catalogs, live additions, and legacy projections');
