import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  const userData = await supabase
    .from("users")
    .select("*")
    .eq("id", authData?.user?.id);

  const authID = authData?.user?.id;
  if (!authID) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  //temporarily removed for performance issues!!

  // const path = request.nextUrl.pathname;
  // const userRole = userData?.data?.[0].role;

  // if (path === "/dashboard" || path === "/dashboard/add-listing") {
  //   if (userRole !== "admin") {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/";
  //     return NextResponse.redirect(url);
  //   }
  // }

  return await updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/listing/:path*", "/"],
};
