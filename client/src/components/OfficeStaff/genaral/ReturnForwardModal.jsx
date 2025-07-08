import React from "react";
import { Forward, RotateCcw, Loader2 } from "lucide-react";
import BeatLoader from "../../common/BeatLoader";

const ReturnForwardModal = ({
  open,
  isDarkMode,
  actionLoading,
  actionError,
  onForward,
  onReturn,
  onCancel,
  returnReason,
  setReturnReason,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`w-full max-w-7xl p-0 rounded-3xl border border-white/30 shadow-2xl transition-all duration-300 relative overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/98 border-gray-700/60"
            : "bg-gradient-to-br from-white/95 via-blue-50/90 to-white/98 border-gray-200/60"
        }`}
        style={{
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow: isDarkMode
            ? "0 12px 48px 0 rgba(31, 38, 135, 0.30)"
            : "0 12px 48px 0 rgba(60, 60, 120, 0.12)",
        }}
      >
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-300/30 dark:divide-gray-700/40">
          {/* Forward Option */}
          <div className="flex-1 flex flex-col items-center gap-2 p-10">
            <Forward className="w-12 h-12 text-green-500 drop-shadow mb-2" />
            <h4
              className={`font-bold text-lg mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Forward to ERC Technical Committee
            </h4>
            <p
              className={`text-base text-center mb-3 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Send this application to the ERC Technical Committee for further
              review. You will not be able to edit after forwarding.
            </p>
            <button
              onClick={onForward}
              disabled={actionLoading}
              className="mt-3 px-6 py-3 rounded-lg bg-green-500/80 text-white text-base font-semibold shadow hover:bg-green-600/90 hover:shadow-md transition-all border border-green-400/60 w-full focus:outline-none focus:ring-2 focus:ring-green-400/60 backdrop-blur"
              title="Forward this application to the committee"
            >
              {actionLoading ? <BeatLoader /> : "Forward to Committee"}
            </button>
          </div>
          {/* Return Option */}
          <div className="flex-1 flex flex-col items-center gap-2 p-10">
            <RotateCcw className="w-12 h-12 text-red-500 drop-shadow mb-2" />
            <h4
              className={`font-bold text-lg mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Return to Applicant
            </h4>
            <p
              className={`text-base text-center mb-3 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Send this application back to the applicant for resubmission.
              Please provide a clear reason for the return.
            </p>
            <textarea
              placeholder="Reason for return (required)"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className={`w-full min-h-[100px] max-h-40 p-3 rounded-md border resize-y mb-3 text-base transition-all custom-scrollbar focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/60 hover:border-blue-400/60 ${
                isDarkMode
                  ? "bg-gray-800/70 border-gray-700/40 text-white placeholder-gray-400 scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                  : "bg-white/90 border-gray-300 text-gray-800 placeholder-gray-500 scrollbar-thumb-blue-200 scrollbar-track-white"
              }`}
              rows={4}
              aria-label="Reason for return"
              style={{
                overflowY: "auto",
                scrollbarWidth: "thin",
              }}
            />
            <button
              onClick={onReturn}
              disabled={actionLoading || !returnReason.trim()}
              className="mt-3 px-6 py-3 rounded-lg bg-red-500/80 text-white text-base font-semibold shadow hover:bg-red-600/90 hover:shadow-md transition-all border border-red-400/60 w-full focus:outline-none focus:ring-2 focus:ring-red-400/60 backdrop-blur"
              title="Return this application to the applicant"
            >
              {actionLoading ? <BeatLoader /> : "Return to Applicant"}
            </button>
          </div>
        </div>
        {actionError && (
          <p className="mt-6 text-center text-red-500 bg-white/60 dark:bg-gray-900/60 rounded-xl py-2 px-4 shadow border border-red-200/40 dark:border-red-700/30 mx-8 text-base">
            {actionError}
          </p>
        )}
        <div className="flex justify-center mt-10 pb-8">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-lg bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md transition-all font-semibold backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-300/30 text-base"
            title="Cancel and close this dialog"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnForwardModal;
