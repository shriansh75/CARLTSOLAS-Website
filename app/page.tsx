import { Hero } from "@/components/hero/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { Technology } from "@/components/sections/Technology";
import { Capabilities } from "@/components/sections/Capabilities";
import { Footer } from "@/components/chrome/Footer";

export default function Page() {
  return (
    <>
      <main>
        <Hero />
        <Positioning />
        <Technology />
        <Capabilities />
      </main>
      <Footer />
    </>
  );
}
