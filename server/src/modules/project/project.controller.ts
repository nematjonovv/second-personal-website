import { RequestHandler } from "express";
import { projectService } from "./project.service";
import { revalidateClient } from "../../shared/revalidate";

type Req = Parameters<RequestHandler>[0];

const filesOf = (req: Req) => (Array.isArray(req.files) ? req.files : []);
const slugOf = (req: Req) => String(req.params.slug);

class ProjectController {
  findAll: RequestHandler = async (_req, res, next) => {
    try {
      const projects = await projectService.findAll();
      res.status(200).json({ success: true, message: "Proyektlar ro'yxati", data: projects });
    } catch (error) {
      next(error);
    }
  };

  findBySlug: RequestHandler = async (req, res, next) => {
    try {
      const project = await projectService.findBySlug(slugOf(req));
      res.status(200).json({ success: true, message: "Proyekt topildi", data: project });
    } catch (error) {
      next(error);
    }
  };

  create: RequestHandler = async (req, res, next) => {
    try {
      const project = await projectService.create(req.body, filesOf(req));
      res.status(201).json({ success: true, message: "Proyekt yaratildi", data: project });

      revalidateClient(["/", "/work", `/work/${project.slug}`]);
    } catch (error) {
      next(error);
    }
  };

  update: RequestHandler = async (req, res, next) => {
    try {
      const project = await projectService.update(slugOf(req), req.body, filesOf(req));
      res.status(200).json({ success: true, message: "Proyekt yangilandi", data: project });
    } catch (error) {
      next(error);
    }
  };

  remove: RequestHandler = async (req, res, next) => {
    try {
      await projectService.remove(slugOf(req));
      res.status(200).json({ success: true, message: "Proyekt o'chirildi", data: null });
    } catch (error) {
      next(error);
    }
  };
}

export const projectController = new ProjectController();
