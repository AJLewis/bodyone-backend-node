import mongoose, { Document, Schema } from 'mongoose';

export interface IMuscleGroup {
  name: string;
}

export interface IExerciseDocument extends Document {
  title: string;
  description: string;
  type: string;
  tags: string[];
  explanation: string;
  equipment: string[];
  targetMuscleGroups: IMuscleGroup[];
  videoSearchTerm: string;
  safetyInstructions: string;
  tips: string[];
  benefits: string[];
  variations: string[];
  warmUp: string;
  cooldown: string;
  prerequisites: string[];
  commonMistakes: string[];
  progression: string;
}

const MuscleGroupSchema = new Schema<IMuscleGroup>({
  name: { type: String, required: true, default: "" },
});

export const ExerciseSchema = new Schema<IExerciseDocument>({
  title: { type: String, required: true, default: "" },
  description: { type: String, required: true, default: "" },
  type: { type: String, required: true, default: "" },
  tags: { type: [String], required: true, default: [] },
  equipment: { type: [String], required: true, default: [] },
  targetMuscleGroups: { type: [MuscleGroupSchema], required: true, default: [] },
  videoSearchTerm: { type: String, required: true, default: "" },
  safetyInstructions: { type: String, required: true, default: "" },
  tips: { type: [String], required: true, default: [] },
  benefits: { type: [String], required: true, default: [] },
  variations: { type: [String], required: true, default: [] },
  warmUp: { type: String, required: true, default: "" },
  cooldown: { type: String, required: true, default: "" },
  prerequisites: { type: [String], required: true, default: [] },
  commonMistakes: { type: [String], required: true, default: [] },
  progression: { type: String, required: true, default: "" },
});

const ExerciseModel = mongoose.model<IExerciseDocument>('Exercise', ExerciseSchema);

export default ExerciseModel;