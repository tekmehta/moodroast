'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import { FaMagic, FaSpinner, FaClock } from 'react-icons/fa';

interface AnalysisResult {
  analysis: string;
  details?: {
    processingTimeMs?: number;
    faceDetected: boolean;
    expression: string;
  };
}

const PhotoAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Simulate progress when analyzing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
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
  }, [isAnalyzing, result]);

  const handleAnalyze = async () => {
    if (!image) {
      setError('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Optimize the image data before sending
      const optimizedImage = image.includes('base64,') 
        ? image.split('base64,')[1] 
        : image;

      const startTime = Date.now();
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          imageData: optimizedImage,
        }),
      });

      // First check if the response is ok
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to analyze image');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      // Try to parse the JSON response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid response from server');
      }

      if (!data || !data.analysis) {
        throw new Error('Invalid response format from server');
      }

      // Calculate total time including frontend processing
      const totalTime = Date.now() - startTime;
      
      // If the server didn't provide processing time, use client-side time
      if (data.details && !data.details.processingTimeMs) {
        data.details.processingTimeMs = totalTime;
      }

      setResult(data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatAnalysis = (analysis: string) => {
    const comments = analysis.split('\n').filter(line => line.trim() !== '');
    const commentTypes = ['Funny Take', 'Attitude Check', 'Style Analysis', 'Mood Reader', 'Vibe Check'];
    const bgColors = ['bg-purple-50', 'bg-pink-50', 'bg-blue-50', 'bg-green-50', 'bg-yellow-50'];
    const textColors = ['text-purple-700', 'text-pink-700', 'text-blue-700', 'text-green-700', 'text-yellow-700'];

    return comments.map((comment, index) => {
      if (index >= commentTypes.length) return null;
      return (
        <div key={index} className={`p-4 ${bgColors[index]} rounded-lg`}>
          <h4 className={`font-semibold ${textColors[index]} mb-2`}>{commentTypes[index]}</h4>
          <p className="text-gray-700">{comment.replace(/^\d+\.\s*/, '')}</p>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">AI Photo Comments</h1>
        <p className="text-gray-600 text-center mb-8">
          Upload a photo and let AI generate fun and creative comments about it!
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Photo</h2>
          <ImageUpload
            onImageSelect={setImage}
            selectedImage={image}
            className="min-h-[300px]"
          />
        </div>

        <div className="flex flex-col items-center mb-8">
          <button
            onClick={handleAnalyze}
            disabled={!image || isAnalyzing}
            className={`
              flex items-center px-8 py-4 rounded-full text-lg font-semibold
              transition-all duration-200 mb-4
              ${
                !image || isAnalyzing
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }
            `}
          >
            {isAnalyzing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <FaMagic className="mr-2" />
                Analyze Photo
              </>
            )}
          </button>
          
          {isAnalyzing && (
            <div className="w-full max-w-md">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                      Processing
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-purple-600">
                      {Math.round(loadingProgress)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                  <div 
                    style={{ width: `${loadingProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500 ease-out"
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-center">Analyzing facial features and generating insights...</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
            {error}
          </div>
        )}

        {result && result.analysis && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold mb-4 text-center text-purple-600">
              AI Comments
            </h3>
            {result.details?.processingTimeMs && (
              <p className="text-gray-500 text-sm flex items-center justify-center mb-6">
                <FaClock className="mr-1" /> 
                Analysis completed in {(result.details.processingTimeMs / 1000).toFixed(1)}s
              </p>
            )}
            <div className="space-y-6">
              {formatAnalysis(result.analysis)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoAnalyzer; 