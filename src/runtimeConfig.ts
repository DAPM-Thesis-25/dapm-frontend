export type RuntimeConfig = { orgName: string; apiBaseUrl: string };

export function getRuntimeConfig(): RuntimeConfig {
  const cfg = (window as any).__RUNTIME_CONFIG__;
  if (!cfg) throw new Error("Missing runtime config (/config.js).");
  return cfg as RuntimeConfig;
}
