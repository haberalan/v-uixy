import type { IconName } from "~/types/icons";
import type { UixyFieldSize } from "~/types/field";

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
  size?: UixyFieldSize;
}

export interface UixyInputEmits {
  (event: "icon-click"): void;
}
