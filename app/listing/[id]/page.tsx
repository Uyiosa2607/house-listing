/* eslint-disable @next/next/no-img-element */
"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bed, Bath, ArrowLeft, ArrowRight, MapPin, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  author_id: string;
  img: string[];
  location: string;
}

interface Realtor {
  name: string;
  img: string;
  phone: string;
  email: string;
}

export default function ListingDetails({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Listing | null>(null);
  const [realtor, setRealtor] = useState<Realtor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { id } = params;
  const baseImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/`;
  const router = useRouter();

  const fetchRealtor = async (author_id: string) => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", author_id)
        .single();
      if (!error) {
        setRealtor(data);
      }
    } catch (err) {
      console.error("Unable to fetch realtor details:", err);
    }
  };

  const fetchPropertyDetails = async (id: string) => {
    const supabase = createClient();
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("listing")
        .select()
        .eq("id", id)
        .single();
      if (!error) {
        setProperty(data);
        fetchRealtor(data.author_id);
      }
    } catch (err) {
      console.error("Error fetching property details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyDetails(id);
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      property && prevIndex === property.img.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      property && prevIndex === 0 ? property.img.length - 1 : prevIndex - 1
    );
  };

  if (loading)
    return (
      <main className="min-w-screen min-h-screen flex items-center justify-center">
        <Loader className="w-5 h-5 animate-spin" />
      </main>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <h1 className="text-base font-semibold">Listing Details</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image Carousel */}
          <div>
            <div className="relative h-96 bg-slate-300 rounded-lg overflow-hidden">
              <img
                src={`${baseImageUrl}${property?.img[currentImageIndex]}`}
                alt={property?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-4 flex justify-between px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-75"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <Badge className="bg-black bg-opacity-75 text-white">
                  {currentImageIndex + 1} / {property?.img.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-75"
                >
                  <ArrowRight className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Listing Details */}
          <div>
            <h2 className="text-2xl font-semibold">{property?.title}</h2>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <p className="text-sm font-medium text-slate-600">
                {property?.location}
              </p>
            </div>
            <div className="mt-4 text-lg font-bold text-indigo-600">
              ${property?.price.toLocaleString()}
            </div>
            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-2">
                <Bed className="h-6 w-6" />
                {property?.bedrooms} Beds
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-6 w-6" />
                {property?.bathrooms} Baths
              </div>
            </div>

            {/* Contact Realtor Section */}
            {realtor && (
              <div className="mt-8 p-4 border border-slate-200 rounded-lg shadow-sm bg-white">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">
                  Contact Realtor
                </h3>
                <div className="flex items-center gap-4">
                  <img
                    src={`${baseImageUrl}${realtor.img}`}
                    alt={realtor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-base font-medium text-slate-800">
                      {realtor.name}
                    </p>
                    <p className="text-sm text-slate-600">{realtor.phone}</p>
                    <p className="text-sm text-slate-600">{realtor.email}</p>
                  </div>
                </div>
                <div className="mt-4 space-x-2">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Call
                  </Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Email
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
