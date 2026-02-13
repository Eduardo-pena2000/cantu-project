export const ensureDateRangeBoundaries = (
  start_date?: string | Date | null,
  end_date?: string | Date | null
): { start_date: Date; end_date: Date } => {
  let start: Date;
  let end: Date;

  const parseDate = (input: string | Date) => {
    const d = typeof input === "string" ? new Date(input) : input;

    const parts = d.toISOString().slice(0, 10).split("-");

    const [year, month, day] = parts.map(Number);

    return { year, month: month - 1, day };
  };

  if (!start_date || !end_date) {
    const now = new Date();

    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();

    start = new Date(y, m, d, 0, 0, 0, 0);

    end = new Date(y, m, d, 23, 59, 59, 999);
  } else {
    const s = parseDate(start_date);
    const e = parseDate(end_date);

    start = new Date(s.year, s.month, s.day, 0, 0, 0, 0);

    end = new Date(e.year, e.month, e.day, 23, 59, 59, 999);
  }

  return { start_date: start, end_date: end };
};
