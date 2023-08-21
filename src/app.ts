// backend/src/app.ts
import session from 'express-session';
import passport from 'passport';
import { passportConfig } from './config/passport';

import dotenv from 'dotenv';
import express from 'express';
require('./config/db');
dotenv.config();

const app = express();
app.use(express.json());

// Passport middleware
app.use(session({ secret: process.env.JWT_SECRET as string, resave: false, saveUninitialized: false }));
app.use(passport.initialize()); 
passportConfig(passport);
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});
app.use(require('./routes/base-route'));

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;