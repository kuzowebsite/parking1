"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { ref, get, onValue } from "firebase/database"
import { auth, database } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, AlertCircle, Download, Sparkles, Smartphone } from "lucide-react"
import { usePWAInstall } from "@/hooks/use-pwa-install"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [imagesPreloaded, setImagesPreloaded] = useState(false)
  const [preloadProgress, setPreloadProgress] = useState(0)
  const [installLoading, setInstallLoading] = useState(false)

  // PWA install hook
  const { canInstall, installApp, isInstalled } = usePWAInstall()

  // Site configuration states
  const [siteConfig, setSiteConfig] = useState({
    siteName: "",
    siteLogo: "",
    siteBackground: "",
  })

  const router = useRouter()

  // Load site configuration from database
  const loadSiteConfig = async () => {
    try {
      const siteRef = ref(database, "siteConfig")
      const snapshot = await get(siteRef)

      if (snapshot.exists()) {
        const data = snapshot.val()
        setSiteConfig({
          siteName: data.siteName || "",
          siteLogo: data.siteLogo || "",
          siteBackground: data.siteBackground || "",
        })

        // Listen for real-time updates
        onValue(siteRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val()
            setSiteConfig({
              siteName: data.siteName || "",
              siteLogo: data.siteLogo || "",
              siteBackground: data.siteBackground || "",
            })
          }
        })
      }
    } catch (error: any) {
      console.error("Error loading site config:", error.message)
    }
  }

  // Preload images function
  const preloadImages = async () => {
    const imagesToPreload = [
      "/images/background.webp",
      "/images/logo.png",
      siteConfig.siteBackground,
      siteConfig.siteLogo,
    ].filter(Boolean)

    let loadedCount = 0
    const totalImages = imagesToPreload.length

    if (totalImages === 0) {
      setImagesPreloaded(true)
      setPreloadProgress(100)
      return
    }

    const loadPromises = imagesToPreload.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          loadedCount++
          setPreloadProgress((loadedCount / totalImages) * 100)
          resolve()
        }
        img.onerror = () => {
          loadedCount++
          setPreloadProgress((loadedCount / totalImages) * 100)
          resolve()
        }
        img.src = src
      })
    })

    await Promise.all(loadPromises)
    setImagesPreloaded(true)
  }

  useEffect(() => {
    const initializePage = async () => {
      await loadSiteConfig()

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userRef = ref(database, `users/${user.uid}`)
            const snapshot = await get(userRef)
            if (snapshot.exists()) {
              const userData = snapshot.val()

              if (userData.active === false) {
                setPageLoading(false)
                return
              }

              if (userData.role === "manager") {
                router.push("/manager")
                return
              } else if (userData.role === "employee" || userData.role === "driver") {
                router.push("/")
                return
              }
            }
          } catch (error) {
            console.error("Error checking user role:", error)
          }
        }
        setPageLoading(false)
      })

      return unsubscribe
    }

    initializePage()
  }, [router])

  useEffect(() => {
    preloadImages()
  }, [siteConfig])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const userRef = ref(database, `users/${user.uid}`)
      const snapshot = await get(userRef)

      if (snapshot.exists()) {
        const userData = snapshot.val()

        if (userData.active === false) {
          setError("Таны эрх хаагдсан байна. Менежертэй холбогдоно уу.")
          await auth.signOut()
          setLoading(false)
          return
        }

        switch (userData.role) {
          case "manager":
            router.push("/manager")
            break
          case "employee":
          case "driver":
            router.push("/")
            break
          default:
            setError("Тодорхойгүй хэрэглэгчийн төрөл")
            await auth.signOut()
        }
      } else {
        setError("Хэрэглэгчийн мэдээлэл олдсонгүй")
        await auth.signOut()
      }
    } catch (error: any) {
      console.error("Login error:", error)

      switch (error.code) {
        case "auth/user-not-found":
          setError("И-мэйл хаяг олдсонгүй")
          break
        case "auth/wrong-password":
          setError("Нууц үг буруу байна")
          break
        case "auth/invalid-email":
          setError("И-мэйл хаяг буруу байна")
          break
        case "auth/too-many-requests":
          setError("Хэт олон удаа оролдлоо. Түр хүлээнэ үү")
          break
        case "auth/user-disabled":
          setError("Энэ хэрэглэгчийн эрх хаагдсан байна")
          break
        case "auth/invalid-credential":
          setError("И-мэйл эсвэл нууц үг буруу байна")
          break
        default:
          setError("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.")
      }
    }

    setLoading(false)
  }

  const handleInstall = async () => {
    setInstallLoading(true)
    try {
      const success = await installApp()
      if (success) {
        console.log("App installed successfully")
      }
    } catch (error) {
      console.error("Installation failed:", error)
    } finally {
      setInstallLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-white font-medium">Ачааллаж байна...</p>
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!imagesPreloaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-6 max-w-sm mx-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-500 mx-auto"></div>
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-purple-300 animate-pulse" />
          </div>
          <div className="space-y-4">
            <p className="text-white font-medium text-lg">Зураг ачааллаж байна...</p>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${preloadProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
              </div>
            </div>
            <p className="text-purple-300 font-semibold text-xl">{Math.round(preloadProgress)}%</p>
          </div>
        </div>
      </div>
    )
  }

  const backgroundImage = siteConfig.siteBackground || "/images/background.webp"
  const logoImage = siteConfig.siteLogo || "/images/logo.png"

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 py-8"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
      }}
    >
      {/* Enhanced background overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Login form with enhanced design */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="backdrop-blur-xl bg-white/10 shadow-2xl border border-white/20 overflow-hidden">
          {/* Card header with gradient background */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    {logoImage ? (
                      <img
                        src={logoImage || "/placeholder.svg"}
                        alt="Logo"
                        className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          e.currentTarget.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <Shield className={`w-12 h-12 sm:w-14 sm:h-14 text-white ${logoImage ? "hidden" : ""}`} />
                  </div>
                  {/* Animated ring around logo */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-purple-400/50 animate-spin"
                    style={{ animationDuration: "3s" }}
                  ></div>
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-white mb-2">{siteConfig.siteName}</CardTitle>
                <CardDescription className="text-white/80 text-base sm:text-lg font-medium">
                  
                </CardDescription>
              </div>
            </CardHeader>
          </div>

          <CardContent className="space-y-6 p-6 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-medium text-sm">
                  И-мэйл хаяг
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-12 text-base bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-purple-400 focus:ring-purple-400/50 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-white font-medium text-sm">
                  Нууц үг
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-12 pr-12 text-base bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-purple-400 focus:ring-purple-400/50 backdrop-blur-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-12 px-4 hover:bg-white/10 text-white/70 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-500/20 border-red-400/50 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-300" />
                  <AlertDescription className="text-red-200 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Нэвтэрч байна...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Нэвтрэх</span>
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </Button>
            </form>

            {/* Install button below login button */}
            {(canInstall || !isInstalled) && (
              <div className="pt-2">
                <Button
                  onClick={handleInstall}
                  variant="outline"
                  className="w-full h-12 text-base font-medium bg-white/5 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-[1.02]"
                  disabled={installLoading}
                >
                  {installLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Суулгаж байна...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-5 h-5" />
                      <span>Суулгах</span>
                      <Download className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </div>
            )}

            {/* Show installed status */}
            {isInstalled && (
              <div className="pt-2">
                <div className="w-full h-12 flex items-center justify-center bg-green-500/20 border border-green-400/50 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2 text-green-300">
                    <Smartphone className="w-5 h-5" />
                    <span className="text-base font-medium">Суулгагдсан</span>
                  </div>
                </div>
              </div>
            )}

            {/* Decorative elements */}
            <div className="flex items-center justify-center space-x-4 pt-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/30"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/30"></div>
            </div>
          </CardContent>
        </Card>

        {/* Floating elements around the card */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/20 rounded-full blur-sm animate-pulse"></div>
        <div
          className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-500/20 rounded-full blur-sm animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 -right-8 w-4 h-4 bg-pink-500/20 rounded-full blur-sm animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  )
}
