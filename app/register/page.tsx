import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Mail } from "lucide-react";
import Form from "./form";

export default function RegisterPage() {
  // const handleGoogleRegister = () => {
  //   // Here you would typically handle Google registration logic
  //   console.log("Registering with Google");
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Home className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up to start finding your dream home
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            // onClick={handleGoogleRegister}
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center w-full text-gray-600">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
