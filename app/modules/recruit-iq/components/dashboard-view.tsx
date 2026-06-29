import { Link } from "react-router";
import { useDashboardStats } from "../hooks/use-jobs";
import { useConfigurables } from "~/modules/configurables";
import { Briefcase, Users, CheckCircle, TrendingUp, ArrowRight, Plus } from "lucide-react";

export function DashboardView() {
  const { stats, loading, error } = useDashboardStats();
  const { config } = useConfigurables();

  const welcomeMessage = config.dashboardWelcomeMessage ?? "Welcome back! Here's your hiring overview.";

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">{error}</div>
      </div>
    );
  }

  const totalApplicants = stats?.jobs.reduce((acc, j) => acc + j.applicantCount, 0) ?? 0;
  const totalScreened = stats?.jobs.reduce((acc, j) => acc + j.screenedCount, 0) ?? 0;
  const screeningPct = totalApplicants > 0 ? Math.round((totalScreened / totalApplicants) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{welcomeMessage}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {config.orgName ?? "Your organization"} — Recruiter Dashboard
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Briefcase className="w-5 h-5" />}
          label="Open Roles"
          value={stats?.openJobs ?? 0}
          sub={`${stats?.totalJobs ?? 0} total jobs`}
          color="bg-primary text-primary-foreground"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Total Applicants"
          value={totalApplicants}
          sub="Across all open roles"
          color="bg-accent text-accent-foreground"
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Screened"
          value={totalScreened}
          sub={`${screeningPct}% screening rate`}
          color="bg-secondary text-secondary-foreground"
        />
      </div>

      {/* Open Roles Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-foreground text-sm">Open Roles</h3>
          </div>
          <Link
            to="/jobs/new"
            className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3 h-3" />
            New Job
          </Link>
        </div>

        {!stats?.jobs.length ? (
          <div className="px-5 py-10 text-center">
            <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No open roles yet.</p>
            <Link to="/jobs/new" className="text-accent text-sm font-medium hover:underline mt-1 inline-block">
              Create your first job posting
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {stats.jobs.map((job) => {
              const pct = job.applicantCount > 0
                ? Math.round((job.screenedCount / job.applicantCount) * 100)
                : 0;
              return (
                <div key={job._id} className="flex items-center gap-4 px-4 sm:px-5 py-4 hover:bg-muted/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.department}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-foreground">{job.applicantCount} applicants</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                  </div>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="shrink-0 text-accent hover:text-accent/80 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        </div>
        <div className={`${color} p-2 rounded-lg`}>{icon}</div>
      </div>
    </div>
  );
}
