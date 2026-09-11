import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { AuthController } from '../controllers/auth.controller.js'; 
import { authMiddleware } from '../middlewares/auth.middleware.js';

const userRoutes = Router();
const userController = new UserController();
const authController = new AuthController(); 

userRoutes.post('/users', userController.create);
userRoutes.post('/login', authController.login); 

userRoutes.get('/users/me', authMiddleware, userController.me);
userRoutes.put('/users/profile', authMiddleware, userController.updateProfile);

export { userRoutes };