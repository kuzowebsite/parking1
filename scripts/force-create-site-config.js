const { initializeApp } = require("firebase/app")
const { getDatabase, ref, set, get } = require("firebase/database")

const firebaseConfig = {
  apiKey: "AIzaSyDReM6qjmJb7EZCDoIoR5j1HsVLmiCRD9s",
  authDomain: "ajlitannurtgl.firebaseapp.com",
  databaseURL: "https://ajlitannurtgl-default-rtdb.firebaseio.com",
  projectId: "ajlitannurtgl",
  messagingSenderId: "1061708931334",
  appId: "1:1061708931334:web:661148d945845e1d7f3e87",
  measurementId: "G-ZRDQBCVXVF",
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

async function forceCreateSiteConfig() {
  try {
    console.log("🚀 Force creating site configuration...")

    // Create comprehensive site config
    const siteConfig = {
      siteName: "ЗОГСООЛЫН УДИРДЛАГЫН СИСТЕМ",
      siteLogo: "https://firebasestorage.googleapis.com/v0/b/ajlitannurtgl.appspot.com/o/logo.png?alt=media",
      siteBackground:
        "https://firebasestorage.googleapis.com/v0/b/ajlitannurtgl.appspot.com/o/background.webp?alt=media",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "2.0.0",
      description: "Зогсоолын удирдлагын цогц систем",
      theme: {
        primaryColor: "#10b981",
        secondaryColor: "#3b82f6",
        backgroundColor: "#1f2937",
      },
      features: {
        realTimeUpdates: true,
        imageSupport: true,
        multiUser: true,
        reporting: true,
        mobileSupport: true,
      },
    }

    // Force write to database
    await set(ref(database, "siteConfig"), siteConfig)
    console.log("✅ Site configuration force created!")

    // Verify it was created
    const verifySnapshot = await get(ref(database, "siteConfig"))
    if (verifySnapshot.exists()) {
      const savedConfig = verifySnapshot.val()
      console.log("✅ Verification successful!")
      console.log("📋 Saved configuration:")
      console.log("   Site Name:", savedConfig.siteName)
      console.log("   Logo URL:", savedConfig.siteLogo)
      console.log("   Background URL:", savedConfig.siteBackground)
      console.log("   Version:", savedConfig.version)
    } else {
      console.log("❌ Verification failed - config not found after creation")
    }
  } catch (error) {
    console.error("❌ Error force creating site config:", error)
  }
}

forceCreateSiteConfig()
