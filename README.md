# ANT61 Mission Control Dashboard

A real-time telemetry dashboard built with React, TypeScript, Express, GraphQL, WebSockets, and Server-Sent Events (SSE).

## Features

- Live telemetry updates
- Real-time message feed
- Upstream message sending
- GraphQL queries, mutations, and subscriptions
- Express proxy backend for authentication and CORS handling
- ANT61-themed dashboard UI
- Type-safe frontend using TypeScript

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Bootstrap
- Custom CSS

### Backend
- Node.js
- Express
- GraphQL
- graphql-ws
- SSE (Server-Sent Events)
- Websockets

---

## Architecture

```txt
React Frontend
    ↓ SSE
Express Backend Proxy
    ↓ WebSocket GraphQL Subscription
ANT61 GraphQL API