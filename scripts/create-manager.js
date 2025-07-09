const { initializeApp } = require("firebase/app")
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth")
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
const auth = getAuth(app)
const database = getDatabase(app)

async function createManager() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "manager@parking.com", "manager123")

    const user = userCredential.user

    await set(ref(database, `users/${user.uid}`), {
      name: "Менежер",
      email: "manager@parking.com",
      role: "manager",
      createdAt: new Date().toISOString(),
    })

    console.log("Manager created successfully!")
    console.log("Email: manager@parking.com")
    console.log("Password: manager123")
  } catch (error) {
    console.error("Error creating manager:", error)
  }
}

createManager()
