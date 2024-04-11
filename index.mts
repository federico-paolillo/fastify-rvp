import Fastify from 'fastify';
import fastifyHttpProxy from '@fastify/http-proxy';
import { onFastifyError } from './errors.mjs';
import { addCatApiKey } from './cat-api-key-plugin.mjs';
import { config } from 'dotenv';

config({
  override: false,
  encoding: 'utf8',
  path: '.env',
});

const server = Fastify({
  logger: true,
});

server.register(async (instance) => {
  instance.register(addCatApiKey, {
    catApiKey: process.env.FASTIFY_RVP_CAT_API_KEY,
  });

  instance.register(fastifyHttpProxy, {
    upstream: 'https://api.thecatapi.com',
    http2: false,
  });
});

server.listen(
  {
    port: 60080,
    host: '0.0.0.0',
  },
  onFastifyError(server.log),
);
