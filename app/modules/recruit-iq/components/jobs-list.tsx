import { useState } from "react";
import { Link } from "react-router";
import { useJobs } from "../hooks/use-jobs";
import { JobForm } from "./job-form";
import {
  Briefcase,
  MapPin,
  Users,
  CheckCircle,
  Plus,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";

export function JobsList() {
  const { jobs, loading, error, createJob, updateJob, deleteJob } = useJobs();
  const [showNew, setShowNew] = useState(false);
  const [editJob, setEditJob] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleCreate = async (data: any) => {
    setSaving(true);
    await createJob(data);
    setSaving(false);
    setShowNew(false);
  };

  const handleUpdate = async (id: string, data: any) => {
    setSaving(true);
    await updateJob(id, data);
    setSaving(false);
    setEditJob(null);
  };

  const handleDelete = async (id: string) => {
    await deleteJob(id);
    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Job Postings</h2>
          <p className="text-sm text-muted-foreground">{jobs.length} role{jobs.length !== 1 ? "s" : ""} total</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Job
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* New Job Form */}
      {showNew && (
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Create New Job</h3>
          <JobForm
            onSubmit={handleCreate}
            onCancel={() => setShowNew(false)}
            isLoading={saving}
          />
        </div>
      )}

      {/* Jobs Grid */}
      {jobs.length === 0 && !showNew ? (
        <div className="bg-card border border-border rounded-lg py-16 text-center">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium">No jobs yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first job posting to start screening candidates.</p>
          <button
            onClick={() => setShowNew(true)}
            className="mt-4 text-accent text-sm font-medium hover:underline"
          >
            + Create job posting
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const pct = job.applicantCount > 0
              ? Math.round((job.screenedCount / job.applicantCount) * 100)
              : 0;

            const statusColors: Record<string, string> = {
              open: "bg-emerald-100 text-emerald-700",
              draft: "bg-amber-100 text-amber-700",
              closed: "bg-muted text-muted-foreground",
            };

            return editJob === job._id ? (
              <div key={job._id} className="bg-card border border-border rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Edit Job</h3>
                <JobForm
                  initialData={job}
                  onSubmit={(data) => handleUpdate(job._id, data)}
                  onCancel={() => setEditJob(null)}
                  isLoading={saving}
                />
              </div>
            ) : (
              <div key={job._id} className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-base font-semibold text-foreground hover:text-accent transition-colors truncate"
                      >
                        {job.title}
                      </Link>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColors[job.status] ?? ""}`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                    </div>
                    {job.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {job.requiredSkills.slice(0, 5).map((s) => (
                          <span key={s} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                        {job.requiredSkills.length > 5 && (
                          <span className="text-xs text-muted-foreground">+{job.requiredSkills.length - 5} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 text-right space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground justify-end">
                      <Users className="w-3 h-3" />
                      <span>{job.applicantCount} applicants</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground justify-end">
                      <CheckCircle className="w-3 h-3" />
                      <span>{job.screenedCount} screened ({pct}%)</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end mt-2">
                      <button
                        onClick={() => setEditJob(job._id)}
                        className="p-1.5 text-muted-foreground hover:text-accent transition-colors rounded"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(job._id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="p-1.5 text-accent hover:opacity-80 transition-opacity rounded"
                        title="View"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-6 shadow-lg w-full max-w-sm mx-4">
            <h3 className="font-semibold text-foreground mb-2">Delete Job?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              This will permanently delete the job posting and all associated candidates.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
