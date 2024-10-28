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
  Home,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Listing {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  img: string[];
  address: string;
  realtor: {
    id: string;
    name: string;
    phone: string;
    email: string;
    img: string;
  };
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
  const [listing, setListing] = useState<Listing | null>(null); // Changed to null

  async function getListing(id: string) {
    const supabase = createClient();

    try {
      const { error, data } = await supabase
        .from("listing")
        .select("*")
        .eq("id", id);
      if (!error && data.length > 0) {
        setListing(data[0]);
        console.log(data[0]);
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

  // Loading state
  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div
            onClick={() => router.back()}
            className="flex items-center text-blue-500 hover:underline cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </div>
          <h1 className="text-3xl font-bold text-center">{listing.title}</h1>
        </div>

        <div className="relative">
          <img
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${listing.img[currentImageIndex]}`}
            alt={`Listing image ${currentImageIndex + 1}`}
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            {currentImageIndex + 1} / {listing.img.length}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <Card>
            <CardHeader className="flex flex-row items-center justify-center pb-2">
              <Bed className="h-4 w-4 mr-2" />
              <CardTitle>{listing.bedrooms}</CardTitle>
            </CardHeader>
            <CardDescription>Bedrooms</CardDescription>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-center pb-2">
              <Bath className="h-4 w-4 mr-2" />
              <CardTitle>{listing.bathrooms}</CardTitle>
            </CardHeader>
            <CardDescription>Bathrooms</CardDescription>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-center pb-2">
              <Home className="h-4 w-4 mr-2" />
              <CardTitle>{listing.squareFeet}</CardTitle>
            </CardHeader>
            <CardDescription>Sq Ft</CardDescription>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-center pb-2">
              <DollarSign className="h-4 w-4 mr-2" />
              <CardTitle>{listing.price}</CardTitle>
            </CardHeader>
            <CardDescription>Per Month</CardDescription>
          </Card>
        </div>

        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>About this property</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{listing.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="features" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {/* {listing.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))} */}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="location" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{listing.address}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Contact Realtor</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            {/* <img
              src={listing.realtor.img}
              alt={listing.realtor.name}
              className="w-16 h-16 rounded-full object-cover"
            /> */}
            <div>
              {/* <h3 className="font-semibold">{listing.realtor.name}</h3> */}
              <div className="flex items-center mt-2">
                <Phone className="h-4 w-4 mr-2" />
                {/* <span>{listing.realtor.phone}</span> */}
              </div>
              <div className="flex items-center mt-1">
                <Mail className="h-4 w-4 mr-2" />
                {/* <span>{listing.realtor.email}</span> */}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {/* <Button
              onClick={() =>
                window.open(`mailto:${listing.realtor.email}`, "_blank")
              }
            >
              Email Realtor
            </Button> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
