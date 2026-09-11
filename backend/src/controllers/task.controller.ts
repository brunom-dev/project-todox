import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export class TaskController {
    async create(req: Request, res: Response) {
        try {
            const { title, description, status, dueDate, categoryId, goalId } =
                req.body;
            const userId = req.userId;

            if (!title) {
                return res.status(400).json({ error: "Título é obrigatório." });
            }

            const task = await prisma.task.create({
                data: {
                    title,
                    description,
                    status,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    categoryId,
                    goalId,
                    userId,
                },
            });

            return res.status(201).json(task);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2003') {
                return res.status(400).json({ error: "Categoria ou Meta fornecida não existe." });
            }
            return res.status(500).json({ error: "Erro interno." });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { status, categoryId, goalId, date } = req.query;

            const where: any = { userId };

            if (status) {
                where.status = String(status);
            }
            if (categoryId) {
                where.categoryId = String(categoryId);
            }
            if (goalId) {
                where.goalId = String(goalId);
            }
            if (date) {
                const searchDate = new Date(String(date));
                if (!isNaN(searchDate.getTime())) {
                    const nextDay = new Date(searchDate);
                    nextDay.setDate(searchDate.getDate() + 1);
                    
                    where.dueDate = {
                        gte: searchDate,
                        lt: nextDay
                    };
                }
            }

            const tasks = await prisma.task.findMany({
                where,
                include: {
                    category: true,
                    goal: true,
                },
                orderBy: [
                    { dueDate: { sort: 'asc', nulls: 'last' } },
                    { createdAt: 'desc' }
                ]
            });

            return res.json(tasks);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno." });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id || Array.isArray(id)) {
                return res.status(400).json({ error: "ID inválido." });
            }

            const { title, description, status, dueDate, categoryId, goalId } =
                req.body;
            const userId = req.userId;

            const task = await prisma.task.findUnique({
                where: { id },
            });

            if (!task || task.userId !== userId) {
                return res
                    .status(404)
                    .json({ error: "Tarefa não encontrada." });
            }

            const updatedTask = await prisma.task.update({
                where: { id },
                data: {
                    title,
                    description,
                    status,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    categoryId,
                    goalId,
                },
            });

            return res.json(updatedTask);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2003') {
                return res.status(400).json({ error: "Categoria ou Meta fornecida não existe." });
            }
            return res.status(500).json({ error: "Erro interno." });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            if (!id || Array.isArray(id)) {
                return res.status(400).json({ error: "ID inválido." });
            }

            const userId = req.userId;

            const task = await prisma.task.findUnique({
                where: { id },
            });

            if (!task || task.userId !== userId) {
                return res
                    .status(404)
                    .json({ error: "Tarefa não encontrada." });
            }

            await prisma.task.delete({
                where: { id },
            });

            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno." });
        }
    }
    async alerts(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const now = new Date();
            
            // Prazos em até 3 dias
            const limitDate = new Date();
            limitDate.setDate(now.getDate() + 3);

            const overdue = await prisma.task.findMany({
                where: {
                    userId,
                    status: { not: "DONE" },
                    dueDate: { lt: now }
                },
                include: { category: true, goal: true },
                orderBy: { dueDate: "asc" }
            });

            const upcoming = await prisma.task.findMany({
                where: {
                    userId,
                    status: { not: "DONE" },
                    dueDate: {
                        gte: now,
                        lte: limitDate
                    }
                },
                include: { category: true, goal: true },
                orderBy: { dueDate: "asc" }
            });

            return res.json({
                overdue,
                upcoming
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno." });
        }
    }
}
