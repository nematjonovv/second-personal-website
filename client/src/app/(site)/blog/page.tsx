import BlogIntro from "@/features/blog/components/BlogIntro";
import BlogList from "@/features/blog/components/BlogList";

export default function BlogPage() {
  return (
    <div className="pb-20 md:pb-28">
      <BlogIntro />
      <BlogList />
    </div>
  );
}
