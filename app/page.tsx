/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Bed,
  Bath,
  DollarSign,
  Search,
  Loader,
  MapPin,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/system/navbar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { Eye, EyeOff } from "lucide-react";
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
// import Link from 'next/link'

type Listing = {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  location: string;
  img: string;
  realtor: {
    id: string;
    name: string;
  };
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle login logic here
    console.log("Login submitted");

    const filteredListings = listings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (priceFilter === "" || listing.price <= parseInt(priceFilter))
    );
  };

  async function getListing() {
    const supabase = createClient();
    const id = (await supabase.auth.getUser()).data.user?.id;
    try {
      if (!id) return;
      setFetchLoading(true);
      const { error, data } = await supabase
        .from("listing")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return console.log(error);
      setListings(data);
    } catch (error) {
      console.log("an error occurred while trying to fetch data:", error);
    } finally {
      setFetchLoading(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    getListing();
  }, []);

  if (loading)
    return (
      <main className="min-w-screen min-h-screen flex items-center justify-center">
        <Loader className="w-5 h-5 animate-spin" />
      </main>
    );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            DreamHome
          </Link>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-indigo-700 rounded-full px-3 py-1">
              <Input
                type="search"
                placeholder="Search for houses..."
                className="bg-transparent border-none text-white placeholder-indigo-300 focus:outline-none"
              />
              <Search className="h-5 w-5 text-indigo-300" />
            </div>
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-indigo-500"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-indigo-500"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Property Types */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">
            Property Types
          </h2>
          <div className="flex flex-wrap gap-4">
            {["Houses", "Apartments", "Villas", "Mansions", "Studios"].map(
              (type) => (
                <Button
                  key={type}
                  variant="outline"
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  {type}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Featured Listings */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800">
            Featured Listings
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200"
              >
                <div className="relative">
                  <img
                    src={`/placeholder.svg?height=200&width=400&text=House+${i}`}
                    alt={`House ${i}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-coral-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    New Listing
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-slate-800">
                    Beautiful House {i}
                  </h3>
                  <div className="flex items-center text-slate-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <p>123 Main St, City</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      $1,234,000
                    </span>
                    <Link href={`/listing/${i}`}>
                      <Button className="bg-coral-500 hover:bg-coral-600 text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/listings">
              <Button
                variant="outline"
                className="text-indigo-600 hover:bg-indigo-50"
              >
                View All Listings <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-slate-300">
                DreamHome is your trusted partner in finding the perfect
                property. With our extensive listings and expert agents, your
                dream home is just a click away.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-slate-300 hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-slate-300 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-slate-300 hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-slate-300 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-slate-300">
                1234 Real Estate Ave
                <br />
                Cityville, State 12345
                <br />
                Phone: (123) 456-7890
                <br />
                Email: info@dreamhome.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center text-slate-300">
            <p>&copy; 2023 DreamHome. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
