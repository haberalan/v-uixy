import type { IconName } from "~/types/icons";
import type { UixyFieldSize } from "~/types/field";

export interface UixyDatePickerProps {
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
  size?: UixyFieldSize;
}
