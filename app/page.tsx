import { Hero } from "@/components/hero/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { Technology } from "@/components/sections/Technology";
import { Capabilities } from "@/components/sections/Capabilities";
import { Footer } from "@/components/chrome/Footer";

export default function Page() {
  return (
    <>
      {/* id + tabIndex are the skip-link target; every route exposes #main */}
      <main id="main" tabIndex={-1}>
        <Hero />
        <Positioning />
        <Technology />
        <Capabilities />
      </main>
      <Footer />
    </>
  );
}
