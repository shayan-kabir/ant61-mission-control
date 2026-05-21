import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { graphqlRequest } from './api/graphql';
import MessageFeed from './components/MessageFeed';
import TelemetryCards from './components/TelemetryCards';
import type { MessagesResponse, TelemetryResponse, BeaconsResponse, Beacon } from './types/ant61';
import { GET_LATEST_TELEMETRY_FOR_BEACON,
  GET_BEACONS
 } from './api/ant61Queries';
import GpsPosition from './components/GpsPosition';
import ImuPanel from './components/ImuPanel';

const BEACON_UID = '985141ba-f0f6-44bd-81ff-31a91fdf1925';


function App() {
  const [data, setData] = useState<MessagesResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [telemetryData, setTelemetryData] = useState<TelemetryResponse | null>(null);
  //const [beacons, setBeacons] = useState<Beacon[] | null>(null);
  const [selectedBeacon, setSelectedBeacon] = useState<Beacon | null>(null);

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


    const beaconResult = await graphqlRequest<BeaconsResponse>(GET_BEACONS);
    // setBeacons(beaconResult.beacon);
    const beaconToUse = selectedBeacon ?? beaconResult.beacon[0];
    if (!beaconToUse) {
      throw new Error('No beacons available');

    }

    setSelectedBeacon(beaconToUse);

      const telemetryResult = await graphqlRequest<TelemetryResponse>(
            GET_LATEST_TELEMETRY_FOR_BEACON,
                {
                  beaconUid: beaconToUse.uid,  // GraphQL variable
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


  const latestTelemetry = telemetryData?.beacon_telemetry_message[0];

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

    {latestTelemetry && <TelemetryCards telemetry={latestTelemetry} />}

    {latestTelemetry && (
    <div className="row">
      <div className="col-md-6">
        <GpsPosition telemetry={latestTelemetry} />
      </div>
      <div className="col-md-6">
        <ImuPanel telemetry={latestTelemetry} />
      </div>
    </div>
    )}


    {selectedBeacon && (
   <div className="alert alert-secondary">
    Selected beacon: <strong>{selectedBeacon.alias}</strong> — {selectedBeacon.status}
  </div>

)}
    </main>
  );
}

export default App;