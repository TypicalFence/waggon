import {
    ConnInfo,
    Handler,
} from "https://deno.land/std@0.123.0/http/server.ts";
import {
    MiddlewareContext,
    MiddlewarePipeline,
} from "./types.ts";


export function runMiddlewarePipeline<C extends MiddlewareContext>(
    pipeline: MiddlewarePipeline<C>,
    req: Request,
    conn: ConnInfo,
    ctx?: Omit<C, 'next'>,
): Promise<Response> {
    let idx = 0;
    if (!pipeline[0]) {
        return Promise.reject(new Error("empty pipeline"));
    }

    const next = (req: Request, conn: ConnInfo, ctx: C) => {
        const handler = pipeline[idx++];
        if (handler) {
            return handler(req, conn, {...ctx, next});
        } else {
            return Promise.reject(new Error("Must not call next inside the last handler")) 
        }
    }

    return Promise.resolve(pipeline[0](req, conn, {...ctx as C, next}))
}

export function handleMiddlewarePipeline<C extends MiddlewareContext>(
    pipeline: MiddlewarePipeline<C>,
): Handler {
    return (req, conn) => runMiddlewarePipeline(pipeline, req, conn);
}
