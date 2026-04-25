import { describe, expect, it } from "vitest";
import { ABLITERATION_DEFAULT_MODEL_REF } from "./models.js";
import { applyAbliterationConfig, applyAbliterationProviderConfig } from "./onboard.js";

describe("abliteration onboarding", () => {
  it("adds Abliteration provider with correct settings and default model", () => {
    const cfg = applyAbliterationConfig({});

    expect(cfg.agents?.defaults?.model).toEqual({
      primary: ABLITERATION_DEFAULT_MODEL_REF,
    });
    expect(cfg.models?.providers?.abliteration).toMatchObject({
      baseUrl: "https://api.abliteration.ai/v1",
      api: "openai-responses",
      authHeader: true,
    });
  });

  it("preserves SecretRef apiKey values when reapplying provider config", () => {
    const apiKey = { source: "env", provider: "default", id: "ABLITERATION_API_KEY" } as const;
    const next = applyAbliterationProviderConfig({
      models: {
        providers: {
          abliteration: {
            api: "openai-completions",
            baseUrl: "https://legacy.abliteration.ai/v1",
            apiKey,
            models: [],
          },
        },
      },
    });

    expect(next.models?.providers?.abliteration?.apiKey).toEqual(apiKey);
  });

  it("rewrites normalized variant provider keys in place", () => {
    const next = applyAbliterationProviderConfig({
      models: {
        providers: {
          Abliteration: {
            api: "openai-completions",
            baseUrl: "https://legacy.abliteration.ai/v1",
            apiKey: "  test-key  ",
            models: [
              {
                id: "old-model",
                name: "Old Model",
                reasoning: false,
                input: ["text"],
                cost: {
                  input: 0,
                  output: 0,
                  cacheRead: 0,
                  cacheWrite: 0,
                },
                contextWindow: 4096,
                maxTokens: 1024,
              },
            ],
          },
        },
      },
    });

    expect(next.models?.providers?.Abliteration).toBeUndefined();
    expect(Object.keys(next.models?.providers ?? {})).toEqual(["abliteration"]);
    expect(next.models?.providers?.abliteration).toMatchObject({
      api: "openai-responses",
      baseUrl: "https://api.abliteration.ai/v1",
      authHeader: true,
      apiKey: "test-key",
    });
    expect(next.models?.providers?.abliteration?.models.map((model) => model.id)).toEqual([
      "old-model",
      "abliterated-model",
    ]);
  });
});
