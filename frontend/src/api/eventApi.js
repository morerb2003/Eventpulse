import api from "./api";

export const getAllEvents = async (pageNo = 0, pageSize = 10, sortBy = "id", sortDir = "asc") => {
  const response = await api.get(`/events?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const getEventQr = async (id) => {
  const response = await api.get(`/events/${id}/qr`);
  return response.data;
};

export const createEvent = async (eventData, posterFile = null) => {
  const formData = new FormData();
  formData.append("event", new Blob([JSON.stringify(eventData)], { type: "application/json" }));
  if (posterFile) {
    formData.append("poster", posterFile);
  }
  const response = await api.post("/events", formData);
  return response.data;
};

export const updateEvent = async (id, eventData, posterFile = null) => {
  const formData = new FormData();
  formData.append("event", new Blob([JSON.stringify(eventData)], { type: "application/json" }));
  if (posterFile) {
    formData.append("poster", posterFile);
  }
  const response = await api.put(`/events/${id}`, formData);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};
