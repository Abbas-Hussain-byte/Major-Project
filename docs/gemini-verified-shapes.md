# Verified API Shapes: Gemini

**Verification Date:** 2026-09-30
**Base URL:** `https://generativelanguage.googleapis.com/v1beta`

## 1. Embeddings (gemini-embedding-2)

**Endpoint:** POST `/models/gemini-embedding-2:embedContent?key=YOUR_KEY`

**Request Payload:**
```json
{
  "model": "models/gemini-embedding-2",
  "content": {
    "parts": [
      { "text": "Insurance is a contract..." }
    ]
  },
  "taskType": "RETRIEVAL_DOCUMENT", 
  "outputDimensionality": 256
}
```
**Notes on Task Types:**
- `RETRIEVAL_DOCUMENT`: Used when storing chunks in the database.
- `RETRIEVAL_QUERY`: Used when querying the database.
- *Testing confirmed that `taskType` acts identically to the omitted fallback for basic text, but it is explicitly supported by the API.*
- *Testing confirmed that `outputDimensionality: 256` correctly truncates the vector to 256 dimensions (the default is 3072).*

**Response:**
```json
{
  "embedding": {
    "values": [0.02989, 0.0386, ...]
  }
}
```

## 2. Text Generation (gemini-2.5-flash)

**Endpoint:** POST `/models/gemini-2.5-flash:generateContent?key=YOUR_KEY`

**Request Payload:**
```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "System instructions here...\\n\\nUser query here" }
      ]
    }
  ],
  "generationConfig": {
    "maxOutputTokens": 1024,
    "temperature": 0.2
  }
}
```
*(Optionally, use `systemInstruction` at the top level instead of prepending, depending on exact API library version. Prepending is fully supported via plain REST).*
