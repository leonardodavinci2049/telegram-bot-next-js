export function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR");
}

export function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

export function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function parseDateInput(text: string): Date | null {
  if (/hoje/gi.test(text)) return new Date();

  if (/amanh[ãa]/gi.test(text)) return addDays(new Date(), 1);

  const diasMatch = text.match(/^(\d+) dias?$/i);
  if (diasMatch) return addDays(new Date(), Number(diasMatch[1]));

  const semanasMatch = text.match(/^(\d+) semanas?$/i);
  if (semanasMatch) return addDays(new Date(), Number(semanasMatch[1]) * 7);

  const mesesMatch = text.match(/^(\d+) m[eê]s(es)?$/i);
  if (mesesMatch) {
    const d = new Date();
    d.setMonth(d.getMonth() + Number(mesesMatch[1]));
    return d;
  }

  const dataMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
  if (dataMatch) {
    const [day, month, year] = dataMatch[1].split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  return null;
}
