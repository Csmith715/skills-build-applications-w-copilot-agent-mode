import { connectDatabase } from '../config/database.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';

// Seed the octofit_db database with test data.

const seedDatabase = async () => {
  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Workout.deleteMany({})
  ]);

  const users = await User.insertMany([
    {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'Admin',
      fitnessLevel: 'Advanced'
    },
    {
      name: 'Grace Hopper',
      email: 'grace@example.com',
      role: 'Member',
      fitnessLevel: 'Intermediate'
    },
    {
      name: 'Linus Torvalds',
      email: 'linus@example.com',
      role: 'Coach',
      fitnessLevel: 'Advanced'
    }
  ]);

  const teams = await Team.insertMany([
    {
      name: 'Code Crushers',
      description: 'A high-energy team focused on endurance and consistency.',
      goal: 'Complete 1000 active minutes this month',
      members: [users[0]._id, users[1]._id],
      points: 1280
    },
    {
      name: 'Sprint Squad',
      description: 'A team that loves interval training and group challenges.',
      goal: 'Hit 15 team workouts this month',
      members: [users[2]._id],
      points: 960
    }
  ]);

  await Promise.all([
    User.findByIdAndUpdate(users[0]._id, { teamId: teams[0]._id }),
    User.findByIdAndUpdate(users[1]._id, { teamId: teams[0]._id }),
    User.findByIdAndUpdate(users[2]._id, { teamId: teams[1]._id })
  ]);

  const activities = await Activity.insertMany([
    {
      userId: users[0]._id,
      type: 'Run',
      durationMinutes: 35,
      distanceKm: 5.2,
      calories: 320,
      notes: 'Morning tempo run',
      completedAt: new Date('2026-07-20T07:30:00.000Z')
    },
    {
      userId: users[1]._id,
      type: 'Strength',
      durationMinutes: 45,
      calories: 410,
      notes: 'Full body circuit',
      completedAt: new Date('2026-07-21T18:00:00.000Z')
    },
    {
      userId: users[2]._id,
      type: 'Cycling',
      durationMinutes: 60,
      distanceKm: 24.8,
      calories: 600,
      notes: 'Weekend ride',
      completedAt: new Date('2026-07-22T09:00:00.000Z')
    }
  ]);

  const leaderboardEntries = await LeaderboardEntry.insertMany([
    {
      userId: users[0]._id,
      teamId: teams[0]._id,
      score: 980,
      rank: 1,
      streak: 12
    },
    {
      userId: users[1]._id,
      teamId: teams[0]._id,
      score: 910,
      rank: 2,
      streak: 8
    },
    {
      userId: users[2]._id,
      teamId: teams[1]._id,
      score: 940,
      rank: 1,
      streak: 10
    }
  ]);

  const workouts = await Workout.insertMany([
    {
      name: 'Interval Run',
      type: 'Cardio',
      durationMinutes: 30,
      difficulty: 'Intermediate',
      equipment: ['Running shoes'],
      focusAreas: ['Stamina', 'Speed'],
      instructions: ['Warm up for 5 minutes', 'Run 1 minute fast and 2 minutes easy for 8 rounds']
    },
    {
      name: 'Core Strength',
      type: 'Strength',
      durationMinutes: 25,
      difficulty: 'Beginner',
      equipment: ['Mat'],
      focusAreas: ['Core', 'Mobility'],
      instructions: ['Complete 3 rounds of 10 bodyweight squats', 'Finish with a 2 minute plank']
    },
    {
      name: 'Cycling Endurance',
      type: 'Cardio',
      durationMinutes: 45,
      difficulty: 'Advanced',
      equipment: ['Bike', 'Helmet'],
      focusAreas: ['Endurance', 'Legs'],
      instructions: ['Ride at steady pace for 30 minutes', 'Cool down with easy pedaling']
    }
  ]);

  console.log('Seed the octofit_db database with test data');
  console.log(`Seeded ${users.length} users, ${teams.length} teams, ${activities.length} activities, ${leaderboardEntries.length} leaderboard entries, and ${workouts.length} workouts`);
};

await seedDatabase();
