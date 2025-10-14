import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../auth/authProvider";

export default function ProjectPrivateRoute() {
  const { projectName } = useParams();
  const auth = useAuth();

  

  // If user not logged in at all
  if (!auth?.token) return <Navigate to="/login" />;

  const userData = auth.userData;

  // Optional safeguard if data hasn't loaded yet
  if (!userData) return null;

  // Admins can access everything
  const isAdmin = userData?.orgRole === "ADMIN";

  // Check if user is part of this project
  const isMember = userData?.projectRoles?.some(
    (pr) => pr.project === projectName
  );

  if (!isAdmin && !isMember) {
    console.log(isAdmin, isMember);
    // Not authorized to access this project
    return <Navigate to="/dashboard/projects" />;
  }

  return <Outlet />;
}
