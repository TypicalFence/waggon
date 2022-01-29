import {
    ConnInfo,
    Handler,
} from "https://deno.land/std@0.123.0/http/server.ts";
import {
    MiddlewareContext,
    MiddlewareHandler,
    MiddlewarePipeline,
} from "./types.ts";

export function runMiddlewarePipeline(
    pipeline: MiddlewarePipeline,
    req: Request,
    conn: ConnInfo,
    ctx?: MiddlewareContext,
): Promise<Response> {
    const endContext = pipeline.reduce(
        async (
            currentCtx: Promise<MiddlewareContext>,
            currentHandler: MiddlewareHandler,
            currentIndex,
        ) => {
            const ctx = await currentCtx;
            const next = pipeline[currentIndex + 1];
            const ctxRef = { ...ctx, next: next };
            const response = await Promise.resolve(
                currentHandler(req, conn, ctxRef),
            );
            return { ...ctxRef, response, next: undefined };
        },
        Promise.resolve(ctx || { response: new Response() }),
    );
    return endContext.then((ctx) => ctx.response);
}

export function handleMiddlewarePipeline(
    pipeline: MiddlewarePipeline,
): Handler {
    return (req, conn) => runMiddlewarePipeline(pipeline, req, conn);
}
