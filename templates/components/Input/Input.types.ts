import type { IconName } from "~/types/icons";

export interface UixyInputProps {
  status?: "valid" | "error" | "default";
  icon?: IconName;
  iconPositon?: "left" | "right";
  type?: "text" | "number" | "password" | "email";
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  errorText?: string;
  autoFocus?: boolean;
  hideHelper?: boolean;
}

export interface UixyInputEmits {
  (event: "icon-click"): void;
}
