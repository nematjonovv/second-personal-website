import type { Contact, ContactChannel } from "./contact.type";

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits.startsWith("998") || digits.length !== 12) return phone;

  const [, code, a, b, c] = /^998(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(digits)!;
  return `+998 ${code} ${a} ${b} ${c}`;
}

export function toChannels(contact: Contact): ContactChannel[] {
  return [
    {
      id: "email",
      display: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      id: "github",
      display: `@${contact.github}`,
      href: `https://github.com/${contact.github}`,
    },
    {
      id: "linkedin",
      display: `in/${contact.linkedin}`,
      href: `https://linkedin.com/in/${contact.linkedin}`,
    },
    {
      id: "telegram",
      display: `@${contact.telegram}`,
      href: `https://t.me/${contact.telegram}`,
    },
    {
      id: "phone",
      display: formatPhone(contact.phoneNumber),
      href: `tel:${contact.phoneNumber}`,
    },
  ];
}
