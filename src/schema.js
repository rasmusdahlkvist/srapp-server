const { gql } = require("apollo-server");

const typeDefs = gql`
  type LiveAudio {
    id: String
    url: String
  }

  type Channel {
    channeltype: String
    name: String
    id: ID!
    color: String
    schedule: String
    trackUrl: LiveAudio
  }
  type Schedule {
    episodeid: Int
    title: String
    description: String
    image: String
    status: String
    channel: String
  }
  type Query {
    channels: [Channel]!
    channel(id: ID!): Channel
    schedule(channelId: [String]): [Schedule]
  }
`;

module.exports = typeDefs;
