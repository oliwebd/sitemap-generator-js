
import React from 'react';
import { CrawlStatus } from '../types';

interface StatusIndicatorProps {
  status: CrawlStatus;
  error: string | null;
  crawledCount: number;
  currentUrl: string | null;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, error, crawledCount, currentUrl }) => {
  if (status === CrawlStatus.IDLE) return null;

  return (
    <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 min-h-[5rem]">
      {status === CrawlStatus.ERROR && error && (
        <div className="text-red-400 font-medium">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      {status === CrawlStatus.CRAWLING && (
        <div className="text-blue-300">
          <p className="font-semibold">Crawling in progress...</p>
          <p className="text-sm text-gray-400 mt-1">Found {crawledCount} pages so far.</p>
          {currentUrl && 
            <p className="text-sm text-gray-500 mt-1 truncate">
              Checking: {currentUrl}
            </p>
          }
        </div>
      )}
      {status === CrawlStatus.GENERATING && (
         <div className="text-teal-300">
          <p className="font-semibold">Crawl complete. Generating XML...</p>
          <p className="text-sm text-gray-400 mt-1">Total pages found: {crawledCount}</p>
        </div>
      )}
      {status === CrawlStatus.DONE && (
        <div className="text-green-400">
          <p className="font-semibold">Sitemap generated successfully!</p>
          <p className="text-sm text-gray-400 mt-1">Found {crawledCount} pages.</p>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
