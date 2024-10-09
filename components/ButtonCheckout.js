"use client";

import { useState } from "react";
import apiClient from "@/libs/api";
import config from "@/config";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// This component is used to create Stripe Checkout Sessions
// It calls the /api/stripe/create-checkout route with the priceId, successUrl and cancelUrl
// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card. You can change that in the API route
// You can also change the mode to "subscription" if you want to create a subscription instead of a one-time payment
const ButtonCheckout = ({ priceId, mode = "payment" }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const res = await apiClient.post("/stripe/create-checkout", {
        priceId,
        mode,
        successUrl: `${window.location.origin}/custom`,
        cancelUrl: window.location.href,
      });

      window.location.href = res.url;
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  return (
    <Button className="w-full p-6 group" onClick={() => handlePayment()}>
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <Image
          src="/icon.png"
          alt={`${config.appName} logo`}
          className="w-5 h-5 fill-primary-content group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200 mr-2"
          priority={true}
          width={32}
          height={32}
        />
      )}
      Get {config?.appName}
    </Button>
  );
};

export default ButtonCheckout;
