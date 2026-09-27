import { Router } from "express";
import type { UserController } from "../controllers/user.controller";
import { asyncHandler } from "../http/async-handler";

export function createUserRoutes(controller: UserController): Router {
  const router = Router();
  router.get("/", asyncHandler(async (req, res) => controller.getDirectory(req, res)));
  return router;
}
