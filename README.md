# PDF/Text Summarizer

A web app that summarizes pasted text or uploaded PDF files using Ollama's local LLM API.

## Features

- Paste any text and get a summary.
- Upload a PDF and get its summarized content.
- Uses Ollama (Mistral model) running locally for AI summarization.
- Clean, responsive UI.

## Requirements

- Synology NAS (or any web server with PHP and cURL enabled)
- PHP 7.4+ with cURL extension
- Ollama running on the same server (`localhost:11434`)
- PDF.js (included as `pdf.mjs` and `pdf.worker.mjs`)

## Setup

1. **Install Ollama** and start the API server:
   ```
   ollama serve
   ```
2. **Enable PHP cURL extension** in DSM Control Panel or via Package Center.
3. **Copy all files** (`index.html`, `style.css`, `script.js`, `summarize.php`, `pdf.mjs`, `pdf.worker.mjs`) to your web directory.
4. **Access the app** in your browser via your NAS/web server URL.

## Usage

- Paste text in the textarea or upload a PDF.
- Click **Summarize**.
- Wait for the summary to appear.

## Troubleshooting

- If you see a "500 Internal Server Error", make sure PHP cURL is enabled.
- Ensure Ollama is running and accessible at `localhost:11434`.
- Check PHP error logs for details.

## License

MIT
