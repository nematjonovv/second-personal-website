"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Container from "@/components/Container";
import type { BlogPost } from "../blog.type";
import BlogListItem from "./BlogListItem";

const EASE = [0.2, 0.8, 0.2, 1] as const;

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("BlogPage");
  console.log(posts);
  
  return (
    <Container>
      {posts.length === 0 ? (
        <p className="border-t-2 border-ink py-16 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
          {t("empty")}
        </p>
      ) : (
        <ul className="border-t-2 border-ink">
          {posts?.map((post) => (
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