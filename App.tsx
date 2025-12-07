import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PreviewWindow } from './components/PreviewWindow';
import { Button } from './components/Button';
import { fileToBase64, generateWebsiteFromImage } from './services/geminiService';
import { AppStatus } from './types';
import { Wand2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setSelectedImage(`data:${file.type};base64,${base64}`); // Prefix for display
      setStatus(AppStatus.IDLE); // Reset status if a new image is selected
      setError(null);
      setGeneratedCode('');
    } catch (e) {
      console.error("Error reading file:", e);
      setError("Failed to process image.");
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    // The stored selectedImage includes the "data:..." prefix, which we need to strip for the API 
    // BUT the fileToBase64 helper I wrote in the service already strips it for the API call?
    // Let's check `geminiService`. Ah, `generateWebsiteFromImage` expects the raw base64.
    // The `selectedImage` state currently has the data prefix.
    
    const base64Data = selectedImage.split(',')[1];

    setStatus(AppStatus.GENERATING);
    setError(null);

    try {
      const code = await generateWebsiteFromImage(base64Data);
      setGeneratedCode(code);
      setStatus(AppStatus.SUCCESS);
    } catch (e: any) {
      console.error(e);
      setStatus(AppStatus.ERROR);
      setError(e.message || "Failed to generate code. Please try again.");
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setGeneratedCode('');
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* Left Panel: Input */}
        <div className={`flex flex-col gap-6 transition-all duration-500 ease-in-out ${generatedCode ? 'lg:w-1/3 w-full' : 'w-full max-w-3xl mx-auto mt-12'}`}>
          
          <div className="space-y-2">
             <h2 className={`font-bold text-white tracking-tight transition-all ${generatedCode ? 'text-2xl' : 'text-3xl sm:text-4xl text-center mb-8'}`}>
              {generatedCode ? 'Configuration' : 'Turn Screenshots into Code'}
             </h2>
             {!generatedCode && (
               <p className="text-gray-400 text-center max-w-lg mx-auto">
                 Upload a design screenshot and let Gemini generate the responsive Tailwind code for you in seconds.
               </p>
             )}
          </div>

          <div className="bg-gray-800/30 border border-gray-700/50 p-6 rounded-2xl backdrop-blur-sm">
            <ImageUploader 
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClear={handleClear}
              isProcessing={status === AppStatus.GENERATING}
            />

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div className="mt-6">
              <Button 
                onClick={handleGenerate} 
                disabled={!selectedImage || status === AppStatus.GENERATING}
                isLoading={status === AppStatus.GENERATING}
                className="w-full h-12 text-base shadow-lg shadow-blue-500/20"
                icon={<Wand2 className="w-5 h-5" />}
              >
                {status === AppStatus.GENERATING ? 'Generating Code...' : 'Generate Website'}
              </Button>
            </div>
            
            {status === AppStatus.GENERATING && (
                <div className="mt-6 space-y-3">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 animate-progress"></div>
                    </div>
                    <p className="text-xs text-center text-gray-400 animate-pulse">
                        Analyzing layout structure... identifying components... writing Tailwind classes...
                    </p>
                </div>
            )}
          </div>
          
          {/* Instructions / Tips when in full view */}
          {!generatedCode && (
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-8">
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
                    <div className="font-semibold text-white mb-1">1. Upload</div>
                    <div className="text-xs text-gray-400">Drag & drop a screenshot of any website section.</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
                    <div className="font-semibold text-white mb-1">2. Process</div>
                    <div className="text-xs text-gray-400">Gemini Vision analyzes the layout and styling.</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
                    <div className="font-semibold text-white mb-1">3. Code</div>
                    <div className="text-xs text-gray-400">Get ready-to-use HTML & Tailwind CSS.</div>
                </div>
             </div>
          )}
        </div>

        {/* Right Panel: Output */}
        {generatedCode && (
          <div className="flex-1 min-h-[500px] lg:h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-8 duration-700">
            <PreviewWindow code={generatedCode} />
          </div>
        )}

      </main>
      
      {/* Footer when empty */}
      {!generatedCode && (
         <footer className="py-6 text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} Screen2Code. Built with Gemini 2.5 Flash & React.</p>
         </footer>
      )}

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 95%; }
        }
        .animate-progress {
          animation: progress 8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;