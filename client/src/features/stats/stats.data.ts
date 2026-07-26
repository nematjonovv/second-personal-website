export type Locale = "uz" | "en";

export type Stat = {
  value: string;
  label: Record<Locale, string>;
};

export const stats: Stat[] = [
  {
    value: "6+",
    label: { uz: "Yillik tajriba", en: "Years shipping" },
  },
  {
    value: "40+",
    label: { uz: "Yakunlangan loyiha", en: "Projects delivered" },
  },
  {
    value: "12",
    label: { uz: "Til va runtime", en: "Languages & runtimes" },
  },
  {
    value: "∞",
    label: { uz: "Chashka qahva", en: "Cups of coffee" },
  },
];
