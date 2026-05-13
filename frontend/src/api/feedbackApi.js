import api from "./api";

export const submitFeedback = async (feedbackData) => {
  const response = await api.post("/feedback", feedbackData);
  return response.data;
};

export const getFeedbackByEvent = async (eventId) => {
  const response = await api.get(`/feedback/event/${eventId}`);
  return response.data;
};

export const getUserFeedback = async (userId) => {
  const response = await api.get(`/feedback/user/${userId}`);
  return response.data;
};
