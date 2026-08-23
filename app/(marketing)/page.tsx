import { CitiesSection } from "@/components/sections/cities";
import { FaqsSection } from "@/components/sections/faqs";
import { HeroSection } from "@/components/sections/hero";
import { MembershipBanner } from "@/components/sections/membership";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CitiesSection />
      <MembershipBanner />
      <FaqsSection />
    </>
  );
}
