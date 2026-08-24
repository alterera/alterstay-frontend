import { CitiesSection } from "@/components/sections/cities";
import { FaqsSection } from "@/components/sections/faqs";
import { HeroSection } from "@/components/sections/hero";
import { StayBenefitsBanner } from "@/components/sections/stay-benefits";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CitiesSection />
      <StayBenefitsBanner />
      <FaqsSection />
    </>
  );
}
