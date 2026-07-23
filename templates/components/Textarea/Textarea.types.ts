export interface UixyTextareaProps {
  status?: "valid" | "error" | "default";
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  errorText?: string;
  alignText?: "left" | "center" | "right";
  autoFocus?: boolean;
  noResize?: boolean;
  rows?: number;
  maxLength?: number;
}
