import { JobModel } from "../models/job.model";
import type { Types } from "mongoose";

export class JobService {
  static async getAllJobs() {
    return JobModel.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();
  }

  static async getJobById(id: string) {
    return JobModel.findOne({ _id: id, deletedAt: null }).lean();
  }

  static async createJob(data: {
    title: string;
    department: string;
    location: string;
    description: string;
    requiredSkills: string[];
    status?: string;
  }) {
    return JobModel.create(data);
  }

  static async updateJob(id: string, data: Partial<{
    title: string;
    department: string;
    location: string;
    description: string;
    requiredSkills: string[];
    status: string;
  }>) {
    return JobModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: data },
      { new: true }
    ).lean();
  }

  static async deleteJob(id: string) {
    return JobModel.findOneAndUpdate(
      { _id: id },
      { $set: { deletedAt: new Date() } },
      { new: true }
    ).lean();
  }

  static async updateCounts(jobId: string, applicantCount?: number, screenedCount?: number) {
    const update: any = {};
    if (typeof applicantCount === "number") update.applicantCount = applicantCount;
    if (typeof screenedCount === "number") update.screenedCount = screenedCount;
    return JobModel.findByIdAndUpdate(jobId, { $set: update }, { new: true }).lean();
  }

  static async getDashboardStats() {
    const [totalJobs, openJobs, jobs] = await Promise.all([
      JobModel.countDocuments({ deletedAt: null }),
      JobModel.countDocuments({ deletedAt: null, status: "open" }),
      JobModel.find({ deletedAt: null, status: "open" })
        .select("_id title department applicantCount screenedCount")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    return { totalJobs, openJobs, jobs };
  }
}
