import Container from "../Container";
import HeroCta from "./HeroCta";
import HeroDescription from "./HeroDescription";
import HeroMeta from "./HeroMeta";
import HeroTitle from "./HeroTitle";

function Hero() {
  return (
    <section className="pt-15 pb-4">
      <Container>
        <HeroMeta />
      </Container>

      <div className="pl-7 md:pl-11 overflow-hidden border-b-2">
        <HeroTitle />
      </div>
      <Container>
        <div className="w-full h-0.5 bg-ink" />
      </Container>
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 py-8 md:flex-row md:items-end">
          <HeroDescription />
          <HeroCta />
        </div>
      </Container>
    </section>
  );
}

export default Hero;