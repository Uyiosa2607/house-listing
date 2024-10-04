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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bed, Bath, DollarSign, Search } from "lucide-react";
import Link from "next/link";

type Listing = {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  image: string;
  realtor: {
    id: string;
    name: string;
  };
};

const mockListings: Listing[] = [
  {
    id: "1",
    title: "Modern Apartment in Downtown",
    price: 2000,
    bedrooms: 2,
    bathrooms: 2,
    description: "A beautiful modern apartment in the heart of downtown.",
    image: "/placeholder.svg",
    realtor: { id: "1", name: "John Doe" },
  },
  {
    id: "2",
    title: "Cozy Suburban House",
    price: 1500,
    bedrooms: 3,
    bathrooms: 2,
    description: "A cozy house in a quiet suburban neighborhood.",
    image: "/placeholder.svg",
    realtor: { id: "2", name: "Jane Smith" },
  },
  // Add more mock listings as needed
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("");

  const filteredListings = mockListings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (priceFilter === "" || listing.price <= parseInt(priceFilter))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Available Listings</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any price</SelectItem>
              <SelectItem value="1000">Up to $1000</SelectItem>
              <SelectItem value="2000">Up to $2000</SelectItem>
              <SelectItem value="3000">Up to $3000</SelectItem>
              <SelectItem value="4000">Up to $4000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="flex flex-col">
              <img
                src={listing.image}
                alt={listing.title}
                className="h-48 w-full object-cover"
              />
              <CardHeader>
                <CardTitle>{listing.title}</CardTitle>
                <CardDescription>
                  <Link
                    href={`/realtor/${listing.realtor.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {listing.realtor.name}
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {listing.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span className="text-sm">{listing.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span className="text-sm">{listing.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-sm font-bold">
                      {listing.price}/mo
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
