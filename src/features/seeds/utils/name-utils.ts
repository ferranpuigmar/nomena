export function normalizeName(name: string): string {
  return name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export function toTitleCase(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}
