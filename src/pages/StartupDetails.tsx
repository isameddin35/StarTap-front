import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Check,
  DollarSign,
  ExternalLink,
  Globe,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

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

type OwnerDto = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
};

type VacancyDto = {
  id: number;
  title: string;
  description: string;
  salary: number;
  isActive: boolean;
  createdAt: string;
};

type StartupDto = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  category: StartupCategory;
  stage: StartupStage;
  website: string | null;
  isActive: boolean;
  createdAt: string;
  owner: OwnerDto;
  vacancies: VacancyDto[];
};

type DraftStartup = {
  name: string;
  tagline: string;
  description: string;
  category: StartupCategory;
  stage: StartupStage;
  website: string;
  isActive: boolean;
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("az-AZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const getInitials = (name: string) =>
  name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??";

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

// ── Component ──────────────────────────────────────────────────────────────────

export default function StartupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [startup, setStartup] = useState<StartupDto | null>(null);
  const [vacancies, setVacancies] = useState<VacancyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<DraftStartup>({
    name: "",
    tagline: "",
    description: "",
    category: "SAAS",
    stage: "IDEA",
    website: "",
    isActive: true,
  });

  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const [startupRes, profileRes, vacanciesRes] = await Promise.all([
          fetch(`/api/startups/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/profile/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/startups/${id}/vacancies`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!startupRes.ok) throw new Error("Failed to fetch startup");

        const startupData: StartupDto = await startupRes.json();
        setStartup(startupData);

        setDraft({
          name: startupData.name,
          tagline: startupData.tagline ?? "",
          description: startupData.description ?? "",
          category: startupData.category,
          stage: startupData.stage,
          website: startupData.website ?? "",
          isActive: startupData.isActive,
        });

        // ✅ owner check
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setIsOwner(profile.id === startupData.owner?.id);
        }

        // ✅ vacancies (NEW)
        if (vacanciesRes.ok) {
          const vacanciesData = await vacanciesRes.json();
          setVacancies(vacanciesData);
        }



      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, token]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/startups/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated: StartupDto = await res.json();
      setStartup(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    if (!startup) return;
    setDraft({
      name: startup.name,
      tagline: startup.tagline ?? "",
      description: startup.description ?? "",
      category: startup.category,
      stage: startup.stage,
      website: startup.website ?? "",
      isActive: startup.isActive,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/startups/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async () => {
    if (!startup) return;
    try {
      const res = await fetch(`/api/startups/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...startup, isActive: !startup.isActive }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      const updated: StartupDto = await res.json();
      setStartup(updated);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Guards ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-500">
        Yüklənir...
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-500">
        Startap tapılmadı.
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-10 pb-16">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-5">

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Bütün startaplar
          </button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Logo + name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-semibold text-xl flex-shrink-0">
                {getInitials(isEditing ? draft.name : startup.name)}
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Startap adı</Label>
                      <Input
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        className="h-11 bg-white border-gray-300 focus:bg-white w-72"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Tagline</Label>
                      <Input
                        value={draft.tagline}
                        onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                        className="h-9 bg-white border-gray-300 focus:bg-white w-72 text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {startup.name}
                    </h1>
                    {startup.tagline && (
                      <p className="text-base text-gray-500 mt-1">{startup.tagline}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Website */}
            {!isEditing && startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline flex-shrink-0"
              >
                <Globe className="w-4 h-4" />
                Vebsayt
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${startup.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block ${startup.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
              />
              {startup.isActive ? "Aktiv" : "Deaktiv"}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
              {CATEGORY_LABELS[startup.category] ?? startup.category}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
              {STAGE_LABELS[startup.stage] ?? startup.stage}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
              {formatDate(startup.createdAt)}
            </span>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-start">

          {/* ── Left column ── */}
          <div className="space-y-5">

            {/* Description */}
            <Card className="border border-gray-200">
              <CardContent className="p-6 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Startap haqqında
                </p>
                {isEditing ? (
                  <Textarea
                    value={draft.description}
                    onChange={(e) =>
                      setDraft({ ...draft, description: e.target.value })
                    }
                    className="min-h-[160px] bg-gray-50 border-gray-200 focus:bg-white"
                  />
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {startup.description || (
                      <span className="text-gray-400 italic">Təsvir əlavə edilməyib.</span>
                    )}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Edit mode save / cancel */}
            {isEditing && (
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 gap-2"
                  onClick={handleCancelEdit}
                >
                  <X className="w-4 h-4" />
                  Ləğv et
                </Button>
                <Button
                  className="h-11 px-6 bg-gray-900 text-white hover:bg-gray-800 gap-2"
                  onClick={handleSave}
                >
                  <Check className="w-4 h-4" />
                  Yadda saxla
                </Button>
              </div>
            )}

            {/* Vacancies list */}
            {vacancies && vacancies.length > 0 && (
              <Card className="border border-gray-200">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Vakansiyalar
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                      <Briefcase className="w-3 h-3" />
                      {vacancies.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {vacancies.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => navigate(`/vacancies/${v.id}`)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-300 hover:bg-white transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-100 border border-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {v.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            ${v.salary.toLocaleString()} / ay
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                              }`}
                          >
                            {v.isActive ? "Aktiv" : "Deaktiv"}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {vacancies.length === 0 && (
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">
                    Vakansiyalar
                  </p>
                  <p className="text-sm text-gray-400 italic">
                    Hələ heç bir vakansiya əlavə edilməyib.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* Owner actions / visitor view */}
            <Card className="border border-gray-200">
              <CardContent className="p-5 space-y-3">
                {isOwner ? (
                  <>
                    {/* Active toggle */}
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-gray-600">Aktiv status</span>
                      <button
                        onClick={handleToggleActive}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${startup.isActive ? "bg-gray-900" : "bg-gray-200"
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${startup.isActive ? "translate-x-6" : "translate-x-1"
                            }`}
                        />
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-2">


                      {/* ✅ NEW BUTTON */}
                      <Button
                        className="w-full h-11 bg-blue-600 text-white hover:bg-blue-700 gap-2"
                        onClick={() => navigate(`/startups/${startup.id}/vacancies/create`)}
                      >
                        <Briefcase className="w-4 h-4" />
                        Vakansiya yarat
                      </Button>

                      {!isEditing && (
                        <Button
                          className="w-full h-11 bg-gray-900 text-white hover:bg-gray-800 gap-2"
                          onClick={() => setIsEditing(true)}
                        >
                          <Pencil className="w-4 h-4" />
                          Redaktə et
                        </Button>
                      )}
                      {!deleteConfirm ? (
                        <Button
                          variant="outline"
                          className="w-full h-11 border-red-200 text-red-600 hover:bg-red-50 gap-2"
                          onClick={() => setDeleteConfirm(true)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Sil
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-center text-gray-500">
                            Silməyə əminsiniz?
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 h-10 border-gray-200 text-gray-600 hover:bg-gray-50"
                              onClick={() => setDeleteConfirm(false)}
                            >
                              Xeyr
                            </Button>
                            <Button
                              className="flex-1 h-10 bg-red-600 text-white hover:bg-red-700"
                              onClick={handleDelete}
                            >
                              Bəli, sil
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-1 text-center text-sm text-gray-400">
                    Bu startapun sahibi deyilsiniz.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Details card */}
            <Card className="border border-gray-200">
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">
                  Məlumatlar
                </p>

                {/* Category */}
                <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500 flex-1">Kateqoriya</span>
                  {isEditing ? (
                    <select
                      value={draft.category}
                      onChange={(e) =>
                        setDraft({ ...draft, category: e.target.value as StartupCategory })
                      }
                      className="text-sm text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">
                      {CATEGORY_LABELS[startup.category] ?? startup.category}
                    </span>
                  )}
                </div>

                {/* Stage */}
                <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500 flex-1">Mərhələ</span>
                  {isEditing ? (
                    <select
                      value={draft.stage}
                      onChange={(e) =>
                        setDraft({ ...draft, stage: e.target.value as StartupStage })
                      }
                      className="text-sm text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      {Object.entries(STAGE_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">
                      {STAGE_LABELS[startup.stage] ?? startup.stage}
                    </span>
                  )}
                </div>

                {/* Website */}
                <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500 flex-1">Vebsayt</span>
                  {isEditing ? (
                    <Input
                      type="url"
                      value={draft.website}
                      onChange={(e) => setDraft({ ...draft, website: e.target.value })}
                      placeholder="https://..."
                      className="h-8 w-36 text-sm bg-gray-50 border-gray-200 focus:bg-white"
                    />
                  ) : startup.website ? (
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      Link
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </div>

                {/* Created at */}
                <div className="flex items-center gap-3 py-2.5">
                  <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500 flex-1">Yaradıldı</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(startup.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Owner card */}
            <Card className="border border-gray-200">
              <CardContent className="p-5 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Sahibkar
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
                    {getInitials(startup.owner?.firstname ?? "")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {startup.owner?.firstname + " " + startup.owner?.lastname}
                    </p>
                    <p className="text-xs text-gray-450 truncate">
                      {startup.owner?.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}