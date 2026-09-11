import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.use('/dashboard', authMiddleware);

dashboardRoutes.get("/dashboard/insights", dashboardController.getInsights);

export { dashboardRoutes };
