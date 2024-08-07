import React from "react";
import { useRoutes } from "react-router-dom";
import PublicRoutes from "@/routes/publicRoutes";
import ProtectedRoutes from "@/routes/protectedRoutes";
import Error from "@/components/Error/Error";

const Routes: React.FC = () => {
  let element = useRoutes([
    {
      path: "/",
      children: PublicRoutes,
    },
    {
      path: "/account",
      children: ProtectedRoutes,
    },
    { path: "*", element: <Error /> },
  ]);

  return element;
};

export default Routes;
