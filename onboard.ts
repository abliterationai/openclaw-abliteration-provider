import type { OpenClawConfig } from "openclaw/plugin-sdk/plugin-entry";
import {
  ABLITERATION_BASE_URL,
  ABLITERATION_DEFAULT_MODEL_REF,
  ABLITERATION_MODEL_CATALOG,
  ABLITERATION_PROVIDER_API,
  buildAbliterationModelDefinition,
} from "./models.js";
import type { ModelProviderConfig } from "./types.js";

export { ABLITERATION_DEFAULT_MODEL_REF };

function normalizeProviderId(providerId: string): string {
  return providerId.trim().toLowerCase();
}

function findExistingProviderKey(
  providers: Record<string, ModelProviderConfig>,
  providerId: string,
): string | undefined {
  const normalizedProviderId = normalizeProviderId(providerId);
  return Object.keys(providers).find((key) => normalizeProviderId(key) === normalizedProviderId);
}

function applyAbliterationProviderConfigInternal(cfg: OpenClawConfig): OpenClawConfig {
  const providerId = "abliteration";
  const providers = { ...cfg.models?.providers } as Record<string, ModelProviderConfig>;
  const existingProviderKey = findExistingProviderKey(providers, providerId);
  const existingProvider =
    existingProviderKey !== undefined ? providers[existingProviderKey] : undefined;
  const existingModels = existingProvider?.models ?? [];
  const catalogModels = ABLITERATION_MODEL_CATALOG.map(buildAbliterationModelDefinition);
  const mergedModels =
    existingModels.length > 0
      ? [
          ...existingModels,
          ...catalogModels.filter(
            (model) => !existingModels.some((existing) => existing.id === model.id),
          ),
        ]
      : catalogModels;
  const { apiKey: existingApiKey, ...existingProviderRest } = existingProvider ?? {};
  const normalizedApiKey =
    typeof existingApiKey === "string" ? existingApiKey.trim() : existingApiKey;
  if (existingProviderKey && existingProviderKey !== providerId) {
    delete providers[existingProviderKey];
  }

  providers[providerId] = {
    ...existingProviderRest,
    api: ABLITERATION_PROVIDER_API,
    baseUrl: ABLITERATION_BASE_URL,
    authHeader: true,
    ...(typeof normalizedApiKey === "string"
      ? normalizedApiKey
        ? { apiKey: normalizedApiKey }
        : {}
      : normalizedApiKey != null
        ? { apiKey: normalizedApiKey }
        : {}),
    models: mergedModels.length > 0 ? mergedModels : catalogModels,
  };

  const agentModels = { ...cfg.agents?.defaults?.models };
  agentModels[ABLITERATION_DEFAULT_MODEL_REF] = {
    ...agentModels[ABLITERATION_DEFAULT_MODEL_REF],
  };

  return {
    ...cfg,
    models: {
      ...cfg.models,
      providers,
    },
    agents: {
      ...cfg.agents,
      defaults: {
        ...cfg.agents?.defaults,
        models: agentModels,
      },
    },
  };
}

export function applyAbliterationProviderConfig(cfg: OpenClawConfig): OpenClawConfig {
  return applyAbliterationProviderConfigInternal(cfg);
}

export function applyAbliterationConfig(cfg: OpenClawConfig): OpenClawConfig {
  const next = applyAbliterationProviderConfigInternal(cfg);
  const currentModel = next.agents?.defaults?.model;

  return {
    ...next,
    agents: {
      ...next.agents,
      defaults: {
        ...next.agents?.defaults,
        model: {
          ...(typeof currentModel === "object" && currentModel !== null ? currentModel : {}),
          primary: ABLITERATION_DEFAULT_MODEL_REF,
        },
      },
    },
  };
}
