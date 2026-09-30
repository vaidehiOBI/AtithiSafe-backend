import { GraphQLFormattedError } from 'graphql';

const CODES: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
};

/** Gives Nest HTTP exceptions a matching GraphQL error code (Nest leaves e.g. 409 as INTERNAL_SERVER_ERROR). */
export function withHttpErrorCode(formatted: GraphQLFormattedError): GraphQLFormattedError {
  const status = (formatted.extensions?.originalError as { statusCode?: number } | undefined)?.statusCode;
  const code = status ? CODES[status] : undefined;
  return code ? { ...formatted, extensions: { ...formatted.extensions, code } } : formatted;
}
