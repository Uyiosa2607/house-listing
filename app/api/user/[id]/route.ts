import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { id } = params;

  try {
    const { data, error } = await supabase.from("users").select().eq("id", id);

    if (error)
      return NextResponse.json(
        { error: "user does not exist" },
        { status: 404 }
      );

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }
}
