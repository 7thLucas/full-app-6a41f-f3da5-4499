import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

export class AiAnalysis {
  @prop({ type: Number, default: 0 })
  score!: number;

  @prop({ type: [String], default: [] })
  strengths!: string[];

  @prop({ type: [String], default: [] })
  weaknesses!: string[];

  @prop({ type: [String], default: [] })
  missingSkills!: string[];

  @prop({ type: String, enum: ["Hire", "Maybe", "Reject"], default: "Maybe" })
  recommendation!: string;

  @prop({ type: String, default: "" })
  summary!: string;
}

@modelOptions({
  schemaOptions: {
    collection: "tbl_candidates",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Candidate extends CommonTypegooseEntity {
  @prop({ type: Types.ObjectId, required: true, ref: "Job" })
  jobId!: Types.ObjectId;

  @prop({ type: String, required: true, trim: true })
  name!: string;

  @prop({ type: String, required: false, trim: true })
  email?: string;

  @prop({ type: String, required: false })
  phone?: string;

  @prop({ type: String, required: false })
  resumeUrl?: string;

  @prop({ type: String, required: false })
  resumeText?: string;

  @prop({ type: [String], default: [] })
  extractedSkills!: string[];

  @prop({
    type: String,
    enum: ["Applied", "Screened", "Shortlisted", "Interview", "Offer", "Hired", "Rejected"],
    default: "Applied",
  })
  pipelineStage!: string;

  @prop({ type: () => AiAnalysis, default: () => ({}) })
  aiAnalysis!: AiAnalysis;

  @prop({ type: Boolean, default: false })
  isScreened!: boolean;
}

export const CandidateModel = getModelForClass(Candidate);
