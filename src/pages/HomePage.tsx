import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, Lightbulb, Users, ArrowRight } from 'lucide-react';

type JobResponseDto = {
  id: number;
  title: string;
  description: string;
  salary: number;
  employer: {
    id: number;
    username: string;
    email: string;
  };
  createdAt: string;
  isActive: boolean;
};



const features = [
  {
    icon: Rocket,
    title: 'Startapınızı Paylaşın',
    description: 'Öz startapınızı dünyaya təqdim edin',
    color: 'text-blue-500',
  },
  {
    icon: Lightbulb,
    title: 'Yeni Ideyalar Keşf Edin',
    description: 'İnnovativ layihələri kəşf edin və öyrənin',
    color: 'text-green-500',
  },
  {
    icon: Users,
    title: 'Cəmiyyətlə Əlaqə Qurun',
    description: 'Tərəfdaşlar və investorlarla əlaqə saxlayın',
    color: 'text-purple-500',
  },
];

// const latestStartups = [
//   {
//     name: 'TechStart',
//     description: 'AI-powered analytics platform',
//     category: 'SaaS',
//     stage: 'Seed',
//   }
// ];



export default function HomePage() {

  const [latestJobs, setLatestJobs] = useState<JobResponseDto[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // console.log(token);

    const fetchStartups = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/jobs", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch startups");
        }

        // console.log(response)
        const data = await response.json();
        console.log(data)
        setLatestJobs(data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchStartups();
  }, []);

  const [formData, setFormData] = useState({
    startupName: '',
    tagline: '',
    description: '',
    category: '',
    founderName: '',
    teamSize: '',
    problem: '',
    solution: '',
    targetMarket: '',
    stage: '',
    fundingAmount: '',
    website: '',
    linkedin: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Startup məlumatları göndərildi!');
    setFormData({
      startupName: '',
      tagline: '',
      description: '',
      category: '',
      founderName: '',
      teamSize: '',
      problem: '',
      solution: '',
      targetMarket: '',
      stage: '',
      fundingAmount: '',
      website: '',
      linkedin: '',
    });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Startupınızı Paylaşın,
            <br />
            <span className="text-blue-600">Yeni Ideyalar Keşf Edin</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            StartTap – innovasiya və startuplar üçün platformadır. Öz startapınızı paylaşın,
            yeni ideyalar kəşf edin və cəmiyyətlə əlaqə qurun.
          </p>
          <Button className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-lg font-medium">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-gray-50`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Startups Section */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Son Startuplar</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {latestJobs.map((job, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5 space-y-3">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                    {job.title?.charAt(0) || "?"}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {job.title}
                    </h3>

                    <span className="text-xs text-gray-500">
                      {job.employer?.username || "Unknown employer"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  {job.description}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${job.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {job.isActive ? "Active" : "Inactive"}
                  </span>

                  <span className="text-xs text-gray-500">
                    ${job.salary}
                  </span>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Add Startup Form Section */}
      <section className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Startupınızı Əlavə Edin</h2>
        <Card className="border border-gray-200">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="startupName" className="text-sm font-medium text-gray-700">
                  Startup Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startupName"
                  name="startupName"
                  placeholder="Startup adınız"
                  value={formData.startupName}
                  onChange={handleInputChange}
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-sm font-medium text-gray-700">
                  Tagline / Short Description <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tagline"
                  name="tagline"
                  placeholder="Qısa təsvir"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Startup haqqında ətraflı məlumat"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[100px] bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Kateqoriya seçin</option>
                  <option value="saas">SaaS</option>
                  <option value="fintech">FinTech</option>
                  <option value="healthtech">HealthTech</option>
                  <option value="edtech">EdTech</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="cleantech">CleanTech</option>
                  <option value="other">Digər</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="founderName" className="text-sm font-medium text-gray-700">
                  Founder Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="founderName"
                  name="founderName"
                  placeholder="Təsisçi adı"
                  value={formData.founderName}
                  onChange={handleInputChange}
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize" className="text-sm font-medium text-gray-700">
                  Team Size <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="teamSize"
                  name="teamSize"
                  placeholder="Komanda ölçüsü (məs: 5-10)"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem" className="text-sm font-medium text-gray-700">
                  Problem – Hansı problemi həll edir? <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="problem"
                  name="problem"
                  placeholder="Həll etdiyiniz problemi təsvir edin"
                  value={formData.problem}
                  onChange={handleInputChange}
                  className="min-h-[80px] bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution" className="text-sm font-medium text-gray-700">
                  Solution – Təklif etdiyiniz həll <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="solution"
                  name="solution"
                  placeholder="Təklif etdiyiniz həlli təsvir edin"
                  value={formData.solution}
                  onChange={handleInputChange}
                  className="min-h-[80px] bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetMarket" className="text-sm font-medium text-gray-700">
                  Target Market – Hədəf bazarınız <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="targetMarket"
                  name="targetMarket"
                  placeholder="Hədəf bazarınızı təsvir edin"
                  value={formData.targetMarket}
                  onChange={handleInputChange}
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage" className="text-sm font-medium text-gray-700">
                  Stage <span className="text-red-500">*</span>
                </Label>
                <select
                  id="stage"
                  name="stage"
                  value={formData.stage}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Mərhələ seçin</option>
                  <option value="idea">Idea</option>
                  <option value="pre-seed">Pre-seed</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b">Series B+</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundingAmount" className="text-sm font-medium text-gray-700">
                  Funding Amount – Toplanmış investisiya (USD)
                </Label>
                <Input
                  id="fundingAmount"
                  name="fundingAmount"
                  placeholder="Məs: $100,000"
                  value={formData.fundingAmount}
                  onChange={handleInputChange}
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://yourstartup.com"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
                  Startup LinkedIn (optional)
                </Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/company/yourstartup"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 font-medium text-base"
              >
                Add Startup
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
