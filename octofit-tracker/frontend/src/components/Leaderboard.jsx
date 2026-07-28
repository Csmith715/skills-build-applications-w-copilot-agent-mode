import { useEffect, useState } from 'react';
import { getApiUrl, normalizeCollection } from '../utils/api.js';

function formatCell(value) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object') {
    if (typeof value.name === 'string') {
      return value.name;
    }

    if (typeof value._id === 'string') {
      return value._id;
    }

    return JSON.stringify(value);
  }

  return String(value);
}

function Leaderboard() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : 'http://127.0.0.1:8000/api/leaderboard/';
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadLeaderboard() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const normalized = normalizeCollection(payload);

        if (isActive) {
          setEntries(normalized);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Unable to load leaderboard');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadLeaderboard();

    return () => {
      isActive = false;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-info">Loading leaderboard…</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!entries.length) {
    return <div className="alert alert-secondary">No leaderboard entries found.</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Leaderboard</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Score</th>
                <th>Streak</th>
                <th>User</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id || entry.id || `${entry.rank}-${entry.userId}`}>
                  <td>{formatCell(entry.rank)}</td>
                  <td>{formatCell(entry.score)}</td>
                  <td>{formatCell(entry.streak)}</td>
                  <td>{formatCell(entry.userId)}</td>
                  <td>{formatCell(entry.teamId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
