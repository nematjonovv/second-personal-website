import { getLocale, getTranslations } from "next-intl/server";
import ContactBody from "@/features/contact/components/ContactBody";
import ContactIntro from "@/features/contact/components/ContactIntro";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "ContactMeta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "/contact",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "/contact",
      type: "website",
    },
  };
}

export default function ContactPage() {
  return (
    <div className="pb-10">
      <ContactIntro />
      <ContactBody />
    </div>
  );
}