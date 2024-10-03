import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    title,
    // description,
    bedrooms,
    // bathrooms,
    // price,
    // total_package,
    // listing_status,
    // user_id,
    // location,
  } = await request.json();

  try {
    const createListing = await supabase
      .from("houses")
      .insert([
        {
          title,
          //   description,
          bedrooms,
          //   bathrooms,
          //   price,
          //   total_package,
          //   listing_status,
          //   user_id,
          //   location,
        },
      ])
      .select("id");
    if (createListing.error) {
      console.log(createListing.error);
      return NextResponse.json({ error: "something went wrong" });
    }
    return NextResponse.json(createListing, { status: 201 });
  } catch (error) {
    console.log(error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { id } = params;
  try {
    const { error, data } = await supabase.from("houses").select().eq("id", id);
    if (error)
      return NextResponse.json({
        error: "Something went wrong",
      });
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}
