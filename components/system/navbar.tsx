/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useStore } from "@/utils/store";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, UserRoundCog, UserRoundPen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { CardContent, Card, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import Link from "next/link";

type Avatar = {
  url: string;
  file: File | null;
};

export default function Navbar() {
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<Avatar | null>({
    file: null,
    url: "",
  });

  const router = useRouter();

  async function signOut() {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (!error) return router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  const { userInfo, fetchUser, loading } = useStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchUser();
  }, []);

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const imageFile = e.target.files?.[0];
    if (imageFile) {
      setAvatar({
        file: imageFile,
        url: URL.createObjectURL(imageFile),
      });
    }
  }

  async function UploadImage(avatar: Avatar) {
    const supabase = createClient();
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };
    let imageURL;
    try {
      const compressedImage = await imageCompression(avatar.file!, options);
      if (userInfo?.img == null) {
        imageURL = `avatar/${compressedImage.name}`;
      } else {
        imageURL = userInfo?.img;
      }
      const { error, data } = await supabase.storage
        .from("storage")
        .upload(`${imageURL}`, compressedImage, {
          cacheControl: "3600",
          upsert: true,
        });
      if (error) return null;
      return data?.path || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function updateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = createClient();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const phone = formData.get("phone");
    try {
      setEditLoading(true);
      if (avatar?.file === null) {
        const { error } = await supabase
          .from("users")
          .update([
            {
              phone,
              name,
            },
          ])
          .eq("id", userInfo?.id);
        if (error)
          return toast({
            variant: "destructive",
            description: "an error occurred trying to update profile",
          });
        toast({
          description: "Profile updated",
        });
        return router.refresh();
      } else {
        const avatarURL = await UploadImage(avatar!);
        if (avatarURL === null)
          return toast({
            variant: "destructive",
            description: "unable to update profile details please try again",
          });
        const { error } = await supabase
          .from("users")
          .update([
            {
              phone,
              name,
              img: avatarURL,
            },
          ])
          .eq("id", userInfo?.id);
        if (error)
          return toast({
            variant: "destructive",
            description: "an error occurred trying to update profile",
          });
        toast({
          description: "Profile updated",
        });
        return router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setEditLoading(false);
    }
  }

  return (
    <div className="px-2 py-3 flex justify-between items-center">
      <Dialog>
        <DialogTrigger>
          {userInfo?.img === null ? (
            <img
              className="w-9 h-9 rounded-full"
              src={"/default.png"}
              alt="default"
            />
          ) : (
            <>
              {loading ? (
                <Skeleton className="w-11 h-11 rounded-full" />
              ) : (
                <img
                  className="w-9 h-9 object-cover rounded-full"
                  alt={userInfo?.name}
                  src={`${
                    process.env.NEXT_PUBLIC_SUPABASE_URL
                  }/storage/v1/object/public/storage/${
                    userInfo?.img
                  }?${Date.now().toString()}`}
                />
              )}
            </>
          )}
        </DialogTrigger>
        <DialogContent className="p-1 w-[90%] md:w-[500px] rounded-lg">
          <Card>
            <CardHeader>
              <p className="text-lg capitalize font-semibold text-center">
                profile details
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-2 justify-center">
                {userInfo?.img === null ? (
                  <img
                    className="w-20 h-20 rounded-full"
                    src={"/default.png"}
                    alt="default"
                  />
                ) : (
                  <>
                    {loading ? (
                      <Skeleton className="w-11 h-11 rounded-full" />
                    ) : (
                      <img
                        className="w-20 h-20 object-cover rounded-full"
                        alt={userInfo?.name}
                        src={`${
                          process.env.NEXT_PUBLIC_SUPABASE_URL
                        }/storage/v1/object/public/storage/${
                          userInfo?.img
                        }?${Date.now().toString()}`}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="mb-4">
                <p className="text-base capitalize font-medium text-center mb-1">
                  {userInfo?.name}
                </p>
                <p className="text-sm font-medium text-center mb-2">
                  {userInfo?.email}
                </p>
              </div>
              <Dialog>
                <DialogTrigger className="mb-4" asChild>
                  <Button className="w-full text-center" size="sm">
                    <UserRoundPen className="w-3 h-3 mr-1" />
                    Edit profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={updateProfile}>
                    <div className="flex gap-4 items-center mb-4">
                      {avatar?.url ? (
                        <Image
                          className="w-20 h-20 rounded-full object-cover"
                          alt="profile picture"
                          src={avatar?.url}
                          width={80}
                          height={80}
                        />
                      ) : null}
                      <div className="flex flex-col gap-2">
                        <Label className="text-base " htmlFor="picture">
                          select profile picture
                        </Label>
                        <Input
                          id="picture"
                          type="file"
                          onChange={handleAvatar}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 mb-4">
                      <Label>Name</Label>
                      <Input
                        name="name"
                        id="name"
                        defaultValue={userInfo?.name}
                      />
                    </div>
                    <div className="flex flex-col mb-4 gap-1.5">
                      <Label>Phone</Label>
                      <Input
                        name="phone"
                        id="phone"
                        defaultValue={userInfo?.phone}
                        type="tel"
                      />
                    </div>

                    <Button
                      type="submit"
                      size={"sm"}
                      disabled={editLoading}
                      className="bg-green-700 w-full text-white"
                    >
                      Update
                      {editLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : null}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              {userInfo?.role === "admin" ? (
                <Link href="/dashboard">
                  <Button
                    size={"sm"}
                    className="w-full font-medium text-sm text-center py-2"
                  >
                    {" "}
                    Dashboard <UserRoundCog size={14} className="ml-2" />
                  </Button>
                </Link>
              ) : null}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      <Button size={"sm"} variant="destructive" onClick={signOut}>
        Logout <LogOut className="ml-2" size={20} />
      </Button>
    </div>
  );
}
