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

async function checkDatabaseConnection() {
  try {
    console.log("🔍 Checking Firebase database connection...")

    // Test basic connection
    const testRef = ref(database, "connectionTest")
    const testData = {
      timestamp: new Date().toISOString(),
      message: "Connection test successful",
    }

    await set(testRef, testData)
    console.log("✅ Write test successful")

    const readSnapshot = await get(testRef)
    if (readSnapshot.exists()) {
      console.log("✅ Read test successful")
      console.log("📦 Test data:", readSnapshot.val())
    } else {
      console.log("❌ Read test failed")
    }

    // Check siteConfig specifically
    console.log("\n🔍 Checking siteConfig...")
    const configRef = ref(database, "siteConfig")
    const configSnapshot = await get(configRef)

    if (configSnapshot.exists()) {
      const config = configSnapshot.val()
      console.log("✅ siteConfig exists in database")
      console.log("📋 Current siteConfig:")
      console.log(JSON.stringify(config, null, 2))
    } else {
      console.log("❌ siteConfig does not exist in database")
      console.log("🔧 Creating siteConfig...")

      const defaultSiteConfig = {
        siteName: "ЗОГСООЛЫН УДИРДЛАГЫН СИСТЕМ",
        siteLogo: "/images/logo.png",
        siteBackground: "/images/background.webp",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: "1.0.0",
      }

      await set(configRef, defaultSiteConfig)
      console.log("✅ siteConfig created successfully")
    }

    console.log("\n🎯 Database connection check completed!")
  } catch (error) {
    console.error("❌ Database connection error:", error)
    console.log("🔧 Possible solutions:")
    console.log("   1. Check Firebase project configuration")
    console.log("   2. Verify database rules allow read/write")
    console.log("   3. Check internet connection")
  }
}

checkDatabaseConnection()
