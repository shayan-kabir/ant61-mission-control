import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/api/graphql', async (req, res) => {
  try {
    const authResponse = await fetch(process.env.VITE_ANT61_AUTH_URL!, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.VITE_ANT61_API_KEY!,
        Accept: 'application/json',
      },
    });

    if (!authResponse.ok) {
      return res.status(authResponse.status).json({
        error: `Auth failed: ${authResponse.status}`,
      });
    }

    const authJson = await authResponse.json();
    const token = authJson.token;

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

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});