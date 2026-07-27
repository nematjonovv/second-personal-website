"use client";

import { useState } from "react";
import Field from "@/components/admin/Field";
import ListField from "@/components/admin/ListField";
import SubmitButton from "@/components/admin/SubmitButton";
import { useToast } from "@/shared/providers/ToastProvider";
import type { ToolboxFormValues, ToolboxGroup } from "../about.type";
import { useCreateToolboxGroup, useUpdateToolboxGroup } from "../about.hook";

const emptyValues: ToolboxFormValues = {
  id: "",
  label: { uz: "", en: "" },
  items: [""],
};

export default function ToolboxForm({
  group,
  onDone,
}: {
  group?: ToolboxGroup;
  onDone: () => void;
}) {
  const toast = useToast();
  const [values, setValues] = useState<ToolboxFormValues>(group ?? emptyValues);

  const create = useCreateToolboxGroup();
  const update = useUpdateToolboxGroup();
  const mutation = group ? update : create;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload: ToolboxFormValues = {
      ...values,
      items: values.items.map((item) => item.trim()).filter(Boolean),
    };

    const done = () => {
      toast(group ? "Guruh saqlandi" : "Guruh qo'shildi");
      onDone();
    };

    if (group) {
      update.mutate({ id: group.id, values: payload }, { onSuccess: done });
      return;
    }

    create.mutate(payload, { onSuccess: done });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 border-2 border-ink/15 bg-ink/[0.02] p-5">
      <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink">
        {group ? "Tahrirlash" : "Yangi guruh"}
      </span>

      {!group && (
        <Field
          name="toolbox-id"
          label="ID"
          value={values.id}
          onChange={(id) => setValues((previous) => ({ ...previous, id }))}
          hint="kichik harf, raqam va defis — masalan frontend. Keyin o'zgartirib bo'lmaydi"
          required
        />
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          name="label-uz"
          label="Yorliq (uz)"
          value={values.label.uz}
          onChange={(uz) => setValues((previous) => ({ ...previous, label: { ...previous.label, uz } }))}
          required
        />

        <Field
          name="label-en"
          label="Yorliq (en)"
          value={values.label.en}
          onChange={(en) => setValues((previous) => ({ ...previous, label: { ...previous.label, en } }))}
          required
        />
      </div>

      <ListField
        label="Texnologiyalar"
        values={values.items}
        onChange={(items) => setValues((previous) => ({ ...previous, items }))}
        placeholder="React"
        hint="tarjimasiz — ikkala tilda bir xil"
      />

      {mutation.error && (
        <p className="font-mono text-xs font-bold uppercase tracking-wide text-accent">
          {mutation.error.message}
        </p>
      )}

      <div className="flex items-center gap-4">
        <SubmitButton pending={mutation.isPending}>{group ? "Saqlash" : "Qo'shish"}</SubmitButton>

        <button
          type="button"
          onClick={onDone}
          className="rounded-full border-2 border-ink px-6 py-3 font-mono text-xs font-bold uppercase
                     tracking-wide transition-colors duration-200 hover:bg-ink/10"
        >
          Bekor qilish
        </button>
      </div>
    </form>
  );
}
