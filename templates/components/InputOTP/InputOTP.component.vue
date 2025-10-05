<template>
  <div class="flex items-center gap-1">
    <div class="flex">
      <input
        v-for="index in [0, 1, 2]"
        :key="index"
        :ref="(el) => pushRef(el as HTMLInputElement, index)"
        :value="value[index]"
        @input="e => handleUpdate(index, (e.target as HTMLInputElement).value)"
        @keydown="handleKeyDown(index)"
        @paste="handlePaste"
        @focus="handleFocus"
        :disabled="props.disabled || loading"
        :class="inputOTPStyles({ status, place: PLACES[index] })"
        type="text"
        max-length="1"
        inputmode="numeric"
        pattern="\d*"
      />
    </div>
    <div class="h-[2px] w-1 rounded-1 bg-black dark:bg-gray-100" />
    <div class="flex">
      <input
        v-for="index in [3, 4, 5]"
        :key="index"
        :ref="(el) => pushRef(el as HTMLInputElement, index)"
        :value="value[index]"
        @input="e => handleUpdate(index, (e.target as HTMLInputElement).value)"
        @keydown="handleKeyDown(index)"
        @paste="handlePaste"
        @focus="handleFocus"
        :disabled="props.disabled || loading"
        :class="inputOTPStyles({ status, place: PLACES[index] })"
        type="text"
        max-length="1"
        inputmode="numeric"
        pattern="\d*"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, watch, computed, type Ref } from "vue";
  import { inputOTPStyles } from "./InputOTP.styles";
  import type { UixyInputOTPProps } from "./InputOTP.types";

  const props = defineProps<UixyInputOTPProps>();

  const INPUT_LENGTH = 6 as const;
  const PLACES = [
    "leftEdge",
    "center",
    "right",
    "left",
    "center",
    "rightEdge",
  ] as const;

  const value = reactive<string[]>(Array(INPUT_LENGTH).fill(""));
  const shouldFocusFirstInput = ref(false);

  type InputRef = Ref<HTMLInputElement | null>;
  const inputRefs: InputRef[] = Array.from({ length: INPUT_LENGTH }, () =>
    ref<HTMLInputElement | null>(null)
  );

  const loading = ref(false);

  const status = computed(() =>
    props.disabled || loading.value ? "disabled" : "default"
  );

  const pushRef = (el: HTMLInputElement | null, index: number) => {
    inputRefs[index].value = el;
  };

  const handleUpdate = (index: number, val: string) => {
    const newVal = val.slice(-1) || "";
    value[index] = newVal;

    if (newVal && index < INPUT_LENGTH - 1) {
      inputRefs[index + 1].value?.focus();
    }

    if (value.every((v) => v !== "")) {
      const code = value.join("");
      handleFilledData(code);
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();

    const pastedData = (e.clipboardData?.getData("Text") || "").trim();
    if (/^\d+$/.test(pastedData)) {
      const input = e.target as HTMLInputElement;
      const index = inputRefs.findIndex((r) => r.value === input);
      const chars = pastedData.slice(0, INPUT_LENGTH - index).split("");

      chars.forEach((char, i) => {
        value[index + i] = char;
      });

      const nextIndex = index + chars.length;
      if (nextIndex < INPUT_LENGTH) {
        inputRefs[nextIndex].value?.focus();
      }

      if (value.every((v) => v !== "")) {
        const code = value.join("");
        handleFilledData(code);
      }
    }
  };

  const handleKeyDown = (index: number) => {
    return (e: KeyboardEvent) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        inputRefs[index - 1].value?.focus();
      }
    };
  };

  const handleFocus = (e: FocusEvent) => {
    (e.target as HTMLInputElement).select();
  };

  const handleFilledData = async (code: string) => {
    if (!props.filled) return;

    loading.value = true;
    try {
      const res = await props.filled(code);

      if (res) return;

      for (let i = 0; i < INPUT_LENGTH; i++) value[i] = "";

      shouldFocusFirstInput.value = true;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  watch(shouldFocusFirstInput, (val) => {
    if (!val) return;

    inputRefs[0].value?.focus();
    shouldFocusFirstInput.value = false;
  });

  onMounted(() => {
    inputRefs[0].value?.focus();
  });
</script>
