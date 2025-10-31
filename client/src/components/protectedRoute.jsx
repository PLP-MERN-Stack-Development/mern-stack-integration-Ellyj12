import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // redirect to login if user is not logged in
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
