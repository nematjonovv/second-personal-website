import ContactBody from "@/features/contact/components/ContactBody";
import ContactIntro from "@/features/contact/components/ContactIntro";

export default function ContactPage() {
  return (
    <div className="pb-10">
      <ContactIntro />
      <ContactBody />
    </div>
  );
}
