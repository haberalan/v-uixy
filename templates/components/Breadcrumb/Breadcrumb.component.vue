<template>
  <nav aria-label="Breadcrumb">
    <ol :class="breadcrumbListStyles({ size: props.size })">
      <template v-for="(node, index) in nodes" :key="index">
        <li :class="breadcrumbItemStyles()">
          <button
            v-if="node.kind === 'ellipsis'"
            type="button"
            :class="breadcrumbEllipsisStyles()"
            aria-label="Show hidden breadcrumbs"
            @click="expanded = true"
          >
            <uixy-icon
              name="more-horizontal"
              :class="breadcrumbIconStyles({ size: props.size })"
            />
          </button>

          <uixy-link
            v-else-if="node.item?.link && !node.current"
            v-bind="node.item.link"
            :class="breadcrumbLinkStyles()"
          >
            <uixy-icon
              v-if="node.item.icon"
              :name="node.item.icon"
              :class="breadcrumbIconStyles({ size: props.size })"
            />
            {{ node.item.label }}
          </uixy-link>

          <span
            v-else
            :class="breadcrumbCurrentStyles()"
            :aria-current="node.current ? 'page' : undefined"
          >
            <uixy-icon
              v-if="node.item?.icon"
              :name="node.item.icon"
              :class="breadcrumbIconStyles({ size: props.size })"
            />
            {{ node.item?.label }}
          </span>
        </li>

        <li
          v-if="index < nodes.length - 1"
          :class="breadcrumbSeparatorStyles()"
          aria-hidden="true"
        >
          <uixy-icon
            :name="props.separator"
            :class="breadcrumbSeparatorIconStyles({ size: props.size })"
          />
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
  import { UixyLink } from "../Link";
  import { UixyIcon } from "../Icon";
  import type {
    BreadcrumbNode,
    ItemNode,
    UixyBreadcrumbItem,
    UixyBreadcrumbProps,
  } from "./Breadcrumb.types";
  import {
    breadcrumbListStyles,
    breadcrumbItemStyles,
    breadcrumbLinkStyles,
    breadcrumbCurrentStyles,
    breadcrumbSeparatorStyles,
    breadcrumbEllipsisStyles,
    breadcrumbIconStyles,
    breadcrumbSeparatorIconStyles,
  } from "./Breadcrumb.styles";

  const props = withDefaults(defineProps<UixyBreadcrumbProps>(), {
    separator: "chevron-right",
    size: "md",
  });

  const expanded = ref(false);

  const nodes = computed<BreadcrumbNode[]>(() => {
    const items = props.items ?? [];
    const total = items.length;

    const toItemNode = (item: UixyBreadcrumbItem, index: number): ItemNode => ({
      kind: "item",
      item,
      current: item.current ?? index === total - 1,
    });

    const shouldCollapse =
      !expanded.value &&
      props.maxItems &&
      props.maxItems >= 1 &&
      total > props.maxItems;

    if (!shouldCollapse) return items.map(toItemNode);

    const tail = Math.min(Math.max(props.maxItems! - 1, 1), total - 1);

    const head = toItemNode(items[0]!, 0);

    const tailNodes = items
      .slice(total - tail)
      .map((item, i) => toItemNode(item, total - tail + i));

    return [head, { kind: "ellipsis" }, ...tailNodes];
  });
</script>
