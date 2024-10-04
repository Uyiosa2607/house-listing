import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
export async function GET() {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.signOut();
    if (error)
      return NextResponse.json(
        { error: "something went wrong please try again" },
        { status: 500 }
      );

    return NextResponse.json(
      {
        message: "signed out successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "an error occured" },
      {
        status: 501,
      }
    );
  }
}
