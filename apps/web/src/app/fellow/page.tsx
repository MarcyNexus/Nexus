import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import ContinueLearning from "@/components/dashboard/ContinueLearning";
import Announcements from "@/components/dashboard/Announcements";
import CapstoneProgress from "@/components/dashboard/CapstoneProgress";
import TodaysSchedule from "@/components/dashboard/TodaysSchedule";
import Assignments from "@/components/dashboard/Assignments";
import RecentGitbooks from "@/components/dashboard/RecentGitbooks";
import Bookmarks from "@/components/dashboard/Bookmarks";
import CareerServices from "@/components/dashboard/CareerServices";

// Fellow dashboard — see docs/08-fellow-dashboard.md. Publicly viewable by
// design (no login required): reached via the Navbar's Community dropdown,
// not gated behind a session. Every widget still renders mock data — the
// tables in the newer migration aren't applied to the hosted project yet.
export default function FellowDashboardPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 lg:px-8">
        <DashboardHeader />

        <div className="mt-10">
          <QuickActions />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ContinueLearning />
            <CapstoneProgress />
            <TodaysSchedule />
            <Assignments />
          </div>
          <div className="space-y-6">
            <Announcements />
            <RecentGitbooks />
            <Bookmarks />
            <CareerServices />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
