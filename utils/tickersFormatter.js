import fs from 'fs';
import path from 'path';
import process from 'process';

const cacheFilePath = path.join(process.cwd(), 'data', 'stockPriceCache.json');

const formatToTextParts = (data) => {
  return data.map((row) => {
    const [ticker, price, indicator, percentage] = row;

    return [
      { text: `${ticker} `, color: 0xffffff }, // White
      { text: `${price} `, color: 0xffffff }, // Green
      {
        text: `${indicator}`,
        color: indicator === '▲' ? 0x00ff00 : 0xff0000, // Green for ▲, Red for ▼
      },
      {
        text: `${percentage}  `,
        color: indicator === '▲' ? 0x00ff00 : 0xff0000, // Green for ▲, Red for ▼
      },
    ];
  });
};

const getFormattedTickers = () => {
  try {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
    // console.log('Raw Data:', data);

    // Format the data into text parts
    const formattedTextParts = formatToTextParts(data);
    console.log('Formatted Text Parts:', formattedTextParts[0]);

    return formattedTextParts;
  } catch (error) {
    console.error('Error reading or parsing the JSON file:', error);
  }
};

export default getFormattedTickers;
