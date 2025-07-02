"use client"

import { useFormStatus } from "react-dom"
import { submitContactForm, type ContactFormState } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useActionState } from "react"

const initialState: ContactFormState = {}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
          در حال ارسال...
        </>
      ) : (
        "ارسال پیام"
      )}
    </Button>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState)

  return (
    <form action={formAction} className="space-y-6">
      {state.errors?._form && (
        <Alert variant="destructive">
          <AlertDescription>{state.errors._form}</AlertDescription>
        </Alert>
      )}

      {state.success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">نام و نام خانوادگی</Label>
          <Input
            id="name"
            name="name"
            placeholder="نام و نام خانوادگی خود را وارد کنید"
            className={state.errors?.name ? "border-red-500" : ""}
          />
          {state.errors?.name && <p className="text-sm text-red-500">{state.errors.name[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">ایمیل</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            className={state.errors?.email ? "border-red-500" : ""}
          />
          {state.errors?.email && <p className="text-sm text-red-500">{state.errors.email[0]}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">موضوع</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="موضوع پیام خود را وارد کنید"
          className={state.errors?.subject ? "border-red-500" : ""}
        />
        {state.errors?.subject && <p className="text-sm text-red-500">{state.errors.subject[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">پیام</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder="پیام خود را وارد کنید"
          className={state.errors?.message ? "border-red-500" : ""}
        />
        {state.errors?.message && <p className="text-sm text-red-500">{state.errors.message[0]}</p>}
      </div>

      <SubmitButton />
    </form>
  )
}
