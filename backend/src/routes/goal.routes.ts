import { Router } from 'express';
import { GoalController } from '../controllers/goal.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const goalRoutes = Router();
const goalController = new GoalController();

goalRoutes.use('/goals', authMiddleware);

goalRoutes.post('/goals', goalController.create);
goalRoutes.get('/goals', goalController.list);
goalRoutes.put('/goals/:id', goalController.update);
goalRoutes.delete('/goals/:id', goalController.delete);

export { goalRoutes };