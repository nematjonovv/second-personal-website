import { RequestHandler } from "express";
import { ZodType } from "zod";

export const validate =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const [issue] = result.error.issues;
      const field = issue.path.join(".");

      res.status(400).json({
        success: false,
        message: field ? `${field}: ${issue.message}` : issue.message,
        data: null,
      });
      return;
    }

    req.body = result.data;
    next();
  };
