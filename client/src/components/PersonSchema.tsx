
const SITE_URL = "https://nematjonovx.uz";

export default function PersonSchema() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hikmatillo Nematjonov",
    url: SITE_URL,
    jobTitle: "Fullstack Developer",
    image: `${SITE_URL}/avatar.jpg`,
    sameAs: [
      "https://www.linkedin.com/in/hikmatillo-nematjonov/",
      "https://github.com/nematjonovv",
      "https://t.me/hikmatillonematjonov",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}