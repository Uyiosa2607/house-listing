/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
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
import Link from "next/link";

type Listing = {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  images: string[];
  features: string[];
  address: string;
  realtor: {
    id: string;
    name: string;
    phone: string;
    email: string;
    image: string;
  };
};

const mockListing: Listing = {
  id: "1",
  title: "Luxurious Downtown Penthouse",
  price: 5000,
  bedrooms: 3,
  bathrooms: 2.5,
  squareFeet: 2000,
  description:
    "Experience urban living at its finest in this stunning penthouse apartment. Featuring breathtaking city views, high-end finishes, and an open concept layout perfect for entertaining. This luxurious home offers the best of city life with all the comforts you desire.",
  images: [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ],
  features: [
    "Floor-to-ceiling windows",
    "Gourmet kitchen with top-of-the-line appliances",
    "Private terrace",
    "In-unit laundry",
    "Central air conditioning",
    "Hardwood floors throughout",
    "24/7 concierge service",
    "Fitness center and pool access",
  ],
  address: "123 Main St, Cityville, State 12345",
  realtor: {
    id: "1",
    name: "Jane Smith",
    phone: "(555) 123-4567",
    email: "jane.smith@realestate.com",
    image: "/placeholder.svg",
  },
};

export default function ListingDetails() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === mockListing.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? mockListing.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/listings"
            className="flex items-center text-blue-500 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Link>
          <h1 className="text-3xl font-bold text-center">
            {mockListing.title}
          </h1>
        </div>

        <div className="relative">
          <img
            src={mockListing.images[currentImageIndex]}
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
            {currentImageIndex + 1} / {mockListing.images.length}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <Card>
            <CardHeader className="flex flex-row items-center justify-center pb-2">
              <Bed className="h-4 w-4 mr-2" />
              <CardTitle>{mockListing.bedrooms}</CardTitle>
            </CardHeader>
            <CardDescription>Bedrooms</CardDescription>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-center pb-2">
              <Bath className="h-4 w-4 mr-2" />
              <CardTitle>{mockListing.bathrooms}</CardTitle>
            </CardHeader>
            <CardDescription>Bathrooms</CardDescription>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-center pb-2">
              <Home className="h-4 w-4 mr-2" />
              <CardTitle>{mockListing.squareFeet}</CardTitle>
            </CardHeader>
            <CardDescription>Sq Ft</CardDescription>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-center pb-2">
              <DollarSign className="h-4 w-4 mr-2" />
              <CardTitle>{mockListing.price}</CardTitle>
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
                <p>{mockListing.description}</p>
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
                  {mockListing.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
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
                <p>{mockListing.address}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Contact Realtor</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <img
              src={mockListing.realtor.image}
              alt={mockListing.realtor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{mockListing.realtor.name}</h3>
              <div className="flex items-center mt-2">
                <Phone className="h-4 w-4 mr-2" />
                <span>{mockListing.realtor.phone}</span>
              </div>
              <div className="flex items-center mt-1">
                <Mail className="h-4 w-4 mr-2" />
                <span>{mockListing.realtor.email}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Contact Realtor</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
