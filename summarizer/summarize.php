<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Read the raw JSON input
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if ($data === null) {
    echo json_encode(['error' => 'Invalid JSON input', 'raw' => $raw]);
    exit;
}

// Check if prompt exists
if (!isset($data['prompt']) || empty(trim($data['prompt']))) {
    echo json_encode(['error' => 'No prompt provided']);
    exit;
}

// Prepare the prompt
$prompt = $data['prompt'];

// Setup Ollama request
$payload = [
    "model" => "mistral",
    "prompt" => "Summarize the following:\n\n" . $prompt,
    "stream" => false
];

$ch = curl_init('http://localhost:11434/api/generate');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);

// Check for curl or HTTP error
if (curl_errno($ch)) {
    echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(['error' => 'Ollama API error. Code: ' . $httpCode]);
    exit;
}

// Ollama streams back data in lines (one JSON object per line), take the last one
$lines = explode("\n", $response);
$lastLine = '';
foreach ($lines as $line) {
    if (trim($line)) {
        $obj = json_decode($line, true);
        if (isset($obj['response'])) {
            $lastLine .= $obj['response'];
        }
    }
}

echo json_encode(['summary' => $lastLine]);
