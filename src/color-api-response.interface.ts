export interface ColorApiResponse {
  mode: string;
  count: number;
  colors: Color[];
}

export interface Color {
  ['string']: ColorValue;
}

export interface ColorValue {
  value: string;
}