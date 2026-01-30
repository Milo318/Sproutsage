
import React, { useState, useRef } from 'react';
import { analyzePlantIssue } from '../services/geminiService';
import { PlantIssueInfo } from '../types';
import IssueResultCard from './IssueResultCard';

const IssueIdentifier: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlantIssueInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImage(base64);
        setResult(null);
        setError(null);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64: string) => {
    setLoading(true);
    setError(null);
    try {
      const base64Data = base64.split(',')[1];
      const info = await analyzePlantIssue(base64Data);
      setResult(info);
    } catch (err: any) {
      setError("I couldn't diagnose this issue. Please ensure the affected parts of the plant are clearly visible.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!image && !result && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-rose-200">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-stethoscope text-rose-500 text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Plant Diagnosis</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Upload a photo of spots, discoloration, or pests on your plant for a professional diagnosis and treatment plan.</p>
          
          <button 
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.value = '';
              fileInputRef.current?.click();
            }}
            className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95 flex items-center gap-2 mx-auto"
          >
            <i className="fa-solid fa-file-medical"></i>
            Analyze Affected Plant
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-rose-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <i className="fa-solid fa-microscope text-rose-500 animate-pulse"></i>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Diagnosing issue...</h2>
          <p className="text-gray-500">Checking botanical pathology database and comparing symptoms...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-6 rounded-2xl text-center mb-8 border border-red-100">
          <i className="fa-solid fa-circle-exclamation text-red-500 text-3xl mb-4"></i>
          <p className="text-red-800 font-medium mb-4">{error}</p>
          <button 
            onClick={() => { setImage(null); setResult(null); setError(null); }}
            className="text-rose-700 font-bold hover:underline"
          >
            Try Another Photo
          </button>
        </div>
      )}

      {result && image && !loading && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-rose-50 p-4 rounded-2xl">
             <button 
               onClick={() => { setImage(null); setResult(null); }}
               className="text-rose-700 font-bold text-sm flex items-center gap-2"
             >
               <i className="fa-solid fa-arrow-left"></i>
               New Diagnosis
             </button>
             <span className="text-xs font-bold text-rose-600 bg-white px-3 py-1 rounded-full uppercase tracking-wider">Health Report Ready</span>
          </div>

          <IssueResultCard issue={result} imageUrl={image} />
        </div>
      )}
    </div>
  );
};

export default IssueIdentifier;
