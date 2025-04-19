import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Toast = ({ show, message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto backdrop-blur-lg bg-white-100/30 border border-white shadow-xl text-black px-6 py-5 rounded-xl flex flex-col items-center space-y-3 w-[90%] max-w-sm"
          >
            <div className="text-4xl">
              {type === "success" ? (
                <FaCheckCircle className="text-green-400 drop-shadow-md" />
              ) : (
                <FaExclamationCircle className="text-red-400 drop-shadow-md" />
              )}
            </div>
            <p className="text-center text-lg font-semibold drop-shadow-sm">{message}</p>
            <button
              onClick={onClose}
              className="text-sm mt-2 px-4 py-1 rounded-full bg-white/70 hover:bg-white/30 transition"
            >
              Dismiss
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
