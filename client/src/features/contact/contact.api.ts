import { contact } from "./contact.data";
import type { Contact } from "./contact.type";

export const contactApi = {
  async get(): Promise<Contact> {
    return contact;
  },
};
