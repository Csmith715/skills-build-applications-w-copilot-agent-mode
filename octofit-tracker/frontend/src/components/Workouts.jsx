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

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadWorkouts() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(getApiUrl('workouts'));

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const normalized = normalizeCollection(payload);

        if (isActive) {
          setWorkouts(normalized);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Unable to load workouts');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadWorkouts();

    return () => {
      isActive = false;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-info">Loading workouts…</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!workouts.length) {
    return <div className="alert alert-secondary">No workouts found.</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Workouts</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Difficulty</th>
                <th>Equipment</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout._id || workout.id || workout.name}>
                  <td>{formatCell(workout.name)}</td>
                  <td>{formatCell(workout.type)}</td>
                  <td>{formatCell(workout.durationMinutes)}</td>
                  <td>{formatCell(workout.difficulty)}</td>
                  <td>{formatCell(workout.equipment)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Workouts;
