import { Request, Response } from "express"
import { healthService } from "./health.service"

class HealthController {
  async check(req: Request, res: Response) {
    try {
      const isHealth = await healthService.check()
      if (isHealth) {
        return res.status(200).json({ success: true, message: "Server up", data: null })
      }
    } catch (error) {
      return error
    }
  }
}

export const healthController = new HealthController()