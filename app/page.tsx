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
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bed, Bath, DollarSign, Search, Loader } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/system/navbar";

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

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (priceFilter === "" || listing.price <= parseInt(priceFilter))
  );

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
      console.log(data);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-lg pt-4 font-semibold text-center">
          Available Listings
        </h1>
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
          {fetchLoading ? (
            <Card className="flex flex-col">
              <Skeleton className="h-48 w-full object-cover" />
              <CardHeader>
                <Skeleton className="h-5" />
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-[70%]" />
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center"></div>
                  <div className="flex items-center"></div>
                  <div className="flex items-center"></div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Skeleton className="h-8" />
              </CardFooter>
            </Card>
          ) : (
            <>
              {filteredListings.map((listing) => (
                <Link href={`/listing/${listing.id}`} key={listing.id}>
                  <Card key={listing.id} className="flex flex-col">
                    <img
                      src={`${process.env
                        .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/storage/${
                        listing.img[0]
                      }`}
                      alt={listing.title}
                      className="h-48 w-full object-cover"
                    />
                    <CardHeader>
                      <CardTitle>{listing.title}</CardTitle>
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
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
