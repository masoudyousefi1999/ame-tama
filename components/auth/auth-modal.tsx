"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"

type AuthView = "login" | "register" | "forgotPassword"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultView?: AuthView
}

export default function AuthModal({ isOpen, onClose, defaultView = "login" }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(defaultView)

  const handleSuccess = () => {
    onClose()
  }

  const handleViewChange = (newView: AuthView) => {
    setView(newView)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {view === "login" && (
          <LoginForm
            onSuccess={handleSuccess}
            onForgotPassword={() => handleViewChange("forgotPassword")}
            onRegister={() => handleViewChange("register")}
          />
        )}

        {view === "register" && <RegisterForm onSuccess={handleSuccess} onLogin={() => handleViewChange("login")} />}

        {view === "forgotPassword" && <ForgotPasswordForm onBack={() => handleViewChange("login")} />}
      </DialogContent>
    </Dialog>
  )
}
