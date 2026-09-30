# Verified API Shapes: Bhashini (MeitY Dhruva)

**Verification Date:** 2026-09-30
**Base URL:** `https://dhruva-api.bhashini.gov.in`

## 1. Authentication & Config
Bhashini requires two steps: fetching the compute pipeline configuration, then performing the inference.

**Headers Required:**
```json
{
  "Authorization": "YOUR_API_KEY",
  "Content-Type": "application/json"
}
```

## 2. ASR (Speech-to-Text)
**Endpoint:** POST `/services/inference/pipeline`
**Request Payload:**
```json
{
  "pipelineTasks": [
    {
      "taskType": "asr",
      "config": {
        "language": {
          "sourceLanguage": "te"
        },
        "serviceId": "ai4bharat/conformer-te-gpu--t4",
        "audioFormat": "wav",
        "samplingRate": 16000
      }
    }
  ],
  "inputData": {
    "audio": [
      {
        "audioContent": "BASE64_ENCODED_AUDIO"
      }
    ]
  }
}
```

## 3. NMT (Translation)
**Endpoint:** POST `/services/inference/pipeline`
**Request Payload:**
```json
{
  "pipelineTasks": [
    {
      "taskType": "translation",
      "config": {
        "language": {
          "sourceLanguage": "te",
          "targetLanguage": "en"
        },
        "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
      }
    }
  ],
  "inputData": {
    "input": [
      {
        "source": "నమస్కారం"
      }
    ]
  }
}
```

## 4. TTS (Text-to-Speech)
**Endpoint:** POST `/services/inference/pipeline`
**Request Payload:**
```json
{
  "pipelineTasks": [
    {
      "taskType": "tts",
      "config": {
        "language": {
          "sourceLanguage": "te"
        },
        "serviceId": "ai4bharat/indic-tts-te-gpu--t4",
        "gender": "female"
      }
    }
  ],
  "inputData": {
    "input": [
      {
        "source": "నమస్కారం"
      }
    ]
  }
}
```

**Note:** The exact `serviceId` strings are dynamically fetched via a configuration call (`/services/inference/pipeline`) specifying the user's `PIPELINE_ID` provided in the Bhashini dashboard.
