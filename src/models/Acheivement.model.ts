import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievementDocument extends Document {
  name: string;
  description: string;
  icon: string; // URL to the icon image
  xp: number; // Amount of XP points awarded for this achievement
  condition: string; // Description of the condition to earn the achievement
}

const achievementSchema = new Schema<IAchievementDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  xp: { type: Number, required: true },
  condition: { type: String, required: true },
});

const Achievement = mongoose.model<IAchievementDocument>('Achievement', achievementSchema);

export default Achievement;