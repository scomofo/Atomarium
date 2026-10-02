export const DEFAULT_DEV_PORT = 5173;
export const DEFAULT_PREVIEW_PORT = 4173;

export function configuredPort(value, fallback) {
  if (value === undefined || String(value).trim() === "") return fallback;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new RangeError(`Invalid server port: ${value}. Use an integer from 1 to 65535.`);
  }
  return port;
}

export function devPort(env = process.env) {
  return configuredPort(env.DEV_PORT ?? env.PORT, DEFAULT_DEV_PORT);
}

export function previewPort(env = process.env) {
  return configuredPort(env.PREVIEW_PORT ?? env.PORT, DEFAULT_PREVIEW_PORT);
}

export function devUrl(env = process.env) {
  return env.DEV_URL || `http://127.0.0.1:${devPort(env)}/`;
}
