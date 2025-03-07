import fs from "fs";
import path from "path";
import express from "express";

const app = express();
const PORT = 3000;

// Function to check if the current time is 9:00 AM
function isNineAM() {
  const now = new Date();
  return now.getHours() === 9 && now.getMinutes() === 0; // Checks if it's 09:00
}

// Function to handle file download
app.get("/download", (req, res) => {
  if (!isNineAM()) {
    return res
      .status(403)
      .json({ message: "File can only be downloaded at 9:00 AM" });
  }

  // Path to the file to be downloaded
  const filePath = path.join(__dirname, "https://filesamples.com/samples/document/csv/sample4.csv ");

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  // Send the file to the client
  res.download(filePath, "downloaded_file.txt", (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ message: "Error downloading file" });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
