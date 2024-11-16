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
  const [listing, setListing] = useState<Listing | null>(null);
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

  if (!listing) {
    return (
      <main className="min-w-screen min-h-screen flex items-center justify-center">
        <Loader className="w-7 h-7 animate-spin" />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex pt-3 items-center justify-between">
          <p
            onClick={() => router.back()}
            className="flex text-sm flex-1 items-center text-blue-500 hover:underline cursor-pointer"
          >
            <ArrowLeft className="h-4 text-base font-semibold w-4 mr-2" />
            Back to Listings
          </p>
          <h1 className="text-sm w-[80%] justify-end pr-1 flex truncate capitalize font-medium flex-1 text-center">
            {listing.title}
          </h1>
        </div>

        <Dialog>
          <div className="relative mx-auto">
            <DialogTrigger asChild>
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${listing.img[currentImageIndex]}`}
                alt={`Listing image ${currentImageIndex + 1}`}
                className="min-w-full  h-auto object-cover rounded-lg"
              />
            </DialogTrigger>

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
          <DialogContent className="p-2">
            <DialogTitle></DialogTitle>
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${listing.img[currentImageIndex]}`}
              alt={`Listing image ${currentImageIndex + 1}`}
              className="w-full h-auto object-contain"
            />
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <Card className="p-2">
            <CardHeader className="flex p-2 flex-row items-center justify-center pb-2">
              <Bed className="h-4 w-4 mr-2" />
              <CardTitle>{listing.bedrooms}</CardTitle>
            </CardHeader>
            <CardDescription>Bedrooms</CardDescription>
          </Card>
          <Card className="p-2">
            <CardHeader className="flex p-2 flex-row items-center justify-center pb-2">
              <Bath className="h-4 w-4 mr-2" />
              <CardTitle>{listing.bathrooms}</CardTitle>
            </CardHeader>
            <CardDescription>Bathrooms</CardDescription>
          </Card>

          <Card className="p-2">
            <CardHeader className="flex flex-row p-2 items-center justify-center pb-2">
              <DollarSign className="h-4 w-4 mr-2" />
              <CardTitle>{listing.price}</CardTitle>
            </CardHeader>
            <CardDescription>Per Month</CardDescription>
          </Card>
        </div>

        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-2">
            <Card className="p-2">
              <CardHeader className="p-2">
                <CardTitle className="text-base font-semibold">
                  About this property
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <p className="text-sm">{listing.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="location" className="mt-2">
            <Card>
              <CardHeader className="p-2">
                <CardTitle className="text-base">Location</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                <p className="text-sm">{listing.location}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-base">Contact Realtor</CardTitle>
          </CardHeader>
          <CardContent className="flex py-2 gap-2 items-center">
            <img
              src={`${
                process.env.NEXT_PUBLIC_SUPABASE_URL
              }/storage/v1/object/public/storage/${
                author?.img
              }?${Date.now().toString()}`}
              alt={author?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="mt-1">
              <div className="flex items-center gap-1">
                <CircleUser className="w-3 h-3 text-sm" />{" "}
                <h3 className="text-medium text-sm">{author?.name}</h3>
              </div>
              <p className="flex text-xs items-center">
                <Phone className="h-3 w-3 text-sm mr-1" />
                {author?.phone}
              </p>
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                <span className="text-sm">{author?.email}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-2 pb-6">
            <Button
              className="bg-green-700 text-white"
              onClick={() =>
                window.open(`https://wa.me/${author?.phone}`, "_blank")
              }
            >
              Contact Agent
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
