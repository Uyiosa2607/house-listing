import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();

  const authID = authData?.user?.id;
  if (!authID) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // const {data, error} = await supabase
  //     .from("users")
  //     .select("role")
  //     .eq("id", authID)
  //     .single();

  // if (error || data?.role !== "admin") {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/";
  //     return NextResponse.redirect(url);
  // }

  return await updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/listing/:path*", "/"],
};
