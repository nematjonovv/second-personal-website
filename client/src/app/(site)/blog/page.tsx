import { getLocale, getTranslations } from "next-intl/server";
import BlogIntro from "@/features/blog/components/BlogIntro";
import BlogList from "@/features/blog/components/BlogList";
import { getAllPostsServer } from "@/features/blog/blog.api";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "BlogMeta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "/blog",
      type: "website",
    },
  };
}

export default async function BlogPage() {
  const posts = await getAllPostsServer();

  return (
    <div className="pb-20 md:pb-28">
      <BlogIntro />
      <BlogList posts={posts} />
    </div>
  );
}