import express, { type Request, type Response } from 'express';
import { connectDatabase } from './config/database.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models/index.js';

const app = express();
app.use(express.json());

const port = Number(process.env.PORT || 8000);
const host = process.env.HOST || '0.0.0.0';
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : process.env.API_URL || `http://127.0.0.1:${port}`;

const registerResourceRoutes = (basePath: string, model: any) => {
  const normalizedPath = basePath.replace(/\/$/, '');
  const supportedPaths = [normalizedPath, `${normalizedPath}/`];

  supportedPaths.forEach((routePath) => {
    app.get(routePath, async (_req: Request, res: Response) => {
      try {
        const items = await model.find({}).lean();
        res.json(items);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
      }
    });

    app.post(routePath, async (req: Request, res: Response) => {
      try {
        const item = await model.create(req.body);
        res.status(201).json(item);
      } catch (error) {
        res.status(400).json({ error: 'Failed to create item' });
      }
    });
  });
};

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', port, apiUrl: apiBaseUrl });
});

registerResourceRoutes('/api/users/', User);
registerResourceRoutes('/api/teams/', Team);
registerResourceRoutes('/api/activities/', Activity);
registerResourceRoutes('/api/leaderboard/', LeaderboardEntry);
registerResourceRoutes('/api/workouts/', Workout);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, host, () => {
      console.log(`Backend listening on http://${host}:${port}`);
      console.log(`API URL: ${apiBaseUrl}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

void startServer();

