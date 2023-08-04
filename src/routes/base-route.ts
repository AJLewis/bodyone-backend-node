import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './api-routes';

import express, { Request, Response } from "express";

var router = express.Router();

// Middlewares
router.use(helmet());
router.use(cors());
router.use(express.json());

router.use('/api', apiRoutes);

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to FindThat API!');
});

module.exports = router;