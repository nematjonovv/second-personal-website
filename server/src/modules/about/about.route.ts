import express from "express";
import { protect } from "../auth/auth.middleware";
import { validate } from "../../shared/validate";
import { aboutController } from "./about.controller";
import {
  createExperienceSchema,
  createToolboxGroupSchema,
  updateAboutContentSchema,
  updateExperienceSchema,
  updateToolboxGroupSchema,
} from "./about.validation";

const router = express.Router();

router.get("/", aboutController.find);

router.patch("/content", protect, validate(updateAboutContentSchema), aboutController.updateContent);

router.post("/experience", protect, validate(createExperienceSchema), aboutController.createExperience);
router.patch("/experience/:id", protect, validate(updateExperienceSchema), aboutController.updateExperience);
router.delete("/experience/:id", protect, aboutController.removeExperience);

router.post("/toolbox", protect, validate(createToolboxGroupSchema), aboutController.createToolboxGroup);
router.patch("/toolbox/:id", protect, validate(updateToolboxGroupSchema), aboutController.updateToolboxGroup);
router.delete("/toolbox/:id", protect, aboutController.removeToolboxGroup);

export const aboutRouter = router;
