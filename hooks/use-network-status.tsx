"use client"

import { useState, useEffect } from "react"

type NetworkStatus = {
  online: boolean
  downlink?: number
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g"
  saveData?: boolean
  rtt?: number
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    online: true,
  })

  useEffect(() => {
    // Initial network status
    setNetworkStatus({
      online: navigator.onLine,
      downlink: (navigator as any).connection?.downlink,
      effectiveType: (navigator as any).connection?.effectiveType,
      saveData: (navigator as any).connection?.saveData,
      rtt: (navigator as any).connection?.rtt,
    })

    // Update online status
    const handleOnline = () => {
      setNetworkStatus((prev) => ({ ...prev, online: true }))
    }

    const handleOffline = () => {
      setNetworkStatus((prev) => ({ ...prev, online: false }))
    }

    // Update connection info if available
    const handleConnectionChange = () => {
      setNetworkStatus({
        online: navigator.onLine,
        downlink: (navigator as any).connection?.downlink,
        effectiveType: (navigator as any).connection?.effectiveType,
        saveData: (navigator as any).connection?.saveData,
        rtt: (navigator as any).connection?.rtt,
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    if ((navigator as any).connection) {
      ;(navigator as any).connection.addEventListener("change", handleConnectionChange)
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)

      if ((navigator as any).connection) {
        ;(navigator as any).connection.removeEventListener("change", handleConnectionChange)
      }
    }
  }, [])

  return networkStatus
}
