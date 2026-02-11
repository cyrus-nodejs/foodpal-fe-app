import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../../components/Button";
import { useToast } from "../../components/Toast";

import { useAppDispatch, useAppSelector } from "../../redux/app/hook";
import { ForgotPassword } from "../../redux/features/auth/authSlice";

import { useFormik } from "formik";
import * as Yup from "yup";

export default function Forgotpassword() {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const { status, error, message } = useAppSelector((state) => state.auth);

  const [isEmailSent, setIsEmailSent] = useState(false);

  // -----------------------------
  // Formik + Yup Validation
  // -----------------------------
  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),

    onSubmit: async (values) => {
      dispatch(ForgotPassword({ email: values.email }));
    },
  });

  const isLoading = status === "pending";

  // -----------------------------
  // Listen for Redux Status
  // -----------------------------
  useEffect(() => {
    if (status === "succeeded" && message) {
      showToast(message, "success");
      setIsEmailSent(true);
    }

    if (status === "failed" && error) {
      showToast(error, "error");
    }
  }, [status, message, error]);

  // -----------------------------
  // SUCCESS VIEW
  // -----------------------------
  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📧</div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h1>

            <p className="text-gray-600 mb-6">
              We've sent a password reset link to{" "}
              <strong>{formik.values.email}</strong>.  
              Please check your inbox.
            </p>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsEmailSent(false);
                  formik.resetForm();
                }}
              >
                Send Another Email
              </Button>

              <Link to="/signin">
                <Button className="w-full bg-primary text-white hover:bg-primary/90">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // MAIN FORM VIEW
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Enter your email and we'll send you a password reset link.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* EMAIL FIELD */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              disabled={isLoading}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 
                ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-primary"
                }
              `}
            />

            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            loading={formik.isSubmitting}
            disabled={formik.isSubmitting }
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            Send Reset Email
          </Button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/signin" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
