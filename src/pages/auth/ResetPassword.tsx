import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Button from "../../components/Button";
import { useToast } from "../../components/Toast";
import { useAppDispatch, useAppSelector } from "../../redux/app/hook";
import { ResetPassword } from "../../redux/features/auth/authSlice";

import { useFormik } from "formik";
import * as Yup from "yup";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const { status, error, message } = useAppSelector((state) => state.auth);

  const [isTokenValid, setIsTokenValid] = useState(true);

  // Token validation
  useEffect(() => {
    if (!token) setIsTokenValid(false);
  }, [token]);

  // -------------------------------
  // Formik + Yup Validation Schema
  // -------------------------------
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),

    onSubmit: async (values) => {
      if (!token) {
        showToast("Invalid or expired reset link", "error");
        return;
      }

      dispatch(
        ResetPassword({
          token,
          password: values.password,
       
        })
      );
    },
  });

  const isLoading = status === "pending";

  // -------------------------------
  // Handle effects from Redux
  // -------------------------------
  useEffect(() => {
    if (status === "succeeded" && message) {
      showToast(message, "success");

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }

    if (status === "failed" && error) {
      if (error.toLowerCase().includes("token")) {
        setIsTokenValid(false);
      }
      showToast(error, "error");
    }
  }, [status, error, message]);

  // -------------------------------
  // Invalid Token View
  // -------------------------------
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Reset Link
            </h1>

            <p className="text-gray-600 mb-6">
              This reset link is invalid or expired. Please request a new one.
            </p>

            <div className="space-y-3">
              <Link to="/password-reset">
                <Button className="w-full bg-primary text-white hover:bg-primary/90">
                  Request New Reset
                </Button>
              </Link>

              <Link to="/signin">
                <Button variant="outline" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------
  // Main Reset Form
  // -------------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Set New Password
          </h1>
          <p className="text-gray-600">
            Enter and confirm your new password.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              disabled={isLoading}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter new password"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 
                ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />

            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              disabled={isLoading}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Confirm password"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 
                ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />

            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading || !formik.isValid || !formik.dirty}
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            Reset Password
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/signin"
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
