import {
    ConnInfo,
    Handler,
} from "https://deno.land/std@0.123.0/http/server.ts";

export interface MiddlewareContext extends Record<string, unknown> {
    next: MiddlewareHandler<MiddlewareContext>|Handler;
}

export type MiddlewareHandler<C extends MiddlewareContext> = (
    request: Request,
    connInfo: ConnInfo,
    ctx: C,
) => Response | Promise<Response>;

export type MiddlewarePipeline<C extends MiddlewareContext> = Array<MiddlewareHandler<C> | Handler>;
