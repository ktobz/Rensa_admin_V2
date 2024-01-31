import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AuthLoader from "components/loader/AuthLoader";
import Login from "@/modules/login";

const ForgotPassword = React.lazy(() => import("@/modules/forgot-password"));
const NewPassword = React.lazy(() => import("@/modules/new-password"));

export default function UnAuthenticatedAppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          // <React.Suspense fallback={<AuthLoader />}>
          <Login />
          // </React.Suspense>
        }
      />
      <Route path="/login" element={<Login />} />

      <Route
        path="/forgot-password"
        element={
          <React.Suspense fallback={<AuthLoader />}>
            <ForgotPassword />
          </React.Suspense>
        }
      />
      <Route
        path="/new-password"
        element={
          <React.Suspense fallback={<AuthLoader />}>
            <NewPassword />
          </React.Suspense>
        }
      />

      <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
