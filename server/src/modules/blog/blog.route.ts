import express from "express";
import { protect } from "../auth/auth.middleware";
import { validate } from "../../shared/validate";
import { blogController } from "./blog.controller";
import { createBlogPostSchema, updateBlogPostSchema } from "./blog.validation";

const router = express.Router();

router.get("/", blogController.findAll);
router.get("/:slug", blogController.findBySlug);

router.post("/", protect, validate(createBlogPostSchema), blogController.create);
router.patch("/:slug", protect, validate(updateBlogPostSchema), blogController.update);
router.delete("/:slug", protect, blogController.remove);

export const blogRouter = router;
