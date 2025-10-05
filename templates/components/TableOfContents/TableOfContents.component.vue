<template>
  <nav
    :class="tableOfContentsStyles($attrs.class as string)"
    v-bind="filteredAttrs"
  >
    <p class="text-sm font-500">{{ props.heading ?? "On This Page" }}</p>
    <ul class="flex list-none flex-col gap-2">
      <li
        v-for="(heading, i) in headings"
        :key="heading.innerText"
        @click="handleClick(heading)"
        :class="
          itemStyles({
            node: node(heading),
            active: i === index,
          })
        "
      >
        {{ heading.dataset.toc ?? heading.innerText }}
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
  import { tableOfContentsStyles, itemStyles } from "./TableOfContents.styles";

  import type { UixyTableOfContentsProps } from "./TableOfContents.types";

  const props = defineProps<UixyTableOfContentsProps>();

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs;

    return rest;
  });

  const node = (heading: HTMLElement) => {
    return heading.nodeName as "H2" | "H3" | "H4" | "H5" | "H6";
  };

  const headings = ref<HTMLElement[]>([]);
  const active = ref<HTMLElement | null>(null);
  const headingElementsRef = ref(
    new Map<HTMLElement, IntersectionObserverEntry>()
  );

  const index = computed(() =>
    headings.value.indexOf(active.value as HTMLElement)
  );

  const container = computed(() => props.container ?? "[data-content]");

  onMounted(() => {
    const headingElements = Array.from(
      document.querySelectorAll(
        `${container.value} h2, ${container.value} h3, ${container.value} h4, ${container.value} h5, ${container.value} h6`
      )
    );

    headings.value = headingElements as HTMLElement[];
  });

  const handleClick = (heading: HTMLElement) => {
    const rect = heading.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const targetPosition = rect.top + scrollTop - 96;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  };

  watch(
    () => headings.value,
    (newHeadings) => {
      if (newHeadings.length) {
        const observer = new IntersectionObserver(
          (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
              const targetEl = entry.target as HTMLElement;
              if (entry.isIntersecting) {
                headingElementsRef.value.set(targetEl, entry);
              } else {
                headingElementsRef.value.delete(targetEl);
              }
            });

            const visibleHeadings = Array.from(
              headingElementsRef.value.values()
            )
              .map((entry) => entry.target as HTMLElement)
              .sort(
                (a, b) => headings.value.indexOf(a) - headings.value.indexOf(b)
              );

            if (visibleHeadings.length) {
              active.value = visibleHeadings[0];
            }
          },
          { rootMargin: "0px 0px -40% 0px" }
        );

        newHeadings.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
      }
    },
    { immediate: true }
  );
</script>
