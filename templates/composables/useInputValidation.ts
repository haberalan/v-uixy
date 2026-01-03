import { ref, computed, type Ref } from "vue";

export type UseValidationProps = {
  validation: ((value: string) => true | string)[];
  base?: string;
};

export function useInputValidation<
  T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement
>({ validation, base }: UseValidationProps) {
  const value = ref(base ?? "");
  const touched = ref(false);
  const error = ref<string | undefined>(undefined);
  const elRef: Ref<T | null> = ref(null);

  const onInput = (e: Event) => {
    const target = e.target as T | null;
    if (error.value) error.value = undefined;
    if (target) value.value = target.value;
  };

  const onBlur = () => {
    touched.value = true;
  };

  const valid = computed(
    () => !error.value && validation.every((v) => v(value.value) === true)
  );

  const status = computed<"valid" | "error" | "default">(() => {
    if (!touched.value) return "default";
    if (error.value || !valid.value) return "error";
    if (valid.value) return "valid";

    return "default";
  });

  const parsedValidation = computed(() => {
    const found = validation.find((v) => v(value.value) !== true);
    return found as ((v: string) => string) | undefined;
  });

  const errorText = computed(() =>
    touched.value
      ? error.value || parsedValidation.value?.(value.value)
      : undefined
  );

  const reset = (hard = false) => {
    touched.value = !hard;
    error.value = undefined;
    value.value = "";
  };

  const setError = async (message: string) => {
    error.value = message;
    touched.value = true;
  };

  const bindings = computed<Record<string, any>>(() => ({
    ref: elRef,
    modelValue: value.value,
    ["onUpdate:modelValue"]: (v: string) => {
      value.value = v;
    },
    status: status.value,
    errorText: errorText.value,
    onInput,
    onBlur,
    "aria-invalid": status.value === "error",
  }));

  return {
    ref: elRef,
    value,
    touched,
    errorText,
    status,
    valid,
    error,
    reset,
    setError,
    onInput,
    onBlur,
    bindings,
  };
}

export default useInputValidation;
