/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  font: TFont;
  appTagline?: string;
  appDescription?: string;
  maxResumeFileSizeMB?: number;
  maxCandidatesPerJob?: number;
  aiScoreThresholdHire?: number;
  aiScoreThresholdMaybe?: number;
  defaultPipelineStage?: string;
  enableSkillGapReport?: boolean;
  enableAiRecommendations?: boolean;
  orgName?: string;
  footerText?: string;
  dashboardWelcomeMessage?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "RecruitIQ",
  logoUrl: "",
  brandColor: {
    // Base
    background:        "#ffffff",
    foreground:        "#0F1F33",
    // Card
    card:              "#F5F8FC",
    cardForeground:    "#0F1F33",
    // Popover
    popover:           "#ffffff",
    popoverForeground: "#0F1F33",
    // Primary
    primary:           "#1E3A5F",
    primaryForeground: "#ffffff",
    // Secondary
    secondary:           "#EDF1F7",
    secondaryForeground: "#1E3A5F",
    // Muted
    muted:           "#EDF1F7",
    mutedForeground: "#5A7089",
    // Accent
    accent:           "#2D7DD2",
    accentForeground: "#ffffff",
    // Destructive
    destructive:           "#D93025",
    destructiveForeground: "#ffffff",
    // Border / Input / Ring
    border: "#C8D8E8",
    input:  "#C8D8E8",
    ring:   "#2D7DD2",
    // Charts
    chart1: "#2D7DD2",
    chart2: "#1E3A5F",
    chart3: "#4AA8D8",
    chart4: "#A8C7E8",
    chart5: "#5A7089",
    // Navbar
    navbarBackground: "#1E3A5F",
    // Sidebar
    sidebarBackground:        "#162E4D",
    sidebarForeground:        "#E8F0F9",
    sidebarPrimary:           "#2D7DD2",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent:            "#1E3A5F",
    sidebarAccentForeground:  "#E8F0F9",
    sidebarBorder:            "#243F5E",
    sidebarRing:              "#2D7DD2",
  },
  font: {
    headingFont: "Space Grotesk",
    textFont: "Inter",
  },
  // ── RecruitIQ Defaults ────────────────────────────────────────────────
  appTagline: "Screen smarter. Hire faster.",
  appDescription: "AI-powered resume screening for recruiters and hiring managers.",
  maxResumeFileSizeMB: 10,
  maxCandidatesPerJob: 500,
  aiScoreThresholdHire: 75,
  aiScoreThresholdMaybe: 50,
  defaultPipelineStage: "Applied",
  enableSkillGapReport: true,
  enableAiRecommendations: true,
  orgName: "RecruitIQ",
  footerText: "RecruitIQ — Screen smarter. Hire faster.",
  dashboardWelcomeMessage: "Welcome back! Here's your hiring overview.",
};
