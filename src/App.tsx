import React from "react";
import { getRuntimeConfig } from "./runtimeConfig";

export default function App() {
  const { orgName, apiBaseUrl } = getRuntimeConfig();
  return (
    <div style={{ padding: 16 }}>
      <h1>{orgName} Console</h1>
      <small>API: {apiBaseUrl}</small>
    </div>
  );
}
