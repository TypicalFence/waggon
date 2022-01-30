# Waggon

Tiny middleware library for deno.

# Examples

```ts
import { serve } from "https://deno.land/std@0.123.0/http/server.ts";
import { handleMiddlewarePipeline } from "https://deno.land/x/waggon/mod.ts";

serve(
    handleMiddlewarePipeline([
        (req, conn, ctx) => {
            const value = "value from first handler";
            ctx.value = value;
            return ctx.next(req, conn, ctx);
        },
        (_req, _conn, ctx) => {
            const firstValue = ctx!.value;
            return new Response(`${firstValue} + value from second handler`);
        },
    ]),
);
```
