/** Безопасное приведение произвольного значения к строке. */
export function asText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

export function trimText(value: unknown): string {
  return asText(value).trim();
}
