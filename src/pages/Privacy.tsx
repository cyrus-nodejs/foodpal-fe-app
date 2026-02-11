import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-4 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-700 text-center mb-8">
          Your privacy is important to us. This policy explains how{" "}
          <span className="font-semibold">JollofAI</span> collects, uses, and
          protects your information.
        </p>

        {/* Section 1 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Information We Collect
          </h2>
          <p className="text-gray-600">
            We may collect your name, email address, and usage data to improve
            our services, provide recommendations, and personalize your
            experience.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            How We Use Your Data
          </h2>
          <p className="text-gray-600">
            We use your data to enhance app performance, send updates, and
            ensure your experience is smooth and secure. Your information is
            never sold to third parties.
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Data Protection
          </h2>
          <p className="text-gray-600">
            We use encryption, secure servers, and access controls to keep your
            data safe. Only authorized personnel can access your information.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Your Rights
          </h2>
          <p className="text-gray-600">
            You can request to view, correct, or delete your personal data at
            any time. Contact our support team for assistance.
          </p>
        </div>

        <p className="mt-8 text-gray-600">
          By using <span className="font-semibold">JollofAI</span>, you agree to
          this Privacy Policy. We may update it periodically to reflect changes
          in our practices or for legal reasons.
        </p>

        <div className="mt-10 text-center text-sm text-gray-500">
          Last updated: October 2025
        </div>
      </div>
    </div>
  );
}
