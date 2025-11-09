
import React from 'react';
import { DownloadIcon } from './icons';

interface SitemapOutputProps {
  xml: string;
  onDownload: () => void;
}

const SitemapOutput: React.FC<SitemapOutputProps> = ({ xml, onDownload }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl shadow-black/20 border border-gray-700 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-200">Generated Sitemap</h2>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 bg-green-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
        >
          <DownloadIcon className="w-5 h-5" />
          Download sitemap.xml
        </button>
      </div>
      <textarea
        readOnly
        value={xml}
        className="w-full h-96 bg-gray-900/50 border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};

export default SitemapOutput;
