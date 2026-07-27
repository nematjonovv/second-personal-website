import type { Contact } from "../../generated/prisma/client";

export type ContactResponse = {
  email: string;
  github: string;
  linkedin: string;
  telegram: string;
  phoneNumber: string;
};

export const CONTACT_ID = "contact";

export const DEFAULT_CONTACT: ContactResponse = {
  email: "hello@hikmatillo.dev",
  github: "hikmatillo",
  linkedin: "hikmatillo",
  telegram: "hikmatillo",
  phoneNumber: "+998901234567",
};

export function toContactResponse(contact: Contact): ContactResponse {
  return {
    email: contact.email,
    github: contact.github,
    linkedin: contact.linkedin,
    telegram: contact.telegram,
    phoneNumber: contact.phoneNumber,
  };
}
