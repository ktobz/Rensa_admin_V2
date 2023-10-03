import * as React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

const NotFound = React.lazy(() => import("components/other/404"));
import AppContentLayout from "@/layouts/InAppLayout";

export default function AuthenticatedAppRoutes() {
  return (
    <div style={{ backgroundColor: "#fff" }}>
      <Routes>
        <Route path={`/app/*`} element={<AppContentLayout />} />

        <Route path={`/`} element={<Navigate to="/app" />} />
        <Route path={`/login`} element={<Navigate to="/app/dashboard" />} />

        <Route
          path="/*"
          element={
            <React.Suspense fallback={<>...</>}>
              <NotFound />
            </React.Suspense>
          }
        />
      </Routes>
    </div>
  );
}
