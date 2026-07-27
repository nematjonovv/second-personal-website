"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { imageUrl } from "@/shared/api/imageUrl";

type GalleryEditorProps = {
  keep: string[];
  onKeepChange: (paths: string[]) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
};

const tile =
  "relative h-32 overflow-hidden border-2 border-ink bg-ink/5";
const iconButton =
  "border-2 border-ink bg-paper p-1.5 transition-colors duration-200 hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-paper disabled:hover:text-ink";

export default function GalleryEditor({
  keep,
  onKeepChange,
  files,
  onFilesChange,
}: GalleryEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= keep.length) return;

    const next = [...keep];
    [next[index], next[target]] = [next[target], next[index]];
    onKeepChange(next);
  };

  const addFiles = (selected: FileList | null) => {
    if (!selected) return;
    onFilesChange([...files, ...Array.from(selected)]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const total = keep.length + files.length;

  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
        Galereya — {total} ta rasm
      </span>

      {total > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {keep.map((path, index) => (
            <div key={path} className={tile}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl(path)}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 p-1.5">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Chapga"
                    className={iconButton}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === keep.length - 1}
                    aria-label="O'ngga"
                    className={iconButton}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onKeepChange(keep.filter((item) => item !== path))}
                  aria-label="O'chirish"
                  className={iconButton}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className={tile}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="h-full w-full object-cover"
              />
              <span className="absolute left-1.5 top-1.5 bg-accent px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wide text-paper">
                Yangi
              </span>
              <div className="absolute inset-x-0 bottom-0 flex justify-end p-1.5">
                <button
                  type="button"
                  onClick={() => onFilesChange(files.filter((_, i) => i !== index))}
                  aria-label="Bekor qilish"
                  className={iconButton}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(event) => addFiles(event.target.files)}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-fit items-center gap-2 rounded-full border-2 border-ink px-4 py-2 font-mono text-xs
                   font-bold uppercase tracking-wide transition-colors duration-200 hover:bg-ink/10"
      >
        <Plus className="h-3.5 w-3.5" />
        Rasm qo&apos;shish
      </button>

      <p className="font-mono text-xs uppercase tracking-wide text-ink/40">
        jpg, png yoki webp — maks 5MB, 10 fayl. Yangi rasmlar doim oxiriga qo&apos;shiladi.
      </p>
    </div>
  );
}
