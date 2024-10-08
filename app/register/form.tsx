"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Form() {
  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // const phone = formData.get("phone")
    const supabase = createClient();
    try {
      const createUser = await supabase.auth.signUp({
        email,
        password,
      });
      if (createUser.error)
        return console.log(
          "there was error trying to create user:",
          createUser.error
        );
      console.log(createUser.data);

      const { error, data } = await supabase
        .from("users")
        .insert([
          {
            id: createUser.data?.user?.id,
            name,
            email,
          },
        ])
        .select("*");

      if (error) return console.log("could not save user to database:", error);
      return console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          name="name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          name="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" placeholder="1234567890" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" type="password" required />
      </div>
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </form>
  );
}
