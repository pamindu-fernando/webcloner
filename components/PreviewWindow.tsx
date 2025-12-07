import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Code, Eye, Copy, Check, Download } from 'lucide-react';
import { ViewMode } from '../types';

interface PreviewWindowProps {
  code: string;
}

export const PreviewWindow: React.FC<PreviewWindowProps> = ({ code }) => {
  const [activeTab, setActiveTab] = useState<ViewMode>('preview');
  const [viewportWidth, setViewportWidth] = useState('100%');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'preview' 
                ? 'bg-gray-700 text-white shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'code' 
                ? 'bg-gray-700 text-white shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
        </div>

        {activeTab === 'preview' && (
          <div className="flex items-center gap-2 hidden sm:flex">
             <span className="text-xs text-gray-500 mr-2 uppercase tracking-wider font-semibold">Viewport</span>
            <button 
              onClick={() => setViewportWidth('375px')}
              className={`p-2 rounded-lg hover:bg-gray-800 transition-colors ${viewportWidth === '375px' ? 'text-blue-400 bg-gray-800' : 'text-gray-400'}`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewportWidth('768px')}
              className={`p-2 rounded-lg hover:bg-gray-800 transition-colors ${viewportWidth === '768px' ? 'text-blue-400 bg-gray-800' : 'text-gray-400'}`}
              title="Tablet (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
             <button 
              onClick={() => setViewportWidth('100%')}
              className={`p-2 rounded-lg hover:bg-gray-800 transition-colors ${viewportWidth === '100%' ? 'text-blue-400 bg-gray-800' : 'text-gray-400'}`}
              title="Desktop (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
            <button 
                onClick={downloadCode}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Download HTML"
            >
                <Download className="w-4 h-4" />
            </button>
            <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gray-950 overflow-hidden relative">
        {activeTab === 'preview' ? (
          <div className="w-full h-full flex justify-center bg-gray-800/50 overflow-y-auto p-4">
            <div 
                className="bg-white transition-all duration-500 ease-in-out shadow-2xl origin-top" 
                style={{ width: viewportWidth, height: '100%', minHeight: '800px' }}
            >
                <iframe 
                    srcDoc={code} 
                    className="w-full h-full border-0"
                    title="Preview"
                    sandbox="allow-scripts" // Allow scripts for standard interactive elements if needed, but restrict others
                />
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-auto custom-scrollbar">
            <pre className="p-4 text-sm font-mono text-gray-300 leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};