export type Locale = "uz" | "en";

export type AccentText = {
  before: string;
  accent: string;
  after: string;
};

export type ExperienceContent = {
  role: string;
  summary: string;
};

export type Experience = {
  id: string;
  company: string;
  period: { from: number; to: number | null };
  content: Record<Locale, ExperienceContent>;
};

export type ToolboxGroup = {
  id: string;
  items: string[];
  label: Record<Locale, string>;
};

export type AboutContent = {
  headline: AccentText;
  bio: {
    primary: AccentText;
    secondary: string;
  };
};

export type About = {
  content: Record<Locale, AboutContent>;
  experience: Experience[];
  toolbox: ToolboxGroup[];
};
