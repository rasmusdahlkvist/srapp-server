module.exports = {
  Query: {
    channels: (_, __, { dataSources }) => dataSources.srAPI.getSr(),
    channel: (_, { id }, { dataSources }) =>
      dataSources.srAPI.getChannelById(id),
    schedule: (_, { channelId }, { dataSources }) =>
      dataSources.srAPI.getSchedule(channelId)
  }
};
