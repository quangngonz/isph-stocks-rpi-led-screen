import { LedMatrix, Font } from 'rpi-led-matrix';
import { matrixOptions, runtimeOptions } from './_config.js';

import fetchSP500 from './utils/fetchSP500.js';
import getTickers from './utils/fetchTickers.js';
import getFormattedTickers from './utils/tickersFormatter.js';

// Initialize the LED matrix
const matrix = new LedMatrix(matrixOptions, runtimeOptions);
// const font = new Font('peep', `${process.cwd()}/fonts/peep-10x20.bdf`);
const font = new Font('knxt', `${process.cwd()}/fonts/knxt_space_5.bdf`);
// const font = new Font('Haxor', `${process.cwd()}/fonts/HaxorNarrow-17.bdf`);

// Fetch formatted ticker data
let textParts = []; // Initialize textParts as an empty array

// Function to fetch and update textParts
const updateTickers = async () => {
  console.log('Fetching SP500 data and updating tickers...');
  await getTickers(); // Get ticker data
  await fetchSP500(); // Fetch SP500 data
  textParts = getFormattedTickers(); // Update textParts with new data
  console.log('Tickers updated:', textParts[0]);
};

// Call updateTickers once at startup
await updateTickers();

// Schedule updateTickers to run once a day
setInterval(updateTickers, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

// Calculate the total text width
const textWidth = textParts.reduce((acc, partGroup) => {
  const groupWidth = partGroup.reduce(
    (groupAcc, part) => groupAcc + part.text.length * 9,
    0
  );
  return acc + groupWidth;
}, 5); // Adjust padding as needed

let xPos = 0; // Starting x-position

const END_SPACING = 8;
const SCROLL_SPEED = 1000 / 100;
const BRIGHTNESS = 80;

matrix.afterSync((mat, dt, t) => {
  matrix.brightness(BRIGHTNESS);
  matrix.font(font);
  matrix.clear();

  let currentX = xPos; // Track the x position for each part
  textParts.forEach((partGroup) => {
    partGroup.forEach((part) => {
      matrix.fgColor(part.color); // Set the color for the part
      matrix.drawText(part.text, currentX, -2); // Draw the text part

      // Add spacing for the end of the group
      if (part.text.includes('%')) {
        currentX += part.text.length * 10 + END_SPACING; // Move x position for the next part
      } else if (part.text.length > 1) {
        currentX += part.text.length * 10 - 3; // Move x position for the next part
      } else {
        currentX += part.text.length * 10; // Move x position for the next part
      }
    });
  });

  // Repeat the text for seamless scrolling
  let followUpX = xPos + textWidth;
  textParts.forEach((partGroup) => {
    partGroup.forEach((part) => {
      matrix.fgColor(part.color); // Set the color for the par
      matrix.drawText(part.text, followUpX, -2); // Draw the follow-up text part

      // Add spacing for the end of the group
      if (part.text.includes('%')) {
        currentX += part.text.length * 10 + END_SPACING; // Move x position for the next part
      } else if (part.text.length > 1) {
        currentX += part.text.length * 10 - 3; // Move x position for the next part
      } else {
        currentX += part.text.length * 10; // Move x position for the next part
      }
    });
  });

  // Update the x-position for smooth scrolling
  xPos -= 1; // Move left
  if (xPos <= -textWidth) {
    xPos = 0; // Reset position when the first instance is fully off-screen
  }

  setTimeout(() => matrix.sync(), SCROLL_SPEED); // Schedule the next sync
});

matrix.sync(); // Start the display
