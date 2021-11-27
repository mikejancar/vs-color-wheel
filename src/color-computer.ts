import { HueSaturationValue } from './hue-saturation-value.interface';
import { RedGreenBlue } from './red-green-blue.interface';

export class ColorComputer {
  createTetradicScheme(primary: HueSaturationValue): HueSaturationValue[] {
    return [
      { hue: primary.hue, saturation: primary.saturation, value: primary.value },
      { hue: this.computeHue(primary.hue + 210), saturation: primary.saturation, value: primary.value },
      { hue: this.computeHue(primary.hue + 150), saturation: primary.saturation, value: primary.value },
      { hue: this.computeHue(primary.hue + 60), saturation: primary.saturation, value: primary.value }
    ];
  }

  computeHue(hue: number): number {
    return hue > 360 ? hue - 360 : hue;
  }

  hexToHsv(hex: string): HueSaturationValue {
    const red = parseInt(hex.substr(0, 2), 16);
    const green = parseInt(hex.substr(2, 2), 16);
    const blue = parseInt(hex.substr(4, 2), 16);
    const hsv = this.rgbToHsv({ red, green, blue });
    return hsv;
  }

  rgbToHsv(rgb: RedGreenBlue): HueSaturationValue {
    const max = Math.max(rgb.red, rgb.green, rgb.blue);
    const min = Math.min(rgb.red, rgb.green, rgb.blue);
    const delta = max - min;
    let hue = 0;
    let saturation = 0;
    let value = max;

    if (max !== 0) {
      saturation = delta / max;
    }

    if (delta !== 0) {
      if (max === rgb.red) {
        hue = (rgb.green - rgb.blue) / delta;
      } else if (max === rgb.green) {
        hue = 2 + (rgb.blue - rgb.red) / delta;
      } else if (max === rgb.blue) {
        hue = 4 + (rgb.red - rgb.green) / delta;
      }
      hue *= 60;
      if (hue < 0) {
        hue += 360;
      }
    }

    return { hue, saturation, value };
  }

  hsvToHex(hsv: HueSaturationValue): string {
    const rgb = this.hsvToRgb(hsv);
    return this.rgbToHex(rgb);
  }

  hsvToRgb(hsv: HueSaturationValue): RedGreenBlue {
    const i = Math.floor(hsv.hue / 60);
    const f = (hsv.hue / 60) - i;
    const p = hsv.value * (1 - hsv.saturation);
    const q = hsv.value * (1 - f * hsv.saturation);
    const t = hsv.value * (1 - (1 - f) * hsv.saturation);
    const mod = i % 6;
    const red = [hsv.value, q, p, p, t, hsv.value][mod];
    const green = [t, hsv.value, hsv.value, q, p, p][mod];
    const blue = [p, p, t, hsv.value, hsv.value, q][mod];
    return { red, green, blue };
  }

  rgbToHex(rgb: RedGreenBlue): string {
    return '#' + ((1 << 24) + (rgb.red << 16) + (rgb.green << 8) + rgb.blue).toString(16).slice(1);
  }
}