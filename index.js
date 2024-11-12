const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Initialize Express
const app = express();
const PORT = 3000;

// Set up multer for file uploads with file type filter
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    // Accept only .mp3 and .wav files
    if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wav' || file.mimetype === 'audio/x-wav') {
      cb(null, true);
    } else {
      cb(new Error('Only .mp3 and .wav files are allowed!'));
    }
  }
});

// Serve static HTML page
app.use(express.static(path.join(__dirname, 'public')));

// Function to extract BPM from filename
function extractBpmFromFilename(filename) {
    // Match any two or three consecutive digits
    const match = filename.match(/(\d{2,3})/);
    return match ? parseInt(match[1], 10) : null;
  }
// Function to calculate the atempo filter chain for the given speed factor
function getAtempoFilters(speedFactor) {
  let filters = [];
  while (speedFactor > 2.0 || speedFactor < 0.5) {
    if (speedFactor > 2.0) {
      filters.push("atempo=2.0");
      speedFactor /= 2.0;
    } else if (speedFactor < 0.5) {
      filters.push("atempo=0.5");
      speedFactor /= 0.5;
    }
  }
  filters.push(`atempo=${speedFactor.toFixed(2)}`);
  return filters;
}

// Endpoint to handle file upload and BPM adjustment
app.post('/change-bpm', upload.single('audioFile'), (req, res) => {
  const inputBpm = extractBpmFromFilename(req.file.originalname);
  const targetBpm = parseFloat(req.body.targetBpm);
  const inputFilePath = req.file.path;
  const outputExtension = path.extname(req.file.originalname); // Keep same extension as input
  const outputFilePath = `uploads/changed_bpm_${targetBpm}${outputExtension}`;

  if (!inputBpm || isNaN(targetBpm)) {
    res.status(400).send("Error: Invalid BPM or filename format.");
    return;
  }

  // Calculate speed factor based on input and target BPM
  const speedFactor = targetBpm / inputBpm;
  const atempoFilters = getAtempoFilters(speedFactor);

  ffmpeg(inputFilePath)
    .audioFilters(atempoFilters)
    .output(outputFilePath)
    .on('end', () => {
      // Send the adjusted file back to the client for download
      res.download(outputFilePath, (err) => {
        // Clean up files after sending
        fs.unlinkSync(inputFilePath);
        fs.unlinkSync(outputFilePath);
      });
    })
    .on('error', (err) => {
      res.status(500).send(`Error processing audio: ${err.message}`);
    })
    .run();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});