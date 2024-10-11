"use client";

import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SignIn({ isOpen }) {
  const [providers, setProviders] = useState(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      const fetchedProviders = await getProviders();
      setProviders(fetchedProviders);
      setIsLoading(false);
    };
    fetchProviders();
  }, []);

  const handleEmailSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    signIn("email", { email, callbackUrl: "/" });
  };

  return (
    <Dialog open={isOpen} close="false">
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In or Sign Up</DialogTitle>
          <DialogDescription>No ads, no payment required.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center items-center">
              <Image
                src="/icon.png"
                alt="App Icon"
                width={40}
                height={40}
                className="rounded-full shadow-lg z-10"
              />
              <h1 className="text-2xl font-bold ml-2">NotesToQuiz</h1>
            </div>
            {providers &&
              Object.values(providers).map(
                (provider) =>
                  provider.name !== "Email" && (
                    <Button
                      key={provider.name}
                      onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                      className="w-full"
                      variant="outline"
                    >
                      Sign in with {provider.name}
                    </Button>
                  )
              )}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            {providers && providers.email && (
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Sign in with Email
                </Button>
              </form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
