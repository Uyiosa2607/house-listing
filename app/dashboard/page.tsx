"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Home, Plus, Pencil, Trash2, Upload, X } from "lucide-react";

type Listing = {
  id: string;
  title: string;
  status: "available" | "rented" | "sold";
  price: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
};

type User = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

export default function UserDashboard() {
  const [user, setUser] = useState<User>({
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    avatar: "/placeholder.svg",
  });
  const [listings, setListings] = useState<Listing[]>([
    {
      id: "1",
      title: "Modern Apartment in Downtown",
      status: "available",
      price: 2000,
      description: "A beautiful modern apartment in the heart of downtown.",
      bedrooms: 2,
      bathrooms: 2,
      images: [
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
      ],
    },
    {
      id: "2",
      title: "Cozy Suburban House",
      status: "rented",
      price: 1500,
      description: "A cozy house in a quiet suburban neighborhood.",
      bedrooms: 3,
      bathrooms: 2,
      images: [
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
      ],
    },
  ]);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [newListingImages, setNewListingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleAddListing = (newListing: Omit<Listing, "id">) => {
    const id = Date.now().toString();
    setListings([...listings, { ...newListing, id, images: newListingImages }]);
    setNewListingImages([]);
  };

  const handleEditListing = (updatedListing: Listing) => {
    setListings(
      listings.map((listing) =>
        listing.id === updatedListing.id ? updatedListing : listing
      )
    );
    setEditingListing(null);
  };

  const handleDeleteListing = (id: string) => {
    setListings(listings.filter((listing) => listing.id !== id));
  };

  const handleImageUpload = (
    files: FileList,
    callback: (urls: string[]) => void
  ) => {
    // In a real application, you would upload the files to a server here
    // For this example, we'll just create local URLs
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    callback(urls);
  };

  const removeImage = (index: number, isNewListing: boolean) => {
    if (isNewListing) {
      setNewListingImages(newListingImages.filter((_, i) => i !== index));
    } else if (editingListing) {
      setEditingListing({
        ...editingListing,
        images: editingListing.images.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">User Dashboard</CardTitle>
            <CardDescription>Manage your profile and listings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">{user.phone}</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Update Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleProfileUpdate({
                      name: formData.get("name") as string,
                      email: formData.get("email") as string,
                      phone: formData.get("phone") as string,
                      avatar: user.avatar,
                    });
                  }}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={user.name}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={user.phone}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <Input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload([file], ([url]) =>
                              setUser({ ...user, avatar: url })
                            );
                          }
                        }}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Your Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listings.map((listing) => (
                <Card key={listing.id}>
                  <CardHeader>
                    <CardTitle>{listing.title}</CardTitle>
                    <CardDescription>
                      {listing.status} - ${listing.price}/month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {listing.images.map((image, index) => (
                        <div key={index} className="relative w-24 h-24">
                          <Image
                            src={image}
                            alt={`${listing.title} - Image ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                    <p>{listing.description}</p>
                    <p className="mt-2">
                      Bedrooms: {listing.bedrooms}, Bathrooms:{" "}
                      {listing.bathrooms}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
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
                            const formData = new FormData(e.currentTarget);
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
                                bedrooms: Number(formData.get("bedrooms")),
                                bathrooms: Number(formData.get("bathrooms")),
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
                                  <SelectItem value="rented">Rented</SelectItem>
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
                                defaultValue={editingListing?.price}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
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
                                <Label htmlFor="bathrooms">Bathrooms</Label>
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
                              <Input
                                id="images"
                                name="images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  const files = e.target.files;
                                  if (
                                    files &&
                                    files.length > 0 &&
                                    editingListing
                                  ) {
                                    handleImageUpload(files, (urls) => {
                                      setEditingListing({
                                        ...editingListing,
                                        images: [
                                          ...editingListing.images,
                                          ...urls,
                                        ].slice(0, 4),
                                      });
                                    });
                                  }
                                }}
                              />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {editingListing?.images.map((image, index) => (
                                <div key={index} className="relative w-24 h-24">
                                  <Image
                                    src={image}
                                    alt={`Listing image ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                    onClick={() => removeImage(index, false)}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <DialogFooter className="mt-4">
                            <Button type="submit">Save changes</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteListing(listing.id)}
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleAddListing({
                      title: formData.get("title") as string,
                      status: formData.get("status") as
                        | "available"
                        | "rented"
                        | "sold",
                      price: Number(formData.get("price")),
                      description: formData.get("description") as string,
                      bedrooms: Number(formData.get("bedrooms")),
                      bathrooms: Number(formData.get("bathrooms")),
                      images: newListingImages,
                    });
                  }}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-title">Title</Label>
                      <Input id="new-title" name="title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-status">Status</Label>
                      <Select name="status">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
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
                      <Label htmlFor="new-images">Listing Images (Max 4)</Label>
                      <Input
                        id="new-images"
                        name="images"
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            handleImageUpload(files, (urls) => {
                              setNewListingImages((prevImages) =>
                                [...prevImages, ...urls].slice(0, 4)
                              );
                            });
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" /> Upload Images
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newListingImages.map((image, index) => (
                        <div key={index} className="relative w-24 h-24">
                          <Image
                            src={image}
                            alt={`New listing image ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            onClick={() => removeImage(index, true)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button type="submit">Add Listing</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
