import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { getAboutServer } from "@/features/about/about.api";
import About from "@/features/about/components/About";

async function getLocale(): Promise<"uz" | "en"> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value as "en" | "uz";
  return locale
}

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "AboutPage.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const data = await getAboutServer();

  return <About data={data} locale={locale} />;
}