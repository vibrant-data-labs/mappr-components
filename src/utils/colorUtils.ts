const hexToRgb = (rgbHex: string) => {
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(rgbHex)) {
    return { r: 0, g: 0, b: 0 };
  }

  let hex = rgbHex.substring(1);
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}


export const rgbToRgba = (rgbHex: string, alpha: number) => {
  const rgb = hexToRgb(rgbHex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
