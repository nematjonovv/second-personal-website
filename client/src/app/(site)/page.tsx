import Hero from "@/components/hero/Hero";
import Marquee from "@/components/Marquee";
import SelectedWork from "@/features/project/components/SelectedWork";
import Stats from "@/features/stats/components/Stats";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Marquee />
      <SelectedWork />
      <Stats />
    </div>
  );
}
