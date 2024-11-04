"use client";
import { createClient } from "@/utils/supabase/client";
import { useStore } from "@/utils/store";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";

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
        className="flex flex-col items-center justify-center w-full h-18 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-2 pb-2">
          <Upload className="w-4 h-4 mb-2 text-gray-400" />
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
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

export default function AddListing() {
  const [status, setStatus] = useState<string>("available");
  const [newListingImages, setNewListingImages] = useState<File[]>([]);
  const [listingLoading, setListingLoading] = useState<boolean>(false);

  const { userInfo, fetchUser } = useStore();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center p-4">
      <div className="flex w-full items-start mb-3">
        <Button
          variant={"link"}
          size={"sm"}
          onClick={() => router.push("/dashboard")}
          asChild
        >
          <div className="flex items-center gap-1">
            <ArrowLeft />
            <p>back to dashboard</p>
          </div>
        </Button>
      </div>
      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle className="text-center">Add new listing</CardTitle>
          </CardHeader>

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
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-price">Price</Label>
                <Input id="new-price" name="price" type="number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-description">Description</Label>
                <Input id="new-description" name="description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" required />
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
            </div>

            <div className="space-y-2 mb-3">
              <Label htmlFor="images">Listing Images (Max 4)</Label>
              <StyledImagePicker onChange={handleNewListingImages} />
              <ImagePreview
                images={newListingImages}
                onRemove={(index) =>
                  setNewListingImages((images) =>
                    images.filter((_, i) => i !== index)
                  )
                }
              />
            </div>

            <Button className="w-full" disabled={listingLoading} type="submit">
              Add Listing{" "}
              {listingLoading ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : null}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
