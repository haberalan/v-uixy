import { type IconName } from "~/types/icons";
import type { UixyButtonProps } from "../Button";

export interface UixyAlertProps {}

export interface UixyAlertItemProps {
  id: string;
  label: string;
  content?: string;
  icon?: IconName;
  action?: UixyButtonProps;
  timer?: boolean;
  showClose?: boolean;
}

export interface UixyAlertItemEmits {
  (event: "close-alert"): void;
  (event: "pause-timer"): void;
  (event: "resume-timer"): void;
}
