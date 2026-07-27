import express from "express";
import cors from "cors";
import helmet from "helmet";
import { aboutRouter } from "./modules/about/about.route";
import { authRouter } from "./modules/auth/auth.route";
import { blogRouter } from "./modules/blog/blog.route";
import { contactRouter } from "./modules/contact/contact.route";
import { healthRouter } from "./modules/health/health.route";
import { projectRouter } from "./modules/project/project.route";
import { CLIENT_URL } from "./shared/constants";
import { errorHandler } from "./shared/errorHandler";
import { UPLOAD_DIR } from "./shared/imageToWebp";
import { docsRouter } from "./shared/swagger";

const app = express();

app.use(helmet());
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: "1mb" }));

app.use(
  "/uploads",
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" }),
  express.static(UPLOAD_DIR),
);

app.use("/api/docs", docsRouter);

app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/contact", contactRouter);
app.use("/api/blog", blogRouter);
app.use("/api/about", aboutRouter);

app.use(errorHandler);

export default app;
