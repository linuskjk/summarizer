import { getDocument, GlobalWorkerOptions } from './pdf.mjs';

// 👇 Tell PDF.js where to find the worker
GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';

document.addEventListener('DOMContentLoaded', () => {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const textInput = document.getElementById('textInput');
  const pdfUpload = document.getElementById('pdfUpload');
  const output = document.getElementById('output');
  const loading = document.getElementById('loading');

  summarizeBtn.addEventListener('click', async () => {
    output.textContent = '';
    loading.style.display = 'block';

    let text = textInput.value.trim();

    if (!text && pdfUpload.files.length > 0) {
      const file = pdfUpload.files[0];
      text = await extractTextFromPDF(file);
    }

    if (!text) {
      alert('Please paste some text or upload a PDF.');
      loading.style.display = 'none';
      return;
    }

try {
  const response = await fetch('summarize.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: text })
  });

  const textResult = await response.text();

  let data;
  try {
    data = JSON.parse(textResult);
  } catch (e) {
    throw new Error("Server error:\n" + textResult);
  }

  if (data.error) {
    output.textContent = '❌ Error: ' + data.error;
  } else {
    output.textContent = data.summary || '[No summary returned]';
  }
} catch (err) {
  output.textContent = '❌ Error: ' + err.message;
}

  })

  async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      text += pageText + '\n';
    }

    return text;
  }
});
