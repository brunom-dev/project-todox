export const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "TodoX API",
        version: "1.0.0",
        description:
            "Documentação completa da API RESTful do TodoX - Plataforma inteligente de organização e produtividade pessoal, acadêmica e profissional.",
        contact: {
            name: "Equipe TodoX",
            email: "devbrunomacedo@gmail.com",
        },
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Servidor Local / Docker",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description:
                    "Insira o token JWT gerado na rota /api/login no formato: Bearer <seu_token>",
            },
        },
        schemas: {
            ErrorResponse: {
                type: "object",
                properties: {
                    error: {
                        type: "string",
                        example: "Mensagem descritiva do erro.",
                    },
                },
            },
            User: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid",
                        example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    },
                    name: {
                        type: "string",
                        example: "Bruno Macedo",
                    },
                    email: {
                        type: "string",
                        format: "email",
                        example: "usuario@exemplo.com",
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-11T16:00:00.000Z",
                    },
                },
            },
            RegisterRequest: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: {
                        type: "string",
                        example: "Bruno Macedo",
                    },
                    email: {
                        type: "string",
                        format: "email",
                        example: "usuario@exemplo.com",
                    },
                    password: {
                        type: "string",
                        format: "password",
                        example: "senha123",
                    },
                },
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: {
                        type: "string",
                        format: "email",
                        example: "usuario@exemplo.com",
                    },
                    password: {
                        type: "string",
                        format: "password",
                        example: "senha123",
                    },
                },
            },
            AuthResponse: {
                type: "object",
                properties: {
                    user: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                format: "uuid",
                                example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                            },
                            name: {
                                type: "string",
                                example: "Bruno Macedo",
                            },
                            email: {
                                type: "string",
                                example: "usuario@exemplo.com",
                            },
                        },
                    },
                    token: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                },
            },
            UserProfileUpdateRequest: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        example: "Bruno Macedo Atualizado",
                    },
                    oldPassword: {
                        type: "string",
                        format: "password",
                        example: "senha123",
                    },
                    newPassword: {
                        type: "string",
                        format: "password",
                        example: "novaSenha456",
                    },
                },
            },
            Category: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid",
                        example: "b4c126d4-8db9-4672-9653-53da38fbb725",
                    },
                    name: {
                        type: "string",
                        example: "Faculdade",
                    },
                    color: {
                        type: "string",
                        nullable: true,
                        example: "#3B82F6",
                    },
                    parentId: {
                        type: "string",
                        format: "uuid",
                        nullable: true,
                        example: null,
                    },
                    userId: {
                        type: "string",
                        format: "uuid",
                        example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    },
                    children: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/Category",
                        },
                    },
                },
            },
            CategoryCreateRequest: {
                type: "object",
                required: ["name"],
                properties: {
                    name: {
                        type: "string",
                        example: "Trabalho",
                    },
                    color: {
                        type: "string",
                        example: "#10B981",
                    },
                    parentId: {
                        type: "string",
                        format: "uuid",
                        nullable: true,
                        example: null,
                    },
                },
            },
            CategoryUpdateRequest: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        example: "Trabalho Remoto",
                    },
                    color: {
                        type: "string",
                        example: "#059669",
                    },
                    parentId: {
                        type: "string",
                        format: "uuid",
                        nullable: true,
                        example: null,
                    },
                },
            },
            Goal: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid",
                        example: "c7e2b109-1a4e-4f57-89aa-096b797825d1",
                    },
                    title: {
                        type: "string",
                        example: "Passar no Semestre com Média Alta",
                    },
                    description: {
                        type: "string",
                        nullable: true,
                        example: "Concluir todas as matérias com nota superior a 8.5",
                    },
                    deadline: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: "2026-12-15T23:59:59.000Z",
                    },
                    userId: {
                        type: "string",
                        format: "uuid",
                        example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-11T16:00:00.000Z",
                    },
                    tasks: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/Task",
                        },
                    },
                },
            },
            GoalCreateRequest: {
                type: "object",
                required: ["title"],
                properties: {
                    title: {
                        type: "string",
                        example: "Aprender Docker e Microsserviços",
                    },
                    description: {
                        type: "string",
                        example: "Dominar orquestração de containers para produção",
                    },
                    deadline: {
                        type: "string",
                        format: "date-time",
                        example: "2026-11-30T00:00:00.000Z",
                    },
                },
            },
            GoalUpdateRequest: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        example: "Aprender Docker Avançado",
                    },
                    description: {
                        type: "string",
                        example: "Estudo aprofundado de redes e volumes",
                    },
                    deadline: {
                        type: "string",
                        format: "date-time",
                        example: "2026-12-31T00:00:00.000Z",
                    },
                },
            },
            Task: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid",
                        example: "a81d432e-5034-4b57-a367-27b3e1572c47",
                    },
                    title: {
                        type: "string",
                        example: "Estudar Álgebra Linear",
                    },
                    description: {
                        type: "string",
                        nullable: true,
                        example: "Capítulo 4 - Autovalores e Autovetores",
                    },
                    status: {
                        type: "string",
                        enum: ["TODO", "IN_PROGRESS", "DONE"],
                        example: "TODO",
                    },
                    dueDate: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: "2026-09-20T18:00:00.000Z",
                    },
                    userId: {
                        type: "string",
                        format: "uuid",
                        example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    },
                    categoryId: {
                        type: "string",
                        format: "uuid",
                        nullable: true,
                        example: "b4c126d4-8db9-4672-9653-53da38fbb725",
                    },
                    goalId: {
                        type: "string",
                        format: "uuid",
                        nullable: true,
                        example: "c7e2b109-1a4e-4f57-89aa-096b797825d1",
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-11T16:00:00.000Z",
                    },
                    category: {
                        $ref: "#/components/schemas/Category",
                    },
                    goal: {
                        $ref: "#/components/schemas/Goal",
                    },
                },
            },
            TaskCreateRequest: {
                type: "object",
                required: ["title"],
                properties: {
                    title: {
                        type: "string",
                        example: "Finalizar relatório de estágio",
                    },
                    description: {
                        type: "string",
                        example: "Revisar introdução e conclusões antes do envio",
                    },
                    status: {
                        type: "string",
                        enum: ["TODO", "IN_PROGRESS", "DONE"],
                        default: "TODO",
                        example: "TODO",
                    },
                    dueDate: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-15T23:59:59.000Z",
                    },
                    categoryId: {
                        type: "string",
                        format: "uuid",
                        example: "b4c126d4-8db9-4672-9653-53da38fbb725",
                    },
                    goalId: {
                        type: "string",
                        format: "uuid",
                        example: "c7e2b109-1a4e-4f57-89aa-096b797825d1",
                    },
                },
            },
            TaskUpdateRequest: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        example: "Relatório de estágio aprovado",
                    },
                    description: {
                        type: "string",
                        example: "Enviado por e-mail com anexo",
                    },
                    status: {
                        type: "string",
                        enum: ["TODO", "IN_PROGRESS", "DONE"],
                        example: "DONE",
                    },
                    dueDate: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-15T23:59:59.000Z",
                    },
                    categoryId: {
                        type: "string",
                        format: "uuid",
                    },
                    goalId: {
                        type: "string",
                        format: "uuid",
                    },
                },
            },
            DashboardInsightsResponse: {
                type: "object",
                properties: {
                    overview: {
                        type: "object",
                        properties: {
                            totalTasks: {
                                type: "integer",
                                example: 20,
                            },
                            completedTasks: {
                                type: "integer",
                                example: 14,
                            },
                            completionRate: {
                                type: "number",
                                format: "float",
                                example: 70.0,
                            },
                            weeklyCompletedTasks: {
                                type: "integer",
                                example: 5,
                            },
                        },
                    },
                    tasksByCategory: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                categoryId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "b4c126d4-8db9-4672-9653-53da38fbb725",
                                },
                                name: {
                                    type: "string",
                                    example: "Faculdade",
                                },
                                color: {
                                    type: "string",
                                    nullable: true,
                                    example: "#3B82F6",
                                },
                                count: {
                                    type: "integer",
                                    example: 8,
                                },
                            },
                        },
                    },
                    goalsProgress: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    format: "uuid",
                                    example: "c7e2b109-1a4e-4f57-89aa-096b797825d1",
                                },
                                title: {
                                    type: "string",
                                    example: "Passar no Semestre",
                                },
                                progress: {
                                    type: "number",
                                    format: "float",
                                    example: 66.67,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    paths: {
        "/ping": {
            get: {
                summary: "Healthcheck da API e Banco de Dados",
                tags: ["Sistema"],
                description:
                    "Verifica se a API está ativa e se o Prisma consegue executar queries com sucesso no banco de dados.",
                responses: {
                    200: {
                        description: "API e banco de dados funcionando corretamente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: {
                                            type: "string",
                                            example:
                                                "API rodando e Banco conectado com sucesso via Prisma Adapter!",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: "Falha na conexão com o banco de dados",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/users": {
            post: {
                summary: "Criar novo usuário",
                tags: ["Autenticação"],
                description:
                    "Registra uma nova conta de usuário no TodoX. O e-mail deve ser único e a senha é criptografada com salt via bcryptjs.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/RegisterRequest",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Usuário cadastrado com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/User",
                                },
                            },
                        },
                    },
                    400: {
                        description: "Campos obrigatórios ausentes",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    409: {
                        description: "E-mail já cadastrado no sistema",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Erro interno no servidor",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/login": {
            post: {
                summary: "Autenticar usuário",
                tags: ["Autenticação"],
                description:
                    "Valida e-mail e senha e retorna as informações do usuário autenticado junto ao token JWT (Bearer).",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/LoginRequest",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Login efetuado com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AuthResponse",
                                },
                            },
                        },
                    },
                    400: {
                        description: "E-mail ou senha ausentes",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Credenciais inválidas",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Erro interno no servidor",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/users/me": {
            get: {
                summary: "Obter perfil do usuário",
                tags: ["Autenticação"],
                security: [{ bearerAuth: [] }],
                description: "Retorna as informações do usuário autenticado no momento.",
                responses: {
                    200: {
                        description: "Dados do usuário recuperados com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/User",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    404: {
                        description: "Usuário não encontrado",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
        },
        "/api/users/profile": {
            put: {
                summary: "Atualizar perfil",
                tags: ["Autenticação"],
                security: [{ bearerAuth: [] }],
                description: "Permite atualizar o nome do usuário e a senha. Para alterar a senha, é obrigatório informar a senha antiga.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UserProfileUpdateRequest",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Perfil atualizado com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/User",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Senha atual incorreta ou Não autorizado",
                    },
                    404: {
                        description: "Usuário não encontrado",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
        },
        "/api/categories": {
            get: {
                summary: "Listar categorias",
                tags: ["Categorias"],
                security: [{ bearerAuth: [] }],
                description:
                    "Retorna todas as categorias pertencentes ao usuário autenticado, incluindo subcategorias filhas associadas.",
                responses: {
                    200: {
                        description: "Lista de categorias",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Category",
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: "Não autorizado / Token inválido ou ausente",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
            post: {
                summary: "Criar categoria",
                tags: ["Categorias"],
                security: [{ bearerAuth: [] }],
                description:
                    "Cria uma nova categoria para o usuário autenticado. Pode receber parentId para criar uma subcategoria.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CategoryCreateRequest",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Categoria criada com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Category",
                                },
                            },
                        },
                    },
                    400: {
                        description: "Nome é obrigatório",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
        },
        "/api/categories/{id}": {
            put: {
                summary: "Atualizar categoria",
                tags: ["Categorias"],
                security: [{ bearerAuth: [] }],
                description:
                    "Atualiza os dados de uma categoria pertencente ao usuário autenticado.",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID da categoria",
                        schema: {
                            type: "string",
                            format: "uuid",
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CategoryUpdateRequest",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Categoria atualizada com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Category",
                                },
                            },
                        },
                    },
                    400: {
                        description: "ID inválido",
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    404: {
                        description: "Categoria não encontrada",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
            delete: {
                summary: "Excluir categoria",
                tags: ["Categorias"],
                security: [{ bearerAuth: [] }],
                description:
                    "Remove a categoria especificada pertencente ao usuário autenticado.",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID da categoria",
                        schema: {
                            type: "string",
                            format: "uuid",
                        },
                    },
                ],
                responses: {
                    204: {
                        description: "Categoria excluída com sucesso",
                    },
                    400: {
                        description: "ID inválido",
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    404: {
                        description: "Categoria não encontrada",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
        },
        "/api/goals": {
            get: {
                summary: "Listar metas",
                tags: ["Metas"],
                security: [{ bearerAuth: [] }],
                description:
                    "Retorna todas as metas do usuário autenticado, incluindo as tarefas vinculadas a cada meta.",
                responses: {
                    200: {
                        description: "Lista de metas",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Goal",
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
            post: {
                summary: "Criar meta",
                tags: ["Metas"],
                security: [{ bearerAuth: [] }],
                description: "Cria uma nova meta de médio ou longo prazo.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/GoalCreateRequest",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Meta criada com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Goal",
                                },
                            },
                        },
                    },
                    400: {
                        description: "Título é obrigatório",
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
        },
        "/api/goals/{id}": {
            put: {
                summary: "Atualizar meta",
                tags: ["Metas"],
                security: [{ bearerAuth: [] }],
                description:
                    "Atualiza os dados de uma meta pertencente ao usuário autenticado.",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID da meta",
                        schema: {
                            type: "string",
                            format: "uuid",
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/GoalUpdateRequest",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Meta atualizada com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Goal",
                                },
                            },
                        },
                    },
                    400: {
                        description: "ID inválido",
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    404: {
                        description: "Meta não encontrada",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
            delete: {
                summary: "Excluir meta",
                tags: ["Metas"],
                security: [{ bearerAuth: [] }],
                description:
                    "Remove a meta indicada pertencente ao usuário autenticado.",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID da meta",
                        schema: {
                            type: "string",
                            format: "uuid",
                        },
                    },
                ],
                responses: {
                    204: {
                        description: "Meta excluída com sucesso",
                    },
                    400: {
                        description: "ID inválido",
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    404: {
                        description: "Meta não encontrada",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
        },
        "/api/tasks/alerts": {
            get: {
                summary: "Alertas de Tarefas",
                tags: ["Tarefas"],
                security: [{ bearerAuth: [] }],
                description:
                    "Retorna duas listas de tarefas do usuário: 'overdue' (tarefas atrasadas não concluídas) e 'upcoming' (tarefas para os próximos 3 dias não concluídas).",
                responses: {
                    200: {
                        description: "Listas de tarefas para alertas",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        overdue: {
                                            type: "array",
                                            items: { $ref: "#/components/schemas/Task" },
                                        },
                                        upcoming: {
                                            type: "array",
                                            items: { $ref: "#/components/schemas/Task" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
        },
        "/api/tasks": {
            get: {
                summary: "Listar tarefas",
                tags: ["Tarefas"],
                security: [{ bearerAuth: [] }],
                description:
                    "Retorna todas as tarefas cadastradas pelo usuário autenticado, com detalhes de categoria e meta inclusos. Permite filtragem por status, categoria, meta e data.",
                parameters: [
                    {
                        name: "status",
                        in: "query",
                        required: false,
                        schema: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"] },
                        description: "Filtrar por status",
                    },
                    {
                        name: "categoryId",
                        in: "query",
                        required: false,
                        schema: { type: "string", format: "uuid" },
                        description: "Filtrar por ID da categoria",
                    },
                    {
                        name: "goalId",
                        in: "query",
                        required: false,
                        schema: { type: "string", format: "uuid" },
                        description: "Filtrar por ID da meta",
                    },
                    {
                        name: "date",
                        in: "query",
                        required: false,
                        schema: { type: "string", format: "date" },
                        description: "Filtrar por data de vencimento exata (YYYY-MM-DD)",
                    }
                ],
                responses: {
                    200: {
                        description: "Lista de tarefas",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Task",
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
            post: {
                summary: "Criar tarefa",
                tags: ["Tarefas"],
                security: [{ bearerAuth: [] }],
                description:
                    "Cria uma nova atividade para o usuário autenticado, com status inicial padrão 'TODO' e vínculos opcionais com categoria e meta.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TaskCreateRequest",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Tarefa criada com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Task",
                                },
                            },
                        },
                    },
                    400: {
                        description: "Título é obrigatório",
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
        },
        "/api/tasks/{id}": {
            put: {
                summary: "Atualizar tarefa",
                tags: ["Tarefas"],
                security: [{ bearerAuth: [] }],
                description:
                    "Atualiza título, descrição, status, prazo ou vínculos de uma tarefa pertencente ao usuário autenticado.",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID da tarefa",
                        schema: {
                            type: "string",
                            format: "uuid",
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TaskUpdateRequest",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Tarefa atualizada com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Task",
                                },
                            },
                        },
                    },
                    400: {
                        description: "ID inválido",
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    404: {
                        description: "Tarefa não encontrada",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
            delete: {
                summary: "Excluir tarefa",
                tags: ["Tarefas"],
                security: [{ bearerAuth: [] }],
                description:
                    "Remove a tarefa indicada pertencente ao usuário autenticado.",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID da tarefa",
                        schema: {
                            type: "string",
                            format: "uuid",
                        },
                    },
                ],
                responses: {
                    204: {
                        description: "Tarefa excluída com sucesso",
                    },
                    400: {
                        description: "ID inválido",
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    404: {
                        description: "Tarefa não encontrada",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
        },
        "/api/dashboard/insights": {
            get: {
                summary: "Obter indicadores do Dashboard (Insights)",
                tags: ["Dashboard"],
                security: [{ bearerAuth: [] }],
                description:
                    "Retorna o resumo analítico do usuário autenticado: contagem de tarefas, taxa de conclusão, agrupamento de tarefas concluídas por categoria e progresso percentual de cada meta vinculada.",
                responses: {
                    200: {
                        description: "Dados estatísticos do dashboard",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/DashboardInsightsResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Não autorizado",
                    },
                    500: {
                        description: "Erro interno no servidor",
                    },
                },
            },
        },
    },
};
