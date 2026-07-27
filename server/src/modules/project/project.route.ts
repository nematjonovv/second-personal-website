import express from "express";
import { protect } from "../auth/auth.middleware";
import { uploadImages } from "../../shared/upload";
import { validate } from "../../shared/validate";
import { projectController } from "./project.controller";
import { createProjectSchema, updateProjectSchema } from "./project.validation";

const router = express.Router();

router.get("/", projectController.findAll);
router.get("/:slug", projectController.findBySlug);

router.post(
  "/",
  protect,
  uploadImages.array("gallery"),
  validate(createProjectSchema),
  projectController.create,
);

router.patch(
  "/:slug",
  protect,
  uploadImages.array("gallery"),
  validate(updateProjectSchema),
  projectController.update,
);

router.delete("/:slug", protect, projectController.remove);

export const projectRouter = router;
