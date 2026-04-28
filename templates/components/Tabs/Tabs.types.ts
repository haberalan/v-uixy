export interface UixyTabsProps {
  tabs: {
    label: string;
    value: string | number;
  }[];
  variant: "primary" | "secondary";
  keepAlive?: boolean;
}
