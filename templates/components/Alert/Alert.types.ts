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
