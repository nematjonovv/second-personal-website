import { RequestHandler } from "express";
import { blogService } from "./blog.service";

type Req = Parameters<RequestHandler>[0];

const slugOf = (req: Req) => String(req.params.slug);

class BlogController {
  findAll: RequestHandler = async (_req, res, next) => {
    try {
      const posts = await blogService.findAll();
      res.status(200).json({ success: true, message: "Postlar ro'yxati", data: posts });
    } catch (error) {
      next(error);
    }
  };

  findBySlug: RequestHandler = async (req, res, next) => {
    try {
      const post = await blogService.findBySlug(slugOf(req));
      res.status(200).json({ success: true, message: "Post topildi", data: post });
    } catch (error) {
      next(error);
    }
  };

  create: RequestHandler = async (req, res, next) => {
    try {
      const post = await blogService.create(req.body);
      res.status(201).json({ success: true, message: "Post yaratildi", data: post });
    } catch (error) {
      next(error);
    }
  };

  update: RequestHandler = async (req, res, next) => {
    try {
      const post = await blogService.update(slugOf(req), req.body);
      res.status(200).json({ success: true, message: "Post yangilandi", data: post });
    } catch (error) {
      next(error);
    }
  };

  remove: RequestHandler = async (req, res, next) => {
    try {
      await blogService.remove(slugOf(req));
      res.status(200).json({ success: true, message: "Post o'chirildi", data: null });
    } catch (error) {
      next(error);
    }
  };
}

export const blogController = new BlogController();
