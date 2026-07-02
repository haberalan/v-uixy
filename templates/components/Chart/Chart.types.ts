export type UixyChartSeries = {
  label: string;
  values: number[];
};

export type UixyChartData = {
  label: string;
  value: number;
};

export interface UixyChartProps {
  series?: UixyChartSeries[];
  data?: UixyChartData[];
  color?: string;
  baseColor?: string;
  rows?: number;
  animate?: boolean;
}
