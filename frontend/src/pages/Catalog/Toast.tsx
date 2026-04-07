import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  onDismiss: () => void;
  duration?: number; // ms, default 60000 (1 minute)
}

export default function Toast({ message, onDismiss, duration = 60000 }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Trigger entrance animation on mount
    const enterTimer = setTimeout(() => setVisible(true), 10);

    // Progress bar countdown
    const intervalMs = 100;
    const steps = duration / intervalMs;
    const decrement = 100 / steps;
    let current = 100;

    const progressInterval = setInterval(() => {
      current -= decrement;
      setProgress(Math.max(0, current));
    }, intervalMs);

    // Auto-dismiss
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // wait for exit animation
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
      clearInterval(progressInterval);
    };
  }, [duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed bottom-6 left-6 z-50 flex flex-col gap-0 w-80 rounded-xl shadow-2xl
        bg-white border border-gray-100 overflow-hidden
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        {/* Checkmark icon */}
        <span className="flex-shrink-0 mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-snug">
            Added to cart
          </p>
          <p className="text-sm text-gray-500 mt-0.5 truncate" title={message}>
            {message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss notification"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 w-full">
        <div
          className="h-full bg-green-500 transition-all ease-linear"
          style={{ width: `${progress}%`, transitionDuration: "100ms" }}
        />
      </div>
    </div>
  );
}
