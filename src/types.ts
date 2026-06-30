export type GenderPosition = "女香" | "男香" | "中性香";

export type StyleCategory =
  | "seasons"
  | "occasions"
  | "schools"
  | "olfactive"
  | "performance";

export type StyleTags = Record<StyleCategory, string[]>;

export interface ScentVisual {
  palette: string[];
  accent: string;
  texture: "petal" | "wood" | "citrus" | "amber" | "green" | "marine" | "smoke";
}

export interface Perfume {
  id: string;
  slug: string;
  brand: string;
  name: string;
  originalName: string;
  family: string;
  gender: GenderPosition;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  nosetimeRating: string;
  mainIngredients: string[];
  styleTags: StyleTags;
  freeTags: string[];
  oneLine: string;
  visual: ScentVisual;
}

export interface FilterState {
  ingredients: string[];
  families: string[];
  styleTags: string[];
}

export interface RankedPerfume {
  perfume: Perfume;
  score: number;
  matched: string[];
}
