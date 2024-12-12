/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bed,
  Bath,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader,
  CircleUser,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

import { Square, Heart, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface Listing {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  img: string[];
  author_id: string;
  location: string;
  realtor: {
    id: string;
    name: string;
    phone: string;
    email: string;
    img: string;
  };
}

interface Author {
  name: string;
  img: string;
  phone: string;
  email: string;
}

export default function ListingDetails({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;

  const router = useRouter();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [listing, setListing] = useState<Listing | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);

  async function getRealtor(id: string) {
    const supabase = createClient();
    try {
      const { error, data } = await supabase
        .from("users")
        .select("*")
        .eq("id", id);
      if (!error) {
        setAuthor(data[0]);
        return;
      }
      return console.log("error fetching author:", error);
    } catch (error) {
      console.log("an error occured:", error);
    }
  }

  async function getListing(id: string) {
    const supabase = createClient();

    try {
      const { error, data } = await supabase
        .from("listing")
        .select("*")
        .eq("id", id);
      if (!error) {
        setListing(data[0]);
        getRealtor(data[0].author_id);
      }
    } catch (error) {
      console.log("An error occurred trying to fetch data:", error);
    }
  }

  useEffect(() => {
    getListing(id);
  }, [id]);
  const nextImage = () => {
    if (listing) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === listing.img.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (listing) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? listing.img.length - 1 : prevIndex - 1
      );
    }
  };

  // if (!listing) {
  //   return (
  //     <main className="min-w-screen min-h-screen flex items-center justify-center">
  //       <Loader className="w-7 h-7 animate-spin" />
  //     </main>
  //   );
  // }

  const listing = {
    id: params.id,
    title: "Spacious Family Home",
    address: "123 Main St, Anytown, USA",
    price: 1234000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    description:
      "This beautiful family home features an open floor plan, gourmet kitchen, and a large backyard perfect for entertaining. Recent upgrades include new hardwood floors and a state-of-the-art HVAC system.",
    images: [
      "/placeholder.svg?height=600&width=800&text=House+Image+1",
      "/placeholder.svg?height=600&width=800&text=House+Image+2",
      "/placeholder.svg?height=600&width=800&text=House+Image+3",
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-indigo-500"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Listing Details</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-indigo-500"
          >
            <Share2 className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div>
            <div className="relative h-96 bg-slate-300 rounded-lg overflow-hidden">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute bottom-2 right-2 bg-slate-800 bg-opacity-75">
                1 / {listing.images.length}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {listing.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="h-24 bg-slate-300 rounded-lg overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`${listing.title} - Image ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                {listing.title}
              </h2>
              <p className="text-xl text-slate-600">{listing.address}</p>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-4xl font-bold text-indigo-600">
                ${listing.price.toLocaleString()}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="text-coral-500 hover:text-coral-600 hover:bg-coral-50"
              >
                <Heart className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex justify-between text-slate-600">
              <div className="flex items-center">
                <Bed className="h-6 w-6 mr-2" />
                <span>{listing.bedrooms} Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-6 w-6 mr-2" />
                <span>{listing.bathrooms} Baths</span>
              </div>
              <div className="flex items-center">
                <Square className="h-6 w-6 mr-2" />
                <span>{listing.area} sqft</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Description
              </h3>
              <p className="text-slate-600">{listing.description}</p>
            </div>

            <div className="flex space-x-4">
              <Button className="flex-1 bg-coral-500 hover:bg-coral-600 text-white">
                Contact Agent
              </Button>
              <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                Schedule a Tour
              </Button>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Location
              </h3>
              <div className="h-64 bg-slate-300 rounded-lg flex items-center justify-center">
                <MapPin className="h-12 w-12 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
