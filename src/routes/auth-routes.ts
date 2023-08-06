import express from 'express';

import passport from 'passport';
import * as auth from '../controllers/crud/authentication';

const router = express.Router();

router.post('/register', auth.register);
router.post('/login', passport.authenticate('local-login'), auth.login);
router.post('/logout', auth.logout);

export default router;
