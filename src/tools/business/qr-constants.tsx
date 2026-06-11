import React from 'react';

export type QrType = 'URL' | 'Text' | 'Email' | 'SMS' | 'Phone' | 'WiFi' | 'vCard';

export const paths: Record<string, string> = {
  heart: "M 50 90 C 50 90 10 60 10 30 C 10 10 40 10 50 30 C 60 10 90 10 90 30 C 90 60 50 90 50 90 Z",
  balloon: "M 50 78 C 45 78, 41 74, 37 68 C 12 52, 5 32, 12 16 C 18 2, 38 2, 50 16 C 62 2, 82 2, 88 16 C 95 32, 88 52, 63 68 C 59 74, 55 78, 50 78 Z M 50 78 L 45 84 L 55 84 Z",
  woman: "M 32 95 C 32 88, 38 82, 38 76 C 38 70, 32 68, 25 68 C 21 68, 17 64, 18 59 C 19 55, 23 54, 21 51 C 18 47, 13 46, 12 43 C 10 39, 16 37, 18 32 C 20 26, 25 16, 35 13 C 45 10, 57 8, 69 13 C 79 18, 85 30, 85 43 C 85 56, 77 66, 73 72 C 67 80, 65 86, 67 93 Z",
  paw: "M 25 35 C 20 35 15 25 20 15 C 25 5 35 5 40 15 C 45 25 35 35 25 35 Z M 75 35 C 80 35 85 25 80 15 C 75 5 65 5 60 15 C 55 25 65 35 75 35 Z M 50 25 C 45 25 40 15 45 5 C 50 -5 60 -5 60 5 C 65 15 55 25 50 25 Z M 50 90 C 25 90 10 75 15 55 C 20 35 40 45 50 45 C 60 45 80 35 85 55 C 90 75 75 90 50 90 Z",
  bunny: "M 50 95 C 30 95 20 80 20 65 C 20 50 30 45 40 45 C 35 25 25 10 30 5 C 35 0 45 15 50 30 C 55 15 65 0 70 5 C 75 10 65 25 60 45 C 70 45 80 50 80 65 C 80 80 70 95 50 95 Z",
  star: "M 50 5 L 61 35 L 95 35 L 67 55 L 78 85 L 50 65 L 22 85 L 33 55 L 5 35 L 39 35 Z",
  shield: "M 10 10 L 90 10 L 90 40 C 90 70 50 95 50 95 C 50 95 10 70 10 40 Z",
  diamond: "M 50 5 L 95 50 L 50 95 L 5 50 Z",
  hexagon: "M 50 5 L 90 27.5 L 90 72.5 L 50 95 L 10 72.5 L 10 27.5 Z",
  leaf: "M 90 10 C 90 60 50 90 10 90 C 10 40 50 10 90 10 Z",
  cat: "M 10 10 L 30 30 C 40 25 60 25 70 30 L 90 10 L 90 50 C 90 80 70 90 50 90 C 30 90 10 80 10 50 Z",
  house: "M 50 5 L 10 40 L 10 90 L 90 90 L 90 40 Z",
  camera: "M 20 30 L 30 20 L 70 20 L 80 30 L 90 30 C 95 30 95 35 95 40 L 95 80 C 95 90 85 90 80 90 L 20 90 C 10 90 5 85 5 80 L 5 40 C 5 35 5 30 10 30 Z M 50 45 C 35 45 35 75 50 75 C 65 75 65 45 50 45 Z",
  flask: "M 35 5 L 65 5 L 65 35 L 90 85 C 93 90, 90 95, 85 95 L 15 95 C 10 95, 7 90, 10 85 L 35 35 Z",
  book: "M 5 20 C 25 10 40 15 50 25 C 60 15 75 10 95 20 L 95 85 C 75 75 60 80 50 90 C 40 80 25 75 5 85 Z"
};

export const SHAPE_KEYS = ['default', 'circle', 'heart', 'balloon', 'woman', 'paw', 'bunny', 'star', 'shield', 'diamond', 'hexagon', 'leaf', 'cat', 'house', 'camera', 'flask', 'book'];
export type ShapeMode = typeof SHAPE_KEYS[number];

export const MOCK_QR_PATTERN = (
  <pattern id="qr-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
     <rect x="0" y="0" width="4" height="4" fill="currentColor" opacity="0.4"/>
     <rect x="5" y="5" width="4" height="4" fill="currentColor" opacity="0.4"/>
     <rect x="0" y="5" width="3" height="3" fill="currentColor" opacity="0.4"/>
  </pattern>
);
