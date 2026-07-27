import { api } from "@/shared/api/client";
import type { Contact, UpdateContactInput } from "./contact.type";

export const contactApi = {
  async get(): Promise<Contact> {
    return api.get<Contact>("/api/contact");
  },

  async update(input: UpdateContactInput): Promise<Contact> {
    return api.patch<Contact>("/api/contact", input);
  },
};
