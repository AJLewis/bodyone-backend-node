import express from 'express';
import * as notification from '../controllers/crud/notification';

const router = express.Router();

router.get('/user/:id', notification.getUserNotifications);
router.get('/:id', notification.getNotification);
router.post('/', notification.createNotification);
router.patch('/:id', notification.markNotificationAsViewed);
router.delete('/:id', notification.deleteNotification);

export default router;