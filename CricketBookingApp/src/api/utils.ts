export const API_DELAY_MS = 250;

export function apiDelay(ms = API_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createId(prefix: string): string {
  return `${prefix}${Date.now()}`;
}
