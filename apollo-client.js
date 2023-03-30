import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://api.tally.xyz/query',
});

// return the headers to the context so httpLink can read them
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'api-key':
      'be9b3d4874a9cb185eaeabe49a89406a073849423090015e01ae30afc16bed36',
  },
}));

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
