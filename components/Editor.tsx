import React, { useState } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { Loader2, Send, Upload, Sparkles, AlertCircle } from 'lucide-react';

interface EditorProps {
  sourceImage: string;
  setSourceImage: (img: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ sourceImage, setSourceImage }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setGeneratedImage(null); // Reset generated on new upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !sourceImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Use the *latest* valid image as the source for the next edit.
      // If we already generated one, we can chain edits (optional), 
      // but for stability, let's stick to source or allow user to "Adopt" the new image.
      const imageToEdit = sourceImage; 
      
      const resultBase64 = await editImageWithGemini(imageToEdit, prompt);
      setGeneratedImage(resultBase64);
    } catch (err: any) {
      setError(err.message || "Failed to generate image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdoptImage = () => {
    if (generatedImage) {
      setSourceImage(generatedImage);
      setGeneratedImage(null);
      setPrompt('');
    }
  };

  return (
    <div className="h-full flex flex-col p-4 gap-6 max-w-4xl mx-auto w-full">
      
      {/* Header/Instructions */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          AI Fashion Designer
        </h2>
        <p className="text-gray-400 text-sm">
          Upload a doll photo and describe changes (e.g., "Add a red ballgown", "Give her blonde hair").
        </p>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        
        {/* Source Image */}
        <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 p-4 flex flex-col items-center justify-center relative overflow-hidden group">
          {sourceImage ? (
            <>
              <img 
                src={sourceImage} 
                alt="Source" 
                className="max-h-[50vh] object-contain rounded-lg shadow-lg"
              />
               <label className="absolute bottom-4 right-4 bg-black/70 hover:bg-pink-600 text-white p-2 rounded-full cursor-pointer transition-colors backdrop-blur-sm">
                  <Upload size={20} />
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
               </label>
            </>
          ) : (
             <label className="cursor-pointer flex flex-col items-center gap-3 text-gray-500 hover:text-pink-400 transition-colors">
                <Upload size={48} />
                <span className="font-medium">Upload Base Image</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
             </label>
          )}
          <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white font-mono">ORIGINAL</div>
        </div>

        {/* Result Image */}
        <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 p-4 flex flex-col items-center justify-center relative min-h-[300px]">
           {isProcessing ? (
             <div className="flex flex-col items-center gap-3 text-pink-400 animate-pulse">
               <Loader2 size={48} className="animate-spin" />
               <span className="text-sm font-medium">Designing...</span>
             </div>
           ) : generatedImage ? (
             <>
               <img 
                src={generatedImage} 
                alt="Generated" 
                className="max-h-[50vh] object-contain rounded-lg shadow-lg border border-pink-500/30"
               />
               <div className="absolute top-2 left-2 bg-pink-600 px-2 py-1 rounded text-xs text-white font-mono shadow-lg shadow-pink-900/50">AI GENERATED</div>
               
               <button 
                onClick={handleAdoptImage}
                className="absolute bottom-4 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all transform hover:scale-105"
               >
                 Use as New Base
               </button>
             </>
           ) : (
             <div className="text-gray-600 flex flex-col items-center">
               <Sparkles size={48} className="opacity-20" />
               <span className="mt-2 text-sm">Result will appear here</span>
             </div>
           )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-gray-800 p-2 rounded-2xl border border-gray-700 flex gap-2 shadow-xl">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your design (e.g., 'Make the hair blue and long', 'Add a floral dress')..." 
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 px-4"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button 
          onClick={handleGenerate}
          disabled={!sourceImage || isProcessing || !prompt.trim()}
          className="bg-pink-600 hover:bg-pink-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
        >
          {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg text-sm border border-red-900/50">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};