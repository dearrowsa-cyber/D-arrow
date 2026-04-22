/**
 * Google Search Console API Wrapper
 * Falls back to simulated data when credentials are not configured.
 */

interface KeywordData {
  keyword: string;
  position: number;
  clicks: number;
  impressions: number;
  ctr: number;
  pages: { url: string; position: number; clicks: number; impressions: number }[];
}

function isConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);
}

/**
 * Fetch keyword ranking data from Google Search Console.
 * Falls back to simulated data if credentials are missing.
 */
export async function fetchKeywordRankings(
  keywords: string[],
  siteUrl: string = 'https://d-arrow.com',
  days: number = 28
): Promise<KeywordData[]> {
  if (isConfigured()) {
    return fetchFromGSC(keywords, siteUrl, days);
  }
  return simulateRankings(keywords);
}

async function fetchFromGSC(
  keywords: string[],
  siteUrl: string,
  days: number
): Promise<KeywordData[]> {
  // TODO: Implement real GSC API integration when credentials are provided
  // This requires:
  // 1. googleapis package: npm install googleapis
  // 2. Service Account with Search Console API access
  // 3. GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY in .env
  //
  // Example implementation:
  // const { google } = require('googleapis');
  // const auth = new google.auth.JWT(
  //   process.env.GOOGLE_CLIENT_EMAIL,
  //   undefined,
  //   process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  //   ['https://www.googleapis.com/auth/webmasters.readonly']
  // );
  // const searchconsole = google.searchconsole({ version: 'v1', auth });
  // const response = await searchconsole.searchanalytics.query({ ... });

  console.warn('[GSC] Real API integration not yet implemented, using simulated data');
  return simulateRankings(keywords);
}

/**
 * Generate realistic simulated ranking data for development/testing
 */
function simulateRankings(keywords: string[]): KeywordData[] {
  return keywords.map(keyword => {
    const basePosition = Math.random() * 50 + 1;
    const impressions = Math.floor(Math.random() * 5000) + 100;
    const ctr = (Math.random() * 15 + 0.5) / 100;
    const clicks = Math.floor(impressions * ctr);

    const pages = generatePageData(keyword, basePosition);

    return {
      keyword,
      position: Math.round(basePosition * 10) / 10,
      clicks,
      impressions,
      ctr: Math.round(ctr * 10000) / 100,
      pages,
    };
  });
}

function generatePageData(keyword: string, basePosition: number) {
  const sitePages = ['/', '/services', '/pricing', '/contact', '/blog', '/why-us', '/process'];
  // Pick 1-3 random pages that this keyword ranks on
  const numPages = Math.floor(Math.random() * 3) + 1;
  const shuffled = sitePages.sort(() => 0.5 - Math.random());
  const selectedPages = shuffled.slice(0, numPages);

  return selectedPages.map(url => {
    const pagePosition = basePosition + (Math.random() * 10 - 5);
    const impressions = Math.floor(Math.random() * 2000) + 50;
    const clicks = Math.floor(impressions * (Math.random() * 0.1));
    return {
      url,
      position: Math.max(1, Math.round(pagePosition * 10) / 10),
      clicks,
      impressions,
    };
  });
}

/**
 * Generate historical ranking data for a keyword (for charts)
 */
export function generateHistoricalData(
  keyword: string,
  days: number = 30
): { date: string; position: number; clicks: number; impressions: number; ctr: number }[] {
  const data = [];
  let position = Math.random() * 30 + 5;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Simulate gradual position changes
    position += (Math.random() - 0.48) * 3;
    position = Math.max(1, Math.min(100, position));

    const impressions = Math.floor(Math.random() * 500 + 50);
    const ctr = Math.max(0.5, 30 - position) / 100;
    const clicks = Math.floor(impressions * ctr);

    data.push({
      date: date.toISOString().split('T')[0],
      position: Math.round(position * 10) / 10,
      clicks,
      impressions,
      ctr: Math.round(ctr * 10000) / 100,
    });
  }

  return data;
}
