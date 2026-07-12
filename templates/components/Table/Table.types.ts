export type UixyTableAlign = "left" | "center" | "right";
export type UixyTableDensity = "compact" | "comfortable";
export type UixyTableSortDirection = "asc" | "desc";

export type UixyTableColumnKey<TRow> =
  | Extract<keyof TRow, string>
  | (string & {});

export interface UixyTableColumn<TRow = Record<string, unknown>> {
  key: UixyTableColumnKey<TRow>;
  header: string;
  accessor?: (row: TRow) => unknown;
  sortable?: boolean;
  align?: UixyTableAlign;
  width?: string;
  minWidth?: string;
}

export interface UixyTableSort<TRow = Record<string, unknown>> {
  key: UixyTableColumnKey<TRow>;
  direction: UixyTableSortDirection;
}

export interface UixyTablePagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface UixyTableFilter {
  key: string;
  type: string;
  label?: string;
  active?: boolean;
  [key: string]: unknown;
}

export type UixyTableRowKey<TRow> =
  | UixyTableColumnKey<TRow>
  | ((row: TRow) => string | number);

export interface UixyTableProps<TRow = Record<string, unknown>> {
  columns: UixyTableColumn<TRow>[];
  rows: TRow[];
  rowKey?: UixyTableRowKey<TRow>;
  sort?: UixyTableSort<TRow> | null;
  pagination?: UixyTablePagination;
  filters?: UixyTableFilter[];
  selectable?: boolean;
  selectedRowKeys?: Array<string | number>;
  summary?: Partial<Record<UixyTableColumnKey<TRow>, unknown>>;
  loading?: boolean;
  density?: UixyTableDensity;
  stickyHeader?: boolean;
  maxHeight?: string;
  caption?: string;
  emptyText?: string;
}

export interface UixyTableEmits<TRow = Record<string, unknown>> {
  (event: "sortChange", sort: UixyTableSort<TRow> | null): void;
  (event: "pageChange", page: number): void;
  (event: "selectionChange", keys: Array<string | number>): void;
}

export interface UixyTableCellSlotProps<TRow = Record<string, unknown>> {
  row: TRow;
  value: unknown;
  column: UixyTableColumn<TRow>;
  index: number;
}

export interface UixyTableSummarySlotProps<TRow = Record<string, unknown>> {
  column: UixyTableColumn<TRow>;
  value: unknown;
}

export interface UixyTableFilterSlotProps<TRow = Record<string, unknown>> {
  column: UixyTableColumn<TRow>;
  filter?: UixyTableFilter;
  close: () => void;
}

export interface UixyTablePaginationSlotProps {
  pagination: UixyTablePagination;
  pageCount: number;
  goToPage: (page: number) => void;
}

export interface UixyTableSlots<TRow = Record<string, unknown>> {
  empty?: (props: Record<string, never>) => unknown;
  pagination?: (props: UixyTablePaginationSlotProps) => unknown;
  [key: `cell-${string}`]: (props: UixyTableCellSlotProps<TRow>) => unknown;
  [key: `summary-${string}`]: (
    props: UixyTableSummarySlotProps<TRow>,
  ) => unknown;
  [key: `filter-${string}`]: (props: UixyTableFilterSlotProps<TRow>) => unknown;
}
