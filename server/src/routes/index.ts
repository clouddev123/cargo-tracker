import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { cargoRouter } from './cargo.routes.js';
import { historyRouter } from './history.routes.js';
import { boxNumbersRouter } from './box-numbers.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/cargo', cargoRouter);
apiRouter.use('/cargo', historyRouter);
apiRouter.use('/box-numbers', boxNumbersRouter);
