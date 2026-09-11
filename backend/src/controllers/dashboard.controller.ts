import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export class DashboardController {
    async getInsights(req: Request, res: Response) {
        try {
            const userId = req.userId;

            const totalTasks = await prisma.task.count({
                where: { userId },
            });

            const completedTasks = await prisma.task.count({
                where: { userId, status: "DONE" },
            });

            const completionRate =
                totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            const weeklyCompletedTasks = await prisma.task.count({
                where: { 
                    userId, 
                    status: "DONE",
                    dueDate: { gte: oneWeekAgo }
                },
            });

            const tasksByCategoryRaw = await prisma.task.groupBy({
                by: ["categoryId"],
                where: { userId, status: "DONE", categoryId: { not: null } },
                _count: { _all: true },
            });

            const categoryIds = tasksByCategoryRaw.map(t => t.categoryId as string);
            const categories = await prisma.category.findMany({
                where: { id: { in: categoryIds } },
                select: { id: true, name: true, color: true }
            });
            
            const tasksByCategory = tasksByCategoryRaw.map(t => {
                const cat = categories.find(c => c.id === t.categoryId);
                return {
                    categoryId: t.categoryId,
                    name: cat?.name || "Desconhecida",
                    color: cat?.color || null,
                    count: t._count._all
                };
            });

            const goals = await prisma.goal.findMany({
                where: { userId },
                include: { tasks: true },
            });

            const goalsProgress = goals.map((goal) => {
                const goalTotalTasks = goal.tasks.length;
                const goalCompletedTasks = goal.tasks.filter(
                    (t) => t.status === "DONE",
                ).length;
                const progress =
                    goalTotalTasks === 0
                        ? 0
                        : (goalCompletedTasks / goalTotalTasks) * 100;

                return {
                    id: goal.id,
                    title: goal.title,
                    progress,
                };
            });

            return res.json({
                overview: {
                    totalTasks,
                    completedTasks,
                    completionRate,
                    weeklyCompletedTasks
                },
                tasksByCategory,
                goalsProgress,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno." });
        }
    }
}
