export function cn(...parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}
