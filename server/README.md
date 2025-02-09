# ERC Server

This is the backend server for the ERC application. It uses Node.js, Express, and PostgreSQL.

## Setup Instructions

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/iransamarasekara/UoC-ERC-system.git
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up the Database

- Create a PostgreSQL database named ercuoc.

- Copy .env.example to .env and update the database credentials:

### 4. Run Migrations

```bash
npx knex migrate:latest --knexfile knexfile.cjs
```

### 5. Start the Server

```bash
npm start
```
