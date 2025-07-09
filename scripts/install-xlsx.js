const { execSync } = require("child_process")

try {
  console.log("Installing xlsx package...")
  execSync("npm install xlsx", { stdio: "inherit" })
  console.log("xlsx package installed successfully!")
} catch (error) {
  console.error("Error installing xlsx package:", error)
}
