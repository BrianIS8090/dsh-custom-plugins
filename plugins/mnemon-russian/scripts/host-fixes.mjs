// Backport of upstream 8447beac9eac0e20b2f52ee0d6c55463276ce920 (#602/#603).
// Local addition: respect DSH Auto's model-authored-call requirement by pausing
// automatic review before its rootless challenge, without bypassing any policy.
export const BASE_HOST_SHA256='9c551f888b255b552a8728592e9ee1a826adac092c5278561974ce1a2006cf93';
export function patchHost(original){
 let source=original;
 function replace(before,after){if(source.split(before).length!==2)throw Error('Host patch must match exactly once: '+before.slice(0,100));source=source.replace(before,()=>after);}
 replace('function idleReviewBlockReason(parent, agentTeams = "pause") {\n', 'function idleReviewBlockReason(parent, agentTeams = "pause") {\n\t// Auto admits model-authored calls only; a Host maintenance probe has no root call.\n\tif (parent.ctx?.get?.("permissionPresets")?.current?.(parent.session) === "auto") return "auto-review";\n');
 replace('}\n/**\n* One Agent owns each turn pin.', `}
/** PTC dispatch records belong to a real open step, not just an open turn. */
function openAgentStep(agent) {
 let turn;
 let open;
 for (const event of agent.session.snapshotEvents()) {
  if (event.type === "turn/start") {
   turn = typeof event.data.turn === "number" ? event.data.turn : void 0;
   open = void 0;
  } else if (event.type === "turn/end" && event.data.turn === turn) {
   turn = void 0;
   open = void 0;
  } else if (event.type === "step/start" && turn !== void 0 && event.data.turn === turn && typeof event.data.step === "number") {
   open = { turn, step: event.data.step };
  } else if (event.type === "step/end" && open?.turn === event.data.turn && open?.step === event.data.step) {
   open = void 0;
  }
 }
 return open;
}
/**
* One Agent owns each turn pin.`);
 replace('this.draining.has(agent) || openAgentTurn(agent) === void 0','this.draining.has(agent) || openAgentStep(agent) === void 0');
 replace('\treviewAccessBlocked = false;\n','\treviewAccessBlocked = false;\n\treviewAdmission;\n');
 replace('\t\t\tthis.agent.ctx.on("agent/turn-stopping", ((payload) => this.finishTurn(payload)))', '\t\t\tthis.agent.ctx.on("agent/request", (async (payload, next) => {\n\t\t\t\tawait this.prepareReviewAccess(payload);\n\t\t\t\treturn next();\n\t\t\t}), { prepend: true }),\n\t\t\tthis.agent.ctx.on("agent/turn-stopping", ((payload) => this.finishTurn(payload)))');
 replace('{ idleReviewBlocked: "agent-team" } : this.reviewAccessBlocked', '{ idleReviewBlocked: idleReviewBlockReason(this.agent, this.config.idleReview.agentTeams) } : this.reviewAccessBlocked');
 replace(`		if (!this.reviewActivity().eligible || !this.reviewAdmitted(payload.turn)) return;
		const controller = new AbortController();
		const signal = AbortSignal.any([payload.signal, controller.signal]);
		const epoch = this.reviewEpoch;
		const policy = this.reviewPolicy();
		this.reviewController = controller;
		this.reviewRunning = true;
		let admitted = false;`, `		if (!this.reviewActivity().eligible || !this.reviewAdmitted(payload.turn)) return;
		// step/end already happened: consume admission, never dispatch tools here.
		const admission = this.reviewAdmission;
		if (admission?.turn === payload.turn && admission.policy === this.reviewPolicy() && admission.available) this.scheduleIdleReview(payload.turn);
	}
	async prepareReviewAccess(payload) {
		this.recordComposedTurn(payload.turn);
		if (payload.signal.aborted || !this.restoreWatermark() || !this.idleReviewAllowed() || this.turnActivity.get(payload.turn)?.noMaintenance) return;
		const policy = this.reviewPolicy();
		if (this.reviewAdmission?.turn === payload.turn && this.reviewAdmission.policy === policy) return;
		const controller = new AbortController();
		const signal = AbortSignal.any([payload.signal, controller.signal]);
		const epoch = this.reviewEpoch;
		this.reviewController = controller;
		this.reviewRunning = true;`);
 replace('\t\t\tadmitted = available;', '\t\t\tthis.reviewAdmission = { turn: payload.turn, policy, available };');
 replace('\n\t\tif (admitted) this.scheduleIdleReview(payload.turn);','');
 replace('\t\t\tthis.reviewAccessBlocked = false;\n', '\t\t\tthis.reviewAccessBlocked = false;\n\t\t\tthis.reviewAdmission = void 0;\n');
 // Invalidate once-per-turn admission if the user changes the permission preset.
 replace('\t\t\t\tthis.config.idleReviewMs,\n', '\t\t\t\tthis.config.idleReviewMs,\n\t\t\t\tthis.agent.ctx?.get?.("permissionPresets")?.current?.(this.agent.session),\n');
 replace('summary: "Idle review is paused by the Agent Teams compatibility setting."','summary: "Idle review is paused by the current permission or Agent Teams compatibility setting."');
 return source;
}
