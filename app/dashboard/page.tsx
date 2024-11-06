/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/utils/store";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Home,
  Loader,
  LogOut,
  Loader2,
} from "lucide-react";
import Link from "next/link";

type Listing = {
  id: string;
  title: string;
  status: "available" | "rented" | "sold";
  price: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  img: string[];
  location: string;
};

export default function UserDashboard() {
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("available");

  const { fetchUser, userInfo, loading } = useStore();

  const router = useRouter();
  const { toast } = useToast();

  async function getListing() {
    const supabase = createClient();
    const id = (await supabase.auth.getUser()).data.user?.id;
    try {
      const { error, data } = await supabase
        .from("listing")
        .select("*")
        .eq("author_id", id)
        .order("created_at", { ascending: false });
      if (error) return console.log(error);
      setListings(data);
    } catch (error) {
      console.log("an error occurred while trying to fetch data:", error);
    }
  }

  useEffect(() => {
    fetchUser();
    getListing();
  }, [fetchUser]);

  async function handleEditListing(
    event: React.FormEvent<HTMLFormElement>,
    id: string
  ) {
    event.preventDefault();
    const supabase = createClient();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const bathrooms = Number(formData.get("bathrooms"));
    const bedrooms = Number(formData.get("bedrooms"));
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;

    try {
      setEditLoading(true);
      const { error } = await supabase
        .from("listing")
        .update([
          {
            title,
            status,
            bedrooms,
            bathrooms,
            price,
            description,
            location,
          },
        ])
        .eq("id", id);

      if (error)
        return toast({
          variant: "destructive",
          description: "unable to edit listing please refresh page try again",
        });
      return toast({
        description: "Listing details updated",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEditLoading(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) return router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteListing(id: string) {
    const supabase = createClient();
    try {
      setDeleteLoading(true);
      const listingToDelete = await supabase
        .from("listing")
        .select("*")
        .eq("id", id);
      if (listingToDelete.error)
        return console.log("No listing found with provided id");
      const { error } = await supabase
        .from("listing")
        .delete()
        .eq("id", listingToDelete?.data[0]?.id);
      if (error)
        return toast({
          variant: "destructive",
          description: "error occurred trying to delete listing",
        });
      const deleteListingImages = await supabase.storage
        .from("storage")
        .remove(listingToDelete?.data[0]?.img);
      if (deleteListingImages.error)
        return console.log("error deleting images:", deleteListingImages.error);
      return toast({
        description: "listing has been deleted",
      });
    } catch (error) {
      console.log(error);
      return toast({
        variant: "destructive",
        description: "an error occurred, please try again",
      });
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading)
    return (
      <main className="min-w-screen min-h-screen flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" />
      </main>
    );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    User Dashboard
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Manage your profile and listings
                  </CardDescription>
                </div>
                <Button
                  onClick={handleLogout}
                  size={"sm"}
                  variant={"destructive"}
                >
                  Logout <LogOut size={20} className="ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${userInfo?.img}`}
                  />
                  <AvatarFallback>
                    {userInfo?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{userInfo?.name}</h2>
                  <p className="text-sm text-gray-500">{userInfo?.email}</p>
                </div>
              </div>
              <Dialog>
                <div className="flex  items-center justify-between">
                  <DialogTrigger asChild>
                    <Button size={"sm"}>Update Profile</Button>
                  </DialogTrigger>
                  <Link href="/">
                    <Button size={"sm"} className="bg-blue-900 text-white">
                      {" "}
                      <Home
                        size={14}
                        className="mr-1 font-normal text-sm"
                      />{" "}
                      All Listings{" "}
                    </Button>
                  </Link>
                </div>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here.
                    </DialogDescription>
                  </DialogHeader>
                  <form>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          defaultValue={userInfo?.name}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          defaultValue={userInfo?.phone}
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {listings ? (
            <Card className="overflow-y-scroll">
              <CardHeader className="p-2">
                <CardTitle className="text-base text-center font-bold">
                  Your Listings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <Card className="p-2" key={listing.id}>
                      <CardHeader className="p-2">
                        <CardTitle className="text-sm">
                          {listing.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {listing.status} - ${listing.price}/year
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-2 px-1">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {listing.img.map((image, index) => (
                            <div
                              key={index}
                              className="relative mb-1 w-20 lg:w-[200px] lg:h-[140px] h-20"
                            >
                              <img
                                src={`${process.env
                                  .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/storage/${image}`}
                                alt={`${listing.title} - Image ${index + 1}`}
                                className="rounded-md w-[100px] lg:w-[200px] h-[80px] lg:h-[140px] object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-sm">{listing.description}</p>
                        <p className="mt-2 text-sm">
                          Bedrooms: {listing.bedrooms}, Bathrooms:{" "}
                          {listing.bathrooms}
                        </p>
                      </CardContent>
                      <CardFooter className="flex p-2 mt-4 justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size={"sm"} variant="outline">
                              <Pencil className="w-4 h-4 mr-2" /> Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Listing</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={(event) =>
                                handleEditListing(event, listing?.id)
                              }
                            >
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="title">Title</Label>
                                  <Input
                                    id="title"
                                    name="title"
                                    defaultValue={listing?.title}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="status">Status</Label>
                                  <Select
                                    name="status"
                                    defaultValue={listing?.status}
                                    onValueChange={(value) => setStatus(value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="available">
                                        Available
                                      </SelectItem>
                                      <SelectItem value="rented">
                                        Rented
                                      </SelectItem>
                                      <SelectItem value="sold">Sold</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="price">Price</Label>
                                  <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    defaultValue={listing?.price}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="description">
                                    Description
                                  </Label>
                                  <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={listing?.description}
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="bedrooms">Bedrooms</Label>
                                    <Input
                                      id="bedrooms"
                                      name="bedrooms"
                                      type="number"
                                      defaultValue={listing?.bedrooms}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="bathrooms">Bathrooms</Label>
                                    <Input
                                      id="bathrooms"
                                      name="bathrooms"
                                      type="number"
                                      defaultValue={listing?.bathrooms}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <DialogFooter className="mt-4">
                                <Button disabled={editLoading} type="submit">
                                  Save changes
                                  {editLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin ml-1" />
                                  ) : null}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          disabled={deleteLoading}
                          size={"sm"}
                          variant="destructive"
                          onClick={() => deleteListing(listing.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete{" "}
                          {deleteLoading ? (
                            <Loader2 className="w-3 animate-spin ml-1 h-3" />
                          ) : null}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/add-listing">
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add New Listing
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ) : (
            <div>
              <p>your listings will appear here</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
