"use client"

import { useState, useEffect } from "react"
import { ref, get } from "firebase/database"
import { database } from "@/lib/firebase"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

interface InstallPromptProps {
  onClose: () => void
}

export default function InstallPrompt({ onClose }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [siteConfig, setSiteConfig] = useState({
    siteName: "Зогсоолын систем",
    siteLogo: "/images/logo.png",
  })

  useEffect(() => {
    // Load site config from database
    const loadSiteConfig = async () => {
      try {
        const configRef = ref(database, "siteConfig")
        const snapshot = await get(configRef)
        if (snapshot.exists()) {
          const config = snapshot.val()
          setSiteConfig({
            siteName: config.siteName || "Зогсоолын систем",
            siteLogo: config.siteLogo || "/images/logo.png",
          })
        }
      } catch (error) {
        console.error("Error loading site config:", error)
      }
    }

    loadSiteConfig()

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = () => {
    setShowConfirm(true)
  }

  const handleConfirmInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        console.log("User accepted the install prompt")
      }
      setDeferredPrompt(null)
    }
    onClose()
  }

  const handleCancel = () => {
    if (showConfirm) {
      setShowConfirm(false)
    } else {
      onClose()
    }
  }

  if (!showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img src={siteConfig.siteLogo || "/placeholder.svg"} alt="Logo" className="w-12 h-12 rounded-lg" />
              <div>
                <h3 className="font-semibold text-gray-900">Суулгах</h3>
                <p className="text-sm text-gray-600">Апп болгон суулгах</p>
              </div>
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Суулгах
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Програм суулгах</h3>
          <div className="flex flex-col items-center space-y-2">
            <img src={siteConfig.siteLogo || "/placeholder.svg"} alt="Logo" className="w-16 h-16 rounded-lg" />
            <p className="text-gray-700 font-medium">{siteConfig.siteName}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-colors"
          >
            Болих
          </button>
          <button
            onClick={handleConfirmInstall}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Суулгах
          </button>
        </div>
      </div>
    </div>
  )
}
