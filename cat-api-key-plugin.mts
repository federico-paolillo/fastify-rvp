import {
  FastifyInstance,
  FastifyPluginAsync,
  onRequestAsyncHookHandler,
} from 'fastify';
import fp from 'fastify-plugin';

const PLUGIN_NAME = 'cat-api-key-plugin';
const AUTH_HEADER = 'x-api-key';

interface AddCatApiKeyHeaderOptions {
  catApiKey: string;
}

type AddCatApiKeyHeaderHookHandlerFactory = (
  catApiKey: string,
) => onRequestAsyncHookHandler;

type AddCatApiKeyPlugin = FastifyPluginAsync<AddCatApiKeyHeaderOptions>;

const addCatApiKeyHeader: AddCatApiKeyHeaderHookHandlerFactory = (
  catApiKey: string,
) =>
  async function (request, _) {
    if (AUTH_HEADER in request.headers) {
      return;
    }

    this.log.info(
      { headerKey: AUTH_HEADER, headerValue: catApiKey },
      'Added Cat API auth. header',
    );

    // @fastify/http-proxy, which uses @fastify/reply-from consumes the raw req. headers. Any change on the Fastify-specific req. is ignored
    // See: https://github.com/fastify/fastify-reply-from/blob/18f99d8fac6a0bb2eb4b46eb98a8486b57b6acd7/index.js#L54

    request.raw.headers[AUTH_HEADER] = catApiKey;

    this.log.info(request.raw.headers);
  };

export const addCatApiKey: AddCatApiKeyPlugin = fp(
  async (instance: FastifyInstance, opts: AddCatApiKeyHeaderOptions) => {
    instance.log.info(`Registering plugin ${PLUGIN_NAME}`);
    instance.addHook('onRequest', addCatApiKeyHeader(opts.catApiKey));
  },
);
