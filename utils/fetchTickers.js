import fs from 'fs';
import path from 'path';
import axios from 'axios';
import csvParser from 'csv-parser'; // To parse CSV files
import moment from 'moment'; // To handle date manipulation
import { Readable } from 'stream';

const dataFolderPath = path.join(process.cwd(), 'data');
const filePath = path.join(dataFolderPath, 'stock_tickers.csv');
const url =
  'https://datahub.io/core/s-and-p-500-companies/_r/-/data/constituents.csv';

// Function to check if file is older than 2 weeks
function isFileRecent(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const stats = fs.statSync(filePath);
  const fileModifiedTime = moment(stats.mtime);
  const twoWeeksAgo = moment().subtract(2, 'weeks');
  return fileModifiedTime.isAfter(twoWeeksAgo);
}

// Function to fetch data from URL or use existing file
async function fetchData() {
  return new Promise((resolve, reject) => {
    // Check if data file exists and is not older than 2 weeks
    if (isFileRecent(filePath)) {
      console.log('Using local data file');
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results)) // Resolve the promise when reading is done
        .on('error', (err) => reject(err)); // Reject the promise if error occurs
    } else {
      console.log('Fetching new data from URL');
      axios
        .get(url)
        .then((response) => {
          const results = [];
          const parseStream = Readable.from(response.data);
          parseStream
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => {
              // Ensure data folder exists before writing the file
              if (!fs.existsSync(dataFolderPath)) {
                fs.mkdirSync(dataFolderPath);
              }
              // Write the fetched data to a file
              fs.writeFileSync(filePath, response.data);
              resolve(results); // Resolve the promise with the results
            })
            .on('error', (err) => {
              console.error('Error parsing CSV:', err);
              reject(err); // Reject the promise if error occurs
            });
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          reject(err); // Reject the promise if error occurs during the fetch
        });
    }
  });
}

// Wrap the call to fetchData in an async function
async function main() {
  try {
    const data = await fetchData();
    console.log('Data fetched or read from file:', data[0]);
  } catch (err) {
    console.error('Error:', err);
  }
}

export default async function getTickers() {
  const cacheFilePath = path.join(process.cwd(), 'data', 'tickersCache.json');

  function isCacheRecent(cacheFilePath) {
    if (!fs.existsSync(cacheFilePath)) return false;
    const stats = fs.statSync(cacheFilePath);
    const cacheModifiedTime = moment(stats.mtime);
    const twoWeeksAgo = moment().subtract(1, 'day');
    return cacheModifiedTime.isAfter(twoWeeksAgo);
  }

  try {
    let tickers;

    // Check if the cache file exists and is recent
    if (isCacheRecent(cacheFilePath)) {
      console.log('Using cached tickers data');
      const cachedData = fs.readFileSync(cacheFilePath, 'utf8');
      tickers = JSON.parse(cachedData);
    } else {
      console.log('Fetching new data and caching it');
      // Fetch new data from the source
      const data = await fetchData();
      tickers = data.map((stock) => stock['Symbol']); // Get symbols from data

      // Fix the class B stocks by replacing periods with hyphens
      tickers = tickers.map((ticker) => ticker.replace('.', '-'));

      // Cache the new data
      fs.mkdirSync(path.dirname(cacheFilePath), { recursive: true }); // Ensure the data folder exists
      fs.writeFileSync(cacheFilePath, JSON.stringify(tickers, null, 2), 'utf8');
    }

    return tickers;
    // return tickers.slice(0, 15);
  } catch (err) {
    console.error('Error:', err);
    throw err; // Optional: rethrow the error if you want the caller to handle it
  }
}

// Call the main function
// main();
// getTickers();
