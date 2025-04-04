import axios from "axios";
const CALENDLY_TOKEN = process.env.CALENDLY_ACCESS_TOKEN;

const calendlyApi = axios.create({
  baseURL: "https://api.calendly.com",
  headers: {
    Authorization: `Bearer ${CALENDLY_TOKEN}`,
    "content-Type": "application/json",
  },
});

export const getCalendlyUserUri = async () => {
  const response = await calendlyApi.get("/user/me");
  return response.data.resource.uri;
};
export const getScheduledEvents = async (
  userUri: string,
  startTime: string,
  endTime: string
) => {
  const response = await calendlyApi.get(`/scheduled_events`, {
    params: {
      user: userUri,
      min_start_time: startTime,
      max_start_time: endTime,
    },
  });
  // Return just the array of events
  return response.data.collection;
};

export const createCalendlyEvent = async (
  eventTypeUri: string,
  inviteEmail: string,
  startTime: string
) => {
  const response = await calendlyApi.post(`/scheduledEvents`, {
    evenType: eventTypeUri,//kind of meeting
    start_time: startTime,
    invitees: [{ email: inviteEmail }],//the clients
  });
  //return promise with created eveny data
  return response.data;
};
