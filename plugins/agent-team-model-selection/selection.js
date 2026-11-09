// Route ownership is per request. Never mutate the parent or adapter-owned values.
export async function selectOptions(llm, parent, args, signal) {
  const hasProvider = args.provider !== undefined;
  const hasModel = args.model !== undefined;
  if (hasProvider !== hasModel) throw new Error('provider and model must be supplied together');
  if (!hasProvider && args.reasoning_effort === undefined) return undefined;
  const base = parent.session.requestHeader()?.config ?? parent.options;
  const provider = hasProvider ? args.provider : base.provider;
  const model = hasModel ? args.model : base.model;
  if (!provider || !model) throw new Error('Specify both provider and model: parent route is unavailable');
  const routeChanged = provider !== base.provider || model !== base.model;
  const effort = args.reasoning_effort ?? (routeChanged ? undefined : base.reasoningEffort);
  const requested = { provider, model, ...(effort === undefined ? {} : { reasoningEffort: effort }) };
  // Validates explicit effort before reserving a Team member name or starting an LLM call.
  const resolved = await llm.resolveCallConfig(requested, signal);
  return { provider: resolved.provider, model: resolved.model,
    ...(resolved.reasoningEffort === undefined ? {} : { reasoningEffort: resolved.reasoningEffort }) };
}

export async function discoverModels(llm, args, signal) {
  if (args.model !== undefined && args.provider === undefined) throw new Error('model requires provider');
  const providers = llm.listProviders();
  if (args.provider === undefined) return { providers };
  if (!providers.some(p => p.id === args.provider)) throw new Error('Provider is not registered: ' + args.provider);
  if (args.model === undefined) return { provider: args.provider, models: await llm.listModels(args.provider) };
  return await llm.resolveModelInfo(args.provider, args.model, signal);
}
