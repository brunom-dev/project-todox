import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.use('/categories', authMiddleware);

categoryRoutes.post('/categories', categoryController.create);
categoryRoutes.get('/categories', categoryController.list);
categoryRoutes.put('/categories/:id', categoryController.update);
categoryRoutes.delete('/categories/:id', categoryController.delete);

export { categoryRoutes };