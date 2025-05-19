import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the request is for an image
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/)) {
    // Get client hints
    const viewportWidth = request.headers.get("viewport-width") || "1920"
    const dpr = request.headers.get("dpr") || "1"
    const saveData = request.headers.get("save-data") || "off"

    // Get user agent to determine device type
    const userAgent = request.headers.get("user-agent") || ""
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)

    // Create URL for optimized image
    const url = request.nextUrl.clone()

    // Add optimization parameters based on client hints
    const params = new URLSearchParams(url.search)

    // Set quality based on save-data header
    if (saveData === "on") {
      params.set("quality", "60")
    }

    // Set width based on viewport and device type
    const width = Number.parseInt(viewportWidth)
    if (isMobile && width < 640) {
      params.set("width", "640")
    } else if (width < 1024) {
      params.set("width", "1024")
    } else {
      params.set("width", "1920")
    }

    // Set device pixel ratio
    params.set("dpr", dpr)

    // Update URL search params
    url.search = params.toString()

    // Return modified request
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
