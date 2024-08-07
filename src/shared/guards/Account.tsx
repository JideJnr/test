import useAuthStore from "@/store/states/auth";
import { useLocation, Navigate } from "react-router-dom";

const AccountGuard: React.FC<{
  children: JSX.Element;
}> = ({ children }) => {
  let { isAuthenticated } = useAuthStore();
  let location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default AccountGuard;
