'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FiUpload } from 'react-icons/fi';

interface AnalysisResult {
  analysis: string;
}

export default function ImageAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    setResult(null);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: selectedImage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data: AnalysisResult = await response.json();
      setResult(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatAnalysis = (analysis: string) => {
    return analysis.split('\n').map((line, index) => (
      <p key={index} className="mb-2">
        {line}
      </p>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('imageInput')?.click()}
      >
        <input
          type="file"
          id="imageInput"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {selectedImage ? (
          <div className="relative w-full aspect-video">
            <Image
              src={selectedImage}
              alt="Selected"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <FiUpload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500">
              Drag and drop an image here, or click to select
            </p>
          </div>
        )}
      </div>

      <button
        onClick={analyzeImage}
        disabled={!selectedImage || isAnalyzing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          !selectedImage || isAnalyzing
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-white shadow-lg rounded-lg">
          {formatAnalysis(result)}
        </div>
      )}
    </div>
  );
} 