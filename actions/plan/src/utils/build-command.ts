export type Part = string | boolean;

export const buildCommand = (parts: Part[]): string => {
  return parts.filter(Boolean).join(' ')
}
