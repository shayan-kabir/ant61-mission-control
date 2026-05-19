import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { graphqlRequest } from './api/graphql';
import MessageFeed from './components/MessageFeed';
import type { MessagesResponse } from './types/ant61';



function App() {
  const [data, setData] = useState<MessagesResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const result = await graphqlRequest<MessagesResponse>(`
          query {
            message(
              order_by: { created_at: desc }

            ) {
              uid
              created_at
              direction
              payload_length
             
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

      {data && <MessageFeed messages={data.message} />}
    </main>
  );
}

export default App;