import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createClient();

  const {
    bedrooms,
    bathrooms,
    price,
    total_package,
    location,
    listing_status,
  } = await request.json();

  try {
    const { error } = await supabase
      .from("houses")
      .update([
        {
          bedrooms,
          bathrooms,
          price,
          total_package,
          location,
          listing_status,
        },
      ])
      .eq("id", id);

    if (error)
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 501 }
      );

    return NextResponse.json(
      {
        message: "Listing has been updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "someting went wrong" }, { status: 501 });
  }
}
