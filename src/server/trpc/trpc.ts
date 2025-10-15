import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import superjson from "superjson";
import type { Context } from "./context";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/**
 * Middleware for logging requests
 */
const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  
  console.log(`[tRPC] ${type} ${path} - ${durationMs}ms`);
  
  return result;
});

/**
 * Public procedure with logging
 */
export const publicProcedureWithLogging = publicProcedure.use(loggerMiddleware);
