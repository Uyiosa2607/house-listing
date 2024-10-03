import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  const { email, name, password } = await request.json();
  const supabase = createClient();

  try {
    const createUserAccount = await supabase.auth.signUp({
      email,
      password,
    });

    if (createUserAccount.error)
      return NextResponse.json(
        { error: createUserAccount.error },
        { status: 501 }
      );

    const { error, data } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          id: createUserAccount.data.user?.id,
        },
      ])
      .select();

    if (error) return NextResponse.json({ message: "Something went wrong" });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { messgae: "something went wrong" },
      { status: 501 }
    );
  }
}
