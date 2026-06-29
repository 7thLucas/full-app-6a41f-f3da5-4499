import { AppLayout } from "~/modules/recruit-iq/components/app-layout";
import { DashboardView } from "~/modules/recruit-iq/components/dashboard-view";

export default function DashboardPage() {
  return (
    <AppLayout title="Dashboard">
      <DashboardView />
    </AppLayout>
  );
}
