import express from "express"
import { healthController } from "./health.controller"

const router = express.Router()

router.get("/health", healthController.check)


export const healthRouter = router
