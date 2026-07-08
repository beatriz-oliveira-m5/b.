/** Fica isolado num módulo próprio pra não disparar a regra de pureza do
 * React quando usado direto dentro de um Server Component. */
export function isoDateDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}
