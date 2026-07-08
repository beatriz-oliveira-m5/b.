import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  parse,
  isValid,
} from "date-fns";

export function parseMonthParam(monthParam: string | undefined): Date {
  if (monthParam) {
    const parsed = parse(monthParam, "yyyy-MM", new Date());
    if (isValid(parsed)) return parsed;
  }
  return new Date();
}

export function monthGrid(reference: Date): Date[] {
  const start = startOfWeek(startOfMonth(reference), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(reference), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function dayKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function monthParam(date: Date): string {
  return format(date, "yyyy-MM");
}

export const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
