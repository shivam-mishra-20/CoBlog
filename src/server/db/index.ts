import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Connection options with sensible defaults and optional SSL
// Use DB_SSL=1 in .env for providers requiring SSL (e.g. some managed Postgres, Render, Railway with force SSL)
const useSSL = process.env.DB_SSL === "1";
const connectTimeoutSeconds = Number(process.env.DB_CONNECT_TIMEOUT ?? 10); // seconds

const client = postgres(process.env.DATABASE_URL, {
  ssl: useSSL ? "require" : undefined,
  connect_timeout: connectTimeoutSeconds,
  // postgres-js expects seconds for time-based options like max_lifetime
  // Use 1 hour (3600 seconds) to recycle connections hourly
  max_lifetime: 60 * 60,
  onnotice: (msg) => {
    if (process.env.DB_DEBUG === "1") {
      console.log("[pg notice]", msg);
    }
  },
  onparameter: (name, value) => {
    if (process.env.DB_DEBUG === "1") {
      console.log(`[pg param] ${name}=${value}`);
    }
  },
});

export const db = drizzle(client, { schema });

// Optional eager test (disabled in production for cold-start performance)
if (process.env.NODE_ENV === "development" && process.env.DB_EAGER_TEST === "1") {
  client`SELECT 1`.then(() => {
    console.log("[db] Connection test succeeded");
  }).catch((err) => {
    console.error("[db] Connection test failed:", err.message);
  });
}

// If DB_DEBUG is enabled in the environment (set DB_DEBUG=1 on Vercel),
// run a quick connection test at startup and log any error to make
// production connection issues visible in Vercel function logs.
if (process.env.DB_DEBUG === "1") {
  client`SELECT 1`.then(() => {
    console.log("[db] Connection test succeeded (DB_DEBUG=1)");
  }).catch((err) => {
    // Print full error for easier debugging in Vercel logs
    console.error("[db] Connection test failed (DB_DEBUG=1):", err);
  });
}
