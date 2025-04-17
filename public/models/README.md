# Face Detection Models

This directory contains model files required for face-api.js to function properly. These files are excluded from Git due to their large size.

## Required Models

The following models should be downloaded and placed in this directory:

- `face_landmark_68_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_recognition_model-shard1`
- `face_recognition_model-shard2`
- `face_recognition_model-weights_manifest.json`
- `ssd_mobilenetv1_model-shard1`
- `ssd_mobilenetv1_model-shard2`
- `ssd_mobilenetv1_model-weights_manifest.json`

## How to Download

You can download these models using one of the following methods:

### Option 1: Download from face-api.js CDN

Run the following commands from the project root directory:

```bash
mkdir -p public/models
cd public/models

# Face detection model
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard1
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard2

# Face landmark model
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

# Face recognition model
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2
```

### Option 2: Download from External Link

[Download the models from this link](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)

## Important Note

The application will not function correctly without these model files. Make sure to download them before running the application. 