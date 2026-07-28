import { connectDatabase } from '../config/database.js';
await connectDatabase();
console.log('Seed script ready');
