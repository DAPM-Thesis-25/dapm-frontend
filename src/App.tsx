import React from "react";
import AuthProvider from "./auth/authProvider";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "./router/route";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import UserProvider from "./context/usersProvides";
import OrgProvider from "./context/orgsProvider";
import PeProvider from "./context/processingElementsProvider";
import AccessRequestProvider from "./context/accessRequestsProvider";
// import { getRuntimeConfig } from "./runtimeConfig";

export default function App() {
  // const { orgName, apiBaseUrl } = getRuntimeConfig();
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <OrgProvider>
            <PeProvider>
              <AccessRequestProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                {/* <Route exact path="/signup" element={<SignUp />} /> */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard/*" element={<Dashboard />} />
                </Route>
              </Routes>
              </AccessRequestProvider>
            </PeProvider>
          </OrgProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}
