# Presight Frontend Exercise

Searchable, filterable, paginated user directory with a React client, Node.js API, SQLite persistence, and Docker.

## Getting Started

Prerequisites: Node.js 22+ and npm.

```bash
npm install
npm run seed
npm run dev
```

- Client: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3001/api/users](http://localhost:3001/api/users)
- Health: [http://localhost:3001/api/health](http://localhost:3001/api/health)

The first server start also seeds SQLite if the database is empty. The database file is created at `server/data/users.sqlite`.

### Useful commands

```bash
npm run seed
npm run dev --workspace=presight-server
npm run dev --workspace=presight-client
npm run build
```

### Docker Compose

```bash
docker compose up --build
```

The app is available at [http://localhost:8080](http://localhost:8080). SQLite is stored in the `user-data` volume.

### API

`GET /api/users`
