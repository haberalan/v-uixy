export interface UixyCalendarProps {
  year?: number;
  month?: number;
  startOfWeek?: "Sunday" | "Monday";
  disabled?: boolean;
  isDateDisabled?: (date: Date) => boolean;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  rangeHover?: Date | null;
}

export interface UixyCalendarEmits {
  (event: "dayHover", date: Date): void;
  (event: "dayLeave"): void;
}
