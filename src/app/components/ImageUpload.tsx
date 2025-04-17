'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaImage, FaTimesCircle } from 'react-icons/fa';

interface ImageUploadProps {
  onImageSelect: (base64: string | null) => void;
  selectedImage: string | null;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  className = '',
}) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];

      if (!file) {
        setError('Please select a valid image file');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      try {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          onImageSelect(base64);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Error processing image');
        console.error('Error processing image:', err);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
  });

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onImageSelect(null);
      setError(null);
    },
    [onImageSelect]
  );

  return (
    <div
      {...getRootProps()}
      className={`
        relative cursor-pointer border-2 border-dashed rounded-lg
        transition-all duration-200
        ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'}
        ${className}
      `}
    >
      <input {...getInputProps()} />
      
      {selectedImage ? (
        <div className="relative h-full">
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full h-full object-contain rounded-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
          >
            <FaTimesCircle size={24} />
          </button>
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity rounded-lg" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FaImage className="text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag and drop an image here, or click to select'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Supports JPG, PNG, GIF, WEBP
          </p>
        </div>
      )}

      {error && (
        <div className="absolute bottom-2 left-2 right-2 bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 