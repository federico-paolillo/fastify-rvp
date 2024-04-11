# fastify-revp

An example of a reverse-proxy using [Fastify](https://fastify.dev/) and [@fastify/http-proxy](https://github.com/fastify/fastify-http-proxy). It will proxy calls to [The Cat API](https://thecatapi.com/) by adding [the authn. header](https://developers.thecatapi.com/view-account/ylX4blBYT9FaoVd6OhvR?report=FJkYOq9tW) to all your requests without it.

## Overview

The application expects to have env. var. `FASTIFY_RVP_CAT_API_KEY` configured with your The Cat API key. The application uses dotenv to simplify this process. Create a `.env` file by copying and renaming the `.env.example` and replace the placeholder value with your API key.

Run the application with `npm start`. The reverse-proxy is hardcoded to listen to `http://0.0.0.0:60080`. Fire your requests at that endpoint to have them proxied to The Cat API, for example: `http://localhost:60080/v1/images/search?limit=50&breed_ids=beng` will be proxied to `https://api.thecatapi.com/v1/images/search?limit=50&breed_ids=beng`.

If you provide in the original request and `x-api-key` header yourself, the reverse proxy will honor it and will forward it as-is.

## Notes

You may see log lines such as:

```
"level":30,"time":1712822749080,"pid":9532,"hostname":"M3741QVYW1","reqId":"req-2","source":"/favicon.ico","msg":"fetching from remote server"}
{"level":30,"time":1712822749249,"pid":9532,"hostname":"M3741QVYW1","reqId":"req-2","msg":"response received"}
{"level":40,"time":1712822749253,"pid":9532,"hostname":"M3741QVYW1","reqId":"req-2","err":{"type":"RequestAbortedError","message":"Request aborted","stack":"AbortError: Request aborted\n    at BodyReadable.destroy (/Users/federico.paolillo/src/fastify-revp/node_modules/undici/lib/api/readable.js:55:13)\n    at ServerResponse.<anonymous> (/Users/federico.paolillo/src/fastify-revp/node_modules/fastify/lib/reply.js:740:17)\n    at ServerResponse.<anonymous> (node:internal/util:522:12)\n    at onclose (node:internal/streams/end-of-stream:158:25)\n    at process.processTicksAndRejections (node:internal/process/task_queues:77:11)","name":"AbortError","code":"UND_ERR_ABORTED"},"msg":"response terminated with an error with headers already sent"}
```

This happens when using an User Agent to call the APIs. When "navigating" to an API `GET` endpoint an User Agent might ask for a `favicon.ico`, which is not provided by The Cat API.
