import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileHeader from "@/components/alumni/ProfileHeader";
import CareerMilestones from "@/components/alumni/CareerMilestones";
import CareerTimeline from "@/components/alumni/CareerTimeline";
import NetworkingDirectory from "@/components/alumni/NetworkingDirectory";
import ExclusiveJobBoard from "@/components/alumni/ExclusiveJobBoard";
import Events from "@/components/alumni/Events";
import CommunityFeed from "@/components/alumni/CommunityFeed";
import FeaturedAlumni from "@/components/alumni/FeaturedAlumni";
import ReferralOpportunities from "@/components/alumni/ReferralOpportunities";

// Alumni dashboard — see docs/09-alumni-dashboard.md. Same conventions as
// /fellow (docs/08-fellow-dashboard.md): its own top-level route, reached
// via the Navbar's Community dropdown, publicly viewable (no session check),
// every widget rendering mock data.
export default function AlumniDashboardPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-6 py-10 lg:px-8">
        <ProfileHeader />

        <CareerMilestones />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CareerTimeline />
            <ExclusiveJobBoard />
            <CommunityFeed />
          </div>
          <div className="space-y-6">
            <NetworkingDirectory />
            <Events />
            <FeaturedAlumni />
            <ReferralOpportunities />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
