import { Hero } from "@/components/sections/Hero/Hero";
import { CurrentWorkshop } from "@/components/sections/CurrentWorkshop/CurrentWorkshop";
import { ProjectsGallery } from "@/components/sections/ProjectsGallery/ProjectsGallery";
import { About } from "@/components/sections/About/About";
import { Crew } from "@/components/sections/Crew/Crew";
import { BrandJourney } from "@/components/motion/BrandJourney";
import { SiteEnd } from "@/components/layout/SiteEnd";
import { getCurrentWorkshop } from "@/data/workshops";

export default function HomePage() {
  return <><main id="main" tabIndex={-1}><BrandJourney hero={<Hero />} now={<CurrentWorkshop workshop={getCurrentWorkshop()} />} /> <ProjectsGallery /> <About /><Crew /></main><SiteEnd /></>;
}
