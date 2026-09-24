import { Hero } from "@/components/sections/Hero/Hero";
import { CurrentWorkshop } from "@/components/sections/CurrentWorkshop/CurrentWorkshop";
import { BrandJourney } from "@/components/motion/BrandJourney";
import { SiteEnd } from "@/components/layout/SiteEnd";
import { getCurrentWorkshop } from "@/data/workshops";

export default function HomePage() {
  return <><main id="main"><BrandJourney><Hero /><CurrentWorkshop workshop={getCurrentWorkshop()} /></BrandJourney></main><SiteEnd /></>;
}
