import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      }

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      }

      const secret = process.env.JWT_SECRET;
      
      if (!secret) {
        throw new Error('JWT_SECRET não está configurado.');
      }

      const token = jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  }
}