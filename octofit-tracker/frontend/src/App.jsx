import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';
import './App.css';

const navigationItems = [
  { to: '/', label: 'Overview' },
  { to: '/users', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
];

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  return (
    <div className="container py-4">
      <header className="mb-4 rounded-4 bg-dark text-white p-4 shadow-sm">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
          <div>
            <p className="text-uppercase small text-secondary mb-2">Octofit Tracker</p>
            <h1 className="h3 mb-2">React 19 Presentation Tier</h1>
            <p className="mb-0 text-light-emphasis">
              Connected to the backend API via Vite environment variables and the public Codespaces URL.
            </p>
          </div>
          <div className="text-lg-end">
            <div className="fw-semibold">API base</div>
            <div className="small text-light-emphasis">
              {codespaceName
                ? `https://${codespaceName}-8000.app.github.dev/api/`
                : 'http://127.0.0.1:8000/api/'}
            </div>
          </div>
        </div>
      </header>

      <nav className="nav nav-pills flex-wrap gap-2 mb-4">
        {navigationItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route path="/" element={<div className="alert alert-info">Select a section from the navigation to inspect tracker data.</div>} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </div>
  );
}

export default App;
