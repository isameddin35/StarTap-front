import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownToLine, FileText, Pencil, Upload } from "lucide-react";

interface Profile {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  cvUrl?: string;
  cvFileName?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draftProfile, setDraftProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
      setDraftProfile(data);
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!draftProfile) return;
    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: draftProfile.firstName,
          lastName: draftProfile.lastName,
          username: draftProfile.username,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      setProfile(draftProfile);
      setIsEditing(false);
      alert("Profile updated!");
    } catch (err) {
      console.error("Update error", err);
    }
  };

  const handleCancelEdit = () => {
    setDraftProfile(profile);
    setIsEditing(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/files/upload", {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      alert("File uploaded!");
      setFile(null);
      setSelectedFileName("");
      fetchProfile();
    } catch (err) {
      console.error("Upload error", err);
    }
  };

  const getInitials = () => {
    if (!profile) return "?";
    return `${profile.firstName?.charAt(0) ?? ""}${profile.lastName?.charAt(0) ?? ""}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-500">
        No profile found.
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Profil{" "}
            <span className="text-blue-600">Məlumatlarım</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hesab məlumatlarınızı yeniləyin və CV-nizi əlavə edin.
          </p>
        </div>
      </section>

      {/* Personal Info Section */}
      <section className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Şəxsi məlumatlar</h2>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-4 border-gray-200 text-gray-700 hover:bg-gray-50 gap-2"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-4 h-4" />
              Redaktə et
            </Button>
          )}
        </div>
        <Card className="border border-gray-200">
          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Avatar row */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-lg flex-shrink-0">
                {getInitials()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-sm text-gray-500">{profile.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Aktiv
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  İstifadəçi adı <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  value={draftProfile?.username ?? ""}
                  onChange={(e) => draftProfile && setDraftProfile({ ...draftProfile, username: e.target.value })}
                  placeholder="İstifadəçi adınız"
                  disabled={!isEditing}
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-poçt
                </Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="h-11 bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  Ad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={draftProfile?.firstName ?? ""}
                  onChange={(e) => draftProfile && setDraftProfile({ ...draftProfile, firstName: e.target.value })}
                  placeholder="Adınız"
                  disabled={!isEditing}
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Soyad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={draftProfile?.lastName ?? ""}
                  onChange={(e) => draftProfile && setDraftProfile({ ...draftProfile, lastName: e.target.value })}
                  placeholder="Soyadınız"
                  disabled={!isEditing}
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50"
                  onClick={handleCancelEdit}
                >
                  Ləğv et
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdate}
                  className="h-11 px-6 bg-gray-900 text-white hover:bg-gray-800"
                >
                  Yadda saxla
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* CV Section */}
      <section className="max-w-2xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">CV</h2>
        <Card className="border border-gray-200">
          <CardContent className="p-6 md:p-8 space-y-5">
            {/* Current CV */}
            {profile.cvUrl && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile.cvFileName}
                  </p>
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowDownToLine className="w-3 h-3" />
                    CV-ni yüklə
                  </a>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500 mb-3">
                Yeni CV yükləmək üçün faylı seçin (PDF, maks 5MB)
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <label
                  htmlFor="cv-upload"
                  className="flex items-center gap-2 h-11 px-4 rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-white hover:border-blue-400 text-sm text-gray-500 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {selectedFileName || "Fayl seçin"}
                </label>
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFile(e.target.files[0]);
                      setSelectedFileName(e.target.files[0].name);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file}
                  className="h-11 px-6 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40"
                >
                  Yüklə
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ProfilePage;