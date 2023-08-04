import mongoose, { Document, Schema } from 'mongoose';

export interface IUserMetrics extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    health: {
        weight: number;
        height: number;
        bodyFat: number;
        water: number;
        muscleRate: number;
        bmi: number;
        visceralFat: number;
        boneMass: number;
    };
    bodyMetrics: {
        waist: number;
        chest: number;
        hips: number;
        neck: number;
        biceps: number;
        forearms: number;
        wrists: number;
        thighs: number;
        calves: number;
        ankles: number;
    };
}

const userMetricsSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    health: {
        weight: { type: Number, required: false },
        height: { type: Number, required: false },
        bodyFat: { type: Number, required: false },
        water: { type: Number, required: false },
        muscleRate: { type: Number, required: false },
        bmi: { type: Number, required: false },
        visceralFat: { type: Number, required: false },
        boneMass: { type: Number, required: false },
    },
    bodyMetrics: {
        waist: { type: Number, required: false },
        chest: { type: Number, required: false },
        hips: { type: Number, required: false },
        neck: { type: Number, required: false },
        biceps: { type: Number, required: false },
        forearms: { type: Number, required: false },
        wrists: { type: Number, required: false },
        thighs: { type: Number, required: false },
        calves: { type: Number, required: false },
        ankles: { type: Number, required: false },
    },
});

const UserMetrics = mongoose.model<IUserMetrics>('UserMetrics', userMetricsSchema);

export default UserMetrics;