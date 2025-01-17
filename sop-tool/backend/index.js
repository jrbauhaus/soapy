const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Multer setup for file uploads (e.g., logo)
const upload = multer({ dest: "uploads/" });

// Test route to check if the backend is running
app.get("/", (req, res) => res.send("Backend is running!"));

// Generate SOP endpoint
app.post("/generate", upload.single("logo"), (req, res) => {
  const { worksheetType, purpose, roles, steps } = req.body;
  const logo = req.file;

  // Generate Markdown content
  const markdown = `
# ${worksheetType} SOP
## Purpose
${purpose}

## Roles
${roles}

## Steps
${JSON.parse(steps)
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n")}

${logo ? `## Logo\n![Logo](./${logo.path})` : ""}
  `;

  // Write the Markdown file
  const outputPath = path.join(__dirname, "output.md");
  fs.writeFileSync(outputPath, markdown);

  // Send the file as a response
  res.download(outputPath, "sop.md", (err) => {
    if (err) {
      console.error("Error sending the file:", err);
    }

    // Clean up the uploaded logo file and Markdown file after sending
    if (logo) fs.unlinkSync(logo.path);
    fs.unlinkSync(outputPath);
  });
});

// Start the server
app.listen(3001, () => console.log("Backend running on port 3001"));
