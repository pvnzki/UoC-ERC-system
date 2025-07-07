import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminServices } from "../../../services/admin-services";
import { toast } from "react-toastify";
import { ShieldCheck } from "lucide-react";
import { useTheme } from "../../context/theme/ThemeContext";

const TwoFAVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  // Get email and (optionally) password from location state
  const { email, password } = location.state || {};
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const requestedRef = useRef(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Auto-request 2FA code on mount (only once)
    if (email && !requestedRef.current) {
      requestedRef.current = true;
      setSending(true);
      setErrorMsg("");
      adminServices
        .request2FA({ email })
        .then(() => {
          toast.success("Verification code sent to your email.");
          setCodeRequested(true);
        })
        .catch((err) => {
          setErrorMsg(
            err?.response?.data?.error || err.message || "Failed to send code"
          );
          toast.error(
            err?.response?.data?.error || err.message || "Failed to send code"
          );
        })
        .finally(() => setSending(false));
    }
  }, [email]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    // Auto-submit when all 6 digits are filled and not loading/sending
    if (codeDigits.every((d) => d !== "") && !loading && !sending) {
      handleSubmit({ preventDefault: () => {} });
    }
    // eslint-disable-next-line
  }, [codeDigits]);

  if (!email) {
    // If no email, redirect to login
    navigate("/admin/login");
    return null;
  }

  const handleDigitChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newDigits = [...codeDigits];
    newDigits[idx] = val;
    setCodeDigits(newDigits);
    if (val && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
    if (!val && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (paste.length === 6) {
      setCodeDigits(paste.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const code = codeDigits.join("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const verifyResult = await adminServices.verify2FA({ email, code });
      if (verifyResult.data && verifyResult.data.auth) {
        localStorage.setItem("authToken", verifyResult.data.auth);
        window.location.href = "/Technical-Admin";
      } else {
        setErrorMsg("Invalid OTP. Please try again.");
        toast.error(verifyResult.data?.error || "Verification failed");
      }
    } catch (err) {
      setErrorMsg("Invalid OTP. Please try again.");
      toast.error(
        err.response?.data?.error || err.message || "Invalid or expired code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setSending(true);
    setErrorMsg("");
    try {
      await adminServices.request2FA({ email });
      toast.success("Verification code resent to your email.");
      setCodeRequested(true);
      setResendTimer(30);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error || err.message || "Failed to resend code"
      );
      toast.error(
        err.response?.data?.error || err.message || "Failed to resend code"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-100 via-white to-blue-50"
      }`}
    >
      <div
        className="w-full max-w-md mx-auto p-6 rounded-2xl shadow-2xl border"
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(31,41,55,0.85), rgba(55,65,81,0.85))"
            : "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(249,250,251,0.85))",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: isDarkMode
            ? "1.5px solid rgba(75,85,99,0.25)"
            : "1.5px solid rgba(229,231,235,0.25)",
          boxShadow: isDarkMode
            ? "0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 8px 32px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.10)",
        }}
      >
        <div className="flex flex-col items-center mb-4">
          <span
            className={`rounded-full shadow-lg border-2 mb-2 flex items-center justify-center ${
              isDarkMode
                ? "bg-blue-900/60 border-blue-700/60"
                : "bg-blue-100 border-blue-200"
            }`}
            style={{ width: 54, height: 54 }}
          >
            <ShieldCheck className="w-7 h-7 text-blue-500" />
          </span>
          <h2
            className={`text-2xl font-semibold mb-1 text-center ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Two-Factor Authentication
          </h2>
          <p
            className={`text-center mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Enter the 6-digit code sent to <b>{email}</b>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {codeDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                className={`w-12 h-14 text-center text-2xl font-mono rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-400 outline-none bg-transparent shadow-sm ${
                  isDarkMode
                    ? "border-gray-600 text-white placeholder-gray-400 bg-gray-800/40"
                    : "border-gray-300 text-gray-900 placeholder-gray-400 bg-white/60"
                }`}
                autoFocus={idx === 0}
                disabled={loading || sending}
              />
            ))}
          </div>
          {errorMsg && (
            <div className="text-center text-red-500 text-sm font-medium mt-1 animate-pulse">
              {errorMsg}
            </div>
          )}
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-lg ${
              isDarkMode
                ? "bg-blue-800 text-white hover:bg-blue-700 focus:ring-blue-500"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400"
            }`}
            disabled={loading || code.length !== 6 || sending}
          >
            {loading ? "Verifying..." : "Verify & Sign In"}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={handleResend}
            className={`font-medium transition-colors duration-200 underline-offset-2 ${
              resendTimer > 0 || loading || sending
                ? "text-gray-400 cursor-not-allowed"
                : isDarkMode
                ? "text-blue-300 hover:text-blue-200"
                : "text-blue-600 hover:text-blue-800"
            }`}
            disabled={resendTimer > 0 || loading || sending}
          >
            {sending
              ? "Sending..."
              : resendTimer > 0
              ? `Resend code in ${resendTimer}s`
              : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFAVerify;
