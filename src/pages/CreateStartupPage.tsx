import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

type StartupRequestDto = {
  name: string;
  tagline: string;
  description: string;
  category: StartupCategory | "";
  stage: StartupStage | "";
  website: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS: { value: StartupCategory; label: string }[] = [
  { value: "SAAS", label: "SaaS" },
  { value: "FINTECH", label: "FinTech" },
  { value: "HEALTHTECH", label: "HealthTech" },
  { value: "EDTECH", label: "EdTech" },
  { value: "ECOMMERCE", label: "E-commerce" },
  { value: "CLEANTECH", label: "CleanTech" },
  { value: "OTHER", label: "Digər" },
];

const STAGE_OPTIONS: { value: StartupStage; label: string }[] = [
  { value: "IDEA", label: "Idea" },
  { value: "PRE_SEED", label: "Pre-seed" },
  { value: "SEED", label: "Seed" },
  { value: "SERIES_A", label: "Series A" },
  { value: "SERIES_B", label: "Series B+" },
];

const EMPTY_FORM: StartupRequestDto = {
  name: "",
  tagline: "",
  description: "",
  category: "",
  stage: "",
  website: "",
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function CreateStartupPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState<StartupRequestDto>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof StartupRequestDto) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/startups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Startup yaradılarkən xəta baş verdi.");

      const created = await res.json();
      navigate(`/startups/${created.id}`);
    } catch (err: any) {
      setError(err.message ?? "Xəta baş verdi.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived preview initials ──────────────────────────────────────────────

  const initials = form.name
    ? form.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : null;

  return (
    <div className="space-y-10 pb-16">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Startup <span className="text-blue-600">əlavə et</span>
          </h1>
          <p className="text-gray-500 text-base">
            Startupunuzu platformaya təqdim edin və istedadlı insanlarla tanış olun.
          </p>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="max-w-2xl mx-auto px-4">
        <Card className="border border-gray-200">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Startup adı <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-3">
                  {/* Live initials preview */}
                  <div className="w-11 h-11 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                    {initials ?? <span className="text-blue-300 text-xs">TS</span>}
                  </div>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="məs. TechStart"
                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white flex-1"
                    required
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <Label htmlFor="tagline" className="text-sm font-medium text-gray-700">
                  Tagline <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tagline"
                  value={form.tagline}
                  onChange={set("tagline")}
                  placeholder="məs. AI-powered analytics for growing teams"
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
                <p className="text-xs text-gray-400">
                  Bir cümlə ilə startupunuzu izah edin.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Təsvir <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={set("description")}
                  placeholder="Startupunuz nə edir, hansı problemi həll edir, hədəf bazarınız kimdir..."
                  className="min-h-[130px] bg-gray-50 border-gray-200 focus:bg-white resize-none"
                  required
                />
              </div>

              {/* Category + Stage (side by side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Kateqoriya <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={set("category")}
                    className="w-full h-11 px-3 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-900"
                    required
                  >
                    <option value="">Kateqoriya seçin</option>
                    {CATEGORY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="stage" className="text-sm font-medium text-gray-700">
                    Mərhələ <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="stage"
                    value={form.stage}
                    onChange={set("stage")}
                    className="w-full h-11 px-3 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-900"
                    required
                  >
                    <option value="">Mərhələ seçin</option>
                    {STAGE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Website */}
              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                  Vebsayt
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={form.website}
                  onChange={set("website")}
                  placeholder="https://yourstartup.com"
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                />
                <p className="text-xs text-gray-400">İstəyə bağlıdır.</p>
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Ləğv et
                </button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-11 px-8 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 gap-2"
                >
                  {submitting ? "Göndərilir..." : "Startup yarat"}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}