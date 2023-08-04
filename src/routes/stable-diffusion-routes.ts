// backend/src/routes/response.ts

import express from 'express';
import * as fetch from '../controllers/external/stable-diffusion/fetch_from_queue';
import * as generateImage from '../controllers/external/stable-diffusion/text_to_image';
import * as generateVideo from '../controllers/external/stable-diffusion/text_to_video';

const router = express.Router();

router.post('/text_to_image', generateImage.text_to_image);
router.post('/fetch_from_queue', fetch.fetch_from_queue);
router.post('/text_to_video', generateVideo.text_to_video);

export default router;