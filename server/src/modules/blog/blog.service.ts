import { ApiError } from "../../shared/ApiError";
import { prisma } from "../../shared/prisma";
import { slugify } from "../../shared/slugify";
import { toBlogPostResponse } from "./blog.mapper";
import type { CreateBlogPostInput, UpdateBlogPostInput } from "./blog.validation";

class BlogService {
  async findAll() {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return posts.map(toBlogPostResponse);
  }

  async findBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      throw new ApiError(404, "Post topilmadi");
    }
    return toBlogPostResponse(post);
  }

  async create(input: CreateBlogPostInput) {
    const slug = this.resolveSlug(input.slug, input.content.uz.title);
    await this.assertSlugIsFree(slug);

    const post = await prisma.blogPost.create({
      data: {
        slug,
        theme: input.theme,
        createdAt: input.createdAt ? new Date(input.createdAt) : undefined,
        uz: input.content.uz,
        en: input.content.en,
      },
    });
    return toBlogPostResponse(post);
  }

  async update(slug: string, input: UpdateBlogPostInput) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) {
      throw new ApiError(404, "Post topilmadi");
    }

    if (input.slug && input.slug !== existing.slug) {
      await this.assertSlugIsFree(input.slug);
    }

    const post = await prisma.blogPost.update({
      where: { id: existing.id },
      data: {
        slug: input.slug,
        theme: input.theme,
        createdAt: input.createdAt ? new Date(input.createdAt) : undefined,
        uz: input.content?.uz,
        en: input.content?.en,
      },
    });
    return toBlogPostResponse(post);
  }

  async remove(slug: string) {
    const existing = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
    if (!existing) {
      throw new ApiError(404, "Post topilmadi");
    }

    await prisma.blogPost.delete({ where: { id: existing.id } });
  }

  private resolveSlug(slug: string | undefined, title: string) {
    const resolved = slug ?? slugify(title);
    if (!resolved) {
      throw new ApiError(400, "title'dan slug yasab bo'lmadi, slug'ni qo'lda kiriting");
    }
    return resolved;
  }

  private async assertSlugIsFree(slug: string) {
    const exists = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
    if (exists) {
      throw new ApiError(409, "Bunday slug bilan post allaqachon mavjud");
    }
  }
}

export const blogService = new BlogService();
