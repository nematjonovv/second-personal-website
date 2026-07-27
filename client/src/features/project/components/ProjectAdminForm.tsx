"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/admin/Field";
import ListField from "@/components/admin/ListField";
import LocaleTabs from "@/components/admin/LocaleTabs";
import SubmitButton from "@/components/admin/SubmitButton";
import TextAreaField from "@/components/admin/TextAreaField";
import { useToast } from "@/shared/providers/ToastProvider";
import type { Locale, Project, ProjectContent, ProjectFormValues } from "../project.type";
import { useCreateProject, useUpdateProject } from "../project.hook";
import GalleryEditor from "./GalleryEditor";

const emptyContent: ProjectContent = {
  description: "",
  problem: "",
  solution: "",
  myContribution: [""],
  challenge: "",
  result: [""],
};

const emptyValues: ProjectFormValues = {
  slug: "",
  title: "",
  date: { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
  techStack: [""],
  role: [""],
  githubUrl: "",
  liveUrl: "",
  content: { uz: emptyContent, en: emptyContent },
};

function toValues(project: Project): ProjectFormValues {
  return {
    slug: project.slug,
    title: project.title,
    date: project.date,
    techStack: project.techStack,
    role: project.role,
    githubUrl: project.githubUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    content: project.content,
  };
}

const clean = (values: string[]) => values.map((item) => item.trim()).filter(Boolean);

const section = "flex flex-col gap-5 border-2 border-ink p-6";
const sectionTitle = "font-display text-lg uppercase tracking-tight text-ink";

export default function ProjectAdminForm({ project }: { project?: Project }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<ProjectFormValues>(
    project ? toValues(project) : emptyValues,
  );
  const [keep, setKeep] = useState<string[]>(project?.gallery ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const [locale, setLocale] = useState<Locale>("uz");

  const create = useCreateProject();
  const update = useUpdateProject(project?.slug ?? "");
  const mutation = project ? update : create;

  const setContent = (field: keyof ProjectContent, value: string | string[]) =>
    setValues((previous) => ({
      ...previous,
      content: {
        ...previous.content,
        [locale]: { ...previous.content[locale], [field]: value },
      },
    }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload: ProjectFormValues = {
      ...values,
      techStack: clean(values.techStack),
      role: clean(values.role),
      content: {
        uz: {
          ...values.content.uz,
          myContribution: clean(values.content.uz.myContribution),
          result: clean(values.content.uz.result),
        },
        en: {
          ...values.content.en,
          myContribution: clean(values.content.en.myContribution),
          result: clean(values.content.en.result),
        },
      },
    };

    const back = () => {
      toast(project ? "Proyekt saqlandi" : "Proyekt yaratildi");
      router.push("/admin/projects");
    };

    if (project) {
      update.mutate({ values: payload, keepGallery: keep, files }, { onSuccess: back });
      return;
    }

    create.mutate({ values: payload, files }, { onSuccess: back });
  };

  const content = values.content[locale];

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
      <div className={section}>
        <h2 className={sectionTitle}>Asosiy</h2>

        <Field
          name="title"
          label="Sarlavha"
          value={values.title}
          onChange={(title) => setValues((previous) => ({ ...previous, title }))}
          required
        />

        <Field
          name="slug"
          label="Slug"
          value={values.slug}
          onChange={(slug) => setValues((previous) => ({ ...previous, slug }))}
          hint={project ? "o'zgartirilsa URL ham o'zgaradi" : "bo'sh qoldirilsa sarlavhadan yasaladi"}
        />

        <div className="grid grid-cols-2 gap-5">
          <Field
            name="month"
            label="Oy (1–12)"
            value={String(values.date.month)}
            onChange={(month) =>
              setValues((previous) => ({
                ...previous,
                date: { ...previous.date, month: Number(month) || 0 },
              }))
            }
            required
          />
          <Field
            name="year"
            label="Yil"
            value={String(values.date.year)}
            onChange={(year) =>
              setValues((previous) => ({
                ...previous,
                date: { ...previous.date, year: Number(year) || 0 },
              }))
            }
            required
          />
        </div>

        <Field
          name="githubUrl"
          label="GitHub URL"
          value={values.githubUrl}
          onChange={(githubUrl) => setValues((previous) => ({ ...previous, githubUrl }))}
          hint="ixtiyoriy — bo'sh qoldirilsa saytda ko'rinmaydi"
        />

        <Field
          name="liveUrl"
          label="Live URL"
          value={values.liveUrl}
          onChange={(liveUrl) => setValues((previous) => ({ ...previous, liveUrl }))}
          hint="ixtiyoriy"
        />

        <ListField
          label="Tech stack"
          values={values.techStack}
          onChange={(techStack) => setValues((previous) => ({ ...previous, techStack }))}
          placeholder="Next.js"
        />

        <ListField
          label="Rollar"
          values={values.role}
          onChange={(role) => setValues((previous) => ({ ...previous, role }))}
          placeholder="Fullstack"
        />
      </div>

      <div className={section}>
        <h2 className={sectionTitle}>Galereya</h2>
        <GalleryEditor
          keep={keep}
          onKeepChange={setKeep}
          files={files}
          onFilesChange={setFiles}
        />
      </div>

      <div className={section}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className={sectionTitle}>Kontent</h2>
          <LocaleTabs active={locale} onChange={setLocale} />
        </div>

        <TextAreaField
          name={`description-${locale}`}
          label="Tavsif"
          value={content.description}
          onChange={(value) => setContent("description", value)}
          rows={3}
          hint="qisqa bir jumla — kartochka va ro'yxat uchun"
        />

        <TextAreaField
          name={`problem-${locale}`}
          label="Muammo"
          value={content.problem}
          onChange={(value) => setContent("problem", value)}
        />

        <TextAreaField
          name={`solution-${locale}`}
          label="Yechim"
          value={content.solution}
          onChange={(value) => setContent("solution", value)}
        />

        <ListField
          label="Mening hissam"
          values={content.myContribution}
          onChange={(value) => setContent("myContribution", value)}
        />

        <TextAreaField
          name={`challenge-${locale}`}
          label="Qiyinchilik"
          value={content.challenge}
          onChange={(value) => setContent("challenge", value)}
        />

        <ListField
          label="Natijalar"
          values={content.result}
          onChange={(value) => setContent("result", value)}
        />
      </div>

      {mutation.error && (
        <p className="font-mono text-xs font-bold uppercase tracking-wide text-accent">
          {mutation.error.message}
        </p>
      )}

      <div className="flex items-center gap-4">
        <SubmitButton pending={mutation.isPending}>
          {project ? "Saqlash" : "Yaratish"}
        </SubmitButton>

        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="rounded-full border-2 border-ink px-6 py-3 font-mono text-xs font-bold uppercase
                     tracking-wide transition-colors duration-200 hover:bg-ink/10"
        >
          Bekor qilish
        </button>
      </div>
    </form>
  );
}
