import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';
import { IUserMealPlanDocument } from './UserMealPlan.model';
import { IUserWorkoutPlanDocument } from './UserWorkoutPlan.model';
import { IPointsDocument } from './Pts.model';
import { IAICoachChatDocument } from './AICoachChat.model';

export enum SubscriptionType {
    FREE = 'free',
    PREMIUM = 'premium',
    PRO = 'pro',
    // Add more subscription types as needed
  }
  
  export interface ISubscription {
    type: SubscriptionType; // Type of subscription (e.g., free, premium, pro, etc.)
    startDate: Date; // Date when the subscription starts
    endDate: Date; // Date when the subscription ends
    isActive: boolean; // Whether the subscription is currently active
    // Additional Properties
    // Add more attributes as needed
  }

export interface IUserDocument extends Document {
    [key: string]: any; 
    
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    metrics: mongoose.Schema.Types.ObjectId;
    fitnessGoals: string[];
    dietaryRequirements: string[];
    allergies: string[];
    preferredCuisine: string[];
    points: IPointsDocument;
    subscription: ISubscription;
    lastLogin: Date;
    accountCreated: Date;
    mealPlans: IUserMealPlanDocument[];
    workoutPlans: IUserWorkoutPlanDocument[];
    aiChats: IAICoachChatDocument[];
    comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;
}

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    gender: { type: String, required: false },
    metrics: { type: mongoose.Schema.Types.ObjectId, ref: 'UserMetrics' },
    fitnessGoals: { type: [String], default: [] },
    dietaryRequirements: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    preferredCuisine: { type: [String], default: [] },
    points: { type: mongoose.Schema.Types.ObjectId, ref: 'Points' },
    subscription: {
        type: {
          type: String,
          enum: Object.values(SubscriptionType),
          required: true,
          default: SubscriptionType.FREE
        },
        startDate: { type: Date, required: true, default: Date.now },
        endDate: { type: String, required: false },
        isActive: { type: Boolean, default: true },
      },
    lastLogin: { type: Date, default: Date.now },
    mealPlans: [{ type: Schema.Types.ObjectId, ref: 'UserMealPlan' }],
    workoutPlans: [{ type: Schema.Types.ObjectId, ref: 'UserWorkoutPlan' }],
    aiChats: [{ type: Schema.Types.ObjectId, ref: 'AICoachChat' }],
    accountCreated: { type: Date, default: Date.now },
});

userSchema.methods.comparePassword = async function(candidatePassword: any, cb: any) {
    await bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User; 