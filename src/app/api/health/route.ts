import { db } from "@/server/db";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Light-weight health query
    await db.execute(sql`SELECT 1 AS up`);
    return new Response(
      JSON.stringify({
        ok: true,
        up: true,
        env: {
          vercel: Boolean(process.env.VERCEL),
          nodeEnv: process.env.NODE_ENV,
          dbSsl: process.env.DB_SSL === "1",
        },
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const cause = (err as unknown as { cause?: unknown })?.cause;
    const causeMsg =
      cause instanceof Error ? cause.message : cause ? String(cause) : undefined;
    const stack = err instanceof Error ? err.stack : undefined;
    return new Response(
      JSON.stringify({ ok: false, error: message, cause: causeMsg, stack }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
