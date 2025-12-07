import React from 'react';
import { Code2, Github, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Screen2<span className="text-blue-500">Code</span></span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-medium text-blue-400">Powered by Gemini 2.5</span>
             </div>
             <a href="#" className="text-gray-400 hover:text-white transition-colors">
               <Github className="w-5 h-5" />
             </a>
          </div>
        </div>
      </div>
    </header>
  );
};