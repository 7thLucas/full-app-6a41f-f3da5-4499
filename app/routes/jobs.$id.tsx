import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { apiGet } from "~/lib/api.client";
import { AppLayout } from "~/modules/recruit-iq/components/app-layout";
import { CandidatesTable } from "~/modules/recruit-iq/components/candidates-table";
import { KanbanBoard } from "~/modules/recruit-iq/components/kanban-board";
import { SkillGapReport } from "~/modules/recruit-iq/components/skill-gap-report";
import type { Job } from "~/modules/recruit-iq/hooks/use-jobs";
import { ArrowLeft, Briefcase, MapPin, Users, CheckCircle, Loader2 } from "lucide-react";

type Tab = "candidates" | "pipeline" | "skill-gap";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("candidates");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiGet<Job>(`/api/recruit-iq/jobs/${id}`)
      .then((res) => { if (res.success) setJob(res.data ?? null); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AppLayout title="Job Detail">
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading job...</span>
        </div>
      </AppLayout>
    );
  }

  if (!job || !id) {
    return (
      <AppLayout title="Not Found">
        <div className="p-6 text-center">
          <p className="text-muted-foreground text-sm">Job not found.</p>
          <Link to="/jobs" className="text-accent text-sm hover:underline mt-2 inline-block">
            Back to Jobs
          </Link>
        </div>
      </AppLayout>
    );
  }

  const pct = job.applicantCount > 0
    ? Math.round((job.screenedCount / job.applicantCount) * 100)
    : 0;

  const statusColors: Record<string, string> = {
    open: "bg-emerald-100 text-emerald-700",
    draft: "bg-amber-100 text-amber-700",
    closed: "bg-muted text-muted-foreground",
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "candidates", label: "Candidates" },
    { key: "pipeline", label: "Pipeline" },
    { key: "skill-gap", label: "Skill Gap" },
  ];

  return (
    <AppLayout title={job.title}>
      <div className="p-4 sm:p-6 space-y-5">
        {/* Back */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Jobs
        </Link>

        {/* Job Header */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-lg font-bold text-foreground">{job.title}</h2>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColors[job.status] ?? ""}`}>
                  {job.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.department}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{job.applicantCount} applicants</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />{job.screenedCount} screened ({pct}%)</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{job.description}</p>

          {job.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.requiredSkills.map((s) => (
                <span key={s} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md font-medium">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-border flex gap-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === key
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {tab === "candidates" && <CandidatesTable jobId={id} />}
          {tab === "pipeline" && <KanbanBoard jobId={id} />}
          {tab === "skill-gap" && <SkillGapReport jobId={id} />}
        </div>
      </div>
    </AppLayout>
  );
}
