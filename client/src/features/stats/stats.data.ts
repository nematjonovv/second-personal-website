export type Locale = "uz" | "en";

export type Stat = {
  value: string;
  label: Record<Locale, string>;
};

export const stats: Stat[] = [
  {
    value: "1+",
    label: { uz: "Yillik tajriba", en: "Years shipping" },
  },
  {
    value: "8+",
    label: { uz: "Yakunlangan loyiha", en: "Projects delivered" },
  },
  {
    value: "3+",
    label: { uz: "Real mijozlar", en: "Real clients" },
  },
  {
    value: "∞",
    label: { uz: "Chashka qahva", en: "Cups of coffee" },
  },
];
