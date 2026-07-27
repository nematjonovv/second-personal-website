"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Field from "@/components/admin/Field";
import LocaleTabs from "@/components/admin/LocaleTabs";
import SelectField from "@/components/admin/SelectField";
import SubmitButton from "@/components/admin/SubmitButton";
import { useToast } from "@/shared/providers/ToastProvider";
import { BLOG_THEMES, type BlogFormValues, type BlogPost, type Locale } from "../blog.type";
import { useCreateBlogPost, useUpdateBlogPost } from "../blog.hook";
import MarkdownEditor from "./MarkdownEditor";

function toLocalInput(iso: string): string {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function toValues(post: BlogPost): BlogFormValues {
  return {
    slug: post.slug,
    theme: post.theme,
    createdAt: toLocalInput(post.createdAt),
    content: post.content,
  };
}

const emptyValues: BlogFormValues = {
  slug: "",
  theme: BLOG_THEMES[0],
  createdAt: "",
  content: {
    uz: { title: "", post: "" },
    en: { title: "", post: "" },
  },
};

const section = "flex flex-col gap-5 border-2 border-ink p-6";
const sectionTitle = "font-display text-lg uppercase tracking-tight text-ink";

export default function BlogAdminForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations("BlogPage.themes");
  const [values, setValues] = useState<BlogFormValues>(post ? toValues(post) : emptyValues);
  const [locale, setLocale] = useState<Locale>("uz");

  const create = useCreateBlogPost();
  const update = useUpdateBlogPost(post?.slug ?? "");
  const mutation = post ? update : create;

  const themeOptions = BLOG_THEMES.map((theme) => ({ value: theme, label: t(theme) }));

  const setContent = (field: "title" | "post", value: string) =>
    setValues((previous) => ({
      ...previous,
      content: {
        ...previous.content,
        [locale]: { ...previous.content[locale], [field]: value },
      },
    }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const back = () => {
      toast(post ? "Post saqlandi" : "Post yaratildi");
      router.push("/admin/blog");
    };

    if (post) {
      update.mutate(values, { onSuccess: back });
      return;
    }

    create.mutate(values, { onSuccess: back });
  };

  const content = values.content[locale];

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
      <div className={section}>
        <h2 className={sectionTitle}>Asosiy</h2>

        <SelectField
          name="theme"
          label="Mavzu"
          value={values.theme}
          options={themeOptions}
          onChange={(theme) => setValues((previous) => ({ ...previous, theme }))}
          hint="yorliqlar messages/{uz,en}.json dagi BlogPage.themes dan olinadi"
        />

        <Field
          name="slug"
          label="Slug"
          value={values.slug}
          onChange={(slug) => setValues((previous) => ({ ...previous, slug }))}
          hint={
            post
              ? "o'zgartirilsa URL ham o'zgaradi"
              : "bo'sh qoldirilsa o'zbekcha sarlavhadan yasaladi"
          }
        />

        <div className="flex flex-col gap-2">
          <label
            htmlFor="createdAt"
            className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40"
          >
            Sana
          </label>
          <input
            id="createdAt"
            name="createdAt"
            type="datetime-local"
            value={values.createdAt}
            onChange={(event) =>
              setValues((previous) => ({ ...previous, createdAt: event.target.value }))
            }
            className="w-full border-2 border-ink bg-paper px-4 py-3 font-mono text-sm text-ink outline-none
                       transition-colors duration-200 focus:border-accent"
          />
          <p className="font-mono text-xs uppercase tracking-wide text-ink/40">
            bo&apos;sh qoldirilsa hozirgi vaqt yoziladi
          </p>
        </div>
      </div>

      <div className={section}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className={sectionTitle}>Kontent</h2>
          <LocaleTabs active={locale} onChange={setLocale} />
        </div>

        <Field
          name={`title-${locale}`}
          label="Sarlavha"
          value={content.title}
          onChange={(value) => setContent("title", value)}
          required
        />

        <MarkdownEditor
          label="Matn (markdown)"
          value={content.post}
          onChange={(value) => setContent("post", value)}
        />
      </div>

      {mutation.error && (
        <p className="font-mono text-xs font-bold uppercase tracking-wide text-accent">
          {mutation.error.message}
        </p>
      )}

      <div className="flex items-center gap-4">
        <SubmitButton pending={mutation.isPending}>{post ? "Saqlash" : "Yaratish"}</SubmitButton>

        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="rounded-full border-2 border-ink px-6 py-3 font-mono text-xs font-bold uppercase
                     tracking-wide transition-colors duration-200 hover:bg-ink/10"
        >
          Bekor qilish
        </button>
      </div>
    </form>
  );
}
