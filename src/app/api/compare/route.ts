import { NextResponse } from 'next/server';
import * as faceapi from 'face-api.js';
import { Canvas, Image, loadImage } from 'canvas';
import path from 'path';

// Initialize face-api.js with proper type casting
faceapi.env.monkeyPatch({ Canvas: Canvas as any, Image: Image as any });

// Cache for loaded models
let modelsLoaded = false;
// Global model path
const modelPath = path.join(process.cwd(), 'public/models');

// Load models only once at server startup
const loadModels = async () => {
  if (modelsLoaded) return;
  
  try {
    // Load models in parallel
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath)
    ]);
    
    modelsLoaded = true;
    console.log('Face-API models loaded successfully');
  } catch (error) {
    console.error('Error loading models:', error);
    throw new Error('Failed to load face detection models');
  }
};

// Try to preload models when the file is first imported
loadModels().catch(err => console.warn('Preloading models failed:', err));

// Optimize image processing
const getFaceDescriptor = async (imageData: string) => {
  try {
    // Remove data URL prefix more efficiently
    const base64Data = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;
    
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Load image
    const img = await loadImage(buffer);
    
    // Use faster detection with lower minConfidence
    const detection = await faceapi
      .detectSingleFace(img as any, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 }))
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new Error('No face detected in image');
    }

    return detection.descriptor;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

export async function POST(req: Request) {
  try {
    const { image1, image2 } = await req.json();

    if (!image1 || !image2) {
      return NextResponse.json(
        { error: 'Both images are required' },
        { status: 400 }
      );
    }

    // Ensure models are loaded
    if (!modelsLoaded) {
      await loadModels();
    }

    // Process both images in parallel
    const startTime = Date.now();
    const [descriptor1, descriptor2] = await Promise.all([
      getFaceDescriptor(image1),
      getFaceDescriptor(image2)
    ]).catch((error) => {
      throw new Error('Failed to detect faces: ' + error.message);
    });
    
    const processingTime = Date.now() - startTime;
    console.log(`Face detection completed in ${processingTime}ms`);

    if (!descriptor1 || !descriptor2) {
      return NextResponse.json(
        { error: 'Could not detect faces in one or both images' },
        { status: 400 }
      );
    }

    // Calculate face similarity
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    const faceMatch = Math.max(0, Math.min(100, (1 - distance) * 100));

    const result = {
      similarity: faceMatch,
      faceMatch: faceMatch,
      clothMatch: Math.random() * 40 + 60, // Still using mock data for clothing
      backgroundMatch: Math.random() * 50 + 50, // Still using mock data for background
      predictedAge1: Math.floor(Math.random() * 30 + 20), // Still using mock data for age
      predictedAge2: Math.floor(Math.random() * 30 + 20), // Still using mock data for age
      comment: `The faces are ${faceMatch.toFixed(1)}% similar. ${
        faceMatch > 80
          ? 'These images appear to be of the same person.'
          : 'These images appear to be of different people.'
      }`,
      processingTimeMs: processingTime
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing images:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process images' },
      { status: 500 }
    );
  }
} 