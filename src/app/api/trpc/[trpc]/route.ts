import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/routers";
import { createTRPCContext } from "@/server/trpc/context";

// Force Node.js runtime on Vercel (Edge doesn't support pg drivers like postgres-js)
export const runtime = "nodejs";
// Ensure the endpoint is always evaluated dynamically (avoid any caching mishaps)
export const dynamic = "force-dynamic";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    onError: ({ path, error, type }) => {
      // Always log in development; in production, enable with TRPC_LOG_ERRORS=1
      if (
        process.env.NODE_ENV === "development" ||
        process.env.TRPC_LOG_ERRORS === "1"
      ) {
        console.error(
          `\u274c tRPC ${type} failed on ${path ?? "<no-path>"}: ${error.message}`
        );
        if (error instanceof Error) {
          // Some drivers set error.cause (unknown type); we just display if present
          const cause = (error as unknown as { cause?: unknown }).cause;
          if (cause) console.error("Cause:", cause);
          if (error.stack) console.error("Stack:", error.stack);
        }
      }
    },
  });

export { handler as GET, handler as POST };
