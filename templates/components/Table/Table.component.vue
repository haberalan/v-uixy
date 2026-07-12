<template>
  <uixy-card :class="cardClass" v-bind="filteredAttrs">
    <uixy-card class="w-full overflow-hidden p-0">
      <div
        :class="scrollAreaStyles({ scrollY: !!props.maxHeight })"
        :style="props.maxHeight ? { maxHeight: props.maxHeight } : undefined"
      >
        <table :class="tableStyles()">
          <caption v-if="props.caption" :class="captionStyles()">
            {{
              props.caption
            }}
          </caption>

          <colgroup>
            <col v-if="props.selectable" style="width: 44px" />
            <col
              v-for="column in props.columns"
              :key="column.key"
              :style="{ width: column.width, minWidth: column.minWidth }"
            />
          </colgroup>

          <thead>
            <tr>
              <th
                v-if="props.selectable"
                :class="
                  thStyles(
                    {
                      align: 'left',
                      density: props.density,
                      sticky: !!props.stickyHeader,
                    },
                    'w-11',
                  )
                "
              >
                <uixy-checkbox
                  :checked="allSelected"
                  :indeterminate="someSelected"
                  :disabled="!props.rows.length"
                  @update:checked="toggleSelectAll"
                />
              </th>
              <th
                v-for="column in props.columns"
                :key="column.key"
                scope="col"
                :class="
                  thStyles({
                    align: column.align ?? 'left',
                    density: props.density,
                    sticky: !!props.stickyHeader,
                  })
                "
              >
                <span :class="thContentStyles()">
                  <span
                    :class="thLabelStyles({ align: column.align ?? 'left' })"
                  >
                    <span
                      v-if="column.sortable"
                      :class="sortButtonStyles()"
                      @click="handleSort(column)"
                    >
                      {{ column.header }}
                      <uixy-icon
                        :name="sortIconName(column)"
                        :class="sortIconStyles({ active: isSorted(column) })"
                      />
                    </span>
                    <span v-else>{{ column.header }}</span>
                  </span>
                  <uixy-popover
                    v-if="hasFilterSlot(column)"
                    :group="filterGroupId"
                  >
                    <template #trigger="triggerProps">
                      <button
                        v-bind="triggerProps"
                        type="button"
                        :class="
                          filterTriggerStyles({
                            active: isFilterActive(column),
                          })
                        "
                      >
                        <uixy-icon name="sliders-2" class="h-3.5 w-3.5" />
                      </button>
                    </template>
                    <template #default="{ close }">
                      <uixy-card :class="filterPanelStyles()">
                        <slot
                          :name="`filter-${column.key}`"
                          :column="column"
                          :filter="filterFor(column)"
                          :close="close"
                        />
                      </uixy-card>
                    </template>
                  </uixy-popover>
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-if="props.loading">
              <tr v-for="n in skeletonRowCount" :key="`skeleton-${n}`">
                <td
                  v-if="props.selectable"
                  :class="
                    tdStyles({
                      align: 'left',
                      density: props.density,
                      last: n === skeletonRowCount,
                    })
                  "
                >
                  <uixy-skeleton class="h-4 w-4 rounded-1" />
                </td>
                <td
                  v-for="column in props.columns"
                  :key="column.key"
                  :class="
                    tdStyles({
                      align: column.align ?? 'left',
                      density: props.density,
                      last: n === skeletonRowCount,
                    })
                  "
                >
                  <uixy-skeleton class="h-4 w-full max-w-32 rounded-1" />
                </td>
              </tr>
            </template>

            <template v-else-if="!props.rows.length">
              <tr>
                <td :colspan="totalColumnCount" class="p-0">
                  <div :class="emptyStyles()">
                    <slot name="empty">
                      <span>{{ props.emptyText ?? "No data available." }}</span>
                    </slot>
                  </div>
                </td>
              </tr>
            </template>

            <template v-else>
              <tr
                v-for="(row, index) in props.rows"
                :key="keyOf(row, index)"
                :class="rowStyles({ selected: isSelected(row, index) })"
              >
                <td
                  v-if="props.selectable"
                  :class="
                    tdStyles({
                      align: 'left',
                      density: props.density,
                      last: index === props.rows.length - 1,
                    })
                  "
                >
                  <uixy-checkbox
                    :checked="isSelected(row, index)"
                    @update:checked="
                      (checked) => toggleRow(row, index, checked)
                    "
                  />
                </td>
                <td
                  v-for="column in props.columns"
                  :key="column.key"
                  :class="
                    tdStyles({
                      align: column.align ?? 'left',
                      density: props.density,
                      last: index === props.rows.length - 1,
                    })
                  "
                >
                  <slot
                    :name="`cell-${column.key}`"
                    :row="row"
                    :value="cellValue(row, column)"
                    :column="column"
                    :index="index"
                  >
                    {{ cellValue(row, column) }}
                  </slot>
                </td>
              </tr>
            </template>
          </tbody>

          <tfoot v-if="props.summary">
            <tr>
              <td
                v-if="props.selectable"
                :class="
                  footerCellStyles({ align: 'left', density: props.density })
                "
              />
              <td
                v-for="column in props.columns"
                :key="column.key"
                :class="
                  footerCellStyles({
                    align: column.align ?? 'left',
                    density: props.density,
                  })
                "
              >
                <slot
                  :name="`summary-${column.key}`"
                  :column="column"
                  :value="props.summary?.[column.key]"
                >
                  {{ props.summary?.[column.key] ?? "" }}
                </slot>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </uixy-card>

    <div v-if="props.pagination" :class="paginationBarStyles()">
      <slot
        name="pagination"
        :pagination="props.pagination"
        :page-count="pageCount"
        :go-to-page="goToPage"
      >
        <span :class="paginationInfoStyles()">{{ paginationRangeText }}</span>
        <div :class="paginationControlsStyles()">
          <button
            type="button"
            :class="paginationButtonStyles()"
            :disabled="props.pagination.page <= 1"
            @click="goToPage(props.pagination.page - 1)"
          >
            <uixy-icon name="chevron-left" class="h-4 w-4" />
          </button>
          <template v-for="(item, i) in paginationItems" :key="i">
            <span
              v-if="item === 'ellipsis'"
              :class="paginationEllipsisStyles()"
            >
              …
            </span>
            <button
              v-else
              type="button"
              :class="
                paginationButtonStyles({
                  active: item === props.pagination.page,
                })
              "
              @click="goToPage(item)"
            >
              {{ item }}
            </button>
          </template>
          <button
            type="button"
            :class="paginationButtonStyles()"
            :disabled="props.pagination.page >= pageCount"
            @click="goToPage(props.pagination.page + 1)"
          >
            <uixy-icon name="chevron-right" class="h-4 w-4" />
          </button>
        </div>
      </slot>
    </div>
  </uixy-card>
