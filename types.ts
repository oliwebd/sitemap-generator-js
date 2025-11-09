
export enum CrawlStatus {
  IDLE = 'IDLE',
  CRAWLING = 'CRAWLING',
  GENERATING = 'GENERATING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export interface CrawledPage {
  url: string;
  lastMod: string | null;
  isHomepage: boolean;
}
