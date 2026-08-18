import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortalHeader from "@/components/partner/PortalHeader";
import HiringStatistics from "@/components/partner/HiringStatistics";
import TalentPipeline from "@/components/partner/TalentPipeline";
import RecruitingEvents from "@/components/partner/RecruitingEvents";
import ImpactMetrics from "@/components/partner/ImpactMetrics";
import PartnerSuccessStories from "@/components/partner/PartnerSuccessStories";
import FeaturedFellows from "@/components/partner/FeaturedFellows";
import GraduateDirectory from "@/components/partner/GraduateDirectory";

// Hiring Partner Portal — see docs/10-partner-portal.md. Same conventions as
// /fellow and /alumni (docs/08, docs/09): its own top-level route, reached
// via the Navbar's Community dropdown, publicly viewable (no session check),
// every widget rendering mock data.
export default function PartnerPortalPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-6 py-10 lg:px-8">
        <PortalHeader />

        <HiringStatistics />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <TalentPipeline />
            <PartnerSuccessStories />
            <FeaturedFellows />
          </div>
          <div className="space-y-6">
            <RecruitingEvents />
            <ImpactMetrics />
            <GraduateDirectory />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
