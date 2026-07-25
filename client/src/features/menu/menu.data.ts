export const navLinks = {
  uz: [
    { label: "Bosh sahifa", href: "/" },
    { label: "Loyihalar", href: "/work" },
    { label: "Men haqimda", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Aloqa", href: "/contact" },
  ],
  en: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type Locale = keyof typeof navLinks;