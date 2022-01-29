import {
    ConnInfo,
    Handler,
} from "https://deno.land/std@0.123.0/http/server.ts";

export interface MiddlewareContext extends Record<string, unknown> {
    next?: MiddlewareHandler;
    response: Response;
}

export type MiddlewareHandler = (
    request: Request,
    connInfo: ConnInfo,
    ctx: MiddlewareContext,
) => Response | Promise<Response>;

export type MiddlewarePipeline = Array<MiddlewareHandler | Handler>;
