import type { RouteObject } from "react-router-dom";

import PublicGuard from "@/shared/guards/Public";
import AuthLayout from "@/components/layouts/public/AuthLayout";

import Login from "@/pages/public/Login/Login";
import ResetPassword from "@/pages/public/ResetPassword/ResetPassword";
import ForgetPassword from "@/pages/public/ForgetPassword/ForgetPassword";

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <PublicGuard>
        <AuthLayout />
      </PublicGuard>
    ),
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
    ],
  },
];

export default routes;
