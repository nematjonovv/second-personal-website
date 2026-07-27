import { prisma } from "../../shared/prisma";
import { CONTACT_ID, DEFAULT_CONTACT, toContactResponse } from "./contact.mapper";
import type { UpdateContactInput } from "./contact.validation";

class ContactService {
  async find() {
    const contact = await prisma.contact.findUnique({ where: { id: CONTACT_ID } });
    return contact ? toContactResponse(contact) : { ...DEFAULT_CONTACT };
  }

  async update(input: UpdateContactInput) {
    const contact = await prisma.contact.upsert({
      where: { id: CONTACT_ID },
      create: { id: CONTACT_ID, ...DEFAULT_CONTACT, ...input },
      update: input,
    });
    return toContactResponse(contact);
  }
}

export const contactService = new ContactService();
