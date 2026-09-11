import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { userRoutes } from "./routes/user.routes.js";
import { categoryRoutes } from "./routes/category.routes.js";
import { goalRoutes } from "./routes/goal.routes.js";
import { taskRoutes } from "./routes/task.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./docs/swagger.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/ping", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            message:
                "API rodando e Banco conectado com sucesso via Prisma Adapter!",
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao conectar no banco" });
    }
});

// Documentação Swagger (OpenAPI 3.0)
app.get(["/api/docs.json", "/docs.json"], (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
});

const swaggerUiMiddleware = swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "TodoX API Docs",
});
app.use(["/api/docs", "/docs"], swaggerUi.serve, swaggerUiMiddleware);

app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", goalRoutes);
app.use("/api", taskRoutes);
app.use("/api", dashboardRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
