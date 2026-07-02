export const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export interface UixyTimeParts {
  hour: number;
  minute: number;
  second: number;
}

export const timePartsOf = (date?: Date | null): UixyTimeParts => ({
  hour: date?.getHours() ?? 0,
  minute: date?.getMinutes() ?? 0,
  second: date?.getSeconds() ?? 0,
});

export const withTimeParts = (day: Date, time: UixyTimeParts) =>
  new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    time.hour,
    time.minute,
    time.second
  );

export interface UixyDateFormatOptions {
  withTime?: boolean;
  withSeconds?: boolean;
}

export const formatDate = (
  date?: Date | null,
  options: UixyDateFormatOptions = {}
) => {
  if (!date) return "";

  const { withTime = false, withSeconds = false } = options;
  const datePart = `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}`;

  if (!withTime) return datePart;

  const tail = withSeconds ? `:${pad2(date.getSeconds())}` : "";
  return `${datePart} ${pad2(date.getHours())}:${pad2(date.getMinutes())}${tail}`;
};
