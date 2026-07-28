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

function Activities() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : 'http://127.0.0.1:8000/api/activities/';
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadActivities() {
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
          setActivities(normalized);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Unable to load activities');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadActivities();

    return () => {
      isActive = false;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-info">Loading activities…</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!activities.length) {
    return <div className="alert alert-secondary">No activities found.</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Activities</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Type</th>
                <th>User</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id || activity.id || `${activity.type}-${activity.completedAt}`}>
                  <td>{formatCell(activity.type)}</td>
                  <td>{formatCell(activity.userId)}</td>
                  <td>{formatCell(activity.durationMinutes)}</td>
                  <td>{formatCell(activity.calories)}</td>
                  <td>{formatCell(activity.completedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Activities;
