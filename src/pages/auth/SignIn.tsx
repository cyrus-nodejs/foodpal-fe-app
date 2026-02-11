import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import { useAppDispatch, useAppSelector } from "../../redux/app/hook";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Login } from "../../redux/features/auth/authSlice";

interface SignInFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const SignInSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const { user, error } = useAppSelector((state) => state.auth);

  const redirectMessage = location.state?.message;
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  /* -------------------------------------------------------------------------- */
  /*                        AUTO-REDIRECT IF ALREADY LOGGED IN                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  /* -------------------------------------------------------------------------- */
  /*                                 FORMIK SETUP                               */
  /* -------------------------------------------------------------------------- */
  const formik = useFormik<SignInFormValues>({
    initialValues: { email: "", password: "", remember: false },
    validationSchema: SignInSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const resultAction = await dispatch(Login(values));
        if (Login.fulfilled.match(resultAction)) {
          showToast(resultAction.payload.message || "Welcome back!", "success");
          navigate(from, { replace: true });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                 JSX FORM                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-primary">JollofAI</h1>
        </Link>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>

        {redirectMessage && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 text-center">
              {redirectMessage}
            </p>
          </div>
        )}

        {/* Server-side Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/signup"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...formik.getFieldProps("email")}
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
                placeholder="Enter your password"
                {...formik.getFieldProps("password")}
                className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-primary"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...formik.getFieldProps("remember")}
                  className="h-4 w-4 text-primary border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="/password-reset" className="font-medium text-primary hover:text-primary/80 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full"
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting}
            >
              Sign in
            </Button>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`)
              }
              className="w-full mt-3 px-4 py-2 border rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
