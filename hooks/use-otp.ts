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

export async function verifyOtp(phone: string, otp: string) {
  try {
    const req = await customFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        phone,
        otp,
      }),

      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await req.json();

    if (result) {
      return result as { user: any; token: any };
    }

    return;
  } catch (error) {
    return false;
  }
}
