export interface UixyCalendarProps {
  year?: number;
  month?: number;
  startOfWeek?: "Sunday" | "Monday";
  disabled?: boolean;
  isDateDisabled?: (date: Date) => boolean;
}
