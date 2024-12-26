import yahooFinance from 'yahoo-finance2';
import getTickers from './fetchTickers.js';
import fs from 'fs';
import path from 'path';
import moment from 'moment';

yahooFinance.suppressNotices(['yahooSurvey']);

const cacheFilePath = path.join(process.cwd(), 'data', 'stockPriceCache.json');

// Check if the cache is recent (within 24 hours)
function isCacheRecent() {
  if (!fs.existsSync(cacheFilePath)) return false;
  const stats = fs.statSync(cacheFilePath);
  const cacheModifiedTime = moment(stats.mtime);
  const oneDayAgo = moment().subtract(1, 'days');
  return cacheModifiedTime.isAfter(oneDayAgo);
}

// Fetch the data from the API if the cache is not recent
const fetchSP500 = async () => {
  if (isCacheRecent()) {
    console.log('Using cached data.');
    const cachedData = JSON.parse(fs.readFileSync(cacheFilePath));
    console.log('Cached S&P 500 Data:', cachedData);
    console.log(cachedData.length);
    return cachedData;
  }

  const sp500Symbols = await getTickers(); // Add more symbols as needed
  const allData = [];

  for (const symbol of sp500Symbols) {
    try {
      const quote = await yahooFinance.quote(symbol);

      if (quote) {
        const changePercent =
          (quote.regularMarketChangePercent || 0).toFixed(2) + '%';
        const direction = quote.regularMarketChangePercent > 0 ? '▲' : '▼';
        const price = (quote.regularMarketPrice || 'N/A').toFixed(2);

        allData.push([symbol, price, direction, changePercent]);
      }

      console.log(`Fetched data for ${symbol}`);
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  }

  console.log('All S&P 500 Data:', allData);

  // Cache the fetched data
  fs.writeFileSync(cacheFilePath, JSON.stringify(allData));
  console.log(allData.length);

  return allData;
};

fetchSP500();
