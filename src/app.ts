import express from 'express';
import ticketRouter from './router/ticketRouter.js';
import { routeHandler } from './middleware/routeHandler.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
const app = express()

app.use(logger)
app.use(express.json())
app.use("/tickets", ticketRouter)
app.use(routeHandler)
app.use(errorHandler)

export default app;