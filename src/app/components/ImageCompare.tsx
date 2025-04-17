'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import { FaExchangeAlt, FaCheckCircle, FaSpinner, FaClock } from 'react-icons/fa';

interface ComparisonResult {
  similarity: number;
  faceMatch: number;
  clothMatch: number;
  backgroundMatch: number;
  predictedAge1: number;
  predictedAge2: number;
  comment: string;
  processingTimeMs?: number;
}

const ImageCompare: React.FC = () => {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  
  // Simulate progress when comparing images
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isComparing) {
      // Start at 5% to show immediate feedback
      setLoadingProgress(5);
      
      // Gradually increase to 90% over 5 seconds
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          // Don't go over 90% - final result will push to 100%
          if (prev < 90) {
            return prev + Math.random() * 3;
          }
          return prev;
        });
      }, 200);
    } else {
      // Complete the progress or reset it
      setLoadingProgress(result ? 100 : 0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isComparing, result]);

  const handleCompare = async () => {
    if (!image1 || !image2) {
      setError('Please upload both images first');
      return;
    }

    setIsComparing(true);
    setError(null);
    setResult(null);

    try {
      // Optimize the image data before sending
      const optimizedImage1 = optimizeImageData(image1);
      const optimizedImage2 = optimizeImageData(image2);
      
      const startTime = Date.now();
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image1: optimizedImage1,
          image2: optimizedImage2,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to compare images');
      }

      const data = await response.json();
      
      // Calculate total time including frontend processing
      const totalTime = Date.now() - startTime;
      
      setResult({
        ...data,
        // Use server processing time if available, otherwise use client-side time
        processingTimeMs: data.processingTimeMs || totalTime
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during comparison');
    } finally {
      setIsComparing(false);
    }
  };
  
  // Helper function to optimize image data
  const optimizeImageData = (imageData: string): string => {
    // If it's already a base64 without metadata, return as is
    if (!imageData.includes('data:image')) return imageData;
    
    // Extract the base64 data
    return imageData.split('base64,')[1];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">PhotoMatch AI</h1>
        <p className="text-gray-600 text-center mb-8">
          Upload two photos to compare their similarity using advanced AI analysis
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">First Photo</h2>
            <ImageUpload
              onImageSelect={setImage1}
              selectedImage={image1}
              className="min-h-[300px]"
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Second Photo</h2>
            <ImageUpload
              onImageSelect={setImage2}
              selectedImage={image2}
              className="min-h-[300px]"
            />
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <button
            onClick={handleCompare}
            disabled={!image1 || !image2 || isComparing}
            className={`
              flex items-center px-8 py-4 rounded-full text-lg font-semibold
              transition-all duration-200 mb-4
              ${
                !image1 || !image2 || isComparing
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }
            `}
          >
            {isComparing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <FaExchangeAlt className="mr-2" />
                Compare Photos
              </>
            )}
          </button>
          
          {isComparing && (
            <div className="w-full max-w-md">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                      Processing
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-green-600">
                      {Math.round(loadingProgress)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                  <div 
                    style={{ width: `${loadingProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500 ease-out"
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-center">Analyzing facial features and comparing photos...</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span className="text-2xl font-bold">
                    {result.similarity.toFixed(1)}% Match
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Face Match: {result.faceMatch.toFixed(1)}%
                  </p>
                  <p className="text-gray-600">
                    Clothing Match: {result.clothMatch.toFixed(1)}%
                  </p>
                  <p className="text-gray-600">
                    Background Match: {result.backgroundMatch.toFixed(1)}%
                  </p>
                  {result.processingTimeMs && (
                    <p className="text-gray-500 text-sm flex items-center mt-2">
                      <FaClock className="mr-1" /> 
                      Processing time: {(result.processingTimeMs / 1000).toFixed(1)}s
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Age Prediction</h3>
                <p className="text-gray-600">Photo 1: ~{result.predictedAge1} years</p>
                <p className="text-gray-600">Photo 2: ~{result.predictedAge2} years</p>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">AI Analysis</h3>
                  <p className="text-gray-600">{result.comment}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCompare; 