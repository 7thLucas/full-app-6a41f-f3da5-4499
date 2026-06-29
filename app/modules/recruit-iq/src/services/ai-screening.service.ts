/**
 * AI Screening Service
 * Simulates AI resume analysis. In production, this would call an LLM API.
 * For MVP, uses keyword matching + scoring to produce realistic output.
 */

interface ScreeningInput {
  resumeText: string;
  jobDescription: string;
  requiredSkills: string[];
}

interface ScreeningResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  recommendation: "Hire" | "Maybe" | "Reject";
  summary: string;
  extractedSkills: string[];
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s+#]/g, " ");
}

function extractSkillsFromText(text: string, knownSkills: string[]): string[] {
  const normalized = normalizeText(text);
  const found: string[] = [];
  for (const skill of knownSkills) {
    if (normalized.includes(skill.toLowerCase())) {
      found.push(skill);
    }
  }
  return found;
}

const COMMON_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
  "React", "Vue", "Angular", "Node.js", "Express", "Next.js", "Remix",
  "SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes",
  "Git", "CI/CD", "Agile", "Scrum",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP",
  "REST API", "GraphQL", "Microservices",
  "Leadership", "Communication", "Problem Solving", "Teamwork",
  "Project Management", "Product Management",
  "Marketing", "Sales", "Customer Success",
  "Data Analysis", "Excel", "Tableau", "Power BI",
  "Figma", "UI/UX", "Sketch",
];

export class AiScreeningService {
  static async screenResume(input: ScreeningInput): Promise<ScreeningResult> {
    const { resumeText, requiredSkills } = input;

    // Combine required skills with common skills for extraction
    const allSkills = [...new Set([...requiredSkills, ...COMMON_SKILLS])];
    const extractedSkills = extractSkillsFromText(resumeText, allSkills);

    // Match required skills
    const matchedRequired = requiredSkills.filter((skill) =>
      normalizeText(resumeText).includes(skill.toLowerCase())
    );
    const missingSkills = requiredSkills.filter((skill) =>
      !normalizeText(resumeText).includes(skill.toLowerCase())
    );

    // Scoring: base on required skill match ratio
    const matchRatio = requiredSkills.length > 0
      ? matchedRequired.length / requiredSkills.length
      : 0.5;

    // Experience keywords for bonus
    const experienceKeywords = ["years", "led", "managed", "built", "designed", "developed", "senior", "lead"];
    const expBonus = experienceKeywords.filter((k) =>
      normalizeText(resumeText).includes(k)
    ).length;

    // Education bonus
    const eduBonus =
      normalizeText(resumeText).includes("bachelor") ||
      normalizeText(resumeText).includes("master") ||
      normalizeText(resumeText).includes("phd")
        ? 5
        : 0;

    const baseScore = Math.round(matchRatio * 70);
    const bonus = Math.min(expBonus * 3, 20) + eduBonus;
    const rawScore = Math.min(baseScore + bonus, 100);
    // Add slight variance to avoid mechanical look
    const score = Math.max(10, Math.min(100, rawScore + Math.floor(Math.random() * 5)));

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (matchedRequired.length > 0) {
      strengths.push(`Demonstrates ${matchedRequired.slice(0, 3).join(", ")} skills matching job requirements`);
    }
    if (expBonus >= 3) {
      strengths.push("Resume shows clear evidence of hands-on experience and leadership");
    }
    if (eduBonus > 0) {
      strengths.push("Relevant academic background in field");
    }
    if (extractedSkills.length > matchedRequired.length) {
      strengths.push(`Broad technical skill set including ${extractedSkills.filter(s => !requiredSkills.includes(s)).slice(0, 2).join(", ")}`);
    }

    if (missingSkills.length > 0) {
      weaknesses.push(`Lacks required skills: ${missingSkills.slice(0, 3).join(", ")}`);
    }
    if (expBonus < 2) {
      weaknesses.push("Limited evidence of relevant work experience in resume");
    }
    if (resumeText.length < 300) {
      weaknesses.push("Resume appears brief — may lack detail on responsibilities and accomplishments");
    }

    let recommendation: "Hire" | "Maybe" | "Reject";
    if (score >= 75) recommendation = "Hire";
    else if (score >= 50) recommendation = "Maybe";
    else recommendation = "Reject";

    const summary = `Candidate matches ${matchedRequired.length} of ${requiredSkills.length} required skills (${Math.round(matchRatio * 100)}% match). Overall AI fit score: ${score}/100. Recommendation: ${recommendation}.`;

    return {
      score,
      strengths: strengths.length > 0 ? strengths : ["Candidate profile meets basic criteria"],
      weaknesses: weaknesses.length > 0 ? weaknesses : ["No major gaps identified"],
      missingSkills,
      recommendation,
      summary,
      extractedSkills,
    };
  }
}
