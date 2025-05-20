"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Download } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // For non-iOS devices, listen for the beforeinstallprompt event
    if (!isIOSDevice) {
      const handleBeforeInstallPrompt = (e: Event) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault()
        // Stash the event so it can be triggered later
        setDeferredPrompt(e as BeforeInstallPromptEvent)
        setIsInstallable(true)
      }

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      }
    }

    // For iOS, check if the app is not in standalone mode
    if (isIOSDevice && !window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(true)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null)

    if (outcome === "accepted") {
      setIsInstallable(false)
    }
  }

  if (!isInstallable) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Download className="h-4 w-4 ml-2" />
          <span>نصب برنامه</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-xl">
        <SheetHeader>
          <SheetTitle className="text-right">نصب AME-TAMA روی دستگاه شما</SheetTitle>
          <SheetDescription className="text-right">
            {isIOS ? (
              <div className="space-y-4">
                <p>برای نصب این برنامه در iOS:</p>
                <ol className="list-decimal list-inside space-y-2 mr-4">
                  <li>روی دکمه «اشتراک‌گذاری» در مرورگر Safari ضربه بزنید</li>
                  <li>پایین بکشید و «افزودن به صفحه اصلی» را انتخاب کنید</li>
                  <li>روی «افزودن» در بالای صفحه ضربه بزنید</li>
                </ol>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setIsOpen(false)}>متوجه شدم</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p>با نصب این برنامه، می‌توانید به راحتی به آن دسترسی داشته باشید، حتی بدون اتصال به اینترنت.</p>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleInstallClick}>نصب برنامه</Button>
                </div>
              </div>
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
