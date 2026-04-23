import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ added
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────

type VacancyRequestDto = {
  title: string;
  description: string;
  salary: string;
};

const EMPTY_FORM: VacancyRequestDto = {
  title: "",
  description: "",
  salary: "",
};

// ── Component ─────────────────────────────────────────────────

export default function CreateVacancyPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get from URL
  const token = localStorage.getItem("token");

  const [form, setForm] = useState<VacancyRequestDto>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (field: keyof VacancyRequestDto) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 🧠 safety check
    if (!id) {
      setError("Startup ID tapılmadı.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/vacancies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          salary: Number(form.salary),
          startupId: Number(id), // ✅ injected automatically
        }),
      });

      if (!res.ok) throw new Error("Vakansiya yaradılarkən xəta baş verdi.");

      const created = await res.json();

      // 🔥 optional: go back to startup page instead
      navigate(`/vacancies/${created.id}`);
      // OR:
      // navigate(`/startups/${startupId}`);

    } catch (err: any) {
      setError(err.message ?? "Xəta baş verdi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Vakansiya <span className="text-green-600">yarat</span>
          </h1>

          <p className="text-gray-500">
            Yeni iş elanı əlavə edin və uyğun namizədləri cəlb edin.
          </p>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="max-w-2xl mx-auto px-4">
        <Card className="border border-gray-200">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title */}
              <div className="space-y-1.5">
                <Label>Vakansiya adı *</Label>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-green-100 border flex items-center justify-center text-green-700">
                    <Briefcase className="w-4 h-4" />
                  </div>

                  <Input
                    value={form.title}
                    onChange={set("title")}
                    placeholder="Frontend Developer"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label>Təsvir *</Label>
                <Textarea
                  value={form.description}
                  onChange={set("description")}
                  required
                />
              </div>

              {/* Salary */}
              <div className="space-y-1.5">
                <Label>Maaş *</Label>
                <Input
                  type="number"
                  value={form.salary}
                  onChange={set("salary")}
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-sm text-gray-500"
                >
                  Ləğv et
                </button>

                <Button type="submit" disabled={submitting}>
                  {submitting ? "Göndərilir..." : "Vakansiya yarat"}
                  {!submitting && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}