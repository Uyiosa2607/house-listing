"use server";

import { createClient } from "@/utils/supabase/server";

export async function handleLogin(formdata: FormData) {
  const supabase = createClient();
  const data = {
    email: formdata.get("email") as string,
    password: formdata.get("password") as string,
  };

  try {
    const { error } = await supabase.auth.signInWithPassword(data);
    if (!error) console.log("user logged in");
  } catch (error) {
    console.log(error);
  }
}
