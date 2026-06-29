import { useConfigurables } from "~/modules/configurables";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  const { config } = useConfigurables();
  const hireThreshold = config.aiScoreThresholdHire ?? 75;
  const maybeThreshold = config.aiScoreThresholdMaybe ?? 50;

  const getColor = () => {
    if (score >= hireThreshold) return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    if (score >= maybeThreshold) return "bg-amber-100 text-amber-800 border border-amber-200";
    return "bg-red-100 text-red-800 border border-red-200";
  };

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 rounded",
    md: "text-sm px-2 py-1 rounded-md font-semibold",
    lg: "text-base px-3 py-1.5 rounded-lg font-bold",
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} ${getColor()}`}>
      {score}%
    </span>
  );
}

interface RecommendationBadgeProps {
  recommendation: "Hire" | "Maybe" | "Reject";
}

export function RecommendationBadge({ recommendation }: RecommendationBadgeProps) {
  const colorMap = {
    Hire: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Maybe: "bg-amber-100 text-amber-800 border border-amber-200",
    Reject: "bg-red-100 text-red-800 border border-red-200",
  };

  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${colorMap[recommendation]}`}>
      {recommendation}
    </span>
  );
}
