import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Coach';
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  teamId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeam extends Document {
  name: string;
  description: string;
  goal: string;
  members: mongoose.Types.ObjectId[];
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  durationMinutes: number;
  distanceKm?: number;
  calories?: number;
  notes?: string;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeaderboardEntry extends Document {
  userId: mongoose.Types.ObjectId;
  teamId?: mongoose.Types.ObjectId;
  score: number;
  rank: number;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkout extends Document {
  name: string;
  type: string;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  focusAreas: string[];
  instructions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ['Admin', 'Member', 'Coach'], default: 'Member' },
    fitnessLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' }
  },
  { timestamps: true }
);

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    goal: { type: String, required: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    points: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    calories: { type: Number, min: 0 },
    notes: { type: String, trim: true },
    completedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const leaderboardSchema = new Schema<ILeaderboardEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
    score: { type: Number, required: true, default: 0 },
    rank: { type: Number, required: true, min: 1 },
    streak: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const workoutSchema = new Schema<IWorkout>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    equipment: [{ type: String, trim: true }],
    focusAreas: [{ type: String, trim: true }],
    instructions: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export const Team: Model<ITeam> = mongoose.model<ITeam>('Team', teamSchema);
export const Activity: Model<IActivity> = mongoose.model<IActivity>('Activity', activitySchema);
export const LeaderboardEntry: Model<ILeaderboardEntry> = mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardSchema);
export const Workout: Model<IWorkout> = mongoose.model<IWorkout>('Workout', workoutSchema);
