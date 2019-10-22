const { RESTDataSource } = require("apollo-datasource-rest");
const { isFuture, isPast } = require("date-fns");

class SrAPI extends RESTDataSource {
  constructor() {
    super();
  }
  async getSr() {
    const res = await this.get(
      "https://api.sr.se/api/v2/channels/?format=json&size=4"
    );
    return Array.isArray(res.channels)
      ? res.channels.map(sr => this.srReducer(sr))
      : [];
  }

  async getChannelById(id) {
    const channel = await this.get(
      `https://api.sr.se/api/v2/channels/${id}/?format=json`
    );
    return this.srReducer(channel.channel);
  }
  async getSchedule(id) {
    const res = await Promise.all([
      ...id.map(channel =>
        this.get(
          `http://api.sr.se/api/v2/scheduledepisodes/rightnow?format=json&channelid=${channel}`
        )
      )
    ])
      .then(res => {
        return res.map(schedule => this.scheduleReducer(schedule));
      })
      .catch(e => {
        console.log(e);
        return [];
      });
    return res;
  }
  scheduleReducer(schedule) {
    return {
      episodeid: schedule.channel.currentscheduledepisode.episodeid,
      title: schedule.channel.currentscheduledepisode.title,
      description: schedule.channel.currentscheduledepisode.description,
      image: schedule.channel.currentscheduledepisode.socialimage,
      status: this.getProgramStatus(
        this.getSrDate(schedule.channel.currentscheduledepisode.starttimeutc),
        this.getSrDate(schedule.channel.currentscheduledepisode.endtimeutc)
      ),
      channel: schedule.channel.id
    };
  }
  srReducer(sr) {
    return {
      channeltype: sr.channeltype,
      color: sr.color,
      name: sr.name,
      id: sr.id,
      schedule: sr.scheduleurl,
      trackUrl: {
        id: sr.liveaudio.id,
        url: sr.liveaudio.url
      }
    };
  }
  getSrDate(date) {
    return parseInt(date.replace(/([/Date()])/g, ""), 10);
  }
  getProgramStatus(startDate, endDate) {
    if (isPast(new Date(startDate))) return "coming";

    if (isFuture(new Date(endDate))) return "ongoing";

    if (isPast(new Date(endDate))) return "ended";
  }
}

module.exports = SrAPI;
