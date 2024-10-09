import { Suspense } from "react";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import FeaturesAccordion from "@/components/landing/FeaturesAccordion";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import WithWithout from "@/components/landing/WithWithout";
import Highlight from "@/components/landing/Highlight";

export default function Home() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="bg-yellow-50">
        <WithWithout />
        <FeaturesAccordion />
        <Highlight />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
