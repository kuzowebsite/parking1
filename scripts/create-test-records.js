const { initializeApp } = require("firebase/app")
const { getDatabase, ref, push } = require("firebase/database")

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

async function createTestRecords() {
  try {
    const recordsRef = ref(database, "parkingRecords")

    // Create some test parking records
    const testRecords = [
      {
        plateNumber: "1234УБА",
        entryTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        exitTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        status: "completed",
        duration: 60,
        amount: 1000,
        employeeId: "test-employee-1",
        employeeName: "Тест ажилтан 1",
      },
      {
        plateNumber: "5678УБА",
        entryTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        exitTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        status: "completed",
        duration: 150,
        amount: 1500,
        employeeId: "test-employee-2",
        employeeName: "Тест ажилтан 2",
      },
      {
        plateNumber: "9999УБА",
        entryTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        status: "parked",
        employeeId: "test-employee-1",
        employeeName: "Тест ажилтан 1",
      },
      {
        plateNumber: "1111УБА",
        entryTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        status: "parked",
        employeeId: "test-employee-2",
        employeeName: "Тест ажилтан 2",
      },
    ]

    for (const record of testRecords) {
      await push(recordsRef, record)
      console.log(`Created record for ${record.plateNumber}`)
    }

    console.log("Test records created successfully!")
  } catch (error) {
    console.error("Error creating test records:", error)
  }
}

createTestRecords()
