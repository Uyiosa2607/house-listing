/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/utils/store";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Login from "../login/page";
import imageCompression from "browser-image-compression";
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
import {
  Plus,
  Pencil,
  Trash2,
  Home,
  Upload,
  X,
  Loader2,
  Loader,
  LogOut,
} from "lucide-react";

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

function ImagePreview({
  images,
  onRemove,
  maxImages = 4,
}: {
  images: File[];
  onRemove: (index: number) => void;
  maxImages?: number;
}) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const newPreviews = images
      .slice(0, maxImages)
      .map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach(URL.revokeObjectURL);
    };
  }, [images, maxImages]);

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {previews.map((preview, index) => (
        <div key={preview} className="relative w-16 h-16">
          <Image
            src={preview}
            alt={`Preview ${index + 1}`}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-0 right-0 h-6 w-6"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function StyledImagePicker({
  onChange,
  multiple = true,
  accept = "image/*",
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  accept?: string;
}) {
  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-4 pb-3">
          <Upload className="w-6 h-6 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={onChange}
          multiple={multiple}
          accept={accept}
        />
      </label>
    </div>
  );
}

export default function UserDashboard() {
  const [status, setStatus] = useState<string>("available");
  const [pickedImages, setPickedImages] = useState<File[]>([]);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [newListingImages, setNewListingImages] = useState<File[]>([]);
  const [listingLoading, setListingLoading] = useState<boolean>(false);
  const [listings, setListings] = useState<Listing[]>([]);

  const { fetchUser, userInfo, auth, loading } = useStore();

  const router = useRouter();

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
      console.log(data);
    } catch (error) {
      console.log("an error occurred while trying to fetch data:", error);
    }
  }

  useEffect(() => {
    if (userInfo?.role !== "admin") return router.push("/");
    fetchUser();

    getListing();
  }, [fetchUser]);

  const handleImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFiles = event.target.files;
    if (imageFiles) {
      const filesArray = Array.from(imageFiles);
      setPickedImages((prevImages) =>
        [...prevImages, ...filesArray].slice(0, 4)
      );
    }
  };

  const handleNewListingImages = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const imageFiles = event.target.files;
    if (imageFiles) {
      const filesArray = Array.from(imageFiles);
      setNewListingImages((prevImages) =>
        [...prevImages, ...filesArray].slice(0, 4)
      );
    }
  };

  async function deleteListing(id: string) {
    const supabase = createClient();
    try {
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
        return console.log("error occurred trying to delete listing", error);
      if (listingToDelete.data[0]?.img < 1)
        return console.log("listing deleted!");
      const deleteListingImages = await supabase.storage
        .from("storage")
        .remove(listingToDelete?.data[0]?.img);
      if (deleteListingImages.error)
        return console.log("error deleting images:", deleteListingImages.error);
    } catch (error) {
      console.log("error occurred while deleting listing:", error);
    }
  }

  async function uploadImagesToSupabase(imageFiles: File[]): Promise<string[]> {
    const supabase = createClient();
    const imagePaths: string[] = [];
    for (const file of imageFiles) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);

        const { data, error } = await supabase.storage
          .from("storage")
          .upload(`images/${compressedFile.name}`, compressedFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (error) {
          console.error("Error uploading image:", error.message);
          continue;
        }

        if (data?.path) {
          imagePaths.push(data.path);
        }
      } catch (compressionError) {
        console.error(
          "Error compressing image:",
          (compressionError as Error).message
        );
      }
    }

    return imagePaths;
  }

  async function handleAddListing(event: React.FormEvent<HTMLFormElement>) {
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
      setListingLoading(true);
      const uploadedImages = await uploadImagesToSupabase(newListingImages);
      if (uploadedImages.length < 1)
        return console.log("error uploading images");
      const { data, error } = await supabase
        .from("listing")
        .insert([
          {
            author_id: userInfo?.id,
            title,
            status,
            bedrooms,
            bathrooms,
            price,
            description,
            location,
            img: uploadedImages,
          },
        ])
        .select("*");

      if (error) {
        console.log("Error saving item to the database:", error.message);
        return;
      }

      console.log(data, "Listing added successfully");
    } catch (error) {
      console.log("Unexpected error:", (error as Error).message);
    } finally {
      setListingLoading(false);
    }
  }

  const handleEditListing = (updatedListing: Listing) => {
    setListings(
      listings.map((listing) =>
        listing.id === updatedListing.id ? updatedListing : listing
      )
    );
    setEditingListing(null);
  };

  async function handleLogout() {
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) return router.push("/login");
    } catch (error) {
      console.log(error);
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
      {auth ? (
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
                    <Button
                      size={"sm"}
                      className="bg-blue-900 text-white"
                      onClick={() => router.push("/")}
                    >
                      {" "}
                      <Home
                        size={14}
                        className="mr-1 font-normal text-sm"
                      />{" "}
                      All Listings{" "}
                    </Button>
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
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={userInfo?.email}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" name="phone" type="tel" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="avatar">Profile Picture</Label>
                          <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleImages}
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
              <Card>
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
                            {listing.status} - ${listing.price}/month
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-2">
                          <div className="flex justify-between flex-wrap gap-2 mb-4">
                            {listing.img.map((image, index) => (
                              <div key={index} className="relative w-20 h-20">
                                <img
                                  src={`${process.env
                                    .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/storage/${image}`}
                                  alt={`${listing.title} - Image ${index + 1}`}
                                  className="rounded-md w-[80px] h-[80px] md:h-[100px] md:w-[100px] object-cover"
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
                              <Button
                                size={"sm"}
                                variant="outline"
                                onClick={() => setEditingListing(listing)}
                              >
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Listing</DialogTitle>
                              </DialogHeader>
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  const formData = new FormData(
                                    e.currentTarget
                                  );
                                  if (editingListing) {
                                    handleEditListing({
                                      ...editingListing,
                                      title: formData.get("title") as string,
                                      status: formData.get("status") as
                                        | "available"
                                        | "rented"
                                        | "sold",
                                      price: Number(formData.get("price")),
                                      description: formData.get(
                                        "description"
                                      ) as string,
                                      bedrooms: Number(
                                        formData.get("bedrooms")
                                      ),
                                      bathrooms: Number(
                                        formData.get("bathrooms")
                                      ),
                                    });
                                  }
                                }}
                              >
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                      id="title"
                                      name="title"
                                      defaultValue={editingListing?.title}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                      name="status"
                                      defaultValue={editingListing?.status}
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
                                        <SelectItem value="sold">
                                          Sold
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                      id="price"
                                      name="price"
                                      type="number"
                                      defaultValue={editingListing?.price}
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
                                      defaultValue={editingListing?.description}
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
                                        defaultValue={editingListing?.bedrooms}
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="bathrooms">
                                        Bathrooms
                                      </Label>
                                      <Input
                                        id="bathrooms"
                                        name="bathrooms"
                                        type="number"
                                        defaultValue={editingListing?.bathrooms}
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="images">
                                      Listing Images (Max 4)
                                    </Label>
                                    <StyledImagePicker
                                      onChange={handleImages}
                                    />
                                    <ImagePreview
                                      images={pickedImages}
                                      onRemove={(index) =>
                                        setPickedImages((images) =>
                                          images.filter((_, i) => i !== index)
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="mt-4">
                                  <Button type="submit">Save changes</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size={"sm"}
                            variant="destructive"
                            onClick={() => deleteListing(listing.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="w-4 h-4 mr-2" /> Add New Listing
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Listing</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddListing}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-title">Title</Label>
                            <Input id="new-title" name="title" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-status">Status</Label>
                            <Select
                              onValueChange={(value) => setStatus(value)}
                              name="status"
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">
                                  Available
                                </SelectItem>
                                <SelectItem value="rented">Rented</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-price">Price</Label>
                            <Input
                              id="new-price"
                              name="price"
                              type="number"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-description">Description</Label>
                            <Textarea
                              id="new-description"
                              name="description"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Textarea id="location" name="location" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="new-bedrooms">Bedrooms</Label>
                              <Input
                                id="new-bedrooms"
                                name="bedrooms"
                                type="number"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-bathrooms">Bathrooms</Label>
                              <Input
                                id="new-bathrooms"
                                name="bathrooms"
                                type="number"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-images">
                              Listing Images (Max 4)
                            </Label>
                            <StyledImagePicker
                              onChange={handleNewListingImages}
                            />
                            <ImagePreview
                              images={newListingImages}
                              onRemove={(index) =>
                                setNewListingImages((images) =>
                                  images.filter((_, i) => i !== index)
                                )
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter className="mt-4">
                          <Button disabled={listingLoading} type="submit">
                            Add Listing{" "}
                            {listingLoading ? (
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            ) : null}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ) : (
              <div>
                <p>your listings will appear here</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}
