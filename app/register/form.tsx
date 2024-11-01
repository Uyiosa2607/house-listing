"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Form() {
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const router = useRouter();

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const phone = formData.get("phone") as string;
    const supabase = createClient();
    try {
      setLoading(true);
      if (confirmPassword !== password)
        return toast({
          variant: "destructive",
          description: "passwords do not match",
        });
      const createUser = await supabase.auth.signUp({
        email,
        password,
      });
      if (createUser.error)
        return toast({
          variant: "destructive",
          title: "Unable to create Account",
          description: `${createUser.error.message}`,
        });
      const { error } = await supabase
        .from("users")
        .insert([
          {
            id: createUser.data?.user?.id,
            name,
            email,
            phone,
          },
        ])
        .select("*");

      if (error)
        toast({
          variant: "destructive",
          title: "Unable to create Account",
          description: error.message,
        });

      toast({
        description: "Account registered successfully",
      });

      return router.push("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
        <Input id="phone" type="tel" name="phone" placeholder="1234567890" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
        />
      </div>
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
      <Button type="submit" className="w-full">
        Create Account{" "}
        {loading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : null}
      </Button>
    </form>
  );
}
