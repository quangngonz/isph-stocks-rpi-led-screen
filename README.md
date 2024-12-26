# LED Stock Ticker for S&P 500 (P10 HUB75 Panels)

## Overview

This project is an educational initiative designed to display live S&P 500 stock information on a P10 HUB75 LED screen using a Raspberry Pi. The project demonstrates the integration of hardware and software to visualize real-time financial data, making it an engaging tool for learning about technology and economics.

## Features

- **Real-Time Data**: Displays continuously updated S&P 500 stock tickers.
- **Smooth Scrolling**: Text scrolls seamlessly across the LED panel for clear visibility.
- **Customizable Appearance**: Adjust text size, colors, and brightness.

## Hardware Requirements

1. **P10 HUB75 LED Panel**
2. **Raspberry Pi** (tested with Raspberry Pi 3/4)
3. **5V Power Supply** (sufficient for powering the LED panel)
4. **GPIO Wiring** (connect the LED panel to the Raspberry Pi)
5. **MicroSD Card** (with Raspbian OS installed)

## Software Setup

### Prerequisites

- Node.js (>= v14.x)
- NPM (Node Package Manager)
- Git
- Fonts directory containing `.bdf` font files.

### Installation Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/<your-repo>/led-stock-ticker.git
   cd led-stock-ticker
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Fonts**:
   Place your `.bdf` font files in the `fonts/` directory. The default script uses `knxt`.

4. **Run the Project**:
   ```bash
   node index.js
   ```

## Project Structure

- **`index.js`**: Main script controlling the LED display.
- **`_config.js`**: Contains LED matrix and runtime configuration options.
- **`utils/fetchSP500.js`**: Fetches S&P 500 data.
- **`utils/fetchTickers.js`**: Retrieves stock tickers of the S&P 500.
- **`utils/tickersFormatter.js`**: Formats the ticker data for the LED display.
- **`fonts/`**: Stores `.bdf` font files used for rendering text.

## Configuration

Customize the LED matrix settings in `_config.js`:

```javascript
export const matrixOptions = {
  ...LedMatrix.defaultMatrixOptions(), // Default options
  rows: 16,
  cols: 32,
  chainLength: 1,
  hardwareMapping: GpioMapping.Regular,
  disableHardwarePulsing: true,
  // parallel: 0,
  showRefreshRate: true,
};

export const runtimeOptions = {
  ...LedMatrix.defaultRuntimeOptions(), // Default options
  gpioSlowdown: 4,
  dropPrivileges: RuntimeFlag.Off,
};
```

## Acknowledgments

### Libraries Used

1. **[hzeller/rpi-rgb-led-matrix](https://github.com/hzeller/rpi-rgb-led-matrix)**  
   A core library for controlling RGB LED panels with Raspberry Pi GPIO. Licensed under the GNU General Public License Version 2.0.

2. **[alexeden/rpi-led-matrix](https://github.com/alexeden/rpi-led-matrix)**  
   Node.js bindings for `rpi-rgb-led-matrix` with added features for double-buffering and smoother rendering.

## Educational Value

This project aims to inspire students by combining concepts from:

- **Software Engineering**: Working with JavaScript and APIs.
- **Hardware Interfacing**: Controlling LED panels using Raspberry Pi GPIO.
- **Finance and Economics**: Displaying real-time stock data.

It is planned to be put in an Economics classroom to help students visualize the stock market.

## License

This project is licensed under the **GNU General Public License Version 2.0**, following the guidelines of the underlying libraries.

For educational purposes only.

## Contribution

Contributions are welcome! Feel free to fork the repository, suggest improvements, or report issues.
