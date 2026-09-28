export const subgraphs = () => [
  { name: 'identity-property', url: process.env.IDENTITY_PROPERTY_URL ?? 'http://localhost:4001/graphql' },
  { name: 'safety-operations', url: process.env.SAFETY_OPERATIONS_URL ?? 'http://localhost:4002/graphql' },
  { name: 'communication-provider', url: process.env.COMMUNICATION_PROVIDER_URL ?? 'http://localhost:4003/graphql' },
];
