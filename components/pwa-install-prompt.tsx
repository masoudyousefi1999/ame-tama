"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // For non-iOS devices, listen for the beforeinstallprompt event
    if (!isIOSDevice) {
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        // Only show modal if user hasn't dismissed it before
        if (!localStorage.getItem("pwaPromptDismissed")) {
          setIsInstallable(true);
          setIsModalOpen(true);
        }
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () =>
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
    }

    // For iOS, check if the app is not in standalone mode
    if (
      isIOSDevice &&
      !window.matchMedia("(display-mode: standalone)").matches
    ) {
      if (!localStorage.getItem("pwaPromptDismissed")) {
        setIsInstallable(true);
        setIsModalOpen(true);
      }
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);

    if (outcome === "accepted") {
      setIsInstallable(false);
      setIsModalOpen(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // Store dismissal in localStorage to prevent showing again
    localStorage.setItem("pwaPromptDismissed", "true");
  };

  if (!isInstallable || isModalOpen === false) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-right"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">نصب AME-TAMA روی دستگاه شما</h2>
        {isIOS ? (
          <div className="space-y-4">
            <p>برای نصب این برنامه در iOS:</p>
            <ol className="list-decimal list-inside space-y-2 mr-4">
              <li>روی دکمه «اشتراک‌گذاری» در مرورگر Safari ضربه بزنید</li>
              <li>پایین بکشید و «افزودن به صفحه اصلی» را انتخاب کنید</li>
              <li>روی «افزودن» در بالای صفحه ضربه بزنید</li>
            </ol>
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose}>متوجه شدم</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p>
              با نصب این برنامه، می‌توانید به راحتی به آن دسترسی داشته باشید،
              حتی بدون اتصال به اینترنت.
            </p>
            <div className="flex justify-end mt-4">
              <Button onClick={handleInstallClick}>نصب برنامه</Button>
              <Button variant="outline" onClick={handleClose} className="ml-2">
                خیر، بعداً
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
