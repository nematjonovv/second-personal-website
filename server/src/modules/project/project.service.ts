import { ApiError } from "../../shared/ApiError";
import { imageToWebp, removeUploads } from "../../shared/imageToWebp";
import { prisma } from "../../shared/prisma";
import { slugify } from "../../shared/slugify";
import { toProjectResponse } from "./project.mapper";
import type { CreateProjectInput, UpdateProjectInput } from "./project.validation";

const UPLOAD_FOLDER = "projects";

type UploadedFile = { buffer: Buffer };

class ProjectService {
  async findAll() {
    const projects = await prisma.project.findMany({
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
    return projects.map(toProjectResponse);
  }

  async findBySlug(slug: string) {
    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project) {
      throw new ApiError(404, "Proyekt topilmadi");
    }
    return toProjectResponse(project);
  }

  async create(input: CreateProjectInput, files: UploadedFile[]) {
    if (files.length === 0) {
      throw new ApiError(400, "Kamida bitta rasm yuklanishi kerak");
    }

    const slug = this.resolveSlug(input.slug, input.title);
    await this.assertSlugIsFree(slug);

    const gallery = await this.storeImages(files);

    try {
      const project = await prisma.project.create({
        data: {
          slug,
          title: input.title,
          month: input.date.month,
          year: input.date.year,
          techStack: input.techStack,
          role: input.role,
          gallery,
          githubUrl: input.githubUrl || null,
          liveUrl: input.liveUrl || null,
          uz: input.content.uz,
          en: input.content.en,
        },
      });
      return toProjectResponse(project);
    } catch (error) {
      await removeUploads(gallery);
      throw error;
    }
  }

  async update(slug: string, input: UpdateProjectInput, files: UploadedFile[]) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing) {
      throw new ApiError(404, "Proyekt topilmadi");
    }

    if (input.slug && input.slug !== existing.slug) {
      await this.assertSlugIsFree(input.slug);
    }

    const { gallery, removed } = await this.resolveGallery(existing.gallery, input.gallery, files);

    try {
      const project = await prisma.project.update({
        where: { id: existing.id },
        data: {
          slug: input.slug,
          title: input.title,
          month: input.date?.month,
          year: input.date?.year,
          techStack: input.techStack,
          role: input.role,
          gallery,
          githubUrl: input.githubUrl === undefined ? undefined : input.githubUrl || null,
          liveUrl: input.liveUrl === undefined ? undefined : input.liveUrl || null,
          uz: input.content?.uz,
          en: input.content?.en,
        },
      });

      await removeUploads(removed);
      return toProjectResponse(project);
    } catch (error) {
      await removeUploads(gallery.filter((path) => !existing.gallery.includes(path)));
      throw error;
    }
  }

  async remove(slug: string) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing) {
      throw new ApiError(404, "Proyekt topilmadi");
    }

    await prisma.project.delete({ where: { id: existing.id } });
    await removeUploads(existing.gallery);
  }

  private async resolveGallery(
    current: string[],
    keepInput: string[] | undefined,
    files: UploadedFile[],
  ): Promise<{ gallery: string[]; removed: string[] }> {
    if (keepInput === undefined && files.length === 0) {
      return { gallery: current, removed: [] };
    }

    const keep = keepInput ?? current;
    const unknownPath = keep.find((path) => !current.includes(path));
    if (unknownPath) {
      throw new ApiError(400, `Bu rasm proyektga tegishli emas: ${unknownPath}`);
    }

    const uploaded = await this.storeImages(files);
    const gallery = [...keep, ...uploaded];

    if (gallery.length === 0) {
      await removeUploads(uploaded);
      throw new ApiError(400, "Kamida bitta rasm qolishi kerak");
    }

    return { gallery, removed: current.filter((path) => !keep.includes(path)) };
  }

  private storeImages(files: UploadedFile[]) {
    return Promise.all(files.map((file) => imageToWebp(file.buffer, UPLOAD_FOLDER)));
  }

  private resolveSlug(slug: string | undefined, title: string) {
    const resolved = slug ?? slugify(title);
    if (!resolved) {
      throw new ApiError(400, "title'dan slug yasab bo'lmadi, slug'ni qo'lda kiriting");
    }
    return resolved;
  }

  private async assertSlugIsFree(slug: string) {
    const exists = await prisma.project.findUnique({ where: { slug }, select: { id: true } });
    if (exists) {
      throw new ApiError(409, "Bunday slug bilan proyekt allaqachon mavjud");
    }
  }
}

export const projectService = new ProjectService();
