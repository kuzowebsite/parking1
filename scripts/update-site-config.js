const { initializeApp } = require("firebase/app")
const { getDatabase, ref, set } = require("firebase/database")

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

async function updateSiteConfig() {
  try {
    console.log("🔧 Updating site configuration...")

    const siteConfig = {
      siteName: "ЗОГСООЛЫН УДИРДЛАГЫН СИСТЕМ",
      siteLogo: "/images/logo.png",
      siteBackground: "/images/background.webp",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.1.0",
      description: "Зогсоолын удирдлагын цогц систем",
      features: {
        realTimeUpdates: true,
        imageSupport: true,
        multiUser: true,
        reporting: true,
      },
    }

    await set(ref(database, "siteConfig"), siteConfig)

    console.log("✅ Site configuration updated successfully!")
    console.log("📋 Updated configuration:")
    console.log("   Site Name:", siteConfig.siteName)
    console.log("   Logo:", siteConfig.siteLogo)
    console.log("   Background:", siteConfig.siteBackground)
    console.log("   Version:", siteConfig.version)
  } catch (error) {
    console.error("❌ Error updating site config:", error)
  }
}

updateSiteConfig()
