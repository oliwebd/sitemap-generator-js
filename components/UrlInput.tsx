import React from 'react';
import { SpinnerIcon } from './icons';

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  maxDepth: number;
  setMaxDepth: (depth: number) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ url, setUrl, onSubmit, isLoading, maxDepth, setMaxDepth }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-grow bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center bg-blue-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Crawling...
            </>
          ) : (
            'Generate Sitemap'
          )}
        </button>
      </div>
      <div className="flex items-center gap-3">
          <label htmlFor="max-depth" className="font-medium text-gray-400">
              Crawl Depth
          </label>
          <input
              id="max-depth"
              type="number"
              value={maxDepth}
              onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value, 10) || 0);
                  if (value <= 5) {
                    setMaxDepth(value);
                  }
              }}
              min="0"
              max="5"
              className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
              disabled={isLoading}
          />
          <p className="text-sm text-gray-500 hidden sm:block">(e.g., 2 levels deep. Max 5)</p>
      </div>
    </form>
  );
};

export default UrlInput;
