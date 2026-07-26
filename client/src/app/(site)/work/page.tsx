import ProjectList from "@/features/project/components/ProjectList";
import WorkIntro from "@/features/project/components/WorkIntro";

export default function WorkPage() {
  return (
    <div className="pb-20 md:pb-28">
      <WorkIntro />
      <ProjectList />
    </div>
  );
}
