import { LedMatrix, Font } from 'rpi-led-matrix';
import { matrixOptions, runtimeOptions } from '../_config.js';

// Define the Pulser class
class Pulser {
  constructor(x, y, f) {
    this.x = x; // X position of the pixel
    this.y = y; // Y position of the pixel
    this.f = f; // Frequency for pulsing
  }

  // Function to calculate the next color based on the time 't'
  nextColor(t) {
    const brightness = 0xff & Math.max(0, 255 * Math.sin((this.f * t) / 1000));
    return (brightness << 16) | (brightness << 8) | brightness; // Return a grayscale color
  }
}

// Initialize the matrix and pulsers array
const matrix = new LedMatrix(matrixOptions, runtimeOptions);
const pulsers = [];

// Create a Pulser instance for each pixel in the matrix
for (let x = 0; x < matrix.width(); x++) {
  for (let y = 0; y < matrix.height(); y++) {
    pulsers.push(new Pulser(x, y, 5 * Math.random())); // Random frequency for each pixel
  }
}

// Use afterSync hook for updating the display
matrix.afterSync((mat, dt, t) => {
  // For each pulser, calculate the color and set the pixel
  pulsers.forEach(pulser => {
    mat.fgColor(pulser.nextColor(t)); // Set the color for the pixel
    mat.setPixel(pulser.x, pulser.y); // Set the pixel position
  });

  // Defer the sync call to avoid stack overflow
  setTimeout(() => mat.sync(), 0);
});

// Start the animation loop
matrix.sync();
