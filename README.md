# Ticket Management API

A lightweight Express.js API for creating, listing, updating, and deleting support tickets. The app stores ticket data in a JSON file and exposes REST endpoints for working with that data.

## Features

- Create new tickets
- List all tickets or filter by `id` and `status`
- Update a ticket's `status` or `assignee`
- Delete a ticket by ID
- Structured error responses for invalid JSON, missing tickets, and unknown routes

## Tech Stack

- Node.js
- TypeScript
- Express
- Vitest

## Project Structure

```text
.
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── controller/
│   │   └── ticketController.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   └── routeHandler.ts
│   ├── router/
│   │   └── ticketRouter.ts
│   ├── ticketRepo/
│   │   └── ticketRepo.ts
│   ├── ticketService/
│   │   └── ticketService.ts
│   └── types/
│       └── types.ts
├── tests/
│   ├── app.test.ts
│   └── services.test.ts
├── tickets.json
├── package.json
├── tsconfig.json
├── vitest.config.js
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Build the TypeScript project

```bash
npm run build
```

### 3. Start the server

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

## API Endpoints

### Get all tickets

```http
GET /tickets
```

Returns a JSON array of tickets.

### Filter tickets

```http
GET /tickets?id=<ticket-id>
GET /tickets?status=open
GET /tickets?status=closed
```

### Create a ticket

```http
POST /tickets
Content-Type: application/json
```

Example body:

```json
{
  "title": "Login issue",
  "description": "User cannot sign in on mobile",
  "priority": "high",
  "assignee": "ak"
}
```

Valid priorities:

- `low`
- `medium`
- `high`

### Update a ticket

```http
PATCH /tickets/:id
Content-Type: application/json
```

Example body:

```json
{
  "status": "closed"
}
```

You can also update the assignee:

```json
{
  "assignee": "john"
}
```

### Delete a ticket

```http
DELETE /tickets/:id
```

## Ticket Model

```ts
interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "closed";
  assignee: string;
}
```

## Error Handling

The API includes responses for common issues such as:

- Unknown route: `404` with `{ "error": "Page not found" }`
- Missing ticket: `404` with `{ "error": "Ticket not found" }`
- Invalid JSON payload: `{ "error": "Invalid Json" }`

## Testing

Run the test suite with:

```bash
npm test
```

To generate coverage:

```bash
npm run coverage
```

## Notes

- Tickets are persisted in the root `tickets.json` file.
- The project is configured as an ES module (`"type": "module"`).
- The app uses `express.json()` middleware to parse incoming JSON requests.
