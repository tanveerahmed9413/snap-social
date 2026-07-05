import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Navigate
      to={user ? "/app/home" : "/signin"}
      replace
    />
  );
};

export default RootRedirect;