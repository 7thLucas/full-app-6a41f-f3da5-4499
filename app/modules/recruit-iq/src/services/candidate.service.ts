import { Types } from "mongoose";
import { CandidateModel } from "../models/candidate.model";
import { JobModel } from "../models/job.model";

export class CandidateService {
  static async getCandidatesByJob(jobId: string) {
    return CandidateModel.find({ jobId: new Types.ObjectId(jobId), deletedAt: null })
      .sort({ "aiAnalysis.score": -1 })
      .lean();
  }

  static async getCandidateById(id: string) {
    return CandidateModel.findOne({ _id: id, deletedAt: null }).lean();
  }

  static async createCandidate(data: {
    jobId: string;
    name: string;
    email?: string;
    phone?: string;
    resumeText?: string;
    resumeUrl?: string;
    extractedSkills?: string[];
    pipelineStage?: string;
  }) {
    const candidate = await CandidateModel.create({
      ...data,
      jobId: new Types.ObjectId(data.jobId),
    });

    // Recalculate job applicant count
    const count = await CandidateModel.countDocuments({
      jobId: new Types.ObjectId(data.jobId),
      deletedAt: null,
    });
    await JobModel.findByIdAndUpdate(data.jobId, { $set: { applicantCount: count } });

    return candidate;
  }

  static async updatePipelineStage(id: string, pipelineStage: string) {
    const candidate = await CandidateModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { pipelineStage } },
      { new: true }
    ).lean();

    // Update screened count on job
    if (candidate && candidate.jobId) {
      const screenedCount = await CandidateModel.countDocuments({
        jobId: candidate.jobId,
        deletedAt: null,
        pipelineStage: { $ne: "Applied" },
      });
      await JobModel.findByIdAndUpdate(candidate.jobId, { $set: { screenedCount } });
    }

    return candidate;
  }

  static async saveAiAnalysis(
    id: string,
    analysis: {
      score: number;
      strengths: string[];
      weaknesses: string[];
      missingSkills: string[];
      recommendation: string;
      summary: string;
    }
  ) {
    return CandidateModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { aiAnalysis: analysis, isScreened: true } },
      { new: true }
    ).lean();
  }

  static async deleteCandidate(id: string) {
    const candidate = await CandidateModel.findOneAndUpdate(
      { _id: id },
      { $set: { deletedAt: new Date() } },
      { new: true }
    ).lean();

    if (candidate && candidate.jobId) {
      const count = await CandidateModel.countDocuments({
        jobId: candidate.jobId,
        deletedAt: null,
      });
      await JobModel.findByIdAndUpdate(candidate.jobId, { $set: { applicantCount: count } });
    }

    return candidate;
  }

  static async getSkillGapReport(jobId: string) {
    const job = await JobModel.findById(jobId).lean();
    const candidates = await CandidateModel.find({
      jobId: new Types.ObjectId(jobId),
      deletedAt: null,
      isScreened: true,
    }).lean();

    if (!job || candidates.length === 0) {
      return { jobTitle: job?.title ?? "", requiredSkills: [], skillGaps: [], totalScreened: 0 };
    }

    const skillGapMap: Record<string, number> = {};
    for (const candidate of candidates) {
      for (const skill of (candidate.aiAnalysis?.missingSkills ?? [])) {
        skillGapMap[skill] = (skillGapMap[skill] ?? 0) + 1;
      }
    }

    const skillGaps = Object.entries(skillGapMap)
      .map(([skill, count]) => ({ skill, count, percentage: Math.round((count / candidates.length) * 100) }))
      .sort((a, b) => b.count - a.count);

    return {
      jobTitle: job.title,
      requiredSkills: job.requiredSkills,
      skillGaps,
      totalScreened: candidates.length,
    };
  }

  static async getPipelineKanban(jobId: string) {
    const candidates = await CandidateModel.find({
      jobId: new Types.ObjectId(jobId),
      deletedAt: null,
    })
      .sort({ "aiAnalysis.score": -1 })
      .lean();

    const stages = ["Applied", "Screened", "Shortlisted", "Interview", "Offer", "Hired", "Rejected"];
    const kanban: Record<string, typeof candidates> = {};
    for (const stage of stages) {
      kanban[stage] = candidates.filter((c) => c.pipelineStage === stage);
    }

    return kanban;
  }
}
