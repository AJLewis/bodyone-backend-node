// backend/src/routes/response.ts

import express from 'express';
import * as midjourney from '../controllers/external/midjourney/imagine';

const router = express.Router();

router.post('/imagine', midjourney.imagine);

export default router;