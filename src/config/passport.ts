import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { PassportStatic } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUserDocument } from '../models/User.model';

interface IJwtPayload {
    user: string;
    iat: number;
    exp: number;
}

export const passportConfig = (passport: PassportStatic) => {
    passport.use(
        'local-login',
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username: username.toLowerCase() });
                if (!user) {
                    return done(null, false, { message: `Username ${username} not found.` });
                }
                user.comparePassword(password, (err: Error, isMatch: boolean) => {
                    if (err) { return done(err); }
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Invalid username or password.' });
                    }
                });
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.use(
		'local-signup',
		new LocalStrategy({ usernameField: 'username', passReqToCallback: true }, async (req, username, password, done) => {
			try {
				const existingUser = await User.findOne({ username: username.toLowerCase() });
	
				if (existingUser) {
					return done(null, false, { message: `Username ${username} already exists.` });
				}
	
				// Hash password
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(password, salt);
	
				// Create new user
                const { email, subscription } = req.body;
				const newUser = new User({ username: username.toLowerCase(), password: hashedPassword, email: email});
                
				const savedUser = await newUser.save();
                console.log(savedUser);
				return done(null, savedUser);
			} catch (err) {
				done(err);
			}
		})
	);

    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromHeader('authorization'),
                secretOrKey: process.env.JWT_SECRET || 'defaultsecret',
            },
            (jwtPayload: IJwtPayload, done) => {
                User.findOne({ username: jwtPayload.user }, (err: any, user: IUserDocument) => {
                    if (err) { return done(err, false); }
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Unauthorized access.' });
                    }
                });
            }
        )
    );

    passport.serializeUser((user: any, done: any) => {
		done(null, user.id);
	});

    passport.deserializeUser((id: any, done: any) => {
		User.findById(id, (err: any, user: mongoose.Document & IUserDocument) => {
			done(err, user);
		});
	});
};
