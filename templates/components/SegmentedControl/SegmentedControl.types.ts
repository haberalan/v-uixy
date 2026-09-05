import type { IconName } from "~/types/icons";

export interface UixySegmentedOption {
  label?: string;
  value: string | number;
  icon?: IconName;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface UixySegmentedControlProps {
  options: UixySegmentedOption[];
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
}
