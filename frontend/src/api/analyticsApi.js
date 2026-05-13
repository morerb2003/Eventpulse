import api from "./api";

export const getEventAnalytics = async (eventId) => {
  const response = await api.get(`/analytics/event/${eventId}`);
  return response.data;
};

export const getGlobalStats = async () => {
  const response = await api.get("/analytics/global");
  return response.data;
};
