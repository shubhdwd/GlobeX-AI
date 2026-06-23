import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GlobeX AI API',
      version: '1.0.0',
      description: `
## GlobeX AI — Export Growth Platform for Indian Businesses

AI-powered platform helping Indian manufacturers, exporters, and MSMEs discover international buyers, 
analyze export opportunities, manage leads, and generate outreach.

### Authentication
Use the **/api/v1/auth/login** endpoint to obtain a JWT token, then click **Authorize** and enter:
\`Bearer <your-token>\`
      `,
      contact: { name: 'GlobeX AI Team', email: 'api@globex.ai' },
      license: { name: 'MIT' },
    },
    servers: [
      { url: `http://localhost:${env.PORT}/api/${env.API_VERSION}`, description: 'Local Development' },
      { url: `https://api.globex.ai/api/${env.API_VERSION}`, description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.controller.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
