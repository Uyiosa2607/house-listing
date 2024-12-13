/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  LogOut,
  LayoutDashboard,
  Edit2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface User {
  name: string;
  role: boolean;
  email: string;
  phone: string;
  id: string;
  img: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  async function getUser() {
    const supabase = createClient();
    const id = (await supabase.auth.getUser()).data?.user?.id;
    try {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", id)
        .single();
      if (!error) {
        setUser(data);
        console.log("user data:", data);
        return;
      }
    } catch (error) {
      return console.log(error);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (!error) return router.push("/login");
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEditing(false);
    console.log("Profile updated:", user);
  };

  //   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = event.target;
  //     setUser((prevUser) => ({ ...prevUser, [name]: value }));
  //   };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white">
        <div className="container flex items-center justify-between px-4 py-4">
          <ArrowLeft onClick={() => router.back()} />
          <Link href="/">
            <h1 className="text-base text-center font-medium">Profile</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-48 w-full object-cover md:w-48"
                src={`${
                  process.env.NEXT_PUBLIC_SUPABASE_URL
                }/storage/v1/object/public/storage/${
                  user?.img
                }?${Date.now().toString()}`}
                alt={user?.name}
              />
            </div>
            <div className="p-8 w-full">
              <div className="flex justify-between items-start">
                <h2 className="text-base font-semibold text-slate-800">
                  My Profile
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-slate-700 font-medium text-sm"
                  >
                    Name
                  </Label>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 text-slate-400 mr-2" />
                    {isEditing ? (
                      <Input
                        id="name"
                        name="name"
                        value={user?.name}
                        className="flex-grow"
                      />
                    ) : (
                      <span className="text-slate-800 text-sm font-normal">
                        {user?.name}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-700">
                    Email
                  </Label>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 text-slate-400 mr-2" />
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={user?.email}
                        className="flex-grow"
                      />
                    ) : (
                      <span className="text-slate-800 text-sm">
                        {user?.email}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-slate-700 text-sm font-medium"
                  >
                    Phone
                  </Label>
                  <div className="flex items-center mt-1">
                    <Phone className="h-4 w-4 text-slate-400 mr-2" />
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={user?.phone}
                        className="flex-grow"
                      />
                    ) : (
                      <span className="text-slate-800 text-sm">
                        {user?.phone}
                      </span>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Save Changes
                  </Button>
                )}
              </form>
              <div className="mt-6 flex space-x-4">
                <Button
                  size={"sm"}
                  className="flex-1 bg-red-500 hover:bg-coral-600 text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
                {user?.role ? (
                  <Link href="/dashboard" className="flex-1">
                    <Button
                      size={"sm"}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <LayoutDashboard className="h-5 w-5 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
