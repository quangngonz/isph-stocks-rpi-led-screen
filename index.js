import { LedMatrix, Font } from 'rpi-led-matrix';
import { matrixOptions, runtimeOptions } from './_config.js';

// Function to generate a smooth rainbow color
const getRainbowColor = (step) => {
  // const r = Math.floor(Math.sin(step + 0) * 127 + 128); // Red channel
  // const g = Math.floor(Math.sin(step + 2) * 127 + 128); // Green channel
  // const b = Math.floor(Math.sin(step + 4) * 127 + 128); // Blue channel

  const r = 0;
  const g = 255;
  const b = 0;

  return (r << 16) | (g << 8) | b; // Return combined RGB value
};

const matrix = new LedMatrix(matrixOptions, runtimeOptions);

// const font = new Font('helvR12', `${process.cwd()}/fonts/10x20.bdf`);
const font = new Font('helvR12', `${process.cwd()}/fonts/knxt.bdf`);

const text = 'APPL 20 ▲3% ';
const textWidth = text.length * 10; // Adjust this value based on the actual text width
let xPos = 0;
let step = 0;

matrix.afterSync((mat, dt, t) => {
  matrix.font(font);
  matrix.clear(); // Clear the display

  const color = getRainbowColor(step);
  matrix.fgColor(color);
  step += 0.05;
  if (step > 6.28) step = 0; // Loop the rainbow effect

  // Draw the text twice to create a seamless scrolling effect
  matrix.drawText(text, xPos, -2); // Main text
  matrix.drawText(text, xPos + textWidth, -2); // Follow-up text

  // Update the x-position for smooth scrolling
  xPos -= 1; // Move left
  if (xPos <= -textWidth) {
    xPos = 0; // Reset position when the first instance is fully off-screen
  }

  setTimeout(() => matrix.sync(), 100);
});

matrix.sync();
