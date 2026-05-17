import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Events from "../pages/public/Events";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import EventDetails from "../pages/public/EventDetails";
import SubmitFeedback from "../pages/feedback/SubmitFeedback";
import CheckIn from "../pages/public/CheckIn";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import OrganizerDashboard from "../pages/dashboard/OrganizerDashboard";
import UserDashboard from "../pages/dashboard/UserDashboard";
import ManageUsers from "../pages/dashboard/ManageUsers";
import Analytics from "../pages/dashboard/Analytics";
import CreateEvent from "../pages/dashboard/CreateEvent";
import { ROLES } from "../utils/constants";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback/submit/:eventId" element={<SubmitFeedback />} />
        <Route path="/checkin/:token" element={<CheckIn />} />
        
        {/* User Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.USER, ROLES.ADMIN, ROLES.ORGANIZER]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>

        {/* Organizer Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ORGANIZER, ROLES.ADMIN]} />}>
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer/events/new" element={<CreateEvent />} />
        </Route>

        {/* Shared Analytics Route */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ORGANIZER]} />}>
          <Route path="/admin/analytics/:eventId" element={<Analytics />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
