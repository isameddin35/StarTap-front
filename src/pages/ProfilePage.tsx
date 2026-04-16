import React, { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const token = localStorage.getItem("token");
  // GET profile
  const fetchProfile = async () => {
    

    try {
      const res = await fetch("/api/profile/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // PUT update
  const handleUpdate = async () => {
    if (!profile) return;

    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
        }),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      alert("Profile updated!");
    } catch (err) {
      console.error("Update error", err);
    }
  };

  // Upload CV
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/files/upload", {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      alert("File uploaded!");
      fetchProfile(); // refresh
    } catch (err) {
      console.error("Upload error", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>No profile found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profile</h2>

      <div>
        <label>Username:</label>
        <input
          value={profile.username}
          onChange={(e) =>
            setProfile({ ...profile, username: e.target.value })
          }
        />
      </div>

      <div>
        <label>First Name:</label>
        <input
          value={profile.firstName}
          onChange={(e) =>
            setProfile({ ...profile, firstName: e.target.value })
          }
        />
      </div>

      <div>
        <label>Last Name:</label>
        <input
          value={profile.lastName}
          onChange={(e) =>
            setProfile({ ...profile, lastName: e.target.value })
          }
        />
      </div>

      <div>
        <label>Email:</label>
        <input value={profile.email} disabled />
      </div>

      <button onClick={handleUpdate}>Update Profile</button>

      <hr />

      <h3>CV Upload</h3>

      {profile.cvUrl && (
        <div>
          <p>Current CV: {profile.cvFileName}</p>
          <a href={profile.cvUrl} target="_blank" rel="noreferrer">
            Download CV
          </a>
        </div>
      )}

      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button onClick={handleUpload}>Upload CV</button>
    </div>
  );
};

export default ProfilePage;