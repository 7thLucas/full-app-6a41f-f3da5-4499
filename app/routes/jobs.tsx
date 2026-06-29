import { AppLayout } from "~/modules/recruit-iq/components/app-layout";
import { JobsList } from "~/modules/recruit-iq/components/jobs-list";

export default function JobsPage() {
  return (
    <AppLayout title="Jobs">
      <JobsList />
    </AppLayout>
  );
}
