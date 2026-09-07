import { CitiesSection } from "@/components/sections/cities";
import { CouponBannerSection } from "@/components/sections/coupon-banner";
import { FaqsSection } from "@/components/sections/faqs";
import { FeaturedPropertiesSection } from "@/components/sections/featured-properties";
import { HeroSection } from "@/components/sections/hero";
import { StayBenefitsBanner } from "@/components/sections/stay-benefits";
import { TestimonialsSection } from "@/components/sections/testimonials";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CitiesSection />
      <CouponBannerSection />
      <FeaturedPropertiesSection />
      <StayBenefitsBanner />
      <TestimonialsSection />
      <FaqsSection />
    </>
  );
}
