# react-nestjs-sse
Server Sent Event work with multiple applications 
This project is a simple React + NestJS application 
that demonstrates Server-Sent Events (SSE) communication 
between a frontend and backend. The React frontend allows 
users to enter a userId and send a request to the NestJS backend, 
which then establishes an SSE connection. 
Once the backend receives an event (e.g., via a webhook), 
it sends a response back to the frontend, which updates 
the UI and closes the connection automatically.

# frontend
npm run dev

# backend
pnpm run start
