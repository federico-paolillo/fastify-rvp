import {
  FastifyInstance,
  FastifyPluginAsync,
  onRequestAsyncHookHandler,
} from 'fastify';
import fp from 'fastify-plugin';

const PLUGIN_NAME = 'cat-api-key-plugin';
const AUTH_HEADER = 'x-api-key';

interface AddCatApiKeyHeaderOptions {
  catApiKeyValue: string;
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

    this.log.info('Added Cat API header to request');

    request.headers[AUTH_HEADER] = catApiKey;
  };

export const addCatApiKey: AddCatApiKeyPlugin = fp(
  async (instance: FastifyInstance, opts: AddCatApiKeyHeaderOptions) => {
    instance.log.info(`Registering plugin ${PLUGIN_NAME}`);
    instance.addHook('onRequest', addCatApiKeyHeader(opts.catApiKeyValue));
  },
);
