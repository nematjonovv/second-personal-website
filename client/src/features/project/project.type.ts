export type Locale = "uz" | "en";

export type ProjectContent = {
  description: string;
  problem: string;
  solution: string;
  myContribution: string[];
  challenge: string;
  result: string[];
};

export type Project = {
  slug: string;
  title: string;
  date: {
    month: number;
    year: number;
  };
  techStack: string[];
  role: string[];
  gallery: string[];
  githubUrl?: string;
  liveUrl?: string;
  content: Record<Locale, ProjectContent>;
};
