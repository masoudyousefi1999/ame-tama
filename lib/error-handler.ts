/**
 * Silent error handler for API calls
 * Distinguishes between expected errors (401, 403) and unexpected errors
 */

export interface ApiError {
  status: number;
  message: string;
  isExpected: boolean;
}

export function handleApiError(error: any): ApiError {
  // Network errors or fetch failures
  if (!error || typeof error !== "object") {
    return {
      status: 0,
      message: "Network error",
      isExpected: false,
    };
  }

  // Response with status code
  if (error.status) {
    const status = error.status;
    const isExpected = status === 401 || status === 403 || status === 404;

    return {
      status,
      message: error.message || `HTTP ${status}`,
      isExpected,
    };
  }

  // Other errors
  return {
    status: 0,
    message: error.message || "Unknown error",
    isExpected: false,
  };
}

export function shouldLogError(error: ApiError): boolean {
  // Only log unexpected errors (not 401, 403, 404)
  return !error.isExpected && error.status !== 0;
}

export function getErrorMessage(error: ApiError): string {
  if (error.isExpected) {
    return ""; // Silent for expected errors
  }

  switch (error.status) {
    case 0:
      return "خطا در اتصال به سرور";
    case 500:
      return "خطا در سرور";
    case 502:
    case 503:
    case 504:
      return "سرور در دسترس نیست";
    default:
      return "خطای غیرمنتظره رخ داد";
  }
}
