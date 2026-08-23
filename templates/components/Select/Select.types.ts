import type { UixyFieldSize } from "~/types/field";

export interface UixySelectOptionType {
  label: string;
  value?: string;
  disabled?: boolean;
  children?: UixySelectOptionType[];
}

export interface UixyMultipleSelectProps {
  multiple: true;
}

export interface UixySingleSelectProps {
  multiple?: false;
}

export interface UixySelectEmits {
  (event: "change", v: string): void;
  (event: "openChange", isOpen: boolean): void;
}

export type UixySelectProps = {
  options: UixySelectOptionType[];
  status: "valid" | "error" | "default";
  search?: boolean;
  multiple?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  errorText?: string;
  autoFocus?: boolean;
  max?: number;
  tree?: boolean;
  leafOnly?: boolean;
  autoOpen?: boolean;
  delay?: number;
  deselectable?: boolean;
  allowCustom?: boolean;
  clearSearchOnSelect?: boolean;
  followOnScroll?: boolean;
  size?: UixyFieldSize;
} & (UixyMultipleSelectProps | UixySingleSelectProps);
