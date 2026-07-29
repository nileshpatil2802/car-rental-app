import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiFacebook,
  FiTwitter,
  FiX,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

import {
  login as loginApi,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
  validateResetToken as validateResetTokenApi,
} from "../services/carService";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const resetToken =
    searchParams.get("token") || "";

  /*
   * LOGIN STATES
   */
  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [toast, setToast] =
    useState(null);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
      rememberMe: false,
    });

  const [errors, setErrors] =
    useState({});

  /*
   * FORGOT PASSWORD STATES
   */
  const [
    showForgotPassword,
    setShowForgotPassword,
  ] = useState(false);

  const [
    forgotLoading,
    setForgotLoading,
  ] = useState(false);

  const [
    forgotEmail,
    setForgotEmail,
  ] = useState("");

  const [
    forgotEmailError,
    setForgotEmailError,
  ] = useState("");

  /*
   * RESET PASSWORD STATES
   */
  const [
    showResetPassword,
    setShowResetPassword,
  ] = useState(false);

  const [
    resetLoading,
    setResetLoading,
  ] = useState(false);

  const [
    tokenChecking,
    setTokenChecking,
  ] = useState(false);

  const [
    tokenValid,
    setTokenValid,
  ] = useState(false);

  const [
    resetError,
    setResetError,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /*
   * When email reset link opens:
   *
   * http://localhost:5173/login?token=abc...
   *
   * Validate token and automatically open
   * the reset password modal.
   */
  useEffect(() => {
    const checkResetToken = async () => {
      if (!resetToken) {
        return;
      }

      try {
        setTokenChecking(true);
        setResetError("");

        const response =
          await validateResetTokenApi(
            resetToken
          );

        if (response?.valid) {
          setTokenValid(true);
          setShowResetPassword(true);
        } else {
          setTokenValid(false);
          setShowResetPassword(true);

          setResetError(
            "This password reset link is invalid, expired or already used."
          );
        }
      } catch (error) {
        console.error(
          "Token validation error:",
          error
        );

        setTokenValid(false);
        setShowResetPassword(true);

        setResetError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to validate password reset link."
        );
      } finally {
        setTokenChecking(false);
      }
    };

    checkResetToken();
  }, [resetToken]);

  /*
   * LOGIN INPUT CHANGE
   */
  const handleInputChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }
  };

  /*
   * LOGIN VALIDATION
   */
  const validateLoginForm = () => {
    const newErrors = {};

    const email =
      formData.email.trim();

    if (!email) {
      newErrors.email =
        "Email is required";
    } else if (
      !emailPattern.test(email)
    ) {
      newErrors.email =
        "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required";
    } else if (
      formData.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    return newErrors;
  };

  /*
   * LOGIN SUBMIT
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors =
      validateLoginForm();

    if (
      Object.keys(newErrors).length > 0
    ) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const userData =
        await loginApi(
          formData.email.trim(),
          formData.password
        );

      console.log(
        "Login API Response:",
        userData
      );

      login(userData);

      if (formData.rememberMe) {
        localStorage.setItem(
          "rememberedEmail",
          formData.email.trim()
        );
      } else {
        localStorage.removeItem(
          "rememberedEmail"
        );
      }

      setToast({
        message: "Login successful!",
        type: "success",
      });

      const role =
        userData?.user?.role ||
        userData?.role ||
        localStorage.getItem("role");

      if (
        role === "ADMIN" ||
        role === "ROLE_ADMIN"
      ) {
        navigate(
          "/administrator",
          {
            replace: true,
          }
        );
      } else {
        navigate("/", {
          replace: true,
        });
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setToast({
        message:
          error?.response?.data
            ?.message ||
          error?.message ||
          "Invalid email or password",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /*
   * OPEN FORGOT PASSWORD MODAL
   */
  const openForgotPasswordModal =
    () => {
      setForgotEmail(
        formData.email.trim()
      );

      setForgotEmailError("");
      setShowForgotPassword(true);
    };

  /*
   * CLOSE FORGOT PASSWORD MODAL
   */
  const closeForgotPasswordModal =
    () => {
      if (forgotLoading) {
        return;
      }

      setShowForgotPassword(false);
      setForgotEmailError("");
    };

  /*
   * SEND RESET EMAIL
   */
  const handleForgotPasswordSubmit =
    async (event) => {
      event.preventDefault();

      const email =
        forgotEmail.trim();

      if (!email) {
        setForgotEmailError(
          "Email address is required"
        );
        return;
      }

      if (
        !emailPattern.test(email)
      ) {
        setForgotEmailError(
          "Please enter a valid email address"
        );
        return;
      }

      try {
        setForgotLoading(true);
        setForgotEmailError("");

        const response =
          await forgotPasswordApi(
            email
          );

        setShowForgotPassword(false);
        setForgotEmail("");

        setToast({
          message:
            response?.message ||
            "If the account exists, reset instructions have been sent to the email.",
          type: "success",
        });
      } catch (error) {
        console.error(
          "Forgot password error:",
          error
        );

        const errorMessage =
          error?.response?.data
            ?.message ||
          error?.message ||
          "Unable to process forgot password request";

        setForgotEmailError(
          errorMessage
        );

        setToast({
          message: errorMessage,
          type: "error",
        });
      } finally {
        setForgotLoading(false);
      }
    };

  /*
   * RESET PASSWORD VALIDATION
   */
  const validateResetPassword =
    () => {
      if (!resetToken) {
        return "Password reset token is missing.";
      }

      if (!newPassword) {
        return "New password is required.";
      }

      if (
        newPassword.length < 8
      ) {
        return "Password must contain at least 8 characters.";
      }

      if (
        !/[A-Z]/.test(newPassword)
      ) {
        return "Password must contain at least one uppercase letter.";
      }

      if (
        !/[a-z]/.test(newPassword)
      ) {
        return "Password must contain at least one lowercase letter.";
      }

      if (
        !/[0-9]/.test(newPassword)
      ) {
        return "Password must contain at least one number.";
      }

      if (
        !/[^A-Za-z0-9]/.test(
          newPassword
        )
      ) {
        return "Password must contain at least one special character.";
      }

      if (!confirmPassword) {
        return "Confirm password is required.";
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        return "New password and confirm password do not match.";
      }

      return "";
    };

  /*
   * RESET PASSWORD SUBMIT
   */
  const handleResetPasswordSubmit =
    async (event) => {
      event.preventDefault();

      setResetError("");

      const validationError =
        validateResetPassword();

      if (validationError) {
        setResetError(
          validationError
        );
        return;
      }

      try {
        setResetLoading(true);

        const response =
          await resetPasswordApi({
            token: resetToken,
            newPassword,
            confirmPassword,
          });

        setToast({
          message:
            response?.message ||
            "Password changed successfully. Please login using your new password.",
          type: "success",
        });

        setShowResetPassword(false);

        setNewPassword("");
        setConfirmPassword("");
        setResetError("");
        setTokenValid(false);

        /*
         * Remove token from browser URL.
         */
        setSearchParams({});

        navigate("/login", {
          replace: true,
        });
      } catch (error) {
        console.error(
          "Reset password error:",
          error
        );

        const errorMessage =
          error?.response?.data
            ?.message ||
          error?.message ||
          "Unable to reset password";

        setResetError(errorMessage);

        setToast({
          message: errorMessage,
          type: "error",
        });
      } finally {
        setResetLoading(false);
      }
    };

  /*
   * CLOSE RESET PASSWORD MODAL
   */
  const closeResetPasswordModal =
    () => {
      if (
        resetLoading ||
        tokenChecking
      ) {
        return;
      }

      setShowResetPassword(false);
      setNewPassword("");
      setConfirmPassword("");
      setResetError("");
      setTokenValid(false);

      setSearchParams({});

      navigate("/login", {
        replace: true,
      });
    };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center py-8 px-4">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 text-center">
              <h1 className="text-3xl font-bold mb-2">
                Welcome Back
              </h1>

              <p className="text-gray-200">
                Sign in to your SelfDrive
                Junction account
              </p>
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className="p-8"
              noValidate
            >
              {/* Email */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2 text-primary"
                >
                  Email Address
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-secondary
                      transition-all ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                  />
                </div>

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold mb-2 text-primary"
                >
                  Password
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-secondary
                      transition-all ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previousValue) =>
                          !previousValue
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember and Forgot */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={
                      formData.rememberMe
                    }
                    onChange={
                      handleInputChange
                    }
                    className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                  />

                  <span className="text-sm text-gray-600">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={
                    openForgotPasswordModal
                  }
                  className="text-sm text-secondary hover:text-red-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="px-8 py-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-300" />

                <span className="text-gray-500 text-sm">
                  Or continue with
                </span>

                <div className="flex-1 h-px bg-gray-300" />
              </div>
            </div>

            {/* Social Login */}
            <div className="px-8 pb-8 flex gap-4">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiFacebook className="text-blue-600" />

                <span className="text-sm font-semibold">
                  Facebook
                </span>
              </button>

              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiTwitter className="text-blue-400" />

                <span className="text-sm font-semibold">
                  Twitter
                </span>
              </button>
            </div>

            {/* Register Link */}
            <div className="bg-light px-8 py-6 text-center border-t border-gray-200">
              <p className="text-gray-600">
                Don&apos;t have an
                account?{" "}
                <Link
                  to="/register"
                  className="text-secondary font-semibold hover:text-red-700 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-white text-sm mt-6">
            By signing in, you agree
            to our{" "}
            <Link
              to="#"
              className="underline hover:text-gray-200"
            >
              Terms of Service
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={
              closeForgotPasswordModal
            }
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              transition={{
                duration: 0.2,
              }}
              onMouseDown={(event) =>
                event.stopPropagation()
              }
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="relative bg-gradient-to-r from-primary to-secondary px-7 py-6 text-white">
                <button
                  type="button"
                  onClick={
                    closeForgotPasswordModal
                  }
                  disabled={
                    forgotLoading
                  }
                  className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/20 disabled:cursor-not-allowed"
                  aria-label="Close forgot password"
                >
                  <FiX size={21} />
                </button>

                <h2 className="text-2xl font-bold">
                  Forgot Password?
                </h2>

                <p className="mt-2 pr-7 text-sm text-gray-200">
                  Enter your registered
                  email address. We will
                  send a secure password
                  reset link.
                </p>
              </div>

              <form
                onSubmit={
                  handleForgotPasswordSubmit
                }
                className="p-7"
              >
                <div className="mb-6">
                  <label
                    htmlFor="forgotEmail"
                    className="mb-2 block text-sm font-semibold text-primary"
                  >
                    Registered Email
                    Address
                  </label>

                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      id="forgotEmail"
                      type="email"
                      value={
                        forgotEmail
                      }
                      onChange={(
                        event
                      ) => {
                        setForgotEmail(
                          event.target
                            .value
                        );

                        if (
                          forgotEmailError
                        ) {
                          setForgotEmailError(
                            ""
                          );
                        }
                      }}
                      placeholder="Enter your registered email"
                      autoComplete="email"
                      autoFocus
                      className={`w-full rounded-lg border py-3 pl-10 pr-4
                        transition-all focus:outline-none focus:ring-2
                        focus:ring-secondary ${
                          forgotEmailError
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                    />
                  </div>

                  {forgotEmailError && (
                    <p className="mt-2 text-sm text-red-500">
                      {
                        forgotEmailError
                      }
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    forgotLoading
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiSend />

                  {forgotLoading
                    ? "Sending reset link..."
                    : "Send Reset Link"}
                </button>

                <button
                  type="button"
                  disabled={
                    forgotLoading
                  }
                  onClick={
                    closeForgotPasswordModal
                  }
                  className="mt-3 w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Back to Login
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {showResetPassword && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={
              closeResetPasswordModal
            }
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              transition={{
                duration: 0.2,
              }}
              onMouseDown={(event) =>
                event.stopPropagation()
              }
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="relative bg-gradient-to-r from-primary to-secondary px-7 py-6 text-white">
                <button
                  type="button"
                  onClick={
                    closeResetPasswordModal
                  }
                  disabled={
                    resetLoading ||
                    tokenChecking
                  }
                  className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/20 disabled:cursor-not-allowed"
                  aria-label="Close reset password"
                >
                  <FiX size={21} />
                </button>

                <h2 className="text-2xl font-bold">
                  Create New Password
                </h2>

                <p className="mt-2 pr-7 text-sm text-gray-200">
                  Enter and confirm your
                  new account password.
                </p>
              </div>

              {tokenChecking ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">
                    Validating reset
                    link...
                  </p>
                </div>
              ) : !tokenValid ? (
                <div className="p-8 text-center">
                  <FiAlertCircle
                    size={50}
                    className="mx-auto mb-4 text-red-500"
                  />

                  <h3 className="mb-2 text-xl font-bold">
                    Invalid Reset Link
                  </h3>

                  <p className="mb-6 text-gray-600">
                    {resetError}
                  </p>

                  <button
                    type="button"
                    onClick={
                      closeResetPasswordModal
                    }
                    className="w-full rounded-lg bg-secondary py-3 font-semibold text-white"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={
                    handleResetPasswordSubmit
                  }
                  className="p-7"
                >
                  {resetError && (
                    <div className="mb-5 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <FiAlertCircle className="mt-0.5 shrink-0" />
                      <span>
                        {resetError}
                      </span>
                    </div>
                  )}

                  {/* New Password */}
                  <div className="mb-5">
                    <label
                      htmlFor="newPassword"
                      className="mb-2 block text-sm font-semibold text-primary"
                    >
                      New Password
                    </label>

                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                      <input
                        id="newPassword"
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          newPassword
                        }
                        onChange={(
                          event
                        ) => {
                          setNewPassword(
                            event.target
                              .value
                          );

                          if (
                            resetError
                          ) {
                            setResetError(
                              ""
                            );
                          }
                        }}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        autoFocus
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-secondary"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            (
                              previous
                            ) =>
                              !previous
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        aria-label={
                          showNewPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                      >
                        {showNewPassword ? (
                          <FiEyeOff />
                        ) : (
                          <FiEye />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-5">
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-semibold text-primary"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          confirmPassword
                        }
                        onChange={(
                          event
                        ) => {
                          setConfirmPassword(
                            event.target
                              .value
                          );

                          if (
                            resetError
                          ) {
                            setResetError(
                              ""
                            );
                          }
                        }}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-secondary"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (
                              previous
                            ) =>
                              !previous
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff />
                        ) : (
                          <FiEye />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb-6 rounded-lg bg-gray-100 p-4 text-sm text-gray-600">
                    Password must contain
                    at least 8 characters,
                    one uppercase letter,
                    one lowercase letter,
                    one number and one
                    special character.
                  </div>

                  <button
                    type="submit"
                    disabled={
                      resetLoading
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiCheckCircle />

                    {resetLoading
                      ? "Changing password..."
                      : "Change Password"}
                  </button>

                  <button
                    type="button"
                    disabled={
                      resetLoading
                    }
                    onClick={
                      closeResetPasswordModal
                    }
                    className="mt-3 w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[150]">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToast(null)
            }
          />
        </div>
      )}
    </>
  );
};

export default Login;