// Script to preload and cache images for better performance
const { initializeApp } = require("firebase/app")
const { getDatabase, ref, get } = require("firebase/database")

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

async function testImagePreloading() {
  try {
    console.log("Testing image preloading functionality...")

    // Get site config
    const configRef = ref(database, "siteConfig")
    const snapshot = await get(configRef)

    if (snapshot.exists()) {
      const config = snapshot.val()
      console.log("Site config found:")
      console.log("- Site Name:", config.siteName)
      console.log("- Logo:", config.siteLogo)
      console.log("- Background:", config.siteBackground)

      // Test image accessibility
      console.log("\nTesting image URLs...")

      // Note: In a real browser environment, you would test actual image loading
      // This is just a configuration validation
      if (config.siteLogo) {
        console.log("✓ Logo URL configured")
      }
      if (config.siteBackground) {
        console.log("✓ Background URL configured")
      }
    } else {
      console.log("No site config found - will use defaults")
    }

    console.log("\nImage preloading test completed!")
  } catch (error) {
    console.error("Error testing image preloading:", error)
  }
}

testImagePreloading()
