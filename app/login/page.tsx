"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { toast } = useToast();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();

    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error)
        return toast({
          variant: "destructive",
          title: "Access Denied",
          description: error.message,
        });
      toast({
        description: "Login successfull",
      });
      return router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  //   const handleGoogleLogin = () => {
  //     // Here you would typically handle Google login logic
  //     console.log("Logging in with Google");
  //   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Home className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-lg font-bold text-center">
            Welcome to Home finder
          </CardTitle>
          <CardDescription className="text-center">
            Login to find your dream home
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                // value={email}
                name="email"
                // onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                // value={password}
                name="password"
                // onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
            <Button type="submit" className="w-full">
              Login{" "}
              {loading && <Loader2 className="ml-2 w-4 h-5 animate-spin" />}
            </Button>
          </form>
          <Link href="/register">
            <span className="text-xs text-blue-500 underline">
              Don&apos;t have an account?
            </span>
          </Link>
          {/* <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                    >
                        <Mail className="mr-2 h-4 w-4"/>
                        Google
                    </Button> */}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center w-full text-gray-600">
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
