import { ObjectId } from 'mongodb';
import mongoose, { Document, Schema } from 'mongoose';
import { IExerciseDocument } from './Exercise.model';

export interface IWorkoutPlanExercise {
  exercise: ObjectId | IExerciseDocument; // Reference to the exercise in the Exercise collection
  sets: number;
  reps: number;
  intensity: number;
  restTime: string; // Optional: Rest time after performing the exercise
  notes: string; // Optional: Notes or specific instructions for this exercise in the workout plan
}

export interface IWorkoutPlanDocument extends Document {
  [key: string]: any; 
  title: string;
  description: string;
  type: string; // Type of workout plan (e.g., strength, cardio, etc.)
  exercises: IWorkoutPlanExercise[]; // List of exercises included in the workout plan
  intensityLevel: number; // Intensity level of the entire workout plan
  duration: string; // Duration of the workout plan (e.g., 1 hour, 30 minutes, etc.)
  notes: string; // Optional: General notes or instructions for the entire workout plan
  // Additional Properties
  // Add more attributes as needed
}

const WorkoutPlanExerciseSchema = new Schema<IWorkoutPlanExercise>({
  exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  intensity: { type: Number, required: true },
  restTime: { type: String, required: false },
  notes: { type: String, required: false },
});

const WorkoutPlanSchema = new Schema<IWorkoutPlanDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  exercises: { type: [WorkoutPlanExerciseSchema], required: true },
  intensityLevel: { type: Number, required: true },
  duration: { type: String, required: true },
  notes: { type: String, required: false },
  // Add more fields based on the workout plan requirements
});

const WorkoutPlanModel = mongoose.model<IWorkoutPlanDocument>('WorkoutPlan', WorkoutPlanSchema);

export default WorkoutPlanModel;