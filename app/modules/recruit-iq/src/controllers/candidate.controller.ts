import type { Request, Response } from "express";
import { CandidateService } from "../services/candidate.service";
import { JobService } from "../services/job.service";
import { AiScreeningService } from "../services/ai-screening.service";

export async function getCandidatesByJob(req: Request, res: Response) {
  try {
    const candidates = await CandidateService.getCandidatesByJob(req.params.jobId);
    return res.json({ success: true, data: candidates });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch candidates" });
  }
}

export async function getCandidateById(req: Request, res: Response) {
  try {
    const candidate = await CandidateService.getCandidateById(req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });
    return res.json({ success: true, data: candidate });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch candidate" });
  }
}

export async function createCandidate(req: Request, res: Response) {
  try {
    const { jobId, name, email, phone, resumeText, resumeUrl, extractedSkills, pipelineStage } = req.body;
    if (!jobId || !name) {
      return res.status(400).json({ success: false, message: "jobId and name are required" });
    }
    const candidate = await CandidateService.createCandidate({
      jobId,
      name,
      email,
      phone,
      resumeText,
      resumeUrl,
      extractedSkills: Array.isArray(extractedSkills) ? extractedSkills : [],
      pipelineStage: pipelineStage ?? "Applied",
    });
    return res.status(201).json({ success: true, data: candidate });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create candidate" });
  }
}

export async function updatePipelineStage(req: Request, res: Response) {
  try {
    const { pipelineStage } = req.body;
    const validStages = ["Applied", "Screened", "Shortlisted", "Interview", "Offer", "Hired", "Rejected"];
    if (!pipelineStage || !validStages.includes(pipelineStage)) {
      return res.status(400).json({ success: false, message: "Invalid pipeline stage" });
    }
    const candidate = await CandidateService.updatePipelineStage(req.params.id, pipelineStage);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });
    return res.json({ success: true, data: candidate });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update stage" });
  }
}

export async function screenResume(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const candidate = await CandidateService.getCandidateById(id);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

    const job = await JobService.getJobById(String(candidate.jobId));
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const result = await AiScreeningService.screenResume({
      resumeText: candidate.resumeText ?? candidate.name ?? "",
      jobDescription: job.description,
      requiredSkills: job.requiredSkills,
    });

    const updated = await CandidateService.saveAiAnalysis(id, {
      score: result.score,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      missingSkills: result.missingSkills,
      recommendation: result.recommendation,
      summary: result.summary,
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to screen resume" });
  }
}

export async function screenAllCandidates(req: Request, res: Response) {
  try {
    const { jobId } = req.params;
    const job = await JobService.getJobById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const candidates = await CandidateService.getCandidatesByJob(jobId);
    const unscreened = candidates.filter((c) => !c.isScreened);

    for (const candidate of unscreened) {
      const result = await AiScreeningService.screenResume({
        resumeText: candidate.resumeText ?? candidate.name ?? "",
        jobDescription: job.description,
        requiredSkills: job.requiredSkills,
      });
      await CandidateService.saveAiAnalysis(String(candidate._id), result);
    }

    const updatedCandidates = await CandidateService.getCandidatesByJob(jobId);
    return res.json({ success: true, data: updatedCandidates, message: `Screened ${unscreened.length} candidate(s)` });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to screen candidates" });
  }
}

export async function getSkillGapReport(req: Request, res: Response) {
  try {
    const report = await CandidateService.getSkillGapReport(req.params.jobId);
    return res.json({ success: true, data: report });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to generate skill gap report" });
  }
}

export async function getPipelineKanban(req: Request, res: Response) {
  try {
    const kanban = await CandidateService.getPipelineKanban(req.params.jobId);
    return res.json({ success: true, data: kanban });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch pipeline" });
  }
}

export async function deleteCandidate(req: Request, res: Response) {
  try {
    await CandidateService.deleteCandidate(req.params.id);
    return res.json({ success: true, message: "Candidate deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete candidate" });
  }
}
