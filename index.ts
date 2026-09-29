import {
  definePluginEntry,
  type UnifiedModelCatalogEntry,
} from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";
import { applyAbliterationConfig, ABLITERATION_DEFAULT_MODEL_REF } from "./onboard.js";
import { buildAbliterationProvider } from "./provider-catalog.js";

const PROVIDER_ID = "abliteration";

function buildCatalogRows(source: "static" | "live"): UnifiedModelCatalogEntry[] {
  return buildAbliterationProvider().models.map((model) => ({
    kind: "text",
    provider: PROVIDER_ID,
    model: model.id,
    label: model.name,
    source,
  }));
}

export default definePluginEntry({
  id: PROVIDER_ID,
  name: "Abliteration Provider",
  description: "Abliteration.ai model provider plugin",
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: "Abliteration",
      docsPath: "https://github.com/abliterationai/openclaw-abliteration-provider#readme",
      envVars: ["ABLITERATION_API_KEY"],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: "Abliteration API key",
          hint: "OpenAI Responses API",
          optionKey: "abliterationApiKey",
          flagName: "--abliteration-api-key",
          envVar: "ABLITERATION_API_KEY",
          promptMessage: "Enter Abliteration API key",
          defaultModel: ABLITERATION_DEFAULT_MODEL_REF,
          applyConfig: (cfg) => applyAbliterationConfig(cfg),
          expectedProviders: [PROVIDER_ID],
          wizard: {
            choiceId: "abliteration-api-key",
            choiceLabel: "Abliteration API key",
            groupId: "abliteration",
            groupLabel: "Abliteration",
            groupHint: "OpenAI Responses API",
          },
        }),
      ],
      catalog: {
        order: "simple",
        run: async (ctx) => {
          const { apiKey } = ctx.resolveProviderApiKey(PROVIDER_ID);
          return {
            provider: {
              ...buildAbliterationProvider(),
              ...(apiKey ? { apiKey } : {}),
            },
          };
        },
      },
    });

    api.registerModelCatalogProvider({
      provider: PROVIDER_ID,
      kinds: ["text"],
      staticCatalog: () => buildCatalogRows("static"),
      liveCatalog: () => buildCatalogRows("live"),
    });
  },
});
