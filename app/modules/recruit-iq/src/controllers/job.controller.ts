import type { Request, Response } from "express";
import { JobService } from "../services/job.service";

export async function getAllJobs(req: Request, res: Response) {
  try {
    const jobs = await JobService.getAllJobs();
    return res.json({ success: true, data: jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
}

export async function getJobById(req: Request, res: Response) {
  try {
    const job = await JobService.getJobById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    return res.json({ success: true, data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch job" });
  }
}

export async function createJob(req: Request, res: Response) {
  try {
    const { title, department, location, description, requiredSkills, status } = req.body;
    if (!title || !department || !location || !description) {
      return res.status(400).json({ success: false, message: "title, department, location, description required" });
    }
    const job = await JobService.createJob({
      title,
      department,
      location,
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      status: status ?? "open",
    });
    return res.status(201).json({ success: true, data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create job" });
  }
}

export async function updateJob(req: Request, res: Response) {
  try {
    const job = await JobService.updateJob(req.params.id, req.body);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    return res.json({ success: true, data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update job" });
  }
}

export async function deleteJob(req: Request, res: Response) {
  try {
    await JobService.deleteJob(req.params.id);
    return res.json({ success: true, message: "Job deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete job" });
  }
}

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const stats = await JobService.getDashboardStats();
    return res.json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
  }
}
