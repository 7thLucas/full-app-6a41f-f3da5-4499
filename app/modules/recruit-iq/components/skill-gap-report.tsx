import { useSkillGapReport } from "../hooks/use-candidates";
import { useConfigurables } from "~/modules/configurables";
import { BarChart3, AlertTriangle, Loader2 } from "lucide-react";

interface SkillGapReportProps {
  jobId: string;
}

export function SkillGapReport({ jobId }: SkillGapReportProps) {
  const { report, loading, error } = useSkillGapReport(jobId);
  const { config } = useConfigurables();

  if (!config.enableSkillGapReport) {
    return (
      <div className="bg-muted/50 rounded-lg px-5 py-8 text-center">
        <p className="text-sm text-muted-foreground">Skill gap report is disabled in settings.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Generating report...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-destructive px-4 py-3">{error}</div>;
  }

  if (!report || report.totalScreened === 0) {
    return (
      <div className="bg-card border border-border rounded-lg py-14 text-center">
        <AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-foreground font-medium text-sm">No screened candidates yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Run AI screening on candidates first to generate the skill gap report.
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...report.skillGaps.map((g) => g.count), 1);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Skill Gap Analysis — {report.jobTitle}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on AI screening of{" "}
          <span className="font-semibold text-foreground">{report.totalScreened}</span> candidate
          {report.totalScreened !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Required skills */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-foreground mb-3">Required Skills</h4>
        <div className="flex flex-wrap gap-2">
          {report.requiredSkills.map((skill) => (
            <span key={skill} className="text-sm bg-primary/10 text-primary px-2.5 py-1 rounded-md font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Gap bars */}
      {report.skillGaps.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
          <p className="text-sm text-emerald-800 font-medium">
            No skill gaps detected across screened candidates.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-sm">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Most Common Missing Skills
          </h4>
          <div className="space-y-3">
            {report.skillGaps.map((gap) => (
              <div key={gap.skill}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{gap.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {gap.count}/{report.totalScreened} candidates
                    </span>
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                        gap.percentage >= 70
                          ? "bg-red-100 text-red-700"
                          : gap.percentage >= 40
                          ? "bg-amber-100 text-amber-700"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {gap.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      gap.percentage >= 70
                        ? "bg-red-400"
                        : gap.percentage >= 40
                        ? "bg-amber-400"
                        : "bg-accent"
                    }`}
                    style={{ width: `${(gap.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insight */}
      {report.skillGaps.length > 0 && (
        <div className="bg-secondary/40 border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Insight: </span>
            The most commonly missing skill is{" "}
            <span className="font-semibold text-foreground">{report.skillGaps[0].skill}</span>{" "}
            ({report.skillGaps[0].percentage}% of screened candidates lack it). Consider adjusting
            your sourcing strategy or provide training resources if shortlisting candidates with this gap.
          </p>
        </div>
      )}
    </div>
  );
}
