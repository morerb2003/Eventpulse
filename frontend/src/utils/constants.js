export const API_BASE_URL = "http://localhost:8080/api";

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  EVENTS: "/events",
  SUBMIT_FEEDBACK: "/feedback/submit/:eventId",
  ADMIN_DASHBOARD: "/admin/dashboard",
  USER_DASHBOARD: "/user/dashboard",
  ANALYTICS: "/admin/analytics",
};

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  ORGANIZER: "ORGANIZER",
};
