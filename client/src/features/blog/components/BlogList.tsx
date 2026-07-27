"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Container from "@/components/Container";
import { useBlogPosts } from "../blog.hook";
import BlogListItem from "./BlogListItem";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const SKELETON_COUNT = 4;

export default function BlogList() {
  const t = useTranslations("BlogPage");
  const { data, isPending } = useBlogPosts();

  if (isPending) {
    return (
      <Container>
        <div className="border-t-2 border-ink">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse border-b-2 border-ink bg-ink/5 md:h-40"
            />
          ))}
        </div>
      </Container>
    );
  }

  const posts = data ?? [];

  return (
    <Container>
      {posts.length === 0 ? (
        <p className="border-t-2 border-ink py-16 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
          {t("empty")}
        </p>
      ) : (
        <ul className="border-t-2 border-ink">
          {posts.map((post) => (
            <motion.li
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <BlogListItem post={post} />
            </motion.li>
          ))}
        </ul>
      )}
    </Container>
  );
}
