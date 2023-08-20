// backend/src/routes/response.ts

import express from 'express';
import * as users from '../controllers/crud/user'

const router = express.Router();
router.get('/', users.getAllUsers);
router.get('/basic/:id', users.getUserBasic);
router.get('/:id', users.getUser);
router.patch('/', users.updateUser);
router.delete('/:id', users.deleteUser);

export default router;