import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminServices } from "../../../services/admin-services";
import { toast } from "react-toastify";

const TwoFAVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get email and (optionally) password from location state
  const { email, password } = location.state || {};
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const requestedRef = useRef(false);

  useEffect(() => {
    // Auto-request 2FA code on mount (only once)
    if (email && !requestedRef.current) {
      requestedRef.current = true;
      setLoading(true);
      adminServices
        .request2FA({ email })
        .then(() => {
          toast.success("Verification code sent to your email.");
          setCodeRequested(true);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.error || err.message || "Failed to send code"
          );
        })
        .finally(() => setLoading(false));
    }
  }, [email]);

  if (!email) {
    // If no email, redirect to login
    navigate("/admin/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Verifying 2FA code:", code);
      const verifyResult = await adminServices.verify2FA({ email, code });
      console.log("2FA verify result:", verifyResult);
      if (verifyResult.data && verifyResult.data.auth) {
        localStorage.setItem("authToken", verifyResult.data.auth);
        // Optionally, store user data: verifyResult.data.data
        window.location.href = "/Technical-Admin"; // Redirect to correct admin dashboard
      } else {
        toast.error(verifyResult.data?.error || "Verification failed");
      }
    } catch (err) {
      console.error("2FA verification error:", err);
      toast.error(
        err.response?.data?.error || err.message || "Invalid or expired code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await adminServices.request2FA({ email });
      toast.success("Verification code resent to your email.");
      setCodeRequested(true);
    } catch (err) {
      toast.error(
        err.response?.data?.error || err.message || "Failed to resend code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-4">
          Two-Factor Authentication
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit code sent to <b>{email}</b>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            pattern="[0-9]{6}"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-xl tracking-widest"
            placeholder="Enter 6-digit code"
            required
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-indigo-900 text-white py-2 rounded-lg hover:bg-indigo-800"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Sign In"}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={handleResend}
            className="text-blue-500 hover:underline"
            disabled={loading}
          >
            Resend code
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFAVerify;
