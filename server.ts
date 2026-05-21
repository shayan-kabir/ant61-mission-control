import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { createClient } from 'graphql-ws';
import WebSocket from 'ws';

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());


async function getJwtToken(): Promise<string> {
  const authResponse = await fetch(process.env.VITE_ANT61_AUTH_URL!, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.VITE_ANT61_API_KEY!,
      Accept: 'application/json',
    },
  });

  if (!authResponse.ok) {
    throw new Error(`Auth failed: ${authResponse.status}`);
  }

  const authJson = await authResponse.json();
  return authJson.token;
}

app.post('/api/graphql', async (req, res) => {
  try {
    const token = await getJwtToken();

    const graphqlResponse = await fetch(process.env.VITE_ANT61_GRAPHQL_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req.body),
    });

    const graphqlJson = await graphqlResponse.json();

    return res.status(graphqlResponse.status).json(graphqlJson);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});



app.get('/api/telemetry-stream', async (req, res) => {
  const beaconUid = req.query.beaconUid;

  if (typeof beaconUid !== 'string') {
    return res.status(400).json({ error: 'Missing beaconUid query parameter' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ message: 'Telemetry stream connected' })}\n\n`);

  try {
    const token = await getJwtToken();

    const client = createClient({
      url: process.env.VITE_ANT61_GRAPHQL_WS_URL!,
      webSocketImpl: WebSocket,
      connectionParams: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const unsubscribe = client.subscribe(
      {
        query: `
          subscription WatchNewTelemetry($beaconUid: uuid!) {
            beacon_telemetry_message(
              limit: 1
              order_by: { created_at: desc }
              where: {
                beacon_uid: { _eq: $beaconUid }
              }
            ) {
              uid
              created_at
              location_longitude
              location_latitude
              location_altitude
              location_timestamp
              signal_quality
              battery_remaining
              battery_charging
              imu_acc_x
              imu_acc_z
              imu_rot_x
              imu_rot_z
              orientation_x
              orientation_y
              latency
              firmware_version
            }
          }
        `,
        variables: {
          beaconUid,
        },
      },
      {
        next: (data) => {
          console.log('Live telemetry from ANT61:', new Date().toLocaleTimeString(), data);
          res.write(`event: telemetry\n`);
          res.write(`data: ${JSON.stringify(data)}\n\n`);
        },
        error: (err) => {
          res.write(`event: stream-error\n`);
          res.write(`data: ${JSON.stringify(err)}\n\n`);
        },
        complete: () => {
          res.write(`event: complete\n`);
          res.write(`data: ${JSON.stringify({ message: 'Subscription completed' })}\n\n`);
        },
      }
    );

    req.on('close', () => {
      unsubscribe();
      res.end();
    });
  } catch (err) {
    res.write(`event: stream-error\n`);
    res.write(
      `data: ${JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      })}\n\n`
    );
    res.end();
  }
});

app.get('/api/message-stream', async (req, res) => {
  const beaconUid = req.query.beaconUid;

  if (typeof beaconUid !== 'string') {
    return res.status(400).json({ error: 'Missing beaconUid query parameter' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ message: 'Message stream connected' })}\n\n`);

  try {
    const token = await getJwtToken();

    const client = createClient({
      url: process.env.VITE_ANT61_GRAPHQL_WS_URL!,
      webSocketImpl: WebSocket,
      connectionParams: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const unsubscribe = client.subscribe(
      {
        query: `
          subscription WatchNewMessages($beaconUid: uuid!) {
            message(
              limit: 3
              order_by: { created_at: desc }
              where: {
                beacon_uid: { _eq: $beaconUid }
              }
            ) {
              uid
              created_at
              direction
              payload_length
              payload_crc
              payload_string
            }
          }
        `,
        variables: {
          beaconUid,
        },
      },
      {
        next: (data) => {
          console.log('Live messages from ANT61:', new Date().toLocaleTimeString(), data);

          res.write(`event: messages\n`);
          res.write(`data: ${JSON.stringify(data)}\n\n`);
        },
        error: (err) => {
          res.write(`event: stream-error\n`);
          res.write(`data: ${JSON.stringify(err)}\n\n`);
        },
        complete: () => {
          res.write(`event: complete\n`);
          res.write(`data: ${JSON.stringify({ message: 'Message subscription completed' })}\n\n`);
        },
      }
    );

    req.on('close', () => {
      unsubscribe();
      res.end();
    });
  } catch (err) {
    res.write(`event: stream-error\n`);
    res.write(
      `data: ${JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      })}\n\n`
    );
    res.end();
  }
});


app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});