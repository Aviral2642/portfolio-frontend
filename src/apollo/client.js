import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// HTTP Link
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:5001/graphql',
});

// WebSocket Link for subscriptions
const wsLink = new GraphQLWsLink(createClient({
  url: process.env.REACT_APP_WS_URL || 'ws://localhost:5001/graphql',
  connectionParams: {
    authToken: localStorage.getItem('token'),
  },
}));

// Auth Link
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Split Link (HTTP for queries/mutations, WebSocket for subscriptions)
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getProjects: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          getResearch: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          getExperience: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          getEducation: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          getAwards: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          getSpeaking: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          getSkills: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export { client };
