import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { graphqlRequest } from './api/graphql';
import MessageFeed from './components/MessageFeed';
import TelemetryCards from './components/TelemetryCards';
import type { MessagesResponse, TelemetryResponse, BeaconsResponse, Beacon } from './types/ant61';
import { GET_LATEST_TELEMETRY_FOR_BEACON,
  GET_BEACONS, 
  SEND_UPSTREAM_MESSAGE,
 } from './api/ant61Queries';
import GpsPosition from './components/GpsPosition';
import ImuPanel from './components/ImuPanel';
import SendMessagePanel from './components/SendMessagePanel';

const BEACON_UID = '985141ba-f0f6-44bd-81ff-31a91fdf1925';


function App() {
  const [data, setData] = useState<MessagesResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [telemetryData, setTelemetryData] = useState<TelemetryResponse | null>(null);
  //const [beacons, setBeacons] = useState<Beacon[] | null>(null);
  const [selectedBeacon, setSelectedBeacon] = useState<Beacon | null>(null);
  const [messageText, setMessageText] = useState('Hello from ANT61 Mission Control');



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
    const beaconToUse = beaconResult.beacon[0];
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

  async function sendUpstreamMessage() {
    console.log(Math.floor(Date.now() / 1000));
    if (!selectedBeacon) {
      setError('No beacon selected');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await graphqlRequest(SEND_UPSTREAM_MESSAGE, {
        beaconUid: selectedBeacon.uid,
        payloadString: messageText,
        customId: Math.floor(Date.now() / 1000),
      });

      setMessageText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (!selectedBeacon) return;

    const eventSource = new EventSource(
      `http://localhost:4000/api/telemetry-stream?beaconUid=${selectedBeacon.uid}`
    );

    eventSource.addEventListener('connected', (event) => {
      console.log('Telemetry stream connected:', event.data);
    });

    eventSource.addEventListener('telemetry', (event) => {
      console.log('Telemetry event received in React:', event.data);
      const payload = JSON.parse(event.data);

      if (payload.data) {
        setTelemetryData(payload.data);
      }
    });

    eventSource.addEventListener('stream-error', (event) => {
      console.error('Telemetry stream error:', event);
    });

    return () => {
      eventSource.close();
    };
  }, [selectedBeacon]);


useEffect(() => {
  if (!selectedBeacon) return;

  const eventSource = new EventSource(
    `http://localhost:4000/api/message-stream?beaconUid=${selectedBeacon.uid}`
  );

  eventSource.addEventListener('connected', (event) => {
    console.log('Message stream connected:', event.data);
  });

  eventSource.addEventListener('messages', (event) => {
    console.log('Message event received in React:', event.data);

    const payload = JSON.parse(event.data);

    if (payload.data) {
      setData(payload.data);
    }
  });

  eventSource.addEventListener('stream-error', (event) => {
    console.error('Message stream error:', event);
  });

  return () => {
    eventSource.close();
  };
}, [selectedBeacon]);



  useEffect(() => {
    loadData();
  }, []);


  const latestTelemetry = telemetryData?.beacon_telemetry_message[0];

 return (
  <main className="dashboard-shell">
    <section className="dashboard-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
      <div>
        <h1 className="dashboard-title">ANT61 Mission Control</h1>
        <p className="dashboard-subtitle">Live GraphQL telemetry dashboard</p>

        {selectedBeacon && (
          <div className="status-pill mt-3">
              {selectedBeacon.alias} — {selectedBeacon.status}
          </div>
        )}
      </div>

      <button className="btn btn-ant" onClick={loadData}>
        Refresh
      </button>
    </section>

    {loading && <div className="alert alert-info">Loading...</div>}

    {error && (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error}
      </div>
    )}

    {latestTelemetry && <TelemetryCards telemetry={latestTelemetry} />}

    {latestTelemetry && (
      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <GpsPosition telemetry={latestTelemetry} />
        </div>

        <div className="col-lg-6">
          <ImuPanel telemetry={latestTelemetry} />
        </div>
      </div>
    )}

    <div className="row g-4 mt-1">
      <div className="col-lg-7">
        {data && <MessageFeed messages={data.message} />}
      </div>

      <div className="col-lg-5">
        {selectedBeacon && (
          <SendMessagePanel
            messageText={messageText}
            setMessageText={setMessageText}
            onSend={sendUpstreamMessage}
            loading={loading}
            beaconAlias={selectedBeacon.alias}
          />
        )}
      </div>
    </div>
  </main>
);
}

export default App;