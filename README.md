# FaceDetect - AI Face Analysis Application

An AI-powered web application for facial analysis and face comparison using face-api.js. This application provides two main features:

1. **Photo Analyzer**: Analyzes a single photo and provides fun insights about expression, style, and mood
2. **Image Compare**: Compares two faces to determine similarity percentage and provides analysis

## 🚀 Setup and Installation

### Prerequisites

- Node.js 16+ and npm
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/your-username/facedetect.git
cd facedetect
```

2. Install dependencies:
```bash
npm install
```

3. Download the model files (required):
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

cd ../..
```

4. Create a `.env.local` file in the root directory and add your environment variables:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics ID (optional)
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Create a production build:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## 📋 Important Notes

### About Model Files

- The face detection model files are **not included** in the Git repository due to their large size (~250MB).
- You must download them separately using the instructions above.
- Without these files, the application will not function properly.
- See `public/models/README.md` for more details.

### .gitignore Configuration

This project uses a `.gitignore` file to exclude:
- Model files in `/public/models/`
- `node_modules` directory
- Build artifacts
- Environment files

## 🧩 Features

- **Photo Analysis**: Upload a photo and get AI-generated insights
- **Face Comparison**: Compare two faces and get a similarity score
- **Responsive Design**: Works on desktop and mobile devices
- **Optimized Performance**: Fast analysis with progress indicators

## 🛠️ Technologies Used

- Next.js 14
- React
- TypeScript
- TailwindCSS
- face-api.js
- Canvas API

## 📱 Hosting

To host this application, follow these additional steps:

1. Build the project locally
2. Set up a hosting service (Vercel, Netlify, etc.)
3. Deploy with the model files in place
4. Configure environment variables on your hosting platform

## 📄 License

MIT 