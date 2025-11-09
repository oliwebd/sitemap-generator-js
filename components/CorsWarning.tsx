
import React from 'react';
import { WarningIcon } from './icons';

const CorsWarning: React.FC = () => {
  return (
    <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-xl relative" role="alert">
      <div className="flex">
        <div className="py-1">
            <WarningIcon className="w-6 h-6 text-yellow-400 mr-4"/>
        </div>
        <div>
          <strong className="font-bold">Important Note on CORS Policy</strong>
          <p className="block sm:inline sm:ml-2 text-yellow-400">
            This tool runs entirely in your browser. Due to security restrictions, it can only crawl websites that permit cross-origin requests. Most sites do not allow this, so the tool may not work on them.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorsWarning;
