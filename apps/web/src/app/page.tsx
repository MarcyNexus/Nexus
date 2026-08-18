import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ImpactStats from "@/components/ImpactStats";
import WhatIsMarcy from "@/components/WhatIsMarcy";
import WhyDifferent from "@/components/WhyDifferent";
import MarcyJourney from "@/components/MarcyJourney";
import AlumniOutcomes from "@/components/AlumniOutcomes";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import Testimonials from "@/components/Testimonials";
import HiringPartners from "@/components/HiringPartners";
import FundersInvestors from "@/components/FundersInvestors";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <Hero />
      <ImpactStats />
      <WhatIsMarcy />
      <WhyDifferent />
      <MarcyJourney />
      <AlumniOutcomes />
      <ProjectsShowcase />
      <Testimonials />
      <HiringPartners />
      <FundersInvestors />
      <FinalCta />
      <Footer />
    </div>
  );
}
