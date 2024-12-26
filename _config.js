import { GpioMapping, LedMatrix, RuntimeFlag } from 'rpi-led-matrix';

export const matrixOptions = {
  ...LedMatrix.defaultMatrixOptions(),
  rows: 16,
  cols: 32,
  chainLength: 1,
  hardwareMapping: GpioMapping.Regular,
  disableHardwarePulsing: true,
  // parallel: 0,
  // panelType: 'FM6127',
  // limitRefreshRateHz: 1,
  showRefreshRate: true,
  // pixelMapperConfig: LedMatrixUtils.encodeMappers(
  //   { type: PixelMapperType.Chainlink }
  // ),
  // pixelMapperConfig: LedMatrixUtils.encodeMappers({ type: PixelMapperType.U }),
};

console.log('matrix options: ', JSON.stringify(matrixOptions, null, 2));

export const runtimeOptions = {
  ...LedMatrix.defaultRuntimeOptions(),
  gpioSlowdown: 4,
  dropPrivileges: RuntimeFlag.Off,
};

console.log('runtime options: ', JSON.stringify(runtimeOptions, null, 2));
