export type UixyPieChartData = {
  label: string;
  value: number;
  color: string;
};

export interface UixyPieChartProps {
  data: UixyPieChartData[];
  thickness?: number;
}
