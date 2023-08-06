import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
const router = express.Router();

// Secret key for JWT
const jwtSecret = process.env.JWT_SECRET;

export const register = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local-signup', (err: any, user:  any, info: any) => {
        if (err) {
            console.log(err)
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ msg: info.message });
        }

        // User registered successfully, log in the user
        req.logIn(user, async function(err) {
            console.log(user)
            if (err) { 
                return next(err); 
            }
            // On successful login, a JWT is created and sent back.
            const token = await jwt.sign({ userId: user._id }, jwtSecret as string, { expiresIn: '1d' });
            return res.json({ token });
        });
    })(req, res, next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local-login', (err: any, user: any, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ msg: info.message });
        }
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            // On successful login, a JWT is created and sent back.
            const token = jwt.sign({ userId: user._id }, jwtSecret as string, { expiresIn: '1d' });
            return res.json({ token });
        });
    })(req, res, next);
};

export const logout = async (req: Request, res: Response) => {
    res.json({ msg: 'Logged out' });
}

export const checkUserToken = (req: Request, res: Response, next: NextFunction) => {
	// Get the token from the 'Authorization' header
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token || !authHeader.startsWith('Bearer ')) {
	  return res.status(401).send('Access Token Required');
	}

      // Check if the token is the shared secret
    if (token === process.env.SHARED_SECRET) {
        // If it is, call next() to proceed to the next middleware function or route handler
        return next();
    }
  
	try {
	  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  
	  // Attach the decoded data to req.user
	  req.user = decoded;
  
	  // Call next() to proceed to the next middleware function or route handler
	  next();
	} catch (error) {
	  console.log(error);
	  return res.status(403).send('Invalid Access Token');
	}
};