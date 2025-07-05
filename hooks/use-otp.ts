import { customFetch } from "@/lib/utils";

export async function sendOtp(phone: string) {
  try {
    const req = await customFetch("/auth/otp", {
      method: "POST",
      body: JSON.stringify({
        phone,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await req.json();

    if (result) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}
