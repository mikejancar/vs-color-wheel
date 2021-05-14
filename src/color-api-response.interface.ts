export interface ColorApiResponse {
  mode: string;
  count: number;
  colors: Color[];
  seed: Color;
}

export interface Color {
  hex: ColorValue;
}

export interface ColorValue {
  value: string;
}