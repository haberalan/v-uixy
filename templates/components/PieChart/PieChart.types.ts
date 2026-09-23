export type UixyPieChartData = {
  label: string;
  value: number;
  color?: string;
};

export interface UixyPieChartProps {
  data: UixyPieChartData[];
  resolution?: number;
  thickness?: number;
  total?: string;
  legend?: boolean;
  animate?: boolean;
  interactive?: boolean;
  format?: (value: number) => string;
}
