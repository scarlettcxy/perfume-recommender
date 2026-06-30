import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Leaf,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import perfumesData from "./data/perfumes.json";
import { familyOptions, styleCategoryLabels, styleTaxonomy } from "./data/taxonomy";
import type { FilterState, Perfume, RankedPerfume, StyleCategory } from "./types";
import { emptyFilters, rankPerfumes } from "./utils/recommendation";
import "./styles.css";

const perfumes = perfumesData as Perfume[];
const styleCategories = Object.keys(styleTaxonomy) as StyleCategory[];

interface RouteState {
  view: "home" | "search" | "detail";
  filters: FilterState;
  slug?: string;
  returnHash?: string;
}

function App() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const updateRoute = () => setRoute(getRoute());
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  const activePerfume = route.slug
    ? perfumes.find((perfume) => perfume.slug === route.slug)
    : undefined;

  return (
    <main className="app-shell">
      {route.view === "detail" && activePerfume ? (
        <DetailPage perfume={activePerfume} backHref={route.returnHash ?? "#/"} />
      ) : route.view === "search" ? (
        <SearchResultsPage filters={route.filters} />
      ) : (
        <HomePage initialFilters={route.filters} />
      )}
    </main>
  );
}

function HomePage({ initialFilters }: { initialFilters: FilterState }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const options = useFilterOptions();
  const activeCount = getActiveCount(filters);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.hash = buildSearchHash(filters);
  }

  return (
    <>
      <Topbar subtitle={`${perfumes.length} 款香水`} />

      <section className="home-page">
        <div className="home-title">
          <p className="eyebrow">Prototype</p>
          <h1>气味索引</h1>
        </div>

        <form className="search-form" onSubmit={submitSearch}>
          <div className="dropdown-grid">
            <DropdownMenu
              id="ingredients"
              label="主要香材"
              options={options.ingredients}
              selected={filters.ingredients}
              isOpen={openMenu === "ingredients"}
              onOpenChange={setOpenMenu}
              onToggle={(value) =>
                setFilters((current) => ({
                  ...current,
                  ingredients: toggleValue(current.ingredients, value),
                }))
              }
            />

            <DropdownMenu
              id="families"
              label="香调分类"
              options={options.families}
              selected={filters.families}
              isOpen={openMenu === "families"}
              onOpenChange={setOpenMenu}
              onToggle={(value) =>
                setFilters((current) => ({
                  ...current,
                  families: toggleValue(current.families, value),
                }))
              }
            />

            {styleCategories.map((category) => (
              <DropdownMenu
                key={category}
                id={category}
                label={styleCategoryLabels[category]}
                options={styleTaxonomy[category]}
                selected={filters.styleTags}
                isOpen={openMenu === category}
                onOpenChange={setOpenMenu}
                onToggle={(value) =>
                  setFilters((current) => ({
                    ...current,
                    styleTags: toggleValue(current.styleTags, value),
                  }))
                }
              />
            ))}
          </div>

          <div className="form-actions">
            <button className="primary-button" type="submit">
              <Search size={18} />
              搜索香水
            </button>
            {activeCount > 0 ? (
              <button className="text-button" type="button" onClick={() => setFilters(emptyFilters)}>
                <RotateCcw size={16} />
                重置
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </>
  );
}

function SearchResultsPage({ filters }: { filters: FilterState }) {
  const rankedPerfumes = useMemo(() => rankPerfumes(perfumes, filters), [filters]);
  const activeLabels = getActiveLabels(filters);
  const fromHash = buildSearchHash(filters);

  return (
    <>
      <Topbar subtitle="搜索结果">
        <a className="back-link" href={buildHomeHash(filters)}>
          <ArrowLeft size={17} />
          调整筛选
        </a>
      </Topbar>

      <section className="results-page" aria-live="polite">
        <div className="results-head">
          <div>
            <p className="eyebrow">Results</p>
            <h1>{rankedPerfumes.length} 款匹配</h1>
          </div>
          <Search size={22} />
        </div>

        <div className="active-filter-row">
          {activeLabels.length > 0 ? (
            activeLabels.map((label) => <span key={label}>{label}</span>)
          ) : (
            <span>全部香水</span>
          )}
        </div>

        {rankedPerfumes.length > 0 ? (
          <div className="result-grid">
            {rankedPerfumes.map((result) => (
              <PerfumeCard key={result.perfume.id} result={result} fromHash={fromHash} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Leaf size={28} />
            <h2>暂无匹配</h2>
            <p>减少筛选条件后再试。</p>
          </div>
        )}
      </section>
    </>
  );
}

function DetailPage({ perfume, backHref }: { perfume: Perfume; backHref: string }) {
  return (
    <>
      <Topbar subtitle="详情">
        <a className="back-link" href={backHref}>
          <ArrowLeft size={17} />
          返回
        </a>
      </Topbar>

      <article className="detail-page">
        <section className="detail-hero">
          <ScentVisual perfume={perfume} size="large" />
          <div className="detail-title">
            <p className="eyebrow">{perfume.brand}</p>
            <h1>{perfume.name}</h1>
            <p>{perfume.originalName}</p>
            <strong>{perfume.oneLine}</strong>
          </div>
        </section>

        <section className="detail-layout">
          <div className="detail-section meta-strip">
            <InfoPill label="香调" value={perfume.family} />
            <InfoPill label="定位" value={perfume.gender} />
            <InfoPill label="香水时代评分" value={perfume.nosetimeRating} />
          </div>

          <div className="detail-section">
            <h2>前中后调</h2>
            <NoteBlock label="前调" values={perfume.notes.top} />
            <NoteBlock label="中调" values={perfume.notes.middle} />
            <NoteBlock label="后调" values={perfume.notes.base} />
          </div>

          <div className="detail-section">
            <h2>主要香材</h2>
            <TagCloud values={perfume.mainIngredients} tone="solid" />
          </div>

          <div className="detail-section">
            <h2>风格标签</h2>
            <div className="style-detail-grid">
              {styleCategories.map((category) => (
                <div key={category}>
                  <h3>{styleCategoryLabels[category]}</h3>
                  <TagCloud values={perfume.styleTags[category]} />
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h2>自由标签</h2>
            <TagCloud values={perfume.freeTags} />
          </div>
        </section>
      </article>
    </>
  );
}

function Topbar({ subtitle, children }: { subtitle: string; children?: React.ReactNode }) {
  return (
    <header className="topbar">
      <a className="brand" href="#/" aria-label="气味索引首页">
        <span className="brand-mark">
          <Sparkles size={18} strokeWidth={1.8} />
        </span>
        <span>
          <strong>气味索引</strong>
          <small>{subtitle}</small>
        </span>
      </a>
      {children}
    </header>
  );
}

function DropdownMenu({
  id,
  label,
  options,
  selected,
  isOpen,
  onOpenChange,
  onToggle,
}: {
  id: string;
  label: string;
  options: string[];
  selected: string[];
  isOpen: boolean;
  onOpenChange: (id: string | null) => void;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="select-field">
      <span className="select-label">{label}</span>
      <button
        className="select-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        onClick={() => onOpenChange(isOpen ? null : id)}
      >
        <span>{formatSelected(selected)}</span>
        <ChevronDown size={18} />
      </button>

      {isOpen ? (
        <div className="select-menu" id={`${id}-menu`}>
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                className="select-option"
                data-selected={isSelected}
                type="button"
                key={option}
                onClick={() => onToggle(option)}
              >
                <span>{option}</span>
                {isSelected ? <Check size={16} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function PerfumeCard({ result, fromHash }: { result: RankedPerfume; fromHash?: string }) {
  const { perfume, score, matched } = result;
  const detailHref = `#/perfume/${perfume.slug}${fromHash ? `?from=${encodeURIComponent(fromHash)}` : ""}`;

  return (
    <a className="result-card" href={detailHref}>
      <ScentVisual perfume={perfume} />
      <div className="card-copy">
        <div className="card-heading">
          <span>{perfume.brand}</span>
          <ChevronRight size={17} />
        </div>
        <h3>{perfume.name}</h3>
        <p>{perfume.oneLine}</p>
        <div className="card-meta">
          <span>{perfume.family}</span>
          <span>{perfume.gender}</span>
          {score > 0 ? <span>{score} 分匹配</span> : null}
        </div>
        {matched.length > 0 ? <TagCloud values={matched.slice(0, 4)} compact /> : null}
      </div>
    </a>
  );
}

function ScentVisual({ perfume, size = "card" }: { perfume: Perfume; size?: "card" | "large" }) {
  const style = {
    "--tone-1": perfume.visual.palette[0],
    "--tone-2": perfume.visual.palette[1],
    "--tone-3": perfume.visual.palette[2],
    "--tone-4": perfume.visual.palette[3],
    "--accent": perfume.visual.accent,
  } as React.CSSProperties;

  return (
    <div className={`scent-visual ${size}`} data-texture={perfume.visual.texture} style={style} aria-hidden="true">
      <span>{perfume.mainIngredients[0]}</span>
      <span>{perfume.mainIngredients[1]}</span>
      <span>{perfume.mainIngredients[2]}</span>
    </div>
  );
}

function NoteBlock({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="note-block">
      <h3>{label}</h3>
      <TagCloud values={values} />
    </div>
  );
}

function TagCloud({
  values,
  compact = false,
  tone = "soft",
}: {
  values: string[];
  compact?: boolean;
  tone?: "soft" | "solid";
}) {
  return (
    <div className={`tag-cloud ${compact ? "compact" : ""}`} data-tone={tone}>
      {values.map((value) => (
        <span key={value}>{value}</span>
      ))}
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function useFilterOptions() {
  return useMemo(
    () => ({
      ingredients: uniqueSorted(perfumes.flatMap((perfume) => perfume.mainIngredients)),
      families: uniqueSorted([...familyOptions, ...perfumes.map((perfume) => perfume.family)]),
    }),
    [],
  );
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function formatSelected(selected: string[]) {
  if (selected.length === 0) {
    return "不限";
  }

  if (selected.length === 1) {
    return selected[0];
  }

  return `${selected[0]} +${selected.length - 1}`;
}

function getActiveCount(filters: FilterState) {
  return filters.ingredients.length + filters.families.length + filters.styleTags.length;
}

function getActiveLabels(filters: FilterState) {
  return [...filters.ingredients, ...filters.families, ...filters.styleTags];
}

function buildSearchHash(filters: FilterState) {
  const query = serializeFilters(filters);
  return `#/search${query ? `?${query}` : ""}`;
}

function buildHomeHash(filters: FilterState) {
  const query = serializeFilters(filters);
  return `#/${query ? `?${query}` : ""}`;
}

function serializeFilters(filters: FilterState) {
  const params = new URLSearchParams();
  filters.ingredients.forEach((value) => params.append("ingredient", value));
  filters.families.forEach((value) => params.append("family", value));
  filters.styleTags.forEach((value) => params.append("tag", value));
  return params.toString();
}

function parseFilters(query = ""): FilterState {
  const params = new URLSearchParams(query);
  return {
    ingredients: params.getAll("ingredient"),
    families: params.getAll("family"),
    styleTags: params.getAll("tag"),
  };
}

function getRoute(): RouteState {
  const hash = window.location.hash || "#/";
  const body = hash.slice(1) || "/";

  if (body.startsWith("/perfume/")) {
    const [slugPart, query = ""] = body.replace("/perfume/", "").split("?");
    const returnHash = new URLSearchParams(query).get("from");

    return {
      view: "detail",
      slug: decodeURIComponent(slugPart),
      filters: emptyFilters,
      returnHash: returnHash?.startsWith("#/") ? returnHash : "#/",
    };
  }

  if (body.startsWith("/search")) {
    const query = body.split("?")[1] ?? "";
    return {
      view: "search",
      filters: parseFilters(query),
    };
  }

  return {
    view: "home",
    filters: parseFilters(body.split("?")[1] ?? ""),
  };
}

export default App;
