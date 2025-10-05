import { twMerge } from "~/utils/twMerge";

type ConditionsType<T> = {
  /**
   * Conditional type for styling based on the given style object's keys.
   */
  [K in keyof T]?: keyof T[K] extends "true" | "false"
    ? keyof T[K] | boolean
    : keyof T[K];
};

function styles(base: string | string[]): (additional?: string) => string;

function styles<T extends Record<string, Record<string, string>>>(
  base: string | string[],
  styleObj: T
): (conditions?: ConditionsType<T>, additional?: string) => string;

function styles<T extends Record<string, Record<string, string>>>(
  base: string | string[],
  styleObj: T,
  combinations: Record<string, string>
): (conditions?: ConditionsType<T>, additional?: string) => string;

/**
 * Overloaded function definition for `styles`.
 * This function accepts a base set of Tailwind classes and optionally a style object and combinations.
 * It returns a function that generates a string of Tailwind classes based on given conditions.
 *
 * @param {string | string[]} base - The base Tailwind classes.
 * @returns {(additional?: string) => string} - A function that accepts an optional additional class string.
 *
 * @overload
 * @param {string | string[]} base - The base Tailwind classes.
 * @param {T} styleObj - The style object with conditions.
 * @returns {(conditions?: ConditionsType<T>, additional?: string) => string} - A function that accepts an optional conditions object and an additional class string.
 *
 * @overload
 * @param {string | string[]} base - The base Tailwind classes.
 * @param {T} styleObj - The style object with conditions.
 * @param {Record<string, string>} combinations - A record of class combinations for specific condition pairs.
 * @returns {(conditions?: ConditionsType<T>, additional?: string) => string} - A function that accepts an optional conditions object and an additional class string.
 */
function styles<T extends Record<string, Record<string, string>>>(
  base: string | string[],
  styleObj?: T,
  combinations?: Record<string, string>
):
  | ((conditions?: ConditionsType<T>, additional?: string) => string)
  | ((additional?: string) => string) {
  if (styleObj === undefined) {
    // return (additional?: string) =>
    //   Array.isArray(base)
    //     ? base.join(" ")
    //     : base + (additional ? ` ${additional}` : "");
    return (additional?: string) =>
      twMerge(
        Array.isArray(base)
          ? base.join(" ")
          : base + (additional ? ` ${additional}` : "")
      );
  }

  return (conditions?: ConditionsType<T>, additional?: string) => {
    let result = Array.isArray(base) ? base.join(" ") : base;
    const combinationClasses: string[] = [];

    for (const [key, value] of Object.entries(conditions ?? {})) {
      if (styleObj[key as keyof T] && value !== undefined) {
        const formattedVal = value.toString();
        result += ` ${
          styleObj[key as keyof T][formattedVal as keyof T[keyof T]]
        }`;
      }
    }

    if (combinations && conditions) {
      for (const [combinationKey, combinationValue] of Object.entries(
        combinations
      )) {
        const conditionPairs = combinationKey.split("+").map((condition) => {
          const [conditionKey, conditionValue] = condition.split(".");
          return { conditionKey, conditionValue };
        });

        const isCombinationSatisfied = conditionPairs.every(
          ({ conditionKey, conditionValue }) =>
            conditions[conditionKey] &&
            conditions[conditionKey]?.toString() === conditionValue
        );

        if (isCombinationSatisfied) {
          combinationClasses.push(combinationValue);
        }
      }

      if (combinationClasses.length > 0) {
        result += ` ${combinationClasses.join(" ")}`;
      }
    }

    result = result.trim();

    return twMerge((result += additional ? ` ${additional}` : "").trim());
    // return (result += additional ? ` ${additional}` : "").trim();
  };
}

export default styles;
