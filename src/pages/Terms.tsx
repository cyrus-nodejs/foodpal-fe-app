import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-4 text-center">
          Terms & Conditions
        </h1>
        <p className="text-gray-700 text-center mb-8">
          Welcome to <span className="font-semibold">JollofAI</span>. These
          Terms & Conditions govern your use of our website and services. By
          accessing or using JollofAI, you agree to comply with these terms.
        </p>

        {/* Section 1 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            1. Use of Our Services
          </h2>
          <p className="text-gray-600">
            You agree to use JollofAI responsibly and only for lawful purposes.
            You must not use our platform to distribute harmful, abusive, or
            misleading content, or to attempt to disrupt our systems.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            2. Account Responsibilities
          </h2>
          <p className="text-gray-600">
            When you create an account, you are responsible for maintaining the
            confidentiality of your login information and for all activities
            that occur under your account.
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            3. Intellectual Property
          </h2>
          <p className="text-gray-600">
            All content, trademarks, and designs on JollofAI are the property of
            JollofAI and its partners. You may not copy, modify, or distribute
            our materials without prior written permission.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            4. Limitation of Liability
          </h2>
          <p className="text-gray-600">
            JollofAI is provided “as is.” We do not guarantee uninterrupted
            access or error-free operation. We are not liable for any losses
            arising from your use of our services.
          </p>
        </div>

        {/* Section 5 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            5. Changes to These Terms
          </h2>
          <p className="text-gray-600">
            We may update these Terms & Conditions from time to time. The
            updated version will be posted on this page with a new “Last
            updated” date. Continued use of JollofAI means you accept the
            revised terms.
          </p>
        </div>

        {/* Section 6 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            6. Contact Us
          </h2>
          <p className="text-gray-600">
            If you have any questions about these Terms, please contact us at{" "}
            <a
              href="mailto:support@jollofai.com"
              className="text-orange-600 hover:underline font-medium"
            >
              support@jollofai.com
            </a>{" "}
            or call{" "}
            <a
              href="tel:08033719143"
              className="text-orange-600 hover:underline font-medium"
            >
              0803&nbsp;371&nbsp;9143
            </a>
            .
          </p>
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          Last updated: October 2025
        </div>
      </div>
    </div>
  );
}
