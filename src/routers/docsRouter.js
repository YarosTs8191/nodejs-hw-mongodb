// src/routes/docsRouter.js
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const docsRouter = express.Router();

// Завантажуємо openapi.yaml
const __dirname = path.resolve();
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));

// Swagger UI
docsRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default docsRouter;
