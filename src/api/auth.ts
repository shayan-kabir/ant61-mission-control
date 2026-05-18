export async function getJwtToken(): Promise<string> {
  const response = await fetch(import.meta.env.VITE_ANT61_AUTH_URL, {
    method: 'GET',
    headers: {
      'x-api-key': import.meta.env.VITE_ANT61_API_KEY,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Auth failed: ${response.status}`);
  }

  const json = await response.json();

  return json.token;
}