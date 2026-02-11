import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../redux/app/hook";
import { Register } from "../../redux/features/auth/authSlice";

export default function SignUp() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const { isLoading, error, message } = useAppSelector((state) => state.auth);

  // ──────────────────────────────────────────────
  // Yup Validation Schema
  // ──────────────────────────────────────────────
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Full name must be at least 2 characters")
      .required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
    terms: Yup.boolean()
      .oneOf([true], "You must accept the terms")
      .required(),
  });

  // ──────────────────────────────────────────────
  // Formik Setup
  // ──────────────────────────────────────────────
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const resultAction = await dispatch(
          Register({
            name: values.name,
            email: values.email,
            password: values.password,
          })
        );

        if (Register.fulfilled.match(resultAction)) {
          showToast(resultAction.payload.message || "Account created successfully!", "success");
          navigate("/dashboard", { replace: true });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ──────────────────────────────────────────────
  // JSX
  // ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-primary">JollofAI</h1>
        </Link>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/signin"
            className="font-medium text-primary hover:text-primary/80"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Server-side Error */}
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...formik.getFieldProps("name")}
                className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-primary"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                placeholder="Enter your email"
                className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-primary"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                {...formik.getFieldProps("password")}
                placeholder="Enter your password"
                className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-primary"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <input
                type="password"
                {...formik.getFieldProps("confirmPassword")}
                placeholder="Confirm your password"
                className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-primary"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input
                type="checkbox"
                {...formik.getFieldProps("terms")}
                checked={formik.values.terms}
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-900">
                I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>
            {formik.touched.terms && formik.errors.terms && (
              <p className="text-red-500 text-xs">{formik.errors.terms}</p>
            )}

            <Button type="submit" className="w-full" loading={formik.isSubmitting}>
              Create account
            </Button>
          </form>

          {/* Why join section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Why join JollofAI?
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="text-primary mr-2">✓</span>
                Save your favorite recipes
              </div>
              <div className="flex items-center">
                <span className="text-primary mr-2">✓</span>
                Get personalized recommendations
              </div>
              <div className="flex items-center">
                <span className="text-primary mr-2">✓</span>
                Track your cooking history
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
