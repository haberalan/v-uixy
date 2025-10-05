import type { IconName } from "~/types/icons";
import { type UixyLinkProps } from "../Link";

export interface UixyIconButtonProps {
  icon: IconName;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  link?: UixyLinkProps;
}
