import { createLogger } from "~/lib/logger";
import { JobModel } from "../models/job.model";
import { CandidateModel } from "../models/candidate.model";

const logger = createLogger("RecruitIQSeed");

export async function seedRecruitIQ(): Promise<void> {
  try {
    const existingJobs = await JobModel.countDocuments({});
    if (existingJobs > 0) {
      logger.info("RecruitIQ seed already exists, skipping");
      return;
    }

    logger.info("Seeding RecruitIQ demo data...");

    const jobs = await JobModel.insertMany([
      {
        title: "Senior Frontend Engineer",
        department: "Engineering",
        location: "Remote",
        description:
          "We're looking for an experienced Frontend Engineer to build high-quality user interfaces for our SaaS platform. You'll work closely with design and backend teams to deliver fast, accessible, and beautiful web experiences.",
        requiredSkills: ["React", "TypeScript", "CSS", "GraphQL", "Git"],
        status: "open",
        applicantCount: 0,
        screenedCount: 0,
      },
      {
        title: "Product Manager",
        department: "Product",
        location: "New York, NY",
        description:
          "Drive the strategy and roadmap for our core product. You will collaborate with engineering, design, and business stakeholders to define, build, and ship features that matter to our users.",
        requiredSkills: ["Product Management", "Agile", "Data Analysis", "Communication", "SQL"],
        status: "open",
        applicantCount: 0,
        screenedCount: 0,
      },
      {
        title: "Machine Learning Engineer",
        department: "AI/ML",
        location: "San Francisco, CA",
        description:
          "Join our AI team to build and deploy machine learning models that power our core product features including recommendations, ranking, and NLP capabilities.",
        requiredSkills: ["Python", "Machine Learning", "TensorFlow", "NLP", "SQL", "Docker"],
        status: "open",
        applicantCount: 0,
        screenedCount: 0,
      },
    ]);

    const candidateSeedData = [
      // Frontend Engineer candidates
      {
        jobId: jobs[0]._id,
        name: "Alex Carter",
        email: "alex.carter@email.com",
        resumeText:
          "Senior Frontend Engineer with 6 years of experience. Expert in React, TypeScript, and modern CSS. Built multiple high-scale web applications. Proficient in GraphQL and REST APIs. Strong knowledge of Git workflows and CI/CD. Bachelor's degree in Computer Science.",
        extractedSkills: ["React", "TypeScript", "CSS", "GraphQL", "Git"],
        pipelineStage: "Applied",
        isScreened: false,
      },
      {
        jobId: jobs[0]._id,
        name: "Jordan Lee",
        email: "jordan.lee@email.com",
        resumeText:
          "Frontend developer with 3 years building React applications. Comfortable with JavaScript and some TypeScript. Managed Git repositories on team projects. Bachelor's degree in Computer Science.",
        extractedSkills: ["React", "JavaScript", "Git"],
        pipelineStage: "Applied",
        isScreened: false,
      },
      {
        jobId: jobs[0]._id,
        name: "Sam Rivera",
        email: "sam.rivera@email.com",
        resumeText:
          "5 years of frontend experience. Deep expertise in React, TypeScript, CSS, and modern tooling. Led frontend architecture redesign at previous company. Experienced with GraphQL. Senior developer background. Master's degree in Software Engineering.",
        extractedSkills: ["React", "TypeScript", "CSS", "GraphQL", "Git"],
        pipelineStage: "Applied",
        isScreened: false,
      },
      // Product Manager candidates
      {
        jobId: jobs[1]._id,
        name: "Morgan Chen",
        email: "morgan.chen@email.com",
        resumeText:
          "Product Manager with 7 years in B2B SaaS. Led cross-functional teams using Agile. Proficient in SQL for data analysis. Strong communication skills. Built and shipped features used by 50,000+ users. Bachelor's degree in Business.",
        extractedSkills: ["Product Management", "Agile", "SQL", "Communication"],
        pipelineStage: "Applied",
        isScreened: false,
      },
      {
        jobId: jobs[1]._id,
        name: "Taylor Brooks",
        email: "taylor.brooks@email.com",
        resumeText:
          "Associate PM with 2 years experience. Worked on consumer mobile apps. Some Agile experience. Good communication. No formal data analysis background. Bachelor's degree in Marketing.",
        extractedSkills: ["Product Management", "Agile", "Communication"],
        pipelineStage: "Applied",
        isScreened: false,
      },
      // ML Engineer candidates
      {
        jobId: jobs[2]._id,
        name: "Casey Zhang",
        email: "casey.zhang@email.com",
        resumeText:
          "ML Engineer with 4 years developing NLP and recommendation models using Python, TensorFlow, and PyTorch. Deployed models with Docker and Kubernetes. Strong SQL skills for data pipelines. Published research in NLP. Master's degree in Machine Learning.",
        extractedSkills: ["Python", "Machine Learning", "TensorFlow", "NLP", "SQL", "Docker"],
        pipelineStage: "Applied",
        isScreened: false,
      },
      {
        jobId: jobs[2]._id,
        name: "Jamie Patel",
        email: "jamie.patel@email.com",
        resumeText:
          "Data scientist with Python and scikit-learn experience. Some machine learning projects in academic setting. Limited production ML deployment experience. Bachelor's degree in Statistics.",
        extractedSkills: ["Python", "Machine Learning", "SQL"],
        pipelineStage: "Applied",
        isScreened: false,
      },
    ];

    await CandidateModel.insertMany(candidateSeedData);

    // Update job counts
    for (const job of jobs) {
      const count = candidateSeedData.filter(
        (c) => c.jobId.toString() === job._id.toString()
      ).length;
      await JobModel.findByIdAndUpdate(job._id, { $set: { applicantCount: count } });
    }

    logger.info("✅ RecruitIQ demo data seeded successfully");
  } catch (error) {
    logger.error("❌ Failed to seed RecruitIQ data:", error);
  }
}
