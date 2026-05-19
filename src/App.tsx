import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { graphqlRequest } from './api/graphql';
import MessageFeed from './components/MessageFeed';
import type { MessagesResponse, TelemetryResponse } from './types/ant61';
import { GET_LATEST_TELEMETRY_FOR_BEACON } from './api/ant61Queries';

const BEACON_UID = '985141ba-f0f6-44bd-81ff-31a91fdf1925';


function App() {
  const [data, setData] = useState<MessagesResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [telemetryData, setTelemetryData] = useState<TelemetryResponse | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const result = await graphqlRequest<MessagesResponse>(`
          query {
            message(
            limit: 3
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


      const telemetryResult = await graphqlRequest<TelemetryResponse>(
            GET_LATEST_TELEMETRY_FOR_BEACON,
                {
                  beaconUid: BEACON_UID,
                }
          );

      setTelemetryData(telemetryResult);

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

      {telemetryData && (
        <div className="card mt-3">
          <div className="card-header">Latest telemetry</div>
          <div className="card-body">
            <pre>{JSON.stringify(telemetryData, null, 2)}</pre>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;