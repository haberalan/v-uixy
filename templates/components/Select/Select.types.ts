export interface UixySelectOptionType {
  label: string;
  disabled?: boolean;
}

export interface UixyMultipleSelectProps {
  multiple: true;
}

export interface UixySingleSelectProps {
  multiple?: false;
}

export interface UixySelectEmits {
  (event: "change", v: string): void;
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
} & (UixyMultipleSelectProps | UixySingleSelectProps);
