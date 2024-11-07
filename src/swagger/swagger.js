import swaggerJsDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "IITJ Mess Portal API",
      version: "1.0.0",
      description: "API for IITJ Mess Portal",
    },
    servers: [{ url: "http://localhost:80" }],
  },
  apis: [path.join(__dirname, "./docs/*.swagger.js")],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
