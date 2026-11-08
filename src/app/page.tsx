import { Hero } from "@/components/sections/Hero/Hero";
import { CurrentWorkshop } from "@/components/sections/CurrentWorkshop/CurrentWorkshop";
import { ProjectsGallery } from "@/components/sections/ProjectsGallery/ProjectsGallery";
import { WorkshopTiles } from "@/components/sections/ProjectsGallery/WorkshopTiles";
import { About } from "@/components/sections/About/About";
import { Crew } from "@/components/sections/Crew/Crew";
import { Contact } from "@/components/sections/Contact/Contact";
import { BrandJourney } from "@/components/motion/BrandJourney";
import { SiteEnd } from "@/components/layout/SiteEnd";
import { getCurrentWorkshop } from "@/data/workshops";

export default function HomePage() {
  return <><main id="main" tabIndex={-1}><BrandJourney hero={<Hero />} now={<CurrentWorkshop workshop={getCurrentWorkshop()} />} /> <ProjectsGallery><WorkshopTiles /></ProjectsGallery> <About /><Crew /><Contact /></main><SiteEnd /></>;
}
