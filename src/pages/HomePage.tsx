import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  Lightbulb,
  Rocket,
  Users,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type StartupDto = {
  id: number;
  name: string;
  tagline: string;
  category: string;
  stage: string;
  isActive: boolean;
  createdAt: string;
  owner: {
    id: number;
    firstname: string;
    lastname: string;
  };
};

type VacancyDto = {
  id: number;
  title: string;
  description: string;
  salary: number;
  isActive: boolean;
  createdAt: string;
  startup: {
    id: number;
    name: string;
    category: string;
  };
};

// ── Static data ────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Rocket,
    title: "Startapınızı paylaşın",
    description: "Öz startapınızı dünyaya təqdim edin",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Lightbulb,
    title: "Yeni ideyalar kəşf edin",
    description: "İnnovativ layihələri kəşf edin və öyrənin",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Users,
    title: "Cəmiyyətlə əlaqə qurun",
    description: "Tərəfdaşlar və investorlarla əlaqə saxlayın",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

const truncate = (text: string, max: number) =>
  text?.length > max ? text.slice(0, max) + "…" : text;

// ── Component ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [startups, setStartups] = useState<StartupDto[]>([]);
  const [vacancies, setVacancies] = useState<VacancyDto[]>([]);
  const [loadingStartups, setLoadingStartups] = useState(true);
  const [loadingVacancies, setLoadingVacancies] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await fetch("/api/startups");
        if (!res.ok) throw new Error("Failed to fetch startups");
        const data = await res.json();
        setStartups(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStartups(false);
      }
    };

    const fetchVacancies = async () => {
      try {
        const res = await fetch("/api/vacancies");
        if (!res.ok) throw new Error("Failed to fetch vacancies");
        const data = await res.json();

        setVacancies(data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoadingVacancies(false);
      }
    };

    fetchStartups();
    fetchVacancies();
  }, []);

  return (
    <div className="space-y-20 pb-20">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Startapınızı paylaşın,
            <br />
            <span className="text-blue-600">yeni ideyalar kəşf edin</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            StartTap — innovasiya və startaplar üçün platformadır. Öz startapınızı
            paylaşın, yeni ideyalar kəşf edin və cəmiyyətlə əlaqə qurun.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {isLoggedIn ? (
              <>
                <Button
                  onClick={() => navigate("/startups/create")}
                  className="bg-gray-900 text-white hover:bg-gray-800 px-7 py-5 text-base font-medium"
                >
                  Startap əlavə et
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => navigate("/vacancies")}
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 px-7 py-5 text-base font-medium"
                >
                  Vakansiyalara bax
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/register")}
                  className="bg-gray-900 text-white hover:bg-gray-800 px-7 py-5 text-base font-medium"
                >
                  Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 px-7 py-5 text-base font-medium"
                >
                  Daxil ol
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={i} className="border border-gray-200 hover:shadow-sm transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className={`mx-auto w-11 h-11 flex items-center justify-center rounded-full ${f.bg}`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Latest startups ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Son startaplar</h2>
          <Link
            to="/startups"
            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            Hamısını gör
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingStartups ? (
          <div className="text-sm text-gray-400 py-8 text-center">Yüklənir...</div>
        ) : startups.length === 0 ? (
          <div className="text-sm text-gray-400 py-8 text-center">
            Hələ heç bir startap əlavə edilməyib.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {startups.slice(0, 6).map((startup) => (
              <Link to={`/startups/${startup.id}`} key={startup.id}>
                <Card className="border border-gray-200 hover:shadow-sm hover:border-gray-300 transition-all cursor-pointer h-full">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                        {getInitials(startup.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {startup.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {startup.owner?.firstname + " " + startup.owner?.lastname}
                        </p>

                      </div>
                    </div>

                    {startup.tagline && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {truncate(startup.tagline, 80)}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
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
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${startup.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {startup.isActive ? "Aktiv" : "Deaktiv"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Latest vacancies ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Son vakansiyalar</h2>
          <Link
            to="/vacancies"
            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            Hamısını gör
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingVacancies ? (
          <div className="text-sm text-gray-400 py-8 text-center">Yüklənir...</div>
        ) : vacancies.length === 0 ? (
          <div className="text-sm text-gray-400 py-8 text-center">
            Hələ heç bir vakansiya əlavə edilməyib.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {vacancies.slice(0, 6).map((vacancy) => (
              <div
                key={vacancy.id}
                onClick={() => navigate(`/vacancies/${vacancy.id}`)}
                className="cursor-pointer"
              >
                <Card className="border border-gray-200 hover:shadow-sm hover:border-gray-300 transition-all cursor-pointer h-full">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {vacancy.title}
                        </h3>
                        <Link
                          to={`/startups/${vacancy.startup?.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-blue-600 hover:underline truncate block"
                        >
                          {vacancy.startup?.name ?? "Naməlum startap"}
                        </Link>
                      </div>
                    </div>

                    {vacancy.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {truncate(vacancy.description, 90)}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${vacancy.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {vacancy.isActive ? "Aktiv" : "Deaktiv"}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${vacancy.salary.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Founder CTA ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-2xl px-8 py-12 text-center space-y-5">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Startapınız var?
          </h2>
          <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
            Startapınızı platformaya əlavə edin, vakansiyalar yerləşdirin və
            istedadlı insanlarla tanış olun.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button
              onClick={() => navigate(isLoggedIn ? "/startups/create" : "/register")}
              className="bg-gray-900 text-white hover:bg-gray-800 px-7 py-5 text-base font-medium"
            >
              Startapımı əlavə et
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {!isLoggedIn && (
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 px-7 py-5 text-base font-medium"
              >
                Daxil ol
              </Button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}