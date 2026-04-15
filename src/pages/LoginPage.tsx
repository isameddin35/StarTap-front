import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface LoginPageProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function LoginPage({ setIsLoggedIn }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login success:", data);

      console.log("Access token by json");
      console.log(data.accessToken);

      // 🔐 store token if backend returns one
      localStorage.setItem("token", data.accessToken);

      console.log("Access Token by localstorage");
      console.log(localStorage.getItem("token"));

      // update app state
      setIsLoggedIn(true);

      // redirect
      navigate("/");

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border border-gray-200 shadow-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Daxil Olun
          </CardTitle>
          <CardDescription className="text-gray-500">
            StartTap hesabınıza daxil olun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Şifrə
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gray-900 text-white hover:bg-gray-800 font-medium"
            >
              Login
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Hesabınız yoxdur? </span>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Qeydiyyatdan keçin
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
