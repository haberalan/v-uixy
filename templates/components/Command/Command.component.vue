<template>
  <uixy-modal v-model="open">
    <uixy-card :class="commandStyles($attrs.class as string)">
      <div class="flex items-center gap-2 p-3">
        <label :for="id">
          <uixy-icon
            name="search"
            class="size-5 cursor-pointer text-gray-400 transition-all duration-150 ease-in-out hover:text-black dark:text-gray-700 dark:hover:text-gray-500"
          />
        </label>
        <input
          :id
          :placeholder
          class="w-full bg-transparent text-sm placeholder:text-gray-400 focus-visible:outline-none dark:placeholder:text-gray-700"
          type="text"
          v-model="input"
        />
        <uixy-icon
          name="close"
          class="size-4 cursor-pointer text-gray-400 transition-all duration-150 ease-in-out hover:text-black dark:text-gray-700 dark:hover:text-gray-500"
          @click="handleClose"
        />
      </div>
      <uixy-separator variant="horizontal" />
      <div class="scrollbar max-h-[320px] overflow-y-auto">
        <template v-for="option in filteredOptions" :key="option.label">
          <template v-if="option.items.length > 0">
            <ul class="flex flex-col gap-2 p-2">
              <div class="font-500 text-xs text-gray-500 dark:text-gray-600">
                {{ option.label }}
              </div>
              <li
                v-for="item in option.items"
                :key="item.label"
                @click="handleClose"
                class="rounded-1 text-sm transition-all duration-100 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-900"
              >
                <uixy-link
                  v-bind="item.link"
                  class="rounded-1 flex items-center gap-2 p-1"
                >
                  <uixy-icon :name="item.icon" class="size-4" />
                  <span>{{ item.label }}</span>
                </uixy-link>
              </li>
            </ul>
            <uixy-separator variant="horizontal" class="last-of-type:hidden" />
          </template>
        </template>
        <p
          v-if="isEmpty"
          class="py-4 text-center text-gray-400 dark:text-gray-700"
        >
          {{ emptyText }}
        </p>
      </div>
    </uixy-card>
  </uixy-modal>
</template>

<script setup lang="ts">
  import { UixyModal } from "../Modal";
  import { UixyCard } from "../Card";
  import { UixyLink } from "../Link";
  import { UixyIcon } from "../Icon";
  import { UixySeparator } from "../Separator";
  import { commandStyles } from "./Command.styles";
  import type { UixyCommandProps } from "./Command.types";

  const props = defineProps<UixyCommandProps>();

  const open = defineModel<boolean>("open");

  const input = defineModel<string>("input");

  const id = useId();

  const filteredOptions = computed(() =>
    props.options.map((option) => ({
      label: option.label,
      items: option.items.filter((item) =>
        item.label.toLowerCase().includes(input.value?.toLowerCase() ?? "")
      ),
    }))
  );

  const isEmpty = computed(() =>
    filteredOptions.value.every((option) => option.items.length === 0)
  );

  const handleClose = () => {
    open.value = false;
  };

  const placeholder = computed(
    () => props.placeholder || "Search or type a command..."
  );

  const emptyText = computed(() => props.emptyText || "No results found.");
</script>
