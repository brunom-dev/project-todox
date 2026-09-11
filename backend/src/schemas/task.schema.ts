import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string({ required_error: "Título é obrigatório." }).min(1, "Título não pode estar vazio."),
    description: z.string().optional().nullable(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    dueDate: z.string().datetime({ message: "Data deve estar no formato ISO 8601 (ex: 2026-12-31T23:59:59Z)" }).optional().nullable(),
    categoryId: z.string().uuid({ message: "O ID da categoria deve ser um UUID válido." }).optional().nullable(),
    goalId: z.string().uuid({ message: "O ID da meta deve ser um UUID válido." }).optional().nullable(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Título não pode estar vazio.").optional(),
    description: z.string().optional().nullable(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    dueDate: z.string().datetime({ message: "Data deve estar no formato ISO 8601 (ex: 2026-12-31T23:59:59Z)" }).optional().nullable(),
    categoryId: z.string().uuid({ message: "O ID da categoria deve ser um UUID válido." }).optional().nullable(),
    goalId: z.string().uuid({ message: "O ID da meta deve ser um UUID válido." }).optional().nullable(),
});
