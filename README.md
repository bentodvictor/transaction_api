# Transactions API

This is a simple API built with Node.js using Fastify, Knex.js, and SQLite to manage transactions. The project aims to study CRUD operations and database concepts.

## Features
- Create, read, and retrieve a summary of transactions.
- Uses cookies to manage session IDs.
- Implements input validation with Zod.
- Uses Knex.js for database queries.

## Installation

Ensure you have **Node.js v22 or later** installed.

```sh
# Clone the repository
git clone https://github.com/bentodvictor/transaction_api.git
cd transaction_api

# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the project root and configure your database:

```env
DATABASE_URL= Path to .db file (usually on ./database/file.db)
NODE_ENV= Should be "development" or "production" or "test"
PORT= Your server port number
DATABASE_CLIENT=sqlite
```

## Running the Application

Start the development server:

```sh
npm run dev
```

## Endpoints

### 1. Get all transactions
```http
GET /transactions
```
**Headers:**
- `Cookie: sessionId=<your_session_id>`

**Response:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "title": "Transaction Example",
      "amount": 1000,
      "session_id": "uuid"
    }
  ]
}
```

### 2. Get a transaction by ID
```http
GET /transactions/:id
```
**Response:**
```json
{
  "transaction": {
    "id": "uuid",
    "title": "Transaction Example",
    "amount": 1000,
    "session_id": "uuid"
  }
}
```

### 3. Create a transaction
```http
POST /transactions
```
**Body:**
```json
{
  "title": "New transaction",
  "amount": 5000,
  "type": "credit"
}
```

### 4. Get transaction summary
```http
GET /transactions/summary
```
**Response:**
```json
{
  "summary": {
    "amount": 3000
  }
}
```

## Running Tests

To run the tests, use:

```sh
npm run test
```

## Author

- **Victor Dallagnol Bento**

## Contributing

Feel free to submit issues or pull requests at:
[GitHub Issues](https://github.com/bentodvictor/transaction_api/issues)

