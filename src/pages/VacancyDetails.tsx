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
  Pencil,
  Trash2,
  Users,
  X,
} from "lucide-react";

type StartupDto = {
  id: number;
  name: string;
  tagline: string;
  category: string;
  stage: string;
  isActive: boolean;
  owner: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
};

type VacancyDto = {
  id: number;
  title: string;
  description: string;
  salary: number;
  isActive: boolean;
  createdAt: string;
  startup: StartupDto;
};

type ApplicationDto = {
  applicationId: number;
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  appliedAt: string;
};

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

export default function VacancyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [vacancy, setVacancy] = useState<VacancyDto | null>(null);
  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [applied, setApplied] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<{
    title: string;
    description: string;
    salary: number;
    isActive: boolean;
  }>({ title: "", description: "", salary: 0, isActive: true });

  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [vacRes, profileRes] = await Promise.all([
          fetch(`/api/vacancies/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/profile/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!vacRes.ok) throw new Error("Failed to fetch vacancy");
        const data: VacancyDto = await vacRes.json();


        setVacancy(data);
        setDraft({
          title: data.title,
          description: data.description,
          salary: data.salary,
          isActive: data.isActive,
        });

        if (profileRes.ok) {
          const profile = await profileRes.json();
          const owner = data.startup?.owner?.id === profile.id;

          setIsOwner(owner);

          if (owner) {
            const appRes = await fetch(`/api/vacancies/${id}/applications`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (appRes.ok) setApplications(await appRes.json());
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSave = async () => {
    if (!vacancy) return;
    try {
      const res = await fetch(`/api/vacancies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated: VacancyDto = await res.json();
      setVacancy(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    if (!vacancy) return;
    setDraft({
      title: vacancy.title,
      description: vacancy.description,
      salary: vacancy.salary,
      isActive: vacancy.isActive,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/vacancies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async () => {
    try {
      const res = await fetch(`/api/vacancies/${id}/applications`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Apply failed");
      setApplied(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async () => {
    if (!vacancy) return;
    const newActive = !vacancy.isActive;
    try {
      const res = await fetch(`/api/vacancies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...vacancy, isActive: newActive }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      const updated: VacancyDto = await res.json();
      setVacancy(updated);
      setDraft((d) => ({ ...d, isActive: newActive }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-500">
        Yüklənir...
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-500">
        Vakansiya tapılmadı.
      </div>
    );
  }

  const { startup } = vacancy;
  const activeStatus = isEditing ? draft.isActive : vacancy.isActive;

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
            Bütün vakansiyalar
          </button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Startup logo + title */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-semibold text-lg flex-shrink-0">
                {getInitials(startup?.name ?? "?")}
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Vakansiya adı</Label>
                    <Input
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      className="text-base h-11 bg-white border-gray-300 focus:bg-white w-72"
                    />
                  </div>
                ) : (
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    {vacancy.title}
                  </h1>
                )}
                <button
                  onClick={() => navigate(`/startups/${startup?.id}`)}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1"
                >
                  {startup?.name}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Salary */}
            <div className="text-right flex-shrink-0">
              {isEditing ? (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Maaş (USD)</Label>
                  <Input
                    type="number"
                    value={draft.salary}
                    onChange={(e) =>
                      setDraft({ ...draft, salary: Number(e.target.value) })
                    }
                    className="h-11 w-36 text-right bg-white border-gray-300 focus:bg-white"
                  />
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-900">
                    ${vacancy.salary.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">aylıq</p>
                </>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${activeStatus
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block ${activeStatus ? "bg-green-500" : "bg-gray-400"
                  }`}
              />
              {activeStatus ? "Aktiv" : "Deaktiv"}
            </span>
            {startup?.category && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                {startup.category}
              </span>
            )}
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
              {formatDate(vacancy.createdAt)}
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
                  Vakansiya haqqında
                </p>
                {isEditing ? (
                  <Textarea
                    value={draft.description}
                    onChange={(e) =>
                      setDraft({ ...draft, description: e.target.value })
                    }
                    className="min-h-[180px] bg-gray-50 border-gray-200 focus:bg-white"
                  />
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {vacancy.description}
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

            {/* Applications list — owner only */}
            {isOwner && applications.length > 0 && (
              <Card className="border border-gray-200">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Müraciətlər
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                      <Users className="w-3 h-3" />
                      {applications.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {applications.map((app) => (
                      <div
                        key={app.applicationId}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
                          {getInitials(app.firstname)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {app.firstname + " " + app.lastname}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {app.email}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatDate(app.appliedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* Action card */}
            <Card className="border border-gray-200">
              <CardContent className="p-5 space-y-3">
                {isOwner ? (
                  <>
                    {/* Active toggle */}
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-gray-600">Aktiv status</span>
                      <button
                        onClick={handleToggleActive}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${vacancy.isActive ? "bg-gray-900" : "bg-gray-200"
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${vacancy.isActive ? "translate-x-6" : "translate-x-1"
                            }`}
                        />
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-2">
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
                  <>
                    {applied ? (
                      <div className="flex items-center justify-center gap-2 h-11 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Müraciətiniz göndərildi
                      </div>
                    ) : (
                      <Button
                        className="w-full h-11 bg-gray-900 text-white hover:bg-gray-800"
                        onClick={handleApply}
                        disabled={!vacancy.isActive}
                      >
                        Müraciət et
                      </Button>
                    )}
                    {!vacancy.isActive && !applied && (
                      <p className="text-xs text-center text-gray-400">
                        Bu vakansiya artıq aktiv deyil
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Details card */}
            <Card className="border border-gray-200">
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">
                  Məlumatlar
                </p>
                <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500 flex-1">Maaş</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${vacancy.salary.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500 flex-1">Status</span>
                  <span
                    className={`text-sm font-medium ${vacancy.isActive ? "text-green-600" : "text-gray-400"
                      }`}
                  >
                    {vacancy.isActive ? "Aktiv" : "Deaktiv"}
                  </span>
                </div>
                <div className="flex items-center gap-3 py-2.5">
                  <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500 flex-1">Yerləşdirildi</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(vacancy.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Startup card */}
            {startup && (
              <Card className="border border-gray-200">
                <CardContent className="p-5 space-y-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Startup
                  </p>

                  {/* Startup identity */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                      {getInitials(startup.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {startup.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{startup.tagline}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/startups/${startup.id}`)}
                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-0.5 flex-shrink-0"
                    >
                      Profil
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Startup badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {startup.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                        {startup.category}
                      </span>
                    )}
                    {startup.stage && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                        {startup.stage}
                      </span>
                    )}
                  </div>

                  {/* Owner */}
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-400 mb-2">Sahibkar</p>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-semibold flex-shrink-0">
                        {getInitials(startup.owner?.firstname ?? "")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {startup.owner?.firstname + " " + startup.owner?.lastname}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {startup.owner?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}