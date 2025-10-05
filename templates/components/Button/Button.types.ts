import type { IconName } from "~/types/icons";
import { type UixyLinkProps } from "../Link";

export interface UixyButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  size?: "sm" | "md" | "lg";
  icon?: IconName;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  rounded?: boolean;
  link?: UixyLinkProps;
}
