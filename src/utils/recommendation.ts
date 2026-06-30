import type { FilterState, Perfume, RankedPerfume, StyleCategory } from "../types";

const styleCategories: StyleCategory[] = [
  "seasons",
  "occasions",
  "schools",
  "olfactive",
  "performance",
];

export const emptyFilters: FilterState = {
  ingredients: [],
  families: [],
  styleTags: [],
};

export function rankPerfumes(perfumes: Perfume[], filters: FilterState): RankedPerfume[] {
  const hasActiveFilters =
    filters.ingredients.length > 0 ||
    filters.families.length > 0 ||
    filters.styleTags.length > 0;

  return perfumes
    .map((perfume) => scorePerfume(perfume, filters))
    .filter((result) => !hasActiveFilters || result.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.perfume.name.localeCompare(right.perfume.name, "zh-CN");
    });
}

export function getAllStyleTags(perfume: Perfume): string[] {
  return styleCategories.flatMap((category) => perfume.styleTags[category]);
}

function scorePerfume(perfume: Perfume, filters: FilterState): RankedPerfume {
  const matched = new Set<string>();
  let score = 0;

  for (const ingredient of filters.ingredients) {
    if (perfume.mainIngredients.includes(ingredient)) {
      score += 5;
      matched.add(ingredient);
    }
  }

  for (const family of filters.families) {
    if (perfume.family === family) {
      score += 3;
      matched.add(family);
    }
  }

  const perfumeStyleTags = getAllStyleTags(perfume);
  for (const tag of filters.styleTags) {
    if (perfumeStyleTags.includes(tag)) {
      score += 2;
      matched.add(tag);
    }
  }

  return {
    perfume,
    score,
    matched: Array.from(matched),
  };
}
