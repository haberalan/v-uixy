import type { IconName } from "~/types/icons";

export interface UixyDateRange {
  start: Date | null;
  end: Date | null;
}

export interface UixyDateRangePickerProps {
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  status?: "default" | "error";
  disabled?: boolean;
  icon?: IconName;
  withTime?: boolean;
  withSeconds?: boolean;
  startOfWeek?: "Sunday" | "Monday";
  isDateDisabled?: (date: Date) => boolean;
  direction?: "top" | "bottom";
  closeOnSelect?: boolean;
}
