/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useStore } from "@/utils/store";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, UserRoundCog } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { CardContent, Card, CardHeader } from "@/components/ui/card";

export default function Navbar() {
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

  const { userInfo, loading, fetchUser } = useStore();

  useEffect(() => {
    fetchUser();
  }, []);

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
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${userInfo?.img}`}
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
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${userInfo?.img}`}
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
              {userInfo?.role === "admin" ? (
                <Button
                  size={"sm"}
                  onClick={() => router.push("/dashboard")}
                  className="w-full font-medium text-sm text-center py-2"
                >
                  {" "}
                  Dashboard <UserRoundCog size={14} className="ml-2" />
                </Button>
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
