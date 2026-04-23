import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ──────────────────────────────────────────────────────────────────────

type StartupCategory =
  | "SAAS"
  | "FINTECH"
  | "HEALTHTECH"
  | "EDTECH"
  | "ECOMMERCE"
  | "CLEANTECH"
  | "OTHER";

type StartupStage =
  | "IDEA"
  | "PRE_SEED"
  | "SEED"
  | "SERIES_A"
  | "SERIES_B";

type StartupDto = {
  id: number;
  name: string;
  tagline: string;
  category: StartupCategory;
  stage: StartupStage;
  isActive: boolean;
  createdAt: string;
  owner: {
    id: number;
    username: string;
  };
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<StartupCategory, string> = {
  SAAS: "SaaS",
  FINTECH: "FinTech",
  HEALTHTECH: "HealthTech",
  EDTECH: "EdTech",
  ECOMMERCE: "E-commerce",
  CLEANTECH: "CleanTech",
  OTHER: "Digər",
};

const STAGE_LABELS: Record<StartupStage, string> = {
  IDEA: "Idea",
  PRE_SEED: "Pre-seed",
  SEED: "Seed",
  SERIES_A: "Series A",
  SERIES_B: "Series B+",
};

const LOGO_COLORS: { bg: string; border: string; text: string }[] = [
  { bg: "bg-blue-100",   border: "border-blue-200",   text: "text-blue-700"   },
  { bg: "bg-yellow-100", border: "border-yellow-200", text: "text-yellow-800" },
  { bg: "bg-green-100",  border: "border-green-200",  text: "text-green-700"  },
  { bg: "bg-purple-100", border: "border-purple-200", text: "text-purple-700" },
  { bg: "bg-pink-100",   border: "border-pink-200",   text: "text-pink-700"   },
  { bg: "bg-orange-100", border: "border-orange-200", text: "text-orange-700" },
  { bg: "bg-teal-100",   border: "border-teal-200",   text: "text-teal-700"   },
  { bg: "bg-indigo-100", border: "border-indigo-200", text: "text-indigo-700" },
];

const getLogoColor = (id: number) => LOGO_COLORS[id % LOGO_COLORS.length];

const getInitials = (name: string) =>
  name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

const truncate = (text: string, max: number) =>
  text?.length > max ? text.slice(0, max) + "…" : text ?? "";

const PAGE_SIZE = 9;

// ── Component ──────────────────────────────────────────────────────────────────

export default function StartupsListingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [startups, setStartups] = useState<StartupDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<StartupCategory | "">("");
  const [stageFilter, setStageFilter] = useState<StartupStage | "">("");

  // Pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await fetch("/api/startups", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch startups");
        const data: StartupDto[] = await res.json();
        setStartups(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, stageFilter]);

  // ── Derived state ──────────────────────────────────────────────────────────

  const filtered = startups.filter((s) => {
    const matchesSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !categoryFilter || s.category === categoryFilter;
    const matchesStage = !stageFilter || s.stage === stageFilter;

    return matchesSearch && matchesCategory && matchesStage;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="pb-16">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-4 border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Bütün <span className="text-blue-600">startuplar</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
              Platformadakı bütün startupları kəşf edin
            </p>
          </div>
          {isLoggedIn && (
            <Button
              onClick={() => navigate("/startups/create")}
              className="bg-gray-900 text-white hover:bg-gray-800 gap-2 h-10"
            >
              <Plus className="w-4 h-4" />
              Startup əlavə et
            </Button>
          )}
        </div>
      </section>

      {/* ── Body ── */}
      <section className="max-w-5xl mx-auto px-4 mt-6">

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Startup axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 border border-gray-200 rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as StartupCategory | "")}
            className="h-10 px-3 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Bütün kateqoriyalar</option>
            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          {/* Stage filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as StartupStage | "")}
            className="h-10 px-3 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Bütün mərhələlər</option>
            {Object.entries(STAGE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          {/* Result count */}
          <span className="text-sm text-gray-400 whitespace-nowrap">
            {filtered.length} startup
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-16 text-sm text-gray-400">Yüklənir...</div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-gray-400 text-sm">Heç bir startup tapılmadı.</p>
            {isLoggedIn && (
              <Button
                onClick={() => navigate("/startups/create")}
                variant="outline"
                className="border-gray-200 text-gray-600 hover:bg-gray-50 gap-1.5"
              >
                <Plus className="w-4 h-4" />
                İlk startupunuzu əlavə edin
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((startup) => {
              const color = getLogoColor(startup.id);
              return (
                <Link to={`/startups/${startup.id}`} key={startup.id}>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer h-full flex flex-col">

                    {/* Card top */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center font-semibold text-sm flex-shrink-0 ${color.bg} ${color.border} ${color.text}`}
                      >
                        {getInitials(startup.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-sm">
                          {startup.name}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">
                          {startup.owner?.username}
                        </p>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-3 line-clamp-2">
                      {truncate(startup.tagline ?? "", 90)}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {startup.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 font-medium">
                            {CATEGORY_LABELS[startup.category] ?? startup.category}
                          </span>
                        )}
                        {startup.stage && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 font-medium">
                            {STAGE_LABELS[startup.stage] ?? startup.stage}
                          </span>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                          startup.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full inline-block ${
                            startup.isActive ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        {startup.isActive ? "Aktiv" : "Deaktiv"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </section>
    </div>
  );
}


