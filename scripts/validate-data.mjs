import { readFileSync } from "node:fs";

const requiredStringFields = [
  "id",
  "slug",
  "brand",
  "name",
  "originalName",
  "family",
  "gender",
  "nosetimeRating",
  "oneLine",
];

const styleCategories = ["seasons", "occasions", "schools", "olfactive", "performance"];
const perfumes = JSON.parse(readFileSync(new URL("../src/data/perfumes.json", import.meta.url), "utf8"));
const errors = [];
const slugs = new Set();

if (perfumes.length !== 30) {
  errors.push(`Expected 30 perfumes, found ${perfumes.length}.`);
}

for (const perfume of perfumes) {
  const label = perfume.slug || perfume.id || "unknown perfume";

  for (const field of requiredStringFields) {
    if (typeof perfume[field] !== "string" || perfume[field].trim() === "") {
      errors.push(`${label}: missing ${field}.`);
    }
  }

  if (slugs.has(perfume.slug)) {
    errors.push(`${label}: duplicate slug.`);
  }
  slugs.add(perfume.slug);

  for (const noteLevel of ["top", "middle", "base"]) {
    if (!Array.isArray(perfume.notes?.[noteLevel]) || perfume.notes[noteLevel].length === 0) {
      errors.push(`${label}: missing notes.${noteLevel}.`);
    }
  }

  for (const field of ["mainIngredients", "freeTags"]) {
    if (!Array.isArray(perfume[field]) || perfume[field].length === 0) {
      errors.push(`${label}: missing ${field}.`);
    }
  }

  for (const category of styleCategories) {
    if (!Array.isArray(perfume.styleTags?.[category]) || perfume.styleTags[category].length === 0) {
      errors.push(`${label}: missing styleTags.${category}.`);
    }
  }

  if (!Array.isArray(perfume.visual?.palette) || perfume.visual.palette.length !== 4) {
    errors.push(`${label}: visual.palette must contain 4 colors.`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${perfumes.length} perfume records.`);
