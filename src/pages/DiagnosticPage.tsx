import React from "react";
import { useToast } from "../components/Toast";

export default function DiagnosticPage() {
  const { showToast } = useToast();

  const testToast = () => {
    showToast("Test toast message", "info");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Diagnostic Page</h1>
      <button
        onClick={testToast}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Toast
      </button>
    </div>
  );
}
