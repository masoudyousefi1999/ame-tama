"use server"

import { z } from "zod"

// تعریف اسکیما برای اعتبارسنجی داده‌های فرم
const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "نام باید حداقل ۲ کاراکتر باشد" }),
  email: z.string().email({ message: "لطفاً یک ایمیل معتبر وارد کنید" }),
  subject: z.string().min(5, { message: "موضوع باید حداقل ۵ کاراکتر باشد" }),
  message: z.string().min(10, { message: "پیام باید حداقل ۱۰ کاراکتر باشد" }),
})

export type ContactFormState = {
  errors?: {
    name?: string[]
    email?: string[]
    subject?: string[]
    message?: string[]
    _form?: string[]
  }
  success?: boolean
  message?: string
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  // استخراج داده‌های فرم
  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  })

  // اگر اعتبارسنجی ناموفق بود، برگرداندن خطاها
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      message: "لطفاً خطاهای فرم را برطرف کنید",
    }
  }

  const { name, email, subject, message } = validatedFields.data

  try {
    // در اینجا می‌توانید کد ارسال ایمیل واقعی را قرار دهید
    // برای مثال با استفاده از nodemailer یا سرویس‌های دیگر

    // شبیه‌سازی تأخیر ارسال ایمیل
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // لاگ کردن اطلاعات برای اهداف توسعه
    console.log("Contact form submission:", { name, email, subject, message })

    // برگرداندن پاسخ موفقیت
    return {
      success: true,
      message: "پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.",
    }
  } catch (error) {
    // در صورت بروز خطا
    return {
      errors: {
        _form: ["خطا در ارسال پیام. لطفاً دوباره تلاش کنید."],
      },
      success: false,
    }
  }
}
