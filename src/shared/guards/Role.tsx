import useStore from "@/store";
import { useLocation, Navigate } from "react-router-dom";
import { roleChecker } from "../utils/role";

const RoleGuard: React.FC<{
  children: JSX.Element;
  requiredRole: string[];
}> = ({ children, requiredRole }) => {
  const {
    authStore: {
      user: { role },
      impersonated_user,
    },
  } = useStore();
  const location = useLocation();

  if (
    requiredRole.length > 0 &&
    !roleChecker(requiredRole, impersonated_user?.role || role)
  ) {
    return (
      <Navigate
        to={location?.state?.pathname || "/account/customer"}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default RoleGuard;
