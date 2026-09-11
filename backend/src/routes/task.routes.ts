import { Router } from "express";
import { TaskController } from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js";

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.use('/tasks', authMiddleware);

taskRoutes.post("/tasks", validate(createTaskSchema), taskController.create);
taskRoutes.get("/tasks/alerts", taskController.alerts);
taskRoutes.get("/tasks", taskController.list);
taskRoutes.put("/tasks/:id", validate(updateTaskSchema), taskController.update);
taskRoutes.delete("/tasks/:id", taskController.delete);

export { taskRoutes };
