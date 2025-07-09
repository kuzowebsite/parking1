const { initializeApp } = require("firebase/app")
const { getDatabase, ref, get, set } = require("firebase/database")

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

async function testSiteConfig() {
  try {
    console.log("🔍 Testing site configuration...")

    // Test reading current config
    const configRef = ref(database, "siteConfig")
    const snapshot = await get(configRef)

    if (snapshot.exists()) {
      const config = snapshot.val()
      console.log("✅ Site config found in database:")
      console.log("   Site Name:", config.siteName)
      console.log("   Logo URL:", config.siteLogo)
      console.log("   Background URL:", config.siteBackground)
      console.log("   Created At:", config.createdAt)
      console.log("   Updated At:", config.updatedAt)
    } else {
      console.log("❌ No site config found in database")
      console.log("🔧 Creating default site config...")

      const defaultConfig = {
        siteName: "ЗОГСООЛЫН СИСТЕМ",
        siteLogo: "/images/logo.png",
        siteBackground: "/images/background.webp",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: "1.0.0",
      }

      await set(configRef, defaultConfig)
      console.log("✅ Default site config created successfully!")
    }

    // Test database rules
    console.log("\n🔐 Testing database access rules...")
    try {
      const testRead = await get(configRef)
      console.log("✅ Public read access working")
    } catch (error) {
      console.log("❌ Public read access failed:", error.message)
    }

    console.log("\n🎯 Site config test completed!")
  } catch (error) {
    console.error("❌ Error testing site config:", error)
  }
}

testSiteConfig()
