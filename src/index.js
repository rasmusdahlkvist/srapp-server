const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const SrAPI = require("./datasources/sr");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    srAPI: new SrAPI()
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
