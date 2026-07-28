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

function Users() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : 'http://127.0.0.1:8000/api/users/';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadUsers() {
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
          setUsers(normalized);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Unable to load users');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      isActive = false;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-info">Loading users…</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!users.length) {
    return <div className="alert alert-secondary">No users found.</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Users</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Fitness</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id || user.email}>
                  <td>{formatCell(user.name)}</td>
                  <td>{formatCell(user.email)}</td>
                  <td>{formatCell(user.role)}</td>
                  <td>{formatCell(user.fitnessLevel)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
