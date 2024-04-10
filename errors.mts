import { FastifyBaseLogger } from 'fastify';

const MAX_ERROR_DEPTH = 5;

interface UnwrappedError {
  message: string;
}

export function onFastifyError(logger: FastifyBaseLogger) {
  return function (error: Error | null, address: string) {
    if (error) {
      logger.fatal(
        `An error has occurred bootstrapping Fastify on ${address}`,
        flattenErrors(error),
      );

      process.exit(1);
    }
  };
}

export function flattenErrors(error: Error | null) {
  function depthCountingFlattenErrors(
    error: Error | null,
    errorsAccumulator: UnwrappedError[],
    depth = 0,
  ): UnwrappedError[] {
    if (error === null) {
      return errorsAccumulator;
    }

    if (depth === MAX_ERROR_DEPTH) {
      return errorsAccumulator;
    }

    const unwrappedError: UnwrappedError = {
      message: `${error.name}: ${error.message}`,
    };

    errorsAccumulator.push(unwrappedError);

    if (error.cause instanceof Error) {
      return depthCountingFlattenErrors(
        error.cause,
        errorsAccumulator,
        depth + 1,
      );
    }

    return errorsAccumulator;
  }

  return depthCountingFlattenErrors(error, [], 0);
}
