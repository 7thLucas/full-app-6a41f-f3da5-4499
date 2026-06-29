import { useState } from "react";
import { useKanban } from "../hooks/use-candidates";
import { ScoreBadge, RecommendationBadge } from "./score-badge";
import { Loader2 } from "lucide-react";
import type { Candidate } from "../hooks/use-candidates";

const STAGES = ["Applied", "Screened", "Shortlisted", "Interview", "Offer", "Hired", "Rejected"] as const;
type Stage = typeof STAGES[number];

const STAGE_COLORS: Record<Stage, string> = {
  Applied: "border-border bg-muted/30",
  Screened: "border-accent/30 bg-accent/5",
  Shortlisted: "border-blue-200 bg-blue-50/50",
  Interview: "border-amber-200 bg-amber-50/50",
  Offer: "border-emerald-200 bg-emerald-50/50",
  Hired: "border-emerald-400 bg-emerald-50",
  Rejected: "border-red-200 bg-red-50/30",
};

const STAGE_HEADER_COLORS: Record<Stage, string> = {
  Applied: "text-foreground",
  Screened: "text-accent",
  Shortlisted: "text-blue-700",
  Interview: "text-amber-700",
  Offer: "text-emerald-700",
  Hired: "text-emerald-800",
  Rejected: "text-red-700",
};

interface KanbanBoardProps {
  jobId: string;
}

export function KanbanBoard({ jobId }: KanbanBoardProps) {
  const { kanban, loading, error, moveCard } = useKanban(jobId);
  const [dragging, setDragging] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  const handleDragStart = (candidateId: string) => {
    setDragging(candidateId);
  };

  const handleDrop = async (stage: Stage) => {
    if (!dragging) return;
    setMovingId(dragging);
    setDragging(null);
    await moveCard(dragging, stage);
    setMovingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading pipeline...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-destructive px-4 py-3">{error}</div>;
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-3 min-w-max">
        {STAGES.map((stage) => {
          const cards = kanban?.[stage] ?? [];
          return (
            <div
              key={stage}
              className={`flex flex-col w-52 min-h-64 rounded-lg border ${STAGE_COLORS[stage]} p-3`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-xs font-semibold uppercase tracking-wide ${STAGE_HEADER_COLORS[stage]}`}>
                  {stage}
                </h4>
                <span className="text-xs bg-card border border-border rounded-full px-1.5 py-0.5 font-medium text-muted-foreground">
                  {cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 flex-1">
                {cards.length === 0 && (
                  <div className="flex-1 flex items-center justify-center border border-dashed border-border rounded-md">
                    <p className="text-xs text-muted-foreground">Drop here</p>
                  </div>
                )}
                {cards.map((candidate) => (
                  <KanbanCard
                    key={candidate._id}
                    candidate={candidate}
                    isDragging={dragging === candidate._id}
                    isMoving={movingId === candidate._id}
                    onDragStart={() => handleDragStart(candidate._id)}
                    onDragEnd={() => setDragging(null)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface KanbanCardProps {
  candidate: Candidate;
  isDragging: boolean;
  isMoving: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function KanbanCard({ candidate, isDragging, isMoving, onDragStart, onDragEnd }: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-card border border-border rounded-md p-3 cursor-grab active:cursor-grabbing shadow-sm transition-all ${
        isDragging ? "opacity-50 scale-95" : "hover:shadow"
      } ${isMoving ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
          {candidate.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{candidate.name}</p>
          {candidate.email && (
            <p className="text-xs text-muted-foreground truncate">{candidate.email}</p>
          )}
        </div>
        {isMoving && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground shrink-0" />}
      </div>

      {candidate.isScreened && candidate.aiAnalysis ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <ScoreBadge score={candidate.aiAnalysis.score} size="sm" />
          <RecommendationBadge recommendation={candidate.aiAnalysis.recommendation} />
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">Pending screen</span>
      )}

      {candidate.extractedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {candidate.extractedSkills.slice(0, 2).map((s) => (
            <span key={s} className="text-xs bg-secondary text-secondary-foreground px-1 py-0.5 rounded">
              {s}
            </span>
          ))}
          {candidate.extractedSkills.length > 2 && (
            <span className="text-xs text-muted-foreground">+{candidate.extractedSkills.length - 2}</span>
          )}
        </div>
      )}
    </div>
  );
}
