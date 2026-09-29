import type { ProviderCatalogResult } from "openclaw/plugin-sdk/plugin-entry";

type SingleProviderCatalogResult = Extract<
  NonNullable<ProviderCatalogResult>,
  { provider: unknown }
>;

export type ModelProviderConfig = SingleProviderCatalogResult["provider"];
export type ModelDefinitionConfig = ModelProviderConfig["models"][number];
