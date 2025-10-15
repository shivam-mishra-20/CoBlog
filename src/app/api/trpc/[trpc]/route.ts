import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/routers";
import { createTRPCContext } from "@/server/trpc/context";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error, type }) => {
            // Enhanced logging in dev to diagnose DB issues
            console.error(
              `\u274c tRPC ${type} failed on ${path ?? "<no-path>"}: ${error.message}`
            );
            if (error instanceof Error) {
              // Some drivers set error.cause (unknown type); we just display if present
              const cause = (error).cause;
              if (cause) console.error('Cause:', cause);
              if (error.stack) console.error('Stack:', error.stack);
            }
          }
        : undefined,
  });

export { handler as GET, handler as POST };
