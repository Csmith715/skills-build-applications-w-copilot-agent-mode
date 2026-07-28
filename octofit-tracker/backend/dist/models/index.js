import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ['Admin', 'Member', 'Coach'], default: 'Member' },
    fitnessLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' }
}, { timestamps: true });
const teamSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    goal: { type: String, required: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    points: { type: Number, default: 0 }
}, { timestamps: true });
const activitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    calories: { type: Number, min: 0 },
    notes: { type: String, trim: true },
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });
const leaderboardSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
    score: { type: Number, required: true, default: 0 },
    rank: { type: Number, required: true, min: 1 },
    streak: { type: Number, default: 0 }
}, { timestamps: true });
const workoutSchema = new Schema({
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    equipment: [{ type: String, trim: true }],
    focusAreas: [{ type: String, trim: true }],
    instructions: [{ type: String, trim: true }]
}, { timestamps: true });
export const User = mongoose.model('User', userSchema);
export const Team = mongoose.model('Team', teamSchema);
export const Activity = mongoose.model('Activity', activitySchema);
export const LeaderboardEntry = mongoose.model('LeaderboardEntry', leaderboardSchema);
export const Workout = mongoose.model('Workout', workoutSchema);
