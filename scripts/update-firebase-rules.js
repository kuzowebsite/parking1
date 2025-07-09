const admin = require("firebase-admin")

// Firebase Admin SDK тохиргоо
if (!admin.apps.length) {
  try {
    // Service account key файлаас тохиргоо
    const serviceAccount = require("../firebase-service-account.json")
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
    })
  } catch (error) {
    console.log("Service account файл олдсонгүй. Environment variables ашиглаж байна...")
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
  }
}

const newRules = {
  rules: {
    ".read": "auth != null",
    ".write": "auth != null",
    users: {
      ".read": "auth != null",
      ".write": "auth != null",
    },
    parking_records: {
      ".read": "auth != null",
      ".write": "auth != null",
    },
    employees: {
      ".read": "auth != null",
      ".write": "auth != null",
    },
    siteConfig: {
      ".read": "true",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'manager'",
    },
    pricingConfig: {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'manager'",
    },
  },
}

async function updateFirebaseRules() {
  try {
    console.log("🔄 Firebase Database Rules шинэчилж байна...")

    // Rules шинэчлэх
    await admin.database().setRules(JSON.stringify(newRules))

    console.log("✅ Firebase Database Rules амжилттай шинэчлэгдлээ!")
    console.log("\n📋 Шинэ rules:")
    console.log(JSON.stringify(newRules, null, 2))
  } catch (error) {
    console.error("❌ Firebase Rules шинэчлэхэд алдаа гарлаа:", error)

    console.log("\n🔧 Гараар шинэчлэх заавар:")
    console.log("1. Firebase Console (https://console.firebase.google.com) руу орох")
    console.log("2. Төслөө сонгох")
    console.log("3. Realtime Database хэсэгт орох")
    console.log("4. Rules таб дээр дарах")
    console.log("5. Доорх rules-г хуулж тавих:")
    console.log("\n" + JSON.stringify(newRules, null, 2))
    console.log("\n6. Publish дарах")
  }
}

// Script ажиллуулах
updateFirebaseRules()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error("Script алдаа:", error)
    process.exit(1)
  })
