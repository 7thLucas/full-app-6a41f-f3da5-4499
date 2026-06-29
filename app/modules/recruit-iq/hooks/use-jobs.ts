import { useState, useEffect, useCallback } from "react";
import { apiRequest, apiGet } from "~/lib/api.client";

export interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requiredSkills: string[];
  status: string;
  applicantCount: number;
  screenedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalJobs: number;
  openJobs: number;
  jobs: Job[];
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<Job[]>("/api/recruit-iq/jobs");
      if (res.success) setJobs(res.data ?? []);
      else setError(res.message ?? "Failed to fetch jobs");
    } catch {
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const createJob = async (data: {
    title: string;
    department: string;
    location: string;
    description: string;
    requiredSkills: string[];
    status?: string;
  }) => {
    const res = await apiRequest<Job>("/api/recruit-iq/jobs", { method: "POST", data });
    if (res.success) await fetchJobs();
    return res;
  };

  const updateJob = async (id: string, data: Partial<Job>) => {
    const res = await apiRequest<Job>(`/api/recruit-iq/jobs/${id}`, { method: "PUT", data });
    if (res.success) await fetchJobs();
    return res;
  };

  const deleteJob = async (id: string) => {
    const res = await apiRequest(`/api/recruit-iq/jobs/${id}`, { method: "DELETE" });
    if (res.success) await fetchJobs();
    return res;
  };

  return { jobs, loading, error, fetchJobs, createJob, updateJob, deleteJob };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<DashboardStats>("/api/recruit-iq/dashboard");
      if (res.success) setStats(res.data ?? null);
      else setError(res.message ?? "Failed to load stats");
    } catch {
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, loading, error, fetchStats };
}
