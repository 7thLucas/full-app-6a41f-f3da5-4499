import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

@modelOptions({
  schemaOptions: {
    collection: "tbl_jobs",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Job extends CommonTypegooseEntity {
  @prop({ type: String, required: true, trim: true })
  title!: string;

  @prop({ type: String, required: true })
  department!: string;

  @prop({ type: String, required: true })
  location!: string;

  @prop({ type: String, required: true })
  description!: string;

  @prop({ type: [String], default: [] })
  requiredSkills!: string[];

  @prop({ type: String, enum: ["open", "closed", "draft"], default: "open" })
  status!: string;

  @prop({ type: Number, default: 0 })
  applicantCount!: number;

  @prop({ type: Number, default: 0 })
  screenedCount!: number;
}

export const JobModel = getModelForClass(Job);
