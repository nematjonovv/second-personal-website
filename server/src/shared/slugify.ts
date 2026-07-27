const STRIPPED = /['‘’ʻʼ`]/g;
const COMBINING_MARKS = /[̀-ͯ]/g;

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .replace(STRIPPED, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
