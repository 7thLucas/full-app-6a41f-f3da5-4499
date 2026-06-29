import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { BarChart3 } from "lucide-react";

export default function IndexPage() {
  const navigate = useNavigate();
  const { config, loading } = useConfigurables();

  useEffect(() => {
    if (!loading) {
      navigate("/dashboard");
    }
  }, [loading, navigate]);

  const appName = config.appName ?? "RecruitIQ";
  const tagline = config.appTagline ?? "Screen smarter. Hire faster.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{appName}</h1>
      </div>
      <p className="text-sm text-muted-foreground">{tagline}</p>
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mt-2" />
    </div>
  );
}
