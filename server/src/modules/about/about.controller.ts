import { RequestHandler } from "express";
import { aboutService } from "./about.service";
import { revalidateClient } from "../../shared/revalidate";

type Req = Parameters<RequestHandler>[0];

const keyOf = (req: Req) => String(req.params.id);

class AboutController {
  find: RequestHandler = async (_req, res, next) => {
    try {
      const about = await aboutService.find();
      res.status(200).json({ success: true, message: "About ma'lumotlari", data: about });
    } catch (error) {
      next(error);
    }
  };

  updateContent: RequestHandler = async (req, res, next) => {
    try {
      const content = await aboutService.updateContent(req.body);
      res.status(200).json({ success: true, message: "About matni yangilandi", data: content });
      revalidateClient(["/about"]);
    } catch (error) {
      next(error);
    }
  };

  createExperience: RequestHandler = async (req, res, next) => {
    try {
      const experience = await aboutService.createExperience(req.body);
      res.status(201).json({ success: true, message: "Tajriba qo'shildi", data: experience });
      revalidateClient(["/about"]);
    } catch (error) {
      next(error);
    }
  };

  updateExperience: RequestHandler = async (req, res, next) => {
    try {
      const experience = await aboutService.updateExperience(keyOf(req), req.body);
      res.status(200).json({ success: true, message: "Tajriba yangilandi", data: experience });
      revalidateClient(["/about"]);
    } catch (error) {
      next(error);
    }
  };

  removeExperience: RequestHandler = async (req, res, next) => {
    try {
      await aboutService.removeExperience(keyOf(req));
      res.status(200).json({ success: true, message: "Tajriba o'chirildi", data: null });
      revalidateClient(["/about"]);
    } catch (error) {
      next(error);
    }
  };

  createToolboxGroup: RequestHandler = async (req, res, next) => {
    try {
      const group = await aboutService.createToolboxGroup(req.body);
      res.status(201).json({ success: true, message: "Toolbox guruhi qo'shildi", data: group });
      revalidateClient(["/about"]);
    } catch (error) {
      next(error);
    }
  };

  updateToolboxGroup: RequestHandler = async (req, res, next) => {
    try {
      const group = await aboutService.updateToolboxGroup(keyOf(req), req.body);
      res.status(200).json({ success: true, message: "Toolbox guruhi yangilandi", data: group });
      revalidateClient(["/about"]);
    } catch (error) {
      next(error);
    }
  };

  removeToolboxGroup: RequestHandler = async (req, res, next) => {
    try {
      await aboutService.removeToolboxGroup(keyOf(req));
      res.status(200).json({ success: true, message: "Toolbox guruhi o'chirildi", data: null });
      revalidateClient(["/about"]);
    } catch (error) {
      next(error);
    }
  };
}

export const aboutController = new AboutController();
