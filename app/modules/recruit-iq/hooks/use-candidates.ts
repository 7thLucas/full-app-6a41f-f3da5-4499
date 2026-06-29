import { useState, useEffect, useCallback } from "react";
import { apiRequest, apiGet } from "~/lib/api.client";

export interface AiAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  recommendation: "Hire" | "Maybe" | "Reject";
  summary: string;
}

export interface Candidate {
  _id: string;
  jobId: string;
  name: string;
  email?: string;
  phone?: string;
  resumeUrl?: string;
  resumeText?: string;
  extractedSkills: string[];
  pipelineStage: string;
  aiAnalysis: AiAnalysis;
  isScreened: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanData {
  Applied: Candidate[];
  Screened: Candidate[];
  Shortlisted: Candidate[];
  Interview: Candidate[];
  Offer: Candidate[];
  Hired: Candidate[];
  Rejected: Candidate[];
}

export interface SkillGap {
  skill: string;
  count: number;
  percentage: number;
}

export interface SkillGapReport {
  jobTitle: string;
  requiredSkills: string[];
  skillGaps: SkillGap[];
  totalScreened: number;
}

export function useCandidates(jobId: string) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screening, setScreening] = useState(false);

  const fetchCandidates = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<Candidate[]>(`/api/recruit-iq/jobs/${jobId}/candidates`);
      if (res.success) setCandidates(res.data ?? []);
      else setError(res.message ?? "Failed to fetch candidates");
    } catch {
      setError("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  const createCandidate = async (data: {
    name: string;
    email?: string;
    phone?: string;
    resumeText?: string;
  }) => {
    const res = await apiRequest<Candidate>(`/api/recruit-iq/jobs/${jobId}/candidates`, {
      method: "POST",
      data: { ...data, jobId },
    });
    if (res.success) await fetchCandidates();
    return res;
  };

  const screenAll = async () => {
    setScreening(true);
    try {
      const res = await apiRequest<Candidate[]>(`/api/recruit-iq/jobs/${jobId}/screen-all`, {
        method: "POST",
      });
      if (res.success) await fetchCandidates();
      return res;
    } finally {
      setScreening(false);
    }
  };

  const screenSingle = async (candidateId: string) => {
    const res = await apiRequest<Candidate>(`/api/recruit-iq/candidates/${candidateId}/screen`, {
      method: "POST",
    });
    if (res.success) await fetchCandidates();
    return res;
  };

  const updateStage = async (candidateId: string, pipelineStage: string) => {
    const res = await apiRequest<Candidate>(
      `/api/recruit-iq/candidates/${candidateId}/stage`,
      { method: "PUT", data: { pipelineStage } }
    );
    if (res.success) await fetchCandidates();
    return res;
  };

  const deleteCandidate = async (candidateId: string) => {
    const res = await apiRequest(`/api/recruit-iq/candidates/${candidateId}`, { method: "DELETE" });
    if (res.success) await fetchCandidates();
    return res;
  };

  return {
    candidates,
    loading,
    error,
    screening,
    fetchCandidates,
    createCandidate,
    screenAll,
    screenSingle,
    updateStage,
    deleteCandidate,
  };
}

export function useKanban(jobId: string) {
  const [kanban, setKanban] = useState<KanbanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKanban = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await apiGet<KanbanData>(`/api/recruit-iq/jobs/${jobId}/kanban`);
      if (res.success) setKanban(res.data ?? null);
      else setError(res.message ?? "Failed to fetch kanban");
    } catch {
      setError("Failed to fetch kanban");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { fetchKanban(); }, [fetchKanban]);

  const moveCard = async (candidateId: string, newStage: string) => {
    const res = await apiRequest(
      `/api/recruit-iq/candidates/${candidateId}/stage`,
      { method: "PUT", data: { pipelineStage: newStage } }
    );
    if (res.success) await fetchKanban();
    return res;
  };

  return { kanban, loading, error, fetchKanban, moveCard };
}

export function useSkillGapReport(jobId: string) {
  const [report, setReport] = useState<SkillGapReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await apiGet<SkillGapReport>(`/api/recruit-iq/jobs/${jobId}/skill-gap`);
      if (res.success) setReport(res.data ?? null);
      else setError(res.message ?? "Failed to fetch skill gap report");
    } catch {
      setError("Failed to fetch skill gap report");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  return { report, loading, error, fetchReport };
}
