import { ApiError } from "../../shared/ApiError";
import { prisma } from "../../shared/prisma";
import {
  ABOUT_ID,
  DEFAULT_ABOUT_CONTENT,
  toAboutContentResponse,
  toExperienceResponse,
  toToolboxGroupResponse,
  type AboutResponse,
} from "./about.mapper";
import type {
  CreateExperienceInput,
  CreateToolboxGroupInput,
  UpdateAboutContentInput,
  UpdateExperienceInput,
  UpdateToolboxGroupInput,
} from "./about.validation";

class AboutService {
  async find(): Promise<AboutResponse> {
    const [content, experiences, toolbox] = await Promise.all([
      prisma.aboutContent.findUnique({ where: { id: ABOUT_ID } }),
      prisma.experience.findMany({ orderBy: [{ fromYear: "desc" }, { createdAt: "desc" }] }),
      prisma.toolboxGroup.findMany({ orderBy: [{ position: "asc" }, { createdAt: "asc" }] }),
    ]);

    return {
      content: content ? toAboutContentResponse(content) : DEFAULT_ABOUT_CONTENT,
      experience: experiences.map(toExperienceResponse),
      toolbox: toolbox.map(toToolboxGroupResponse),
    };
  }

  async updateContent(input: UpdateAboutContentInput) {
    const content = await prisma.aboutContent.upsert({
      where: { id: ABOUT_ID },
      create: { id: ABOUT_ID, uz: input.content.uz, en: input.content.en },
      update: { uz: input.content.uz, en: input.content.en },
    });
    return toAboutContentResponse(content);
  }

  async createExperience(input: CreateExperienceInput) {
    await this.assertExperienceKeyIsFree(input.id);

    const experience = await prisma.experience.create({
      data: {
        key: input.id,
        company: input.company,
        fromYear: input.period.from,
        toYear: input.period.to,
        uz: input.content.uz,
        en: input.content.en,
      },
    });
    return toExperienceResponse(experience);
  }

  async updateExperience(key: string, input: UpdateExperienceInput) {
    const existing = await this.findExperienceOrThrow(key);

    const experience = await prisma.experience.update({
      where: { id: existing.id },
      data: {
        company: input.company,
        fromYear: input.period?.from,
        toYear: input.period?.to,
        uz: input.content?.uz,
        en: input.content?.en,
      },
    });
    return toExperienceResponse(experience);
  }

  async removeExperience(key: string) {
    const existing = await this.findExperienceOrThrow(key);
    await prisma.experience.delete({ where: { id: existing.id } });
  }

  async createToolboxGroup(input: CreateToolboxGroupInput) {
    await this.assertToolboxKeyIsFree(input.id);

    const group = await prisma.toolboxGroup.create({
      data: {
        key: input.id,
        position: input.position ?? (await this.nextToolboxPosition()),
        labelUz: input.label.uz,
        labelEn: input.label.en,
        items: input.items,
      },
    });
    return toToolboxGroupResponse(group);
  }

  async updateToolboxGroup(key: string, input: UpdateToolboxGroupInput) {
    const existing = await this.findToolboxGroupOrThrow(key);

    const group = await prisma.toolboxGroup.update({
      where: { id: existing.id },
      data: {
        position: input.position,
        labelUz: input.label?.uz,
        labelEn: input.label?.en,
        items: input.items,
      },
    });
    return toToolboxGroupResponse(group);
  }

  async removeToolboxGroup(key: string) {
    const existing = await this.findToolboxGroupOrThrow(key);
    await prisma.toolboxGroup.delete({ where: { id: existing.id } });
  }

  private async nextToolboxPosition() {
    const last = await prisma.toolboxGroup.findFirst({
      orderBy: { position: "desc" },
      select: { position: true },
    });
    return last ? last.position + 1 : 0;
  }

  private async findExperienceOrThrow(key: string) {
    const experience = await prisma.experience.findUnique({ where: { key }, select: { id: true } });
    if (!experience) {
      throw new ApiError(404, "Tajriba topilmadi");
    }
    return experience;
  }

  private async findToolboxGroupOrThrow(key: string) {
    const group = await prisma.toolboxGroup.findUnique({ where: { key }, select: { id: true } });
    if (!group) {
      throw new ApiError(404, "Toolbox guruhi topilmadi");
    }
    return group;
  }

  private async assertExperienceKeyIsFree(key: string) {
    const exists = await prisma.experience.findUnique({ where: { key }, select: { id: true } });
    if (exists) {
      throw new ApiError(409, "Bunday id bilan tajriba allaqachon mavjud");
    }
  }

  private async assertToolboxKeyIsFree(key: string) {
    const exists = await prisma.toolboxGroup.findUnique({ where: { key }, select: { id: true } });
    if (exists) {
      throw new ApiError(409, "Bunday id bilan toolbox guruhi allaqachon mavjud");
    }
  }
}

export const aboutService = new AboutService();
