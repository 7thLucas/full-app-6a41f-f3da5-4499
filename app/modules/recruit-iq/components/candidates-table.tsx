import { useState } from "react";
import { useCandidates } from "../hooks/use-candidates";
import { ScoreBadge, RecommendationBadge } from "./score-badge";
import {
  Users,
  Plus,
  Zap,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trash2,
  UserCheck,
} from "lucide-react";

interface CandidatesTableProps {
  jobId: string;
}

const PIPELINE_STAGES = ["Applied", "Screened", "Shortlisted", "Interview", "Offer", "Hired", "Rejected"];

export function CandidatesTable({ jobId }: CandidatesTableProps) {
  const {
    candidates,
    loading,
    error,
    screening,
    screenAll,
    screenSingle,
    updateStage,
    deleteCandidate,
    createCandidate,
  } = useCandidates(jobId);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addResume, setAddResume] = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const [screeningId, setScreeningId] = useState<string | null>(null);

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    setAddSaving(true);
    await createCandidate({
      name: addName.trim(),
      email: addEmail.trim() || undefined,
      phone: addPhone.trim() || undefined,
      resumeText: addResume.trim() || undefined,
    });
    setAddSaving(false);
    setAddName("");
    setAddEmail("");
    setAddPhone("");
    setAddResume("");
    setShowAdd(false);
  };

  const handleScreenSingle = async (candidateId: string) => {
    setScreeningId(candidateId);
    await screenSingle(candidateId);
    setScreeningId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading candidates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Candidate
        </button>
        <button
          onClick={screenAll}
          disabled={screening || candidates.filter((c) => !c.isScreened).length === 0}
          className="flex items-center gap-1.5 text-sm bg-accent text-accent-foreground px-3 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {screening ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {screening ? "Screening..." : `Screen All (${candidates.filter((c) => !c.isScreened).length} pending)`}
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Add Candidate Form */}
      {showAdd && (
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-foreground text-sm mb-3">Add Candidate</h4>
          <form onSubmit={handleAddCandidate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3 py-1.5 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                <input
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="email@example.com"
                  type="email"
                  className="w-full px-3 py-1.5 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Phone</label>
                <input
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  placeholder="+1 555 0123"
                  className="w-full px-3 py-1.5 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Resume Text
                <span className="ml-1 text-muted-foreground font-normal">(paste resume content for AI screening)</span>
              </label>
              <textarea
                value={addResume}
                onChange={(e) => setAddResume(e.target.value)}
                rows={4}
                placeholder="Paste the candidate's resume text here..."
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addSaving}
                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {addSaving ? "Adding..." : "Add Candidate"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Candidates */}
      {candidates.length === 0 ? (
        <div className="bg-card border border-border rounded-lg py-14 text-center">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium text-sm">No candidates yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add candidates manually to begin screening.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {candidates.map((candidate) => (
            <div key={candidate._id} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              {/* Row */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(expanded === candidate._id ? null : candidate._id)}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                  {candidate.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{candidate.name}</p>
                    {candidate.isScreened && (
                      <UserCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                    )}
                  </div>
                  {candidate.email && (
                    <p className="text-xs text-muted-foreground truncate">{candidate.email}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {candidate.isScreened ? (
                    <>
                      <ScoreBadge score={candidate.aiAnalysis?.score ?? 0} size="sm" />
                      <RecommendationBadge recommendation={candidate.aiAnalysis?.recommendation ?? "Maybe"} />
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Not screened</span>
                  )}

                  {/* Stage select */}
                  <select
                    value={candidate.pipelineStage}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateStage(candidate._id, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs bg-secondary text-secondary-foreground border border-border rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  {expanded === candidate._id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === candidate._id && (
                <div className="border-t border-border px-4 py-4 bg-muted/20 space-y-4">
                  {candidate.isScreened && candidate.aiAnalysis ? (
                    <>
                      <div className="bg-card border border-border rounded-md p-3">
                        <p className="text-xs font-semibold text-foreground mb-1">AI Summary</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{candidate.aiAnalysis.summary}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {candidate.aiAnalysis.strengths.length > 0 && (
                          <div className="bg-emerald-50 border border-emerald-100 rounded-md p-3">
                            <p className="text-xs font-semibold text-emerald-800 mb-2">Strengths</p>
                            <ul className="space-y-1">
                              {candidate.aiAnalysis.strengths.map((s, i) => (
                                <li key={i} className="text-xs text-emerald-700 flex gap-1.5">
                                  <span className="mt-0.5 shrink-0">•</span>{s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {candidate.aiAnalysis.weaknesses.length > 0 && (
                          <div className="bg-amber-50 border border-amber-100 rounded-md p-3">
                            <p className="text-xs font-semibold text-amber-800 mb-2">Weaknesses</p>
                            <ul className="space-y-1">
                              {candidate.aiAnalysis.weaknesses.map((s, i) => (
                                <li key={i} className="text-xs text-amber-700 flex gap-1.5">
                                  <span className="mt-0.5 shrink-0">•</span>{s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {candidate.aiAnalysis.missingSkills.length > 0 && (
                          <div className="bg-red-50 border border-red-100 rounded-md p-3">
                            <p className="text-xs font-semibold text-red-800 mb-2">Missing Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {candidate.aiAnalysis.missingSkills.map((s) => (
                                <span key={s} className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <p className="text-sm text-muted-foreground">
                        This candidate hasn't been AI screened yet.
                      </p>
                      <button
                        onClick={() => handleScreenSingle(candidate._id)}
                        disabled={screeningId === candidate._id}
                        className="flex items-center gap-1.5 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
                      >
                        {screeningId === candidate._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Zap className="w-3.5 h-3.5" />
                        )}
                        Run AI Screen
                      </button>
                    </div>
                  )}

                  {/* Skills */}
                  {candidate.extractedSkills.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1.5">Extracted Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.extractedSkills.map((s) => (
                          <span key={s} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteCandidate(candidate._id)}
                      className="flex items-center gap-1.5 text-xs text-destructive hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove Candidate
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
