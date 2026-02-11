import React from "react";

export default function TestApp() {
  console.log("TestApp is rendering!");

  return (
    <div style={{ padding: "20px", fontSize: "18px", color: "red" }}>
      <h1>🚀 Test App is Working!</h1>
      <p>If you can see this, React is working fine.</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
