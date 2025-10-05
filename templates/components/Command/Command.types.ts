import type { IconName } from "~/types/icons";
import type { UixyLinkProps } from "../Link";

export interface UixyCommandItem {
  label: string;
  icon: IconName;
  link: UixyLinkProps;
}

export interface UixyCommandItems {
  label: string;
  items: UixyCommandItem[];
}

export interface UixyCommandProps {
  options: UixyCommandItems[];
  placeholder?: string;
  emptyText?: string;
}
