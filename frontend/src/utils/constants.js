export const BASE_URL = "http://localhost:8080";
export const API_BASE_URL = `${BASE_URL}/api`;

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  EVENTS: "/events",
  SUBMIT_FEEDBACK: "/feedback/submit/:eventId",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ORGANIZER_DASHBOARD: "/organizer/dashboard",
  USER_DASHBOARD: "/user/dashboard",
  ANALYTICS: "/admin/analytics",
};

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  ORGANIZER: "ORGANIZER",
};
