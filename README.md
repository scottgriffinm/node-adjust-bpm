# Audio BPM Adjuster

This is a Node.js application that allows users to upload an `.mp3` or `.wav` audio file, specify a new target BPM (Beats Per Minute), and download the adjusted audio file. The pitch of the audio is preserved, so only the tempo is changed to match the specified BPM.

## Features

- **File Upload**: Users can upload `.mp3` or `.wav` files.
- **Automatic BPM Extraction**: The app extracts the original BPM from the filename. The filename should contain a two- or three-digit number representing the BPM (e.g., `my_track_120_bpm.wav`).
- **BPM Adjustment**: Users can specify a new target BPM, and the app adjusts the speed of the audio accordingly without affecting pitch.
- **Downloadable Output**: The adjusted audio file is available for download after processing.

## Requirements

- Node.js
- FFmpeg installed and available in your PATH
- Compatible audio file (`.mp3` or `.wav`) with the original BPM in the filename (e.g., `track_90_bpm.mp3`).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/audio-bpm-adjuster.git
   cd audio-bpm-adjuster
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure FFmpeg is installed on your system. You can check if FFmpeg is installed by running:
   ```bash
   ffmpeg -version
   ```
   - **macOS**: `brew install ffmpeg`
   - **Ubuntu**: `sudo apt update && sudo apt install ffmpeg`
   - **Windows**: Download from [FFmpeg’s official website](https://ffmpeg.org/download.html) and add it to your PATH.

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

3. Upload an `.mp3` or `.wav` file, ensuring the filename contains a two- or three-digit BPM (e.g., `my_track_120_bpm.wav`).

4. Enter the new target BPM and click **Change BPM**. The adjusted audio file will be generated and available for download.

## File Naming Conventions

The app extracts the BPM from the filename. Make sure the filename includes a two- or three-digit BPM value (e.g., `my_track_120_bpm.wav`). Some examples:

- `8-bit_music_90_bpm.wav` → Extracted BPM: 90
- `jazz_groove_110.mp3` → Extracted BPM: 110
- `electronic_vibe80.mp3` → Extracted BPM: 80

## Technical Details

- **Multer**: Handles file uploads.
- **FFmpeg**: Used to process audio files and adjust BPM.
- **Express**: Serves the front end and handles API requests.

### Key Functions

- `extractBpmFromFilename(filename)`: Extracts a two- or three-digit BPM from the filename.
- `getAtempoFilters(speedFactor)`: Creates an array of `atempo` filters to adjust playback speed within FFmpeg's limits (0.5 to 2.0 per filter), chaining multiple filters if needed.
- **Supported File Types**: Accepts `.mp3` and `.wav` files with MIME types `audio/mpeg`, `audio/wav`, and `audio/x-wav`.

## Error Handling

- **Invalid File Type**: Only `.mp3` and `.wav` files are allowed. If a different file type is uploaded, an error message will be displayed.
- **Filename Formatting**: If no BPM is found in the filename, or if an invalid target BPM is provided, an error message will be displayed.

## Example HTML (`public/index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BPM Adjuster</title>
</head>
<body>
  <h1>Change Audio BPM</h1>
  <form id="uploadForm" enctype="multipart/form-data" action="/change-bpm" method="post">
    <label for="audioFile">Upload MP3/WAV file:</label>
    <input type="file" id="audioFile" name="audioFile" accept=".mp3,.wav" required><br><br>

    <label for="targetBpm">Target BPM:</label>
    <input type="number" id="targetBpm" name="targetBpm" required><br><br>

    <button type="submit">Change BPM</button>
  </form>
</body>
</html>
```

## License

This project is open source and available under the [MIT License](LICENSE).

---

Enjoy adjusting the BPM of your favorite tracks!