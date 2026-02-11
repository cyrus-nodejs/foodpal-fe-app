// src/pages/HelpCenter.tsx
import React from "react";

export default function HelpCenter() {
  return (
    <div className="p-8 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-primary">Help Center</h1>
      <p className="mb-6">
        Welcome to the JollofAI Help Center! We’re here to assist you with any
        questions, feedback, or technical issues.
      </p>

      <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Contact Support</h2>
        <p>
          📞 Phone:{" "}
          <a
            href="tel:08033719143"
            className="text-blue-600 font-medium hover:underline"
          >
            0803&nbsp;371&nbsp;9143
          </a>
        </p>
        <p>
          📧 Email:{" "}
          <a
            href="mailto:support@jollofai.com"
            className="text-blue-600 hover:underline"
          >
            support@jollofai.com
          </a>
        </p>
      </div>

      <p className="mt-6 text-sm text-gray-600">
        Our support team is available Monday–Friday, 9 AM–6 PM (WAT).
      </p>
    </div>
  );
}
