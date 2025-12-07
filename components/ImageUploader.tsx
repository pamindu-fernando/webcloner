import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { Button } from './Button';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: string | null;
  onClear: () => void;
  isProcessing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  selectedImage, 
  onClear,
  isProcessing 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative group w-full max-w-lg mx-auto rounded-xl overflow-hidden border border-gray-700 bg-gray-800/50 shadow-2xl">
        <img 
          src={selectedImage} 
          alt="Upload preview" 
          className="w-full h-auto object-cover max-h-[400px]"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          {!isProcessing && (
            <Button variant="secondary" onClick={onClear} icon={<X className="w-4 h-4" />}>
              Remove Image
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full max-w-lg mx-auto border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
        isDragging 
          ? 'border-blue-500 bg-blue-500/10 scale-102' 
          : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-gray-800 rounded-full ring-8 ring-gray-800/50">
          <UploadCloud className="w-8 h-8 text-blue-400" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-white">
            Upload a screenshot
          </p>
          <p className="text-sm text-gray-400">
            Drag and drop or click to browse
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ImageIcon className="w-3 h-3" />
          <span>Supports PNG, JPG, WebP</span>
        </div>
      </div>
    </div>
  );
};