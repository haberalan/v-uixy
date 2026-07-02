import type { IconName } from "~/types/icons";

export type UixyFileRejectionReason = "type" | "size" | "count";

export interface UixyFileRejection {
  file: File;
  reason: UixyFileRejectionReason;
}

export interface UixyFileUploadProps {
  variant?: "dropzone" | "button";
  buttonVariant?: "primary" | "secondary" | "tertiary" | "quaternary";
  buttonSize?: "sm" | "md" | "lg";
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  icon?: IconName;
  label?: string;
  hint?: string;
  status?: "default" | "error";
  helperText?: string;
  errorText?: string;
  hideList?: boolean;
}

export interface UixyFileUploadEmits {
  (event: "change", files: File[]): void;
  (event: "reject", rejections: UixyFileRejection[]): void;
}
