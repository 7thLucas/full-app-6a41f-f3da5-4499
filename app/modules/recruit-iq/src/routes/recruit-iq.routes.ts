import { Router } from "express";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getDashboardStats,
} from "../controllers/job.controller";
import {
  getCandidatesByJob,
  getCandidateById,
  createCandidate,
  updatePipelineStage,
  screenResume,
  screenAllCandidates,
  getSkillGapReport,
  getPipelineKanban,
  deleteCandidate,
} from "../controllers/candidate.controller";

const router = Router();

// ── Jobs ──────────────────────────────────────────────────────────────────────
router.get("/recruit-iq/dashboard", getDashboardStats);
router.get("/recruit-iq/jobs", getAllJobs);
router.post("/recruit-iq/jobs", createJob);
router.get("/recruit-iq/jobs/:id", getJobById);
router.put("/recruit-iq/jobs/:id", updateJob);
router.delete("/recruit-iq/jobs/:id", deleteJob);

// ── Candidates ────────────────────────────────────────────────────────────────
router.get("/recruit-iq/jobs/:jobId/candidates", getCandidatesByJob);
router.post("/recruit-iq/jobs/:jobId/candidates", createCandidate);
router.post("/recruit-iq/jobs/:jobId/screen-all", screenAllCandidates);
router.get("/recruit-iq/jobs/:jobId/kanban", getPipelineKanban);
router.get("/recruit-iq/jobs/:jobId/skill-gap", getSkillGapReport);
router.get("/recruit-iq/candidates/:id", getCandidateById);
router.put("/recruit-iq/candidates/:id/stage", updatePipelineStage);
router.post("/recruit-iq/candidates/:id/screen", screenResume);
router.delete("/recruit-iq/candidates/:id", deleteCandidate);

export default router;