</template>

<script
  setup
  lang="ts"
  generic="TRow extends Record<string, any> = Record<string, any>"
>
  import { UixyCard } from "../Card";
  import { UixyCheckbox } from "../Checkbox";
  import { UixyIcon } from "../Icon";
  import { UixyPopover } from "../Popover";
  import { UixySkeleton } from "../Skeleton";
  import type {
    UixyTableProps,
    UixyTableEmits,
    UixyTableSlots,
    UixyTableColumn,
    UixyTableSort,
  } from "./Table.types";
  import {
    scrollAreaStyles,
    tableStyles,
    captionStyles,
    thStyles,
    thContentStyles,
    thLabelStyles,
    sortButtonStyles,
    sortIconStyles,
    filterTriggerStyles,
    filterPanelStyles,
    rowStyles,
    tdStyles,
    footerCellStyles,
    emptyStyles,
    paginationBarStyles,
    paginationInfoStyles,
    paginationControlsStyles,
    paginationButtonStyles,
    paginationEllipsisStyles,
  } from "./Table.styles";

  const props = withDefaults(defineProps<UixyTableProps<TRow>>(), {
    rowKey: "id",
    density: "comfortable",
    sort: null,
    selectedRowKeys: () => [],
    loading: false,
    selectable: false,
    stickyHeader: false,
  });

  const emit = defineEmits<UixyTableEmits<TRow>>();

  defineSlots<UixyTableSlots<TRow>>();

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();
  const slots = useSlots();
  const filterGroupId = useId();

  const filteredAttrs = computed(() => {
    const { class: _cls, ...rest } = attrs;
    return rest;
  });

  const cardClass = computed(() =>
    ["w-full p-1 bg-gray-100 dark:bg-black", attrs.class]
      .filter(Boolean)
      .join(" "),
  );

  const totalColumnCount = computed(
    () => props.columns.length + (props.selectable ? 1 : 0),
  );

  function keyOf(row: TRow, index: number): string | number {
    const rk = props.rowKey;
    const value =
      typeof rk === "function"
        ? rk(row)
        : (row as Record<string, unknown>)[(rk ?? "id") as string];
    return (value as string | number | undefined) ?? index;
  }

  function cellValue(row: TRow, column: UixyTableColumn<TRow>): unknown {
    if (column.accessor) return column.accessor(row);
    return (row as Record<string, unknown>)[column.key];
  }

  function filterFor(column: UixyTableColumn<TRow>) {
    return props.filters?.find((filter) => filter.key === column.key);
  }

  function hasFilterSlot(column: UixyTableColumn<TRow>) {
    return !!slots[`filter-${column.key}`];
  }

  function isFilterActive(column: UixyTableColumn<TRow>) {
    return !!filterFor(column)?.active;
  }

  function isSorted(column: UixyTableColumn<TRow>) {
    return props.sort?.key === column.key;
  }

  function sortIconName(column: UixyTableColumn<TRow>) {
    if (!isSorted(column)) return "chevrons-vertical" as const;
    return props.sort?.direction === "asc"
      ? ("chevron-up" as const)
      : ("chevron-down" as const);
  }

  function handleSort(column: UixyTableColumn<TRow>) {
    if (!column.sortable) return;

    const current = props.sort;
    let next: UixyTableSort<TRow> | null;

    if (!current || current.key !== column.key) {
      next = { key: column.key, direction: "asc" };
    } else if (current.direction === "asc") {
      next = { key: column.key, direction: "desc" };
    } else {
      next = null;
    }

    emit("sortChange", next);
  }

  const selectedKeySet = computed(() => new Set(props.selectedRowKeys ?? []));

  function isSelected(row: TRow, index: number) {
    return selectedKeySet.value.has(keyOf(row, index));
  }

  const allSelected = computed(
    () =>
      props.rows.length > 0 &&
      props.rows.every((row, index) => isSelected(row, index)),
  );

  const someSelected = computed(
    () =>
      !allSelected.value &&
      props.rows.some((row, index) => isSelected(row, index)),
  );

  function toggleRow(row: TRow, index: number, checked: boolean | undefined) {
    const key = keyOf(row, index);
    const next = new Set(selectedKeySet.value);

    if (checked) next.add(key);
    else next.delete(key);

    emit("selectionChange", Array.from(next));
  }

  function toggleSelectAll(checked: boolean | undefined) {
    const next = new Set(selectedKeySet.value);

    props.rows.forEach((row, index) => {
      const key = keyOf(row, index);
      if (checked) next.add(key);
      else next.delete(key);
    });

    emit("selectionChange", Array.from(next));
  }

  const skeletonRowCount = computed(() =>
    Math.min(props.pagination?.pageSize ?? 8, 10),
  );

  const pageCount = computed(() => {
    if (!props.pagination) return 1;
    return Math.max(
      1,
      Math.ceil(props.pagination.total / props.pagination.pageSize),
    );
  });

  const paginationRangeText = computed(() => {
    if (!props.pagination) return "";

    const { page, pageSize, total } = props.pagination;
    if (total === 0) return "0 results";

    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);

    return `${from}–${to} of ${total}`;
  });

  function goToPage(page: number) {
    if (!props.pagination) return;

    const clamped = Math.min(Math.max(page, 1), pageCount.value);

    if (clamped === props.pagination.page) return;

    emit("pageChange", clamped);
  }

  type PaginationItem = number | "ellipsis";

  const paginationItems = computed<PaginationItem[]>(() => {
    const count = pageCount.value;
    const current = props.pagination?.page ?? 1;
    const siblings = 1;
    const items: PaginationItem[] = [1];

    const start = Math.max(2, current - siblings);
    const end = Math.min(count - 1, current + siblings);

    if (start > 2) items.push("ellipsis");

    for (let i = start; i <= end; i++) items.push(i);

    if (end < count - 1) items.push("ellipsis");

    if (count > 1) items.push(count);

    return items;
  });
</script>
