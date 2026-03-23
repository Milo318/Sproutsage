
import React, { useState, useRef, useCallback } from 'react';
import { analyzePlantIssue } from '../services/geminiService';
import { PlantIssueInfo } from '../types';
import IssueResultCard from './IssueResultCard';

const IssueIdentifier: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlantIssueInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImage(base64);
      setResult(null);
      setError(null);
      processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64: string) => {
    setLoading(true);
    setError(null);
    try {
      const base64Data = base64.split(',')[1];
      const info = await analyzePlantIssue(base64Data);
      setResult(info);
    } catch (err: any) {
      setError("I couldn't diagnose this issue. Please ensure the affected parts are clearly visible in the photo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!image && !result && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-stethoscope text-rose-400 text-3xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Plant Health Check</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Upload a photo of spots, discoloration, pests, or wilting for an instant diagnosis with treatment options.</p>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`max-w-lg mx-auto border-2 border-dashed rounded-3xl p-10 transition-all cursor-pointer ${
              isDragging 
                ? 'border-rose-400 bg-rose-50' 
                : 'border-rose-200 bg-white hover:border-rose-300 hover:bg-rose-50/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className={`fa-solid ${isDragging ? 'fa-cloud-arrow-down' : 'fa-microscope'} text-rose-500 text-xl`}></i>
            </div>
            <p className="font-bold text-gray-800 mb-1">
              {isDragging ? 'Drop your photo here' : 'Drag & drop a photo here'}
            </p>
            <p className="text-sm text-gray-400 mb-4">Show affected plant parts clearly</p>
            <div className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-rose-200">
              <i className="fa-solid fa-file-medical"></i>
              Upload Photo
            </div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: 'fa-circle', text: 'Spots' },
              { icon: 'fa-palette', text: 'Discoloration' },
              { icon: 'fa-bug', text: 'Pests' },
              { icon: 'fa-droplet-slash', text: 'Wilting' },
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
                <i className={`fa-solid ${item.icon}`}></i>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-rose-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fa-solid fa-microscope text-rose-500 animate-pulse text-xl"></i>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Running diagnosis...</h2>
          <p className="text-gray-500 text-sm mt-1">Checking symptoms against botanical pathology database</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-8 rounded-3xl text-center mb-8 border border-red-100 max-w-lg mx-auto">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-circle-exclamation text-red-500 text-xl"></i>
          </div>
          <p className="text-red-800 font-medium mb-4">{error}</p>
          <button 
            onClick={() => { setImage(null); setResult(null); setError(null); }}
            className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-rose-700 transition-all"
          >
            Try Another Photo
          </button>
        </div>
      )}

      {result && image && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-rose-50 p-4 rounded-2xl">
            <button 
              onClick={() => { setImage(null); setResult(null); }}
              className="text-rose-700 font-bold text-sm flex items-center gap-2 hover:text-rose-800"
            >
              <i className="fa-solid fa-arrow-left"></i>
              New Diagnosis
            </button>
            <span className="text-[10px] font-bold text-rose-600 bg-white px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <i className="fa-solid fa-check-circle"></i>
              Report Ready
            </span>
          </div>

          <IssueResultCard issue={result} imageUrl={image} />
        </div>
      )}
    </div>
  );
};

export default IssueIdentifier;
