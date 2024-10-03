import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  const { id } = params;

  const supabase = createClient();

  try {
    const { error } = await supabase.from("houses").delete().eq("id", id);

    if (!error)
      return NextResponse.json(
        { message: "deleted succesfully" },
        { status: 200 }
      );

    return NextResponse.json({
      status: 501,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" });
  }
}
