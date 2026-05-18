import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { graphqlRequest } from './api/graphql';



function App() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const result = await graphqlRequest<Record<string, unknown>>(`
query {
  message(
    limit: 5
    order_by: { created_at: desc }
    where: { direction: {_eq: downstream} }
  ) {
    uid
    created_at
    direction
    payload_length
    payload_crc
    payload_string
  }
}
      `);

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="container py-4">
      <h1>ANT61 Mission Control</h1>
      <p className="text-muted">Testing live GraphQL telemetry connection</p>

      <button className="btn btn-primary mb-3" onClick={loadData}>
        Refresh
      </button>

      {loading && <div className="alert alert-info">Loading...</div>}

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div className="card">
          <div className="card-header">GraphQL response</div>
          <div className="card-body">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;