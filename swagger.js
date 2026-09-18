import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
    openapi: "3.0.0",

    info: {
        title: "E-Commerce API",
        version: "1.0.0",
        description: "E-Commerce API using Node.js, Express, MongoDB and JWT"
    },

    servers: [
        {
            url: "http://localhost:5000",
            description: "Local Server"
        }
    ],

    tags: [
        {
            name: "Authentication",
            description: "User registration and login"
        },
        {
            name: "User Products",
            description: "APIs for users to view products"
        },
        {
            name: "Admin Products",
            description: "Admin product management APIs"
        },
        {
            name: "Admin Users",
            description: "Admin user management APIs"
        }
    ],

    components: {

        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },

        schemas: {

            Product: {
                type: "object",
                required: [
                    "name",
                    "description",
                    "category",
                    "price",
                    "stock"
                ],
                properties: {
                    name: {
                        type: "string",
                        example: "Laptop"
                    },
                    description: {
                        type: "string",
                        example: "High performance laptop for work and study"
                    },
                    category: {
                        type: "string",
                        example: "Electronics"
                    },
                    price: {
                        type: "number",
                        example: 55000
                    },
                    stock: {
                        type: "number",
                        example: 10
                    },
                    published: {
                        type: "boolean",
                        example: true
                    }
                }
            },

            User: {
                type: "object",
                properties: {
                    userId: {
                        type: "string",
                        example: "USER001"
                    },
                    name: {
                        type: "string",
                        example: "Sudeep"
                    },
                    email: {
                        type: "string",
                        example: "sudeep@gmail.com"
                    },
                    password: {
                        type: "string",
                        example: "123456"
                    },
                    role: {
                        type: "string",
                        enum: [
                            "user",
                            "admin"
                        ],
                        example: "user"
                    }
                }
            },

            Register: {
                type: "object",
                required: [
                    "name",
                    "email",
                    "password"
                ],
                properties: {
                    name: {
                        type: "string",
                        example: "Sudeep"
                    },
                    email: {
                        type: "string",
                        example: "sudeep@gmail.com"
                    },
                    password: {
                        type: "string",
                        example: "123456"
                    },
                    role: {
                        type: "string",
                        enum: [
                            "user",
                            "admin"
                        ],
                        example: "user"
                    }
                }
            },

            Login: {
                type: "object",
                required: [
                    "email",
                    "password"
                ],
                properties: {
                    email: {
                        type: "string",
                        example: "sudeep@gmail.com"
                    },
                    password: {
                        type: "string",
                        example: "123456"
                    }
                }
            }

        }
    },

    paths: {

        // =========================
        // AUTHENTICATION
        // =========================

        "/api/users/register": {

            post: {
                tags: ["Authentication"],
                summary: "Register a new user",

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Register"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: "User registered successfully"
                    },

                    400: {
                        description: "Invalid request"
                    }
                }
            }
        },


        "/api/users/login": {

            post: {
                tags: ["Authentication"],
                summary: "Login user",

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Login"
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: "Login successful"
                    },

                    401: {
                        description: "Invalid email or password"
                    }
                }
            }
        },


        // =========================
        // USER PRODUCTS
        // =========================

        "/api/users/products": {

            get: {
                tags: ["User Products"],
                summary: "Get all published products",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [

                    {
                        name: "page",
                        in: "query",
                        schema: {
                            type: "integer",
                            example: 1
                        }
                    },

                    {
                        name: "limit",
                        in: "query",
                        schema: {
                            type: "integer",
                            example: 10
                        }
                    }

                ],

                responses: {
                    200: {
                        description: "Products fetched successfully"
                    },

                    401: {
                        description: "Unauthorized"
                    }
                }
            }
        },


        "/api/users/products/filter": {

            get: {
                tags: ["User Products"],
                summary: "Filter products",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [

                    {
                        name: "category",
                        in: "query",
                        schema: {
                            type: "string",
                            example: "Electronics"
                        }
                    },

                    {
                        name: "minPrice",
                        in: "query",
                        schema: {
                            type: "number",
                            example: 1000
                        }
                    },

                    {
                        name: "maxPrice",
                        in: "query",
                        schema: {
                            type: "number",
                            example: 50000
                        }
                    },

                    {
                        name: "sort",
                        in: "query",
                        schema: {
                            type: "string",
                            enum: [
                                "price_asc",
                                "price_desc",
                                "newest"
                            ]
                        }
                    }

                ],

                responses: {
                    200: {
                        description: "Products filtered successfully"
                    },

                    404: {
                        description: "Products not found"
                    }
                }
            }
        },


        "/api/users/products/{id}": {

            get: {
                tags: ["User Products"],
                summary: "Get published product by ID",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [

                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        },

                        example: "65f123456789abcdef123456"
                    }

                ],

                responses: {

                    200: {
                        description: "Product found"
                    },

                    404: {
                        description: "Product not found"
                    }
                }
            }
        },


        // =========================
        // ADMIN PRODUCTS
        // =========================

        "/api/": {

            post: {
                tags: ["Admin Products"],
                summary: "Create product",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {

                            schema: {
                                $ref: "#/components/schemas/Product"
                            }

                        }
                    }
                },

                responses: {

                    201: {
                        description: "Product created successfully"
                    },

                    400: {
                        description: "Invalid product data"
                    }
                }
            },


            get: {
                tags: ["Admin Products"],
                summary: "Get all products",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [

                    {
                        name: "category",
                        in: "query",

                        schema: {
                            type: "string"
                        },

                        example: "Electronics"
                    },

                    {
                        name: "minPrice",
                        in: "query",

                        schema: {
                            type: "number"
                        },

                        example: 1000
                    },

                    {
                        name: "maxPrice",
                        in: "query",

                        schema: {
                            type: "number"
                        },

                        example: 50000
                    },

                    {
                        name: "sort",
                        in: "query",

                        schema: {
                            type: "string",

                            enum: [
                                "price_asc",
                                "price_desc",
                                "newest"
                            ]
                        }
                    },

                    {
                        name: "page",
                        in: "query",

                        schema: {
                            type: "integer",
                            default: 1
                        }
                    },

                    {
                        name: "limit",
                        in: "query",

                        schema: {
                            type: "integer",
                            default: 10
                        }
                    }

                ],

                responses: {

                    200: {
                        description: "Products fetched successfully"
                    }
                }
            }
        },


        "/api/{id}": {

            get: {

                tags: ["Admin Products"],
                summary: "Get product by ID",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [

                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        }
                    }

                ],

                responses: {

                    200: {
                        description: "Product found"
                    },

                    404: {
                        description: "Product not found"
                    }
                }
            },


            put: {

                tags: ["Admin Products"],
                summary: "Update product",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [

                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        }
                    }

                ],

                requestBody: {

                    required: true,

                    content: {

                        "application/json": {

                            schema: {
                                $ref: "#/components/schemas/Product"
                            }

                        }
                    }
                },

                responses: {

                    200: {
                        description: "Product updated successfully"
                    },

                    404: {
                        description: "Product not found"
                    }
                }
            },


            delete: {

                tags: ["Admin Products"],
                summary: "Delete product",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [

                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        }
                    }

                ],

                responses: {

                    200: {
                        description: "Product deleted successfully"
                    },

                    404: {
                        description: "Product not found"
                    }
                }
            }
        },


        // =========================
        // PUBLISH / UNPUBLISH
        // =========================

        "/api/{id}/publish": {

            patch: {

                tags: ["Admin Products"],
                summary: "Publish product",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [

                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        }
                    }

                ],

                responses: {

                    200: {
                        description: "Product published successfully"
                    },

                    404: {
                        description: "Product not found"
                    }
                }
            }
        },


        "/api/{id}/unpublish": {

            patch: {

                tags: ["Admin Products"],
                summary: "Unpublish product",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [

                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        }
                    }

                ],

                responses: {

                    200: {
                        description: "Product unpublished successfully"
                    },

                    404: {
                        description: "Product not found"
                    }
                }
            }
        },


        // =========================
        // IMPORT CSV
        // =========================

        "/api/import": {

            post: {

                tags: ["Admin Products"],
                summary: "Import products from CSV",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                requestBody: {

                    required: true,

                    content: {

                        "multipart/form-data": {

                            schema: {

                                type: "object",

                                required: [
                                    "file"
                                ],

                                properties: {

                                    file: {
                                        type: "string",
                                        format: "binary"
                                    }

                                }
                            }
                        }
                    }
                },

                responses: {

                    201: {
                        description: "Products imported successfully"
                    },

                    400: {
                        description: "Invalid CSV file"
                    }
                }
            }
        },


        // =========================
        // EXPORT CSV
        // =========================

        "/api/export": {

            get: {

                tags: ["Admin Products"],
                summary: "Export products to CSV",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                responses: {

                    200: {

                        description: "Products CSV file",

                        content: {

                            "text/csv": {

                                schema: {
                                    type: "string",
                                    format: "binary"
                                }
                            }
                        }
                    },

                    500: {
                        description: "Could not export products"
                    }
                }
            }
        },


        // =========================
        // ADMIN USERS
        // =========================

        "/api/users": {

            get: {

                tags: ["Admin Users"],
                summary: "Get all users",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                responses: {

                    200: {
                        description: "Users fetched successfully"
                    }
                }
            }
        },


        "/api/users/{id}": {

            get: {

                tags: ["Admin Users"],
                summary: "Get user by ID",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [

                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        },

                        example: "USER001"
                    }

                ],

                responses: {

                    200: {
                        description: "User found"
                    },

                    404: {
                        description: "User not found"
                    }
                }
            },


            put: {

                tags: ["Admin Users"],
                summary: "Update user",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [

                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        }
                    }

                ],

                requestBody: {

                    required: true,

                    content: {

                        "application/json": {

                            schema: {

                                type: "object",

                                properties: {

                                    name: {
                                        type: "string",
                                        example: "Sudeep"
                                    },

                                    email: {
                                        type: "string",
                                        example: "sudeep@gmail.com"
                                    },

                                    role: {
                                        type: "string",
                                        enum: [
                                            "user",
                                            "admin"
                                        ],
                                        example: "user"
                                    }

                                }
                            }
                        }
                    }
                },

                responses: {

                    200: {
                        description: "User updated successfully"
                    },

                    404: {
                        description: "User not found"
                    }
                }
            },


            delete: {

                tags: ["Admin Users"],
                summary: "Delete user",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [

                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        }
                    }

                ],

                responses: {

                    200: {
                        description: "User deleted successfully"
                    },

                    404: {
                        description: "User not found"
                    }
                }
            }
        }

    }
};


// FUNCTION TO CONNECT SWAGGER
export const setupSwagger = (app) => {

    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument)
    );

    console.log(
        "Swagger running at http://localhost:5000/api-docs"
    );
};