import { RequestHandler } from "express";
import { contactService } from "./contact.service";

class ContactController {
  find: RequestHandler = async (_req, res, next) => {
    try {
      const contact = await contactService.find();
      res.status(200).json({ success: true, message: "Kontakt ma'lumotlari", data: contact });
    } catch (error) {
      next(error);
    }
  };

  update: RequestHandler = async (req, res, next) => {
    try {
      const contact = await contactService.update(req.body);
      res.status(200).json({ success: true, message: "Kontakt ma'lumotlari yangilandi", data: contact });
    } catch (error) {
      next(error);
    }
  };
}

export const contactController = new ContactController();
