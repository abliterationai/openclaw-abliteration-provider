import { describe, expect, it } from "vitest";
import plugin from "./index.js";
import { ABLITERATION_DEFAULT_MODEL_REF } from "./models.js";
import { buildAbliterationProvider } from "./provider-catalog.js";

describe("abliteration provider plugin", () => {
  it("registers Abliteration provider metadata", () => {
    const providers: unknown[] = [];
    plugin.register({
      registerProvider(provider: unknown) {
        providers.push(provider);
      },
    } as never);

    expect(providers).toHaveLength(1);
    expect(providers[0]).toMatchObject({
      id: "abliteration",
      label: "Abliteration",
      docsPath: "https://github.com/abliterationai/openclaw-abliteration-provider#readme",
      envVars: ["ABLITERATION_API_KEY"],
    });
  });

  it("builds the static Abliteration provider catalog", () => {
    const provider = buildAbliterationProvider();

    expect(provider).toMatchObject({
      api: "openai-responses",
      baseUrl: "https://api.abliteration.ai/v1",
      authHeader: true,
    });
    expect(provider.models.map((model) => model.id)).toEqual(["abliterated-model"]);
    expect(provider.models[0]).toMatchObject({
      cost: {
        input: 5,
        output: 5,
        cacheRead: 0,
        cacheWrite: 0,
      },
      input: ["text", "image"],
      maxTokens: 8192,
      contextWindow: 128000,
    });
  });

  it("uses the expected default model ref", () => {
    expect(ABLITERATION_DEFAULT_MODEL_REF).toBe("abliteration/abliterated-model");
  });
});
