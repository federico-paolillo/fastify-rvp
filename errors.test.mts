import { describe, it, expect } from 'vitest';
import { flattenErrors } from './errors.mjs';

describe('flattenErrors', () => {
  it('flattens errors', () => {
    const error = new Error('Oh noooo', {
      cause: new Error('Oh goood', { cause: new Error('Oh myyyy') }),
    });

    const errors = flattenErrors(error);

    expect(errors.length).toBe(3);
  });
});
