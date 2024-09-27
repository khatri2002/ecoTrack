import { useAuth } from "../context/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const { loading, loggedIn } = useAuth();
  if (loading) return <h1>loading......</h1>;
  if (!loggedIn) return <Navigate to="/sign-in" replace={true} />;

  return <Outlet />;
};

export default ProtectedLayout;
