import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("houses")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error)
      return NextResponse.json(
        {
          error: "something went wrong",
        },
        { status: 500 }
      );
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "something went wrong",
      },
      { status: 500 }
    );
  }
}
