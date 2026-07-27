import express from "express";
import { protect } from "../auth/auth.middleware";
import { validate } from "../../shared/validate";
import { contactController } from "./contact.controller";
import { updateContactSchema } from "./contact.validation";

const router = express.Router();

router.get("/", contactController.find);
router.patch("/", protect, validate(updateContactSchema), contactController.update);

export const contactRouter = router;
