import { api } from "@/shared/api/client";
import type {
  About,
  AboutContent,
  Experience,
  ExperienceFormValues,
  Locale,
  ToolboxFormValues,
  ToolboxGroup,
} from "./about.type";

export const aboutApi = {
  async get(): Promise<About> {
    return api.get<About>("/api/about");
  },

  async updateContent(content: Record<Locale, AboutContent>) {
    return api.patch<Record<Locale, AboutContent>>("/api/about/content", { content });
  },

  async createExperience(values: ExperienceFormValues): Promise<Experience> {
    return api.post<Experience>("/api/about/experience", values);
  },

  async updateExperience(id: string, values: ExperienceFormValues): Promise<Experience> {
    const { company, period, content } = values;
    return api.patch<Experience>(`/api/about/experience/${id}`, { company, period, content });
  },

  async removeExperience(id: string): Promise<void> {
    await api.delete(`/api/about/experience/${id}`);
  },

  async createToolboxGroup(values: ToolboxFormValues): Promise<ToolboxGroup> {
    return api.post<ToolboxGroup>("/api/about/toolbox", values);
  },

  async updateToolboxGroup(id: string, values: ToolboxFormValues): Promise<ToolboxGroup> {
    const { label, items, position } = values;
    return api.patch<ToolboxGroup>(`/api/about/toolbox/${id}`, {
      label,
      items,
      ...(position === undefined ? {} : { position }),
    });
  },

  async removeToolboxGroup(id: string): Promise<void> {
    await api.delete(`/api/about/toolbox/${id}`);
  },
};


const API_BASE_URL = process.env.API_BASE_URL;

export async function getAboutServer(): Promise<About> {
  const res = await fetch(`${API_BASE_URL}/api/about`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch about");
  const json = await res.json();
  return json.data;
}