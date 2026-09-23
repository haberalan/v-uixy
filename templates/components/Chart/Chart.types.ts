export type UixyChartSeries = {
  label: string;
  values: number[];
  color?: string;
  baseColor?: string;
};

export type UixyChartData = {
  label: string;
  value: number;
};

export interface UixyChartProps {
  series?: UixyChartSeries[];
  data?: UixyChartData[];
  labels?: string[];
  axisLabels?: string[];
  color?: string;
  baseColor?: string;
  rows?: number;
  animate?: boolean;
  axis?: boolean;
  interactive?: boolean;
  format?: (value: number) => string;
}
