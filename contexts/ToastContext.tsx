import React, { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastConfig {
  title: string;
  message?: string;
  type: ToastType;
  visibilityTimeout?: number;
}

interface ToastContextValue {
  toast: (
    type: ToastType,
    title: string,
    message?: string,
    visibilityTimeout?: number,
  ) => void;
  dismiss: () => void;
  isVisible: boolean;
  config: ToastConfig | null;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState<ToastConfig | null>(null);
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    // Clear config after animation completes
    setTimeout(() => setConfig(null), 300);
  }, [timeoutId]);

  const toast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string,
      visibilityTimeout: number = 5000,
    ) => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new toast config
      setConfig({ type, title, message, visibilityTimeout });
      setIsVisible(true);

      // Auto-hide after timeout
      const newTimeoutId = setTimeout(() => {
        dismiss();
      }, visibilityTimeout);

      setTimeoutId(newTimeoutId);
    },
    [timeoutId, dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss, isVisible, config }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
