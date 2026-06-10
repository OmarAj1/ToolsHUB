import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling, { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';
import { Download, Image as ImageIcon, Link, Type as TypeIcon, Wifi, Mail, MessageSquare, Phone, Contact, Palette, Shapes, SlidersHorizontal, Sparkles, ImagePlus, X, Music, Shield, Tv, Heart } from 'lucide-react';

type QrType = 'URL' | 'Text' | 'Email' | 'SMS' | 'Phone' | 'WiFi' | 'vCard';

const paths: Record<string, string> = {
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
  camera: "M 20 30 L 30 20 L 70 20 L 80 30 L 90 30 C 95 30 95 35 95 40 L 95 80 C 95 90 85 90 80 90 L 20 90 C 10 90 5 85 5 80 L 5 40 C 5 35 5 30 10 30 Z M 50 45 C 35 45 35 75 50 75 C 65 75 65 45 50 45 Z"
};

const SHAPE_KEYS = ['default', 'circle', 'heart', 'balloon', 'woman', 'paw', 'bunny', 'star', 'shield', 'diamond', 'hexagon', 'leaf', 'cat', 'house', 'camera'];
type ShapeMode = typeof SHAPE_KEYS[number];

const MOCK_QR_PATTERN = (
  <pattern id="qr-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
     <rect x="0" y="0" width="4" height="4" fill="currentColor" opacity="0.4"/>
     <rect x="5" y="5" width="4" height="4" fill="currentColor" opacity="0.4"/>
     <rect x="0" y="5" width="3" height="3" fill="currentColor" opacity="0.4"/>
  </pattern>
);

export function QrBarcodeGenerator() {
  const [activeTab, setActiveTab] = useState('QR SHAPES');
  const [qrType, setQrType] = useState<QrType>('URL');
  const [data, setData] = useState('https://example.com');
  const [size, setSize] = useState(500); // Higher default resolution for crisp frames
  const [dotsColor, setDotsColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [gradient, setGradient] = useState<any>(null);
  const [cornersColor, setCornersColor] = useState('#000000');
  
  const [customPattern, setCustomPattern] = useState<string>('rounded');
  const [dotsType, setDotsType] = useState<DotType>('rounded');
  const [customEyeFrame, setCustomEyeFrame] = useState<string>('extra-rounded');
  const [customEyeBall, setCustomEyeBall] = useState<string>('dot');
  
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoMargin, setLogoMargin] = useState(0);

  const [shapeMode, setShapeMode] = useState<ShapeMode>('default');
  const [shapePadding, setShapePadding] = useState(10);
  const [eclPercent, setEclPercent] = useState(30);

  // Sticker options
  const [stickerMode, setStickerMode] = useState<'sticker' | 'silhouette'>('sticker');
  const [stickerTemplate, setStickerTemplate] = useState<'polaroid' | 'balloon' | 'speech' | 'computer' | 'shield' | 'cat' | 'music'>('polaroid');
  const [stickerCaption, setStickerCaption] = useState('SCAN ME!');
  const [sticker3D, setSticker3D] = useState(true);
  const [useTransparentBg, setUseTransparentBg] = useState(false);

  // Form states
  const [url, setUrl] = useState('https://example.com');
  const [text, setText] = useState('Hello World!');
  const [emailTo, setEmailTo] = useState('');
  const [emailSub, setEmailSub] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMsg, setSmsMsg] = useState('');
  const [telPhone, setTelPhone] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiEnc, setWifiEnc] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);
  const [vcFirst, setVcFirst] = useState('');
  const [vcLast, setVcLast] = useState('');
  const [vcPhone, setVcPhone] = useState('');
  const [vcEmail, setVcEmail] = useState('');
  const [vcOrg, setVcOrg] = useState('');
  const [vcTitle, setVcTitle] = useState('');
  const [vcUrl, setVcUrl] = useState('');

  // Update underlying QR string data when forms change
  useEffect(() => {
    let payload = '';
    switch (qrType) {
      case 'URL': payload = url; break;
      case 'Text': payload = text; break;
      case 'Email': payload = `mailto:${emailTo}?subject=${encodeURIComponent(emailSub)}&body=${encodeURIComponent(emailBody)}`; break;
      case 'SMS': payload = `smsto:${smsPhone}:${smsMsg}`; break;
      case 'Phone': payload = `tel:${telPhone}`; break;
      case 'WiFi': payload = `WIFI:T:${wifiEnc};S:${wifiSsid};P:${wifiPass};H:${wifiHidden};;`; break;
      case 'vCard': 
        payload = `BEGIN:VCARD\nVERSION:3.0\nN:${vcLast};${vcFirst}\nFN:${vcFirst} ${vcLast}\nORG:${vcOrg}\nTITLE:${vcTitle}\nTEL:${vcPhone}\nEMAIL:${vcEmail}\nURL:${vcUrl}\nEND:VCARD`; 
        break;
    }
    setData(payload);
  }, [qrType, url, text, emailTo, emailSub, emailBody, smsPhone, smsMsg, telPhone, wifiSsid, wifiPass, wifiEnc, wifiHidden, vcFirst, vcLast, vcPhone, vcEmail, vcOrg, vcTitle, vcUrl]);

  const qrRef = useRef<HTMLDivElement>(null);
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling({
    width: size,
    height: size,
    type: "canvas",
    imageOptions: { crossOrigin: "anonymous", margin: logoMargin }
  }));

  // Utility helper to draw rounded rectangles on the HTML5 canvas
  const drawRoundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  useEffect(() => {
    let isMounted = true;
    
    // Always force H level (Maximum 30%) when shaping or drawing templates
    const ecl = (stickerMode === 'silhouette' || shapeMode !== 'default') ? 'H' : 'Q';
    
    const NATIVE_PATTERNS = ['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'];
    const isCustomDraw = !NATIVE_PATTERNS.includes(customPattern);
    
    // EYE FRAME LOGIC
    const NATIVE_EYE_FRAMES = ['square', 'dot', 'extra-rounded'];
    const isCustomEyeFrame = !NATIVE_EYE_FRAMES.includes(customEyeFrame);
    
    // EYE BALL LOGIC
    const NATIVE_EYE_BALLS = ['square', 'dot'];
    const isCustomEyeBall = !NATIVE_EYE_BALLS.includes(customEyeBall);
    
    qrCode.update({
      type: "canvas", // necessary for our rendering logic
      width: size,
      height: size,
      data: data || ' ',
      qrOptions: { errorCorrectionLevel: ecl as any },
      dotsOptions: { 
         type: isCustomDraw ? 'square' : (customPattern as DotType), 
         color: isCustomDraw ? 'transparent' : dotsColor, 
         gradient: isCustomDraw ? undefined : (gradient || undefined) 
      },
      backgroundOptions: { color: 'transparent' }, // transparent for masking & sticker layering
      cornersSquareOptions: { 
         type: isCustomEyeFrame ? 'square' : (customEyeFrame as CornerSquareType), 
         color: isCustomEyeFrame ? 'transparent' : (cornersColor || dotsColor) 
      },
      cornersDotOptions: { 
         type: isCustomEyeBall ? 'square' : (customEyeBall as CornerDotType), 
         color: isCustomEyeBall ? 'transparent' : (cornersColor || dotsColor) 
      },
      image: logoImage || undefined,
      imageOptions: {
         crossOrigin: "anonymous",
         margin: logoMargin
      }
    });

    qrCode.getRawData('png').then(blob => {
        if (!isMounted || !blob || !qrRef.current) return;
        
        const blobUrl = URL.createObjectURL(blob as Blob);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(blobUrl);
            
            // 1. Create the base QR canvas where we composite our custom dots if needed
            const qrBaseCanvas = document.createElement('canvas');
            qrBaseCanvas.width = size;
            qrBaseCanvas.height = size;
            const qrBaseCtx = qrBaseCanvas.getContext('2d');
            if (!qrBaseCtx) return;

            const NATIVE_PATTERNS = ['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'];
            const isCustomDraw = !NATIVE_PATTERNS.includes(customPattern);

            if (isCustomDraw) {
               // Draw custom data dots manually!
               const qr = qrCode._qr;
               if (qr) {
                   const moduleCount = (qr as any).getModuleCount();
                   const cellSize = size / moduleCount;
                   
                   // Setup fill style for custom dots
                   if (gradient) {
                       const g = qrBaseCtx.createLinearGradient(0,0, size, size); // approximation mapping
                       g.addColorStop(0, gradient.colorStops[0].color);
                       g.addColorStop(1, gradient.colorStops[1].color);
                       qrBaseCtx.fillStyle = g;
                   } else {
                       qrBaseCtx.fillStyle = dotsColor;
                   }
                   
                   for (let r = 0; r < moduleCount; r++) {
                       for (let c = 0; c < moduleCount; c++) {
                           const isDark = (qr as any).isDark(r, c);
                           if (!isDark) continue;
                
                           // Skip corners (they are rendered natively by qr-code-styling)
                           const isFinder = (r < 8 && c < 8) || (r < 8 && c >= moduleCount - 8) || (r >= moduleCount - 8 && c < 8);
                           if (isFinder) continue;
                           
                           // Roughly skip logo area to prevent dots under the logo cutout
                           if (logoImage) {
                               const ls = size * 0.4;
                               const margin = logoMargin;
                               const lx = size/2 - ls/2 - margin;
                               const ly = size/2 - ls/2 - margin;
                               const lw = ls + margin*2;
                               
                               const px = c * cellSize;
                               const py = r * cellSize;
                               
                               if (px + cellSize > lx && px < lx + lw && py + cellSize > ly && py < ly + lw) {
                                   continue;
                               }
                           }
                
                           const px = c * cellSize;
                           const py = r * cellSize;
                           const cx = px + cellSize/2;
                           const cy = py + cellSize/2;
                           const s = cellSize;
                
                           qrBaseCtx.beginPath();
                           if (customPattern === 'vertical') {
                               qrBaseCtx.fillRect(px + s*0.1, py, s*0.8, s + 0.5); // overlapping slightly to close gaps
                           } else if (customPattern === 'horizontal') {
                               qrBaseCtx.fillRect(px, py + s*0.1, s + 0.5, s*0.8);
                           } else if (customPattern === 'cross') {
                               qrBaseCtx.fillRect(px + s*0.2, py + s*0.4, s*0.6, s*0.2);
                               qrBaseCtx.fillRect(px + s*0.4, py + s*0.2, s*0.2, s*0.6);
                           } else if (customPattern === 'diamond') {
                               qrBaseCtx.moveTo(cx, py + s*0.1);
                               qrBaseCtx.lineTo(px + s*0.9, cy);
                               qrBaseCtx.lineTo(cx, py + s*0.9);
                               qrBaseCtx.lineTo(px + s*0.1, cy);
                           } else if (customPattern === 'heart') {
                               const hs = s * 0.9;
                               const hx = px + s * 0.05;
                               const hy = py + s * 0.15;
                               qrBaseCtx.moveTo(hx + hs/2, hy + hs*0.25);
                               qrBaseCtx.bezierCurveTo(hx + hs/2, hy, hx, hy, hx, hy + hs*0.25);
                               qrBaseCtx.bezierCurveTo(hx, hy + hs*0.5, hx + hs/2, hy + hs*0.75, hx + hs/2, hy + hs);
                               qrBaseCtx.bezierCurveTo(hx + hs/2, hy + hs*0.75, hx + hs, hy + hs*0.5, hx + hs, hy + hs*0.25);
                               qrBaseCtx.bezierCurveTo(hx + hs, hy, hx + hs/2, hy, hx + hs/2, hy + hs*0.25);
                           } else if (customPattern === 'leaf') {
                               qrBaseCtx.moveTo(px, cy);
                               qrBaseCtx.bezierCurveTo(px + s*0.1, py, px + s*0.9, py, px + s, cy);
                               qrBaseCtx.bezierCurveTo(px + s*0.9, py + s, px + s*0.1, py + s, px, cy);
                           } else if (customPattern === 'circle-clusters') {
                               qrBaseCtx.moveTo(px + s*0.25 + s*0.15, py + s*0.25); qrBaseCtx.arc(px + s*0.25, py + s*0.25, s*0.15, 0, Math.PI*2);
                               qrBaseCtx.moveTo(px + s*0.75 + s*0.15, py + s*0.25); qrBaseCtx.arc(px + s*0.75, py + s*0.25, s*0.15, 0, Math.PI*2);
                               qrBaseCtx.moveTo(px + s*0.25 + s*0.15, py + s*0.75); qrBaseCtx.arc(px + s*0.25, py + s*0.75, s*0.15, 0, Math.PI*2);
                               qrBaseCtx.moveTo(px + s*0.75 + s*0.15, py + s*0.75); qrBaseCtx.arc(px + s*0.75, py + s*0.75, s*0.15, 0, Math.PI*2);
                           } else if (customPattern === 'target') {
                               qrBaseCtx.moveTo(cx + s*0.4, cy); qrBaseCtx.arc(cx, cy, s*0.4, 0, Math.PI*2);
                               qrBaseCtx.moveTo(cx + s*0.15, cy); qrBaseCtx.arc(cx, cy, s*0.15, 0, Math.PI*2);
                           } else if (customPattern === 'ninja') {
                               qrBaseCtx.moveTo(cx, py);
                               qrBaseCtx.quadraticCurveTo(px + s*0.6, py + s*0.4, px + s, cy);
                               qrBaseCtx.quadraticCurveTo(px + s*0.6, py + s*0.6, cx, py + s);
                               qrBaseCtx.quadraticCurveTo(px + s*0.4, py + s*0.6, px, cy);
                               qrBaseCtx.quadraticCurveTo(px + s*0.4, py + s*0.4, cx, py);
                           } else {
                               // fallback square
                               qrBaseCtx.fillRect(px, py, s, s);
                           }
                           qrBaseCtx.fill();
                       }
                   }
               }
            }
            // Draw the lib corners, background, and logo on top overlaying the transparent dots
            qrBaseCtx.drawImage(img, 0, 0);

            // Draw custom Eye Frames & Balls manually
            if (isCustomEyeFrame || isCustomEyeBall) {
                const qr = qrCode._qr;
                if (qr) {
                    const moduleCount = (qr as any).getModuleCount();
                    const cellSize = size / moduleCount;

                    qrBaseCtx.strokeStyle = cornersColor || dotsColor;
                    qrBaseCtx.fillStyle = cornersColor || dotsColor;
                    
                    const corners = [
                        { x: 0, y: 0 },
                        { x: (moduleCount - 7) * cellSize, y: 0 },
                        { x: 0, y: (moduleCount - 7) * cellSize }
                    ];
                    
                    corners.forEach(corner => {
                        const cx = corner.x;
                        const cy = corner.y;
                        const fs = 7 * cellSize; // finderSize
                        const t = cellSize; // thickness
                        const hr = fs / 2; // half size
                        
                        qrBaseCtx.lineWidth = t;
                        qrBaseCtx.setLineDash([]);
                        qrBaseCtx.beginPath();
                        
                        try {
                            if (customEyeFrame === 'leaf') {
                                if (qrBaseCtx.roundRect) qrBaseCtx.roundRect(cx + t/2, cy + t/2, fs - t, fs - t, [hr, 0, hr, 0]);
                                else qrBaseCtx.rect(cx+t/2, cy+t/2, fs-t, fs-t);
                            } else if (customEyeFrame === 'shield') {
                                if (qrBaseCtx.roundRect) qrBaseCtx.roundRect(cx + t/2, cy + t/2, fs - t, fs - t, [0, 0, hr, hr]);
                                else qrBaseCtx.rect(cx+t/2, cy+t/2, fs-t, fs-t);
                            } else if (customEyeFrame === 'octagon') {
                                const s = fs / 3.5;
                                const inset = t/2;
                                qrBaseCtx.moveTo(cx + s, cy + inset);
                                qrBaseCtx.lineTo(cx + fs - s, cy + inset);
                                qrBaseCtx.lineTo(cx + fs - inset, cy + s);
                                qrBaseCtx.lineTo(cx + fs - inset, cy + fs - s);
                                qrBaseCtx.lineTo(cx + fs - s, cy + fs - inset);
                                qrBaseCtx.lineTo(cx + s, cy + fs - inset);
                                qrBaseCtx.lineTo(cx + inset, cy + fs - s);
                                qrBaseCtx.lineTo(cx + inset, cy + s);
                                qrBaseCtx.closePath();
                            } else if (customEyeFrame === 'rotate-square') {
                                qrBaseCtx.moveTo(cx + hr, cy + t/2);
                                qrBaseCtx.lineTo(cx + fs - t/2, cy + hr);
                                qrBaseCtx.lineTo(cx + hr, cy + fs - t/2);
                                qrBaseCtx.lineTo(cx + t/2, cy + hr);
                                qrBaseCtx.closePath();
                            } else if (customEyeFrame === 'double-ring') {
                                qrBaseCtx.lineWidth = t * 0.3;
                                if (qrBaseCtx.roundRect) {
                                    qrBaseCtx.roundRect(cx + t*0.15, cy + t*0.15, fs - t*0.3, fs - t*0.3, hr * 0.3);
                                    qrBaseCtx.stroke(); qrBaseCtx.beginPath();
                                    qrBaseCtx.roundRect(cx + t*0.85, cy + t*0.85, fs - t*1.7, fs - t*1.7, hr * 0.1);
                                }
                            } else if (customEyeFrame === 'stitched') {
                                qrBaseCtx.setLineDash([t, t]);
                                if (qrBaseCtx.roundRect) qrBaseCtx.roundRect(cx + t/2, cy + t/2, fs - t, fs - t, hr * 0.3);
                                else qrBaseCtx.rect(cx+t/2, cy+t/2, fs-t, fs-t);
                            } else if (customEyeFrame === 'brackets') {
                                qrBaseCtx.moveTo(cx + t*1.5, cy + t/2);
                                qrBaseCtx.lineTo(cx + t/2, cy + t/2);
                                qrBaseCtx.lineTo(cx + t/2, cy + fs - t/2);
                                qrBaseCtx.lineTo(cx + t*1.5, cy + fs - t/2);
                                qrBaseCtx.stroke(); qrBaseCtx.beginPath();
                                qrBaseCtx.moveTo(cx + fs - t*1.5, cy + t/2);
                                qrBaseCtx.lineTo(cx + fs - t/2, cy + t/2);
                                qrBaseCtx.lineTo(cx + fs - t/2, cy + fs - t/2);
                                qrBaseCtx.lineTo(cx + fs - t*1.5, cy + fs - t/2);
                            } else if (customEyeFrame === 'fluid') {
                                if (qrBaseCtx.roundRect) qrBaseCtx.roundRect(cx + t/2, cy + t/2, fs - t, fs - t, [hr, hr, hr, 0]);
                                else qrBaseCtx.rect(cx+t/2, cy+t/2, fs-t, fs-t);
                            } else if (customEyeFrame === 'minimalist') {
                                qrBaseCtx.lineWidth = t * 0.5;
                                qrBaseCtx.rect(cx + t, cy + t, fs - t*2, fs - t*2);
                            } else if (customEyeFrame === 'microwave') {
                                qrBaseCtx.moveTo(cx + hr, cy + t/2);
                                qrBaseCtx.lineTo(cx + fs - t/2, cy + t/2);
                                qrBaseCtx.lineTo(cx + fs - t/2, cy + fs - t/2);
                                qrBaseCtx.lineTo(cx + hr, cy + fs - t/2);
                                qrBaseCtx.arcTo(cx + t/2, cy + fs - t/2, cx + t/2, cy + hr, hr*0.5);
                                qrBaseCtx.arcTo(cx + t/2, cy + t/2, cx + hr, cy + t/2, hr*0.5);
                                qrBaseCtx.closePath();
                            } else {
                                qrBaseCtx.rect(cx+t/2, cy+t/2, fs-t, fs-t);
                            }
                            
                            if (customEyeFrame !== 'double-ring' && customEyeFrame !== 'brackets' && isCustomEyeFrame) {
                                qrBaseCtx.stroke();
                            }
                            
                            // Draw Custom Eye Ball
                            if (isCustomEyeBall) {
                                qrBaseCtx.fillStyle = cornersColor || dotsColor;
                                qrBaseCtx.beginPath();
                                const bx = cx + t * 2;
                                const by = cy + t * 2;
                                const bs = t * 3; // ballSize is 3 modules wide
                                const bh = bs / 2;
                                const bcx = bx + bh;
                                const bcy = by + bh;
                                
                                if (customEyeBall === 'rounded') {
                                    if (qrBaseCtx.roundRect) qrBaseCtx.roundRect(bx, by, bs, bs, bh * 0.5);
                                    else qrBaseCtx.rect(bx, by, bs, bs);
                                } else if (customEyeBall === 'diamond') {
                                    qrBaseCtx.moveTo(bcx, by);
                                    qrBaseCtx.lineTo(bx + bs, bcy);
                                    qrBaseCtx.lineTo(bcx, by + bs);
                                    qrBaseCtx.lineTo(bx, bcy);
                                    qrBaseCtx.closePath();
                                } else if (customEyeBall === 'leaf') {
                                    if (qrBaseCtx.roundRect) qrBaseCtx.roundRect(bx, by, bs, bs, [bh, 0, bh, 0]);
                                } else if (customEyeBall === 'pillow') {
                                    qrBaseCtx.moveTo(bcx, by);
                                    qrBaseCtx.quadraticCurveTo(bcx, bcy, bx + bs, bcy);
                                    qrBaseCtx.quadraticCurveTo(bcx, bcy, bcx, by + bs);
                                    qrBaseCtx.quadraticCurveTo(bcx, bcy, bx, bcy);
                                    qrBaseCtx.quadraticCurveTo(bcx, bcy, bcx, by);
                                } else if (customEyeBall === 'vertical-capsule') {
                                    if (qrBaseCtx.roundRect) qrBaseCtx.roundRect(bx + bs*0.15, by, bs*0.7, bs, bs*0.35);
                                } else if (customEyeBall === 'horizontal-capsule') {
                                    if (qrBaseCtx.roundRect) qrBaseCtx.roundRect(bx, by + bs*0.15, bs, bs*0.7, bs*0.35);
                                } else if (customEyeBall === 'right-triangle') {
                                    qrBaseCtx.moveTo(bx + bs*0.2, by + bs*0.1);
                                    qrBaseCtx.lineTo(bx + bs*0.8, bcy);
                                    qrBaseCtx.lineTo(bx + bs*0.2, by + bs*0.9);
                                    qrBaseCtx.closePath();
                                } else if (customEyeBall === 'up-triangle') {
                                    qrBaseCtx.moveTo(bcx, by + bs*0.2);
                                    qrBaseCtx.lineTo(bx + bs*0.9, by + bs*0.8);
                                    qrBaseCtx.lineTo(bx + bs*0.1, by + bs*0.8);
                                    qrBaseCtx.closePath();
                                } else if (customEyeBall === 'heart') {
                                    const hs = bs * 0.9;
                                    const hx = bx + bs * 0.05;
                                    const hy = by + bs * 0.15;
                                    qrBaseCtx.moveTo(hx + hs/2, hy + hs*0.25);
                                    qrBaseCtx.bezierCurveTo(hx + hs/2, hy, hx, hy, hx, hy + hs*0.25);
                                    qrBaseCtx.bezierCurveTo(hx, hy + hs*0.5, hx + hs/2, hy + hs*0.75, hx + hs/2, hy + hs);
                                    qrBaseCtx.bezierCurveTo(hx + hs/2, hy + hs*0.75, hx + hs, hy + hs*0.5, hx + hs, hy + hs*0.25);
                                    qrBaseCtx.bezierCurveTo(hx + hs, hy, hx + hs/2, hy, hx + hs/2, hy + hs*0.25);
                                } else if (customEyeBall === 'star') {
                                    const rot = Math.PI / 2 * 3;
                                    let x = bcx, y = by, step = Math.PI / 4;
                                    qrBaseCtx.moveTo(bcx, by);
                                    for(let i=0; i<4; i++){
                                        qrBaseCtx.lineTo(bcx + Math.cos(rot + step * i * 2) * bh, bcy + Math.sin(rot + step * i * 2) * bh);
                                        qrBaseCtx.lineTo(bcx + Math.cos(rot + step * (i * 2 + 1)) * (bh*0.4), bcy + Math.sin(rot + step * (i * 2 + 1)) * (bh*0.4));
                                    }
                                    qrBaseCtx.closePath();
                                } else if (customEyeBall === 'cross') {
                                    qrBaseCtx.rect(bcx - bs*0.15, by, bs*0.3, bs);
                                    qrBaseCtx.rect(bx, bcy - bs*0.15, bs, bs*0.3);
                                } else if (customEyeBall === 'fluid') {
                                    if (qrBaseCtx.roundRect) qrBaseCtx.roundRect(bx, by, bs, bs, [bh, bh, bh, 0]);
                                } else if (customEyeBall === 'target') {
                                    qrBaseCtx.arc(bcx, bcy, bh, 0, Math.PI * 2);
                                    qrBaseCtx.fill();
                                    qrBaseCtx.beginPath();
                                    qrBaseCtx.fillStyle = 'white'; // Cutout part
                                    qrBaseCtx.arc(bcx, bcy, bh * 0.4, 0, Math.PI * 2);
                                } else if (customEyeBall === 'sliced') {
                                    qrBaseCtx.moveTo(bx, by); qrBaseCtx.lineTo(bcx - 1, by); qrBaseCtx.lineTo(bcx - 1, bcy - 1); qrBaseCtx.lineTo(bx, bcy - 1);
                                    qrBaseCtx.moveTo(bcx + 1, by); qrBaseCtx.lineTo(bx + bs, by); qrBaseCtx.lineTo(bx + bs, bcy - 1); qrBaseCtx.lineTo(bcx + 1, bcy - 1);
                                    qrBaseCtx.moveTo(bx, bcy + 1); qrBaseCtx.lineTo(bcx - 1, bcy + 1); qrBaseCtx.lineTo(bcx - 1, by + bs); qrBaseCtx.lineTo(bx, by + bs);
                                    qrBaseCtx.moveTo(bcx + 1, bcy + 1); qrBaseCtx.lineTo(bx + bs, bcy + 1); qrBaseCtx.lineTo(bx + bs, by + bs); qrBaseCtx.lineTo(bcx + 1, by + bs);
                                } else if (customEyeBall === 'ninja') {
                                    qrBaseCtx.moveTo(bcx, by);
                                    qrBaseCtx.quadraticCurveTo(bcx + bh*0.5, bcy - bh*0.5, bx + bs, bcy);
                                    qrBaseCtx.quadraticCurveTo(bcx + bh*0.5, bcy + bh*0.5, bcx, by + bs);
                                    qrBaseCtx.quadraticCurveTo(bcx - bh*0.5, bcy + bh*0.5, bx, bcy);
                                    qrBaseCtx.quadraticCurveTo(bcx - bh*0.5, bcy - bh*0.5, bcx, by);
                                } else if (customEyeBall === 'teardrop') {
                                    if (qrBaseCtx.roundRect) qrBaseCtx.roundRect(bx, by, bs, bs, [bh, bh, bh, 0]);
                                } else if (customEyeBall === 'heavy-plus') {
                                    if (qrBaseCtx.roundRect) {
                                        qrBaseCtx.roundRect(bcx - bs*0.2, by, bs*0.4, bs, bs*0.1);
                                        qrBaseCtx.roundRect(bx, bcy - bs*0.2, bs, bs*0.4, bs*0.1);
                                    }
                                } else {
                                    qrBaseCtx.rect(bx, by, bs, bs);
                                }
                                qrBaseCtx.fill();
                            }
                        } catch(e) {
                            console.error(e);
                        }
                    });
                }
            }
            
            // 2. Final stage Canvas used for composition
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            // Use qrBaseCanvas globally as the source material
            const sourceImg = qrBaseCanvas;
            
            // Draw background if not set to transparent
            if (!useTransparentBg) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, size, size);
            } else {
                ctx.clearRect(0, 0, size, size);
            }

            if (stickerMode === 'sticker') {
                ctx.save();
                // Normalize drawing space to 500x500
                ctx.scale(size / 500, size / 500);

                // Draw 3D Sticker Look (Thick White Contour backing)
                if (sticker3D) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.14)';
                    ctx.shadowBlur = 12;
                    ctx.shadowOffsetY = 8;
                    ctx.fillStyle = '#ffffff';

                    if (stickerTemplate === 'polaroid') {
                        drawRoundRect(ctx, 50 - 12, 35 - 12, 400 + 24, 430 + 24, 28);
                        ctx.fill();
                    } else if (stickerTemplate === 'balloon') {
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 32;
                        ctx.lineJoin = 'round';
                        ctx.lineCap = 'round';
                        ctx.beginPath();
                        ctx.moveTo(250, 110);
                        ctx.bezierCurveTo(150, 40, 50, 110, 100, 220);
                        ctx.lineTo(250, 360);
                        ctx.lineTo(400, 220);
                        ctx.bezierCurveTo(450, 110, 350, 40, 250, 110);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();

                        // string border backplate
                        ctx.beginPath();
                        ctx.moveTo(250, 360);
                        ctx.bezierCurveTo(230, 400, 270, 430, 250, 480);
                        ctx.stroke();
                    } else if (stickerTemplate === 'speech') {
                        drawRoundRect(ctx, 40 - 12, 40 - 12, 420 + 24, 340 + 24, 40);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(130, 370);
                        ctx.lineTo(150, 435);
                        ctx.lineTo(180, 370);
                        ctx.closePath();
                        ctx.fill();
                    } else if (stickerTemplate === 'computer') {
                        drawRoundRect(ctx, 60 - 12, 50 - 12, 380 + 24, 320 + 24, 32);
                        ctx.fill();
                        // stand base
                        ctx.beginPath();
                        ctx.moveTo(125, 420);
                        ctx.lineTo(375, 420);
                        ctx.lineTo(395, 465);
                        ctx.lineTo(105, 465);
                        ctx.closePath();
                        ctx.fill();
                    } else if (stickerTemplate === 'shield') {
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 32;
                        ctx.lineJoin = 'round';
                        ctx.beginPath();
                        ctx.moveTo(250, 40);
                        ctx.lineTo(400, 80);
                        ctx.quadraticCurveTo(400, 260, 250, 420);
                        ctx.quadraticCurveTo(100, 260, 100, 80);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();
                    } else if (stickerTemplate === 'cat') {
                        ctx.beginPath();
                        ctx.arc(250, 250, 160 + 12, 0, 2*Math.PI);
                        ctx.fill();
                        // ears
                        ctx.beginPath();
                        ctx.moveTo(110, 130); ctx.lineTo(100, 40); ctx.lineTo(190, 110); ctx.closePath(); ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(390, 130); ctx.lineTo(400, 40); ctx.lineTo(310, 110); ctx.closePath(); ctx.fill();
                    } else if (stickerTemplate === 'music') {
                        drawRoundRect(ctx, 50 - 12, 40 - 12, 400 + 24, 420 + 24, 34);
                        ctx.fill();
                    }
                }

                // Reset shadow/3D effect for drawing main colors
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;

                // Render main templates
                if (stickerTemplate === 'polaroid') {
                    // Photo body
                    ctx.fillStyle = '#ffffff';
                    drawRoundRect(ctx, 50, 35, 400, 430, 20);
                    ctx.fill();

                    // Polaroid Bezel
                    ctx.fillStyle = '#f8fafc';
                    ctx.fillRect(80, 60, 340, 310);
                    ctx.strokeStyle = '#e2e8f0';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(80, 60, 340, 310);

                    // Insert QR
                    ctx.drawImage(sourceImg, 95, 60, 310, 310);

                    // Caption text
                    ctx.fillStyle = '#0f172a';
                    ctx.font = "bold 26px 'Georgia', serif";
                    ctx.textAlign = 'center';
                    ctx.fillText(stickerCaption || "SCAN ME!", 250, 425);
                    
                    // Cute red diagonal scotch tape highlights on top corners
                    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
                    ctx.save();
                    ctx.translate(65, 40); ctx.rotate(-Math.PI / 4); ctx.fillRect(-20, -5, 40, 10);
                    ctx.restore();
                    ctx.save();
                    ctx.translate(435, 40); ctx.rotate(Math.PI / 4); ctx.fillRect(-20, -5, 40, 10);
                    ctx.restore();

                } else if (stickerTemplate === 'balloon') {
                    // Red/Pink Heart Balloon Casing
                    ctx.fillStyle = cornersColor || dotsColor || '#f43f5e';
                    ctx.beginPath();
                    ctx.moveTo(250, 110);
                    ctx.bezierCurveTo(150, 40, 50, 110, 100, 220);
                    ctx.lineTo(250, 360);
                    ctx.lineTo(400, 220);
                    ctx.bezierCurveTo(450, 110, 350, 40, 250, 110);
                    ctx.closePath();
                    ctx.fill();

                    // Cute balloon reflective highlight arc
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
                    ctx.lineWidth = 8;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.arc(130, 130, 35, 1.2 * Math.PI, 1.7 * Math.PI);
                    ctx.stroke();

                    // Balloon tail knot
                    ctx.fillStyle = cornersColor || dotsColor || '#f43f5e';
                    ctx.beginPath();
                    ctx.moveTo(250, 355); ctx.lineTo(240, 375); ctx.lineTo(260, 375); ctx.closePath(); ctx.fill();

                    // String line
                    ctx.strokeStyle = '#475569';
                    ctx.lineWidth = 3.5;
                    ctx.beginPath();
                    ctx.moveTo(250, 375);
                    ctx.bezierCurveTo(230, 410, 270, 440, 250, 480);
                    ctx.stroke();

                    // Ribbon knot decoration
                    ctx.fillStyle = '#f59e0b'; // golden ribbon
                    ctx.beginPath();
                    ctx.moveTo(250, 380); ctx.lineTo(238, 372); ctx.lineTo(238, 388); ctx.closePath(); ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(250, 380); ctx.lineTo(262, 372); ctx.lineTo(262, 388); ctx.closePath(); ctx.fill();

                    // Pristine white QR Plate
                    ctx.fillStyle = '#ffffff';
                    drawRoundRect(ctx, 140, 130, 220, 220, 24);
                    ctx.fill();

                    // Embed standard QR Code safely
                    ctx.drawImage(sourceImg, 150, 140, 200, 200);

                    // Cute caption written inside bottom balloon
                    ctx.fillStyle = '#ffffff';
                    ctx.font = "bold 13px sans-serif";
                    ctx.textAlign = 'center';
                    ctx.fillText(stickerCaption || "TAP ME!", 250, 465);

                } else if (stickerTemplate === 'speech') {
                    // Chat bubble backplate
                    ctx.fillStyle = '#ffffff';
                    drawRoundRect(ctx, 40, 40, 420, 340, 32);
                    ctx.fill();

                    // Artistic Border
                    ctx.strokeStyle = cornersColor || dotsColor || '#6366f1';
                    ctx.lineWidth = 8;
                    ctx.stroke();

                    // Dialog tip
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.moveTo(130, 370); ctx.lineTo(150, 425); ctx.lineTo(180, 370); ctx.closePath(); ctx.fill();

                    // Tip outline border
                    ctx.strokeStyle = cornersColor || dotsColor || '#6366f1';
                    ctx.lineWidth = 8;
                    ctx.lineJoin = 'round';
                    ctx.beginPath();
                    ctx.moveTo(130, 370); ctx.lineTo(150, 425); ctx.lineTo(180, 370); ctx.stroke();

                    // Cover inner seam line
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(134, 365, 42, 10);

                    // Top Sticker Pill
                    ctx.fillStyle = cornersColor || dotsColor || '#6366f1';
                    drawRoundRect(ctx, 140, 56, 220, 42, 18);
                    ctx.fill();

                    ctx.fillStyle = '#ffffff';
                    ctx.font = "bold 14px sans-serif";
                    ctx.textAlign = 'center';
                    ctx.fillText(stickerCaption || "LET'S CHAT!", 250, 82);

                    // Embed QR Code
                    ctx.drawImage(sourceImg, 110, 115, 280, 250);

                } else if (stickerTemplate === 'computer') {
                    // Computer Case
                    ctx.fillStyle = '#f1f5f9';
                    drawRoundRect(ctx, 60, 50, 380, 320, 24);
                    ctx.fill();

                    // Monitor neck and stand base
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fillRect(180, 370, 140, 50);
                    ctx.fillStyle = '#94a3b8';
                    ctx.beginPath();
                    ctx.moveTo(130, 420); ctx.lineTo(370, 420); ctx.lineTo(390, 450); ctx.lineTo(110, 450); ctx.closePath(); ctx.fill();

                    // Custom ventilation slot details
                    ctx.fillStyle = '#475569';
                    ctx.fillRect(80, 345, 60, 6);

                    // Retro Apple-band colors
                    const rgbX = 350;
                    const rgbY = 345;
                    ctx.fillStyle = '#ef4444'; ctx.fillRect(rgbX, rgbY, 4, 6);
                    ctx.fillStyle = '#f97316'; ctx.fillRect(rgbX + 4, rgbY, 4, 6);
                    ctx.fillStyle = '#eab308'; ctx.fillRect(rgbX + 8, rgbY, 4, 6);
                    ctx.fillStyle = '#22c55e'; ctx.fillRect(rgbX + 12, rgbY, 4, 6);
                    ctx.fillStyle = '#3b82f6'; ctx.fillRect(rgbX + 16, rgbY, 4, 6);

                    // Bezel
                    ctx.fillStyle = '#475569';
                    drawRoundRect(ctx, 80, 70, 340, 250, 16);
                    ctx.fill();

                    // Black terminal screen
                    ctx.fillStyle = '#0f172a';
                    drawRoundRect(ctx, 92, 82, 316, 226, 12);
                    ctx.fill();

                    // Clean white sheet inside terminal so scanning is perfect
                    ctx.fillStyle = '#ffffff';
                    drawRoundRect(ctx, 145, 90, 210, 210, 12);
                    ctx.fill();

                    // Embed standard QR Code safely
                    ctx.drawImage(sourceImg, 150, 95, 200, 200);

                    // Cute operating system text at the bottom
                    ctx.fillStyle = '#475569';
                    ctx.font = "bold 13px monospace";
                    ctx.textAlign = 'center';
                    ctx.fillText(stickerCaption || "BOOTING QR_OS...", 250, 395);

                } else if (stickerTemplate === 'shield') {
                    // Full shield backdrop
                    ctx.fillStyle = cornersColor || dotsColor || '#0284c7';
                    ctx.beginPath();
                    ctx.moveTo(250, 40);
                    ctx.lineTo(400, 80);
                    ctx.quadraticCurveTo(400, 260, 250, 420);
                    ctx.quadraticCurveTo(100, 260, 100, 80);
                    ctx.closePath();
                    ctx.fill();

                    // Gold ribbon trim
                    ctx.strokeStyle = '#fbbf24';
                    ctx.lineWidth = 10;
                    ctx.stroke();

                    // Security Label
                    ctx.fillStyle = '#fbbf24';
                    drawRoundRect(ctx, 160, 90, 180, 35, 12);
                    ctx.fill();

                    ctx.fillStyle = '#0f172a';
                    ctx.font = "bold 13px sans-serif";
                    ctx.textAlign = 'center';
                    ctx.fillText(stickerCaption || "100% SECURE", 250, 112);

                    // White emblem sheet
                    ctx.fillStyle = '#ffffff';
                    drawRoundRect(ctx, 140, 150, 220, 220, 20);
                    ctx.fill();

                    // Draw standard QR
                    ctx.drawImage(sourceImg, 150, 160, 200, 200);

                    // Ribbon sash below the shield
                    ctx.fillStyle = '#fbbf24';
                    ctx.beginPath();
                    ctx.moveTo(110, 380); ctx.lineTo(390, 380); ctx.lineTo(365, 412); ctx.lineTo(135, 412); ctx.closePath(); ctx.fill();

                    ctx.fillStyle = '#0f172a';
                    ctx.font = "bold 15px sans-serif";
                    ctx.fillText("TAP OR SCAN", 250, 402);

                } else if (stickerTemplate === 'cat') {
                    // Round orange/pink cat face
                    ctx.fillStyle = cornersColor || dotsColor || '#ef7014';
                    ctx.beginPath();
                    ctx.arc(250, 250, 160, 0, 2 * Math.PI);
                    ctx.fill();

                    // Drawing ears
                    ctx.fillStyle = cornersColor || dotsColor || '#ef7014';
                    ctx.beginPath();
                    ctx.moveTo(110, 130); ctx.lineTo(100, 45); ctx.lineTo(190, 110); ctx.closePath(); ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(390, 130); ctx.lineTo(400, 45); ctx.lineTo(310, 110); ctx.closePath(); ctx.fill();

                    // Pink inner ears
                    ctx.fillStyle = '#fbcfe8';
                    ctx.beginPath();
                    ctx.moveTo(125, 120); ctx.lineTo(115, 65); ctx.lineTo(175, 105); ctx.closePath(); ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(375, 120); ctx.lineTo(385, 65); ctx.lineTo(325, 105); ctx.closePath(); ctx.fill();

                    // White whiskers
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 5;
                    ctx.lineCap = 'round';
                    // whiskers left
                    ctx.beginPath();
                    ctx.moveTo(110, 250); ctx.lineTo(45, 235);
                    ctx.moveTo(110, 260); ctx.lineTo(40, 260);
                    ctx.moveTo(110, 270); ctx.lineTo(45, 285);
                    // whiskers right
                    ctx.moveTo(390, 250); ctx.lineTo(455, 235);
                    ctx.moveTo(390, 260); ctx.lineTo(460, 260);
                    ctx.moveTo(390, 270); ctx.lineTo(455, 285);
                    ctx.stroke();

                    // White central round-rect plate
                    ctx.fillStyle = '#ffffff';
                    drawRoundRect(ctx, 140, 150, 220, 220, 24);
                    ctx.fill();

                    // Embed QR
                    ctx.drawImage(sourceImg, 150, 160, 200, 200);

                    // Caption text
                    ctx.fillStyle = '#ffffff';
                    ctx.font = "bold 15px sans-serif";
                    ctx.textAlign = 'center';
                    ctx.fillText(stickerCaption || "MEOW MEOW!", 250, 395);

                } else if (stickerTemplate === 'music') {
                    // Sleek digital audio player card background
                    ctx.fillStyle = '#0f172a';
                    drawRoundRect(ctx, 50, 40, 400, 420, 24);
                    ctx.fill();

                    ctx.strokeStyle = cornersColor || dotsColor || '#ec4899';
                    ctx.lineWidth = 3.5;
                    drawRoundRect(ctx, 50, 40, 400, 420, 24);
                    ctx.stroke();

                    ctx.fillStyle = '#ffffff';
                    ctx.font = "bold 18px sans-serif";
                    ctx.textAlign = 'center';
                    ctx.fillText(stickerCaption || "PLAY MY MUSIC!", 250, 75);

                    ctx.fillStyle = '#94a3b8';
                    ctx.font = "12px sans-serif";
                    ctx.fillText("SCAN TO LAUNCH SYSTEM", 250, 95);

                    // Scannability backdrop card
                    ctx.fillStyle = '#ffffff';
                    drawRoundRect(ctx, 135, 115, 230, 230, 15);
                    ctx.fill();

                    ctx.drawImage(sourceImg, 145, 125, 210, 210);

                    // Player track duration timeline slider track
                    ctx.fillStyle = '#334155';
                    drawRoundRect(ctx, 80, 365, 340, 6, 3);
                    ctx.fill();

                    // Filled Pink slider timeline
                    ctx.fillStyle = cornersColor || dotsColor || '#ec4899';
                    drawRoundRect(ctx, 80, 365, 185, 6, 3);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(265, 368, 6, 0, 2 * Math.PI);
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();

                    // Media Player symbol icons
                    // Back skips
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 4;
                    ctx.lineJoin = 'round';
                    ctx.beginPath();
                    ctx.moveTo(175, 400); ctx.lineTo(160, 410); ctx.lineTo(175, 420); ctx.closePath(); ctx.stroke(); ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(190, 400); ctx.lineTo(175, 410); ctx.lineTo(190, 420); ctx.closePath(); ctx.stroke(); ctx.fill();

                    // Circular center Play action button
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(250, 410, 20, 0, 2 * Math.PI);
                    ctx.fill();
                    // Play triangle icon
                    ctx.fillStyle = '#0f172a';
                    ctx.beginPath();
                    ctx.moveTo(245, 400); ctx.lineTo(260, 410); ctx.lineTo(245, 420); ctx.closePath(); ctx.fill();

                    // Skip forward
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.moveTo(310, 400); ctx.lineTo(325, 410); ctx.lineTo(310, 420); ctx.closePath(); ctx.stroke(); ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(325, 400); ctx.lineTo(340, 410); ctx.lineTo(325, 420); ctx.closePath(); ctx.stroke(); ctx.fill();
                }

                ctx.restore();

            } else {
                // RUN THE STANDARD/SILHOUETTE MASK LOGIC
                if (shapeMode === 'default') {
                    ctx.drawImage(sourceImg, 0, 0);
                } else {
                    // Create mask
                    const maskCanvas = document.createElement('canvas');
                    maskCanvas.width = size;
                    maskCanvas.height = size;
                    const mCtx = maskCanvas.getContext('2d');
                    if (mCtx) {
                        mCtx.fillStyle = 'black';
                        
                        // Calculate shape padding based on the 1-30% ECL percentage budget slider
                        const computedPadding = (30 - eclPercent) * (size / 150);
                        const innerSize = size - computedPadding * 2;
                        const scale = innerSize / 100;
                        
                        const pathStr = paths[shapeMode];
                        
                        // Set up a 100x100 canvas once for high-performance point-in-path testing
                        const testCanvas = document.createElement('canvas');
                        testCanvas.width = 100;
                        testCanvas.height = 100;
                        const tCtx = testCanvas.getContext('2d');
                        const p100 = pathStr ? new Path2D(pathStr) : null;
                        
                        const qr = qrCode._qr;
                        if (qr) {
                            const moduleCount = (qr as any).getModuleCount();
                            const cellSize = size / moduleCount;
                            
                            for (let row = 0; row < moduleCount; row++) {
                                for (let col = 0; col < moduleCount; col++) {
                                    const px = col * cellSize;
                                    const py = row * cellSize;
                                    
                                    // Protect the three corner finder patterns (including 1 module quiet boundary)
                                    const isFinder = (row < 8 && col < 8) || 
                                                     (row < 8 && col >= moduleCount - 8) || 
                                                     (row >= moduleCount - 8 && col < 8);
                                                     
                                    // Protect the alignment pattern (typically near the bottom-right for Version 2+)
                                    const isAlignment = (moduleCount > 21 && 
                                                         row >= moduleCount - 10 && row <= moduleCount - 5 && 
                                                         col >= moduleCount - 10 && col <= moduleCount - 5);
                                    
                                    const isProtected = isFinder || isAlignment;
                                    
                                    let keepModule = false;
                                    if (isProtected) {
                                        keepModule = true;
                                    } else {
                                        const centerX = px + cellSize / 2;
                                        const centerY = py + cellSize / 2;
                                        
                                        if (shapeMode === 'circle') {
                                            const dx = centerX - size / 2;
                                            const dy = centerY - size / 2;
                                            const dist = Math.sqrt(dx * dx + dy * dy);
                                            keepModule = dist <= (size - computedPadding * 2) / 2;
                                        } else if (p100 && tCtx) {
                                            // Map absolute coordinates back to the local 100x100 space
                                            const mappedX = (centerX - computedPadding) / scale;
                                            const mappedY = (centerY - computedPadding) / scale;
                                            tCtx.clearRect(0, 0, 100, 100);
                                            tCtx.fill(p100);
                                            keepModule = tCtx.isPointInPath(p100, mappedX, mappedY);
                                        }
                                    }
                                    
                                    if (keepModule) {
                                        // Draw block mask with a tiny overlap for seamless connected pixels styles
                                        mCtx.fillRect(px - 0.2, py - 0.2, cellSize + 0.4, cellSize + 0.4);
                                    }
                                }
                            }
                        } else {
                            // Fallback if qr generator is not ready
                            const rectSize = size * 0.33;
                            mCtx.fillRect(0, 0, rectSize, rectSize);
                            mCtx.fillRect(size - rectSize, 0, rectSize, rectSize);
                            mCtx.fillRect(0, size - rectSize, rectSize, rectSize);
                        }
                    }
                    
                    // Mask the QR code
                    const qrCanvas = document.createElement('canvas');
                    qrCanvas.width = size;
                    qrCanvas.height = size;
                    const qrCtx = qrCanvas.getContext('2d');
                    if (qrCtx) {
                        qrCtx.drawImage(sourceImg, 0, 0);
                        qrCtx.globalCompositeOperation = 'destination-in';
                        qrCtx.drawImage(maskCanvas, 0, 0);
                    }
                    
                    ctx.drawImage(qrCanvas, 0, 0);
                    
                    // Outline Stroke overlay
                    const computedPadding = (30 - eclPercent) * (size / 150);
                    if (shapeMode === 'circle') {
                        ctx.beginPath();
                        ctx.arc(size/2, size/2, (size - computedPadding*2)/2, 0, 2*Math.PI);
                        ctx.lineWidth = 10;
                        ctx.strokeStyle = cornersColor || dotsColor;
                        ctx.stroke();
                    } else {
                        const pathStr = paths[shapeMode];
                        if (pathStr) {
                            ctx.save();
                            const innerSize = size - computedPadding * 2;
                            const scale = innerSize / 100;
                            ctx.translate(computedPadding, computedPadding);
                            ctx.scale(scale, scale);
                            const p = new Path2D(pathStr);
                            ctx.lineWidth = 10 / scale; 
                            ctx.lineJoin = 'round';
                            ctx.strokeStyle = cornersColor || dotsColor;
                            ctx.stroke(p);
                            ctx.restore();
                        }
                    }
                }
            }
            
            // Update DOM
            qrRef.current.innerHTML = '';
            qrRef.current.appendChild(canvas);
        };
        img.src = blobUrl;
    });

    return () => { isMounted = false; };
  }, [data, size, dotsColor, bgColor, gradient, cornersColor, dotsType, customPattern, customEyeFrame, customEyeBall, logoImage, logoMargin, shapeMode, shapePadding, qrCode, stickerMode, stickerTemplate, stickerCaption, sticker3D, useTransparentBg, eclPercent]);

  const onDownload = () => {
    if (qrRef.current) {
        const canvas = qrRef.current.querySelector('canvas');
        if (canvas) {
            const tempUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.download = 'custom-qr-code.png';
            a.href = tempUrl;
            a.click();
        }
    }
  };

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'ocean':
        setGradient({ type: 'linear', rotation: Math.PI / 4, colorStops: [{ offset: 0, color: '#2193b0' }, { offset: 1, color: '#6dd5ed' }] });
        setCornersColor('#2193b0');
        setBgColor('#ffffff');
        setCustomPattern('rounded');
        setCustomEyeFrame('extra-rounded');
        setCustomEyeBall('dot');
        break;
      case 'sunset':
        setGradient({ type: 'linear', rotation: Math.PI / 4, colorStops: [{ offset: 0, color: '#ff7e5f' }, { offset: 1, color: '#feb47b' }] });
        setCornersColor('#ff7e5f');
        setBgColor('#ffffff');
        setCustomPattern('classy');
        setCustomEyeFrame('extra-rounded');
        setCustomEyeBall('dot');
        break;
      case 'cyberpunk':
        setGradient({ type: 'linear', rotation: Math.PI / 4, colorStops: [{ offset: 0, color: '#f953c6' }, { offset: 1, color: '#b91d73' }] });
        setCornersColor('#00f2fe');
        setBgColor('#0f0c29');
        setCustomPattern('square');
        setCustomEyeFrame('square');
        setCustomEyeBall('square');
        break;
      case 'leafy':
        setGradient({ type: 'linear', rotation: Math.PI / 4, colorStops: [{ offset: 0, color: '#11998e' }, { offset: 1, color: '#38ef7d' }] });
        setCornersColor('#11998e');
        setBgColor('#ffffff');
        setCustomPattern('dots');
        setCustomEyeFrame('dot');
        setCustomEyeBall('dot');
        break;
      case 'cosmic':
        setGradient({ type: 'linear', rotation: Math.PI / 4, colorStops: [{ offset: 0, color: '#8A2387' }, { offset: 1, color: '#E94057' }] });
        setCornersColor('#F27121');
        setBgColor('#ffffff');
        setCustomPattern('classy-rounded');
        setCustomEyeFrame('extra-rounded');
        setCustomEyeBall('dot');
        break;
      case 'standard':
      default:
        setGradient(null);
        setDotsColor('#000000');
        setCornersColor('#000000');
        setBgColor('#ffffff');
        setCustomPattern('rounded');
        setCustomEyeFrame('extra-rounded');
        setCustomEyeBall('dot');
        break;
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-[1600px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-xl flex flex-col xl:flex-row overflow-hidden">
        
        {/* LEFT PANEL: Customize Options */}
        <div className="w-full xl:w-[70%] border-b xl:border-b-0 xl:border-r border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col pt-2 pb-6">
           
           <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800/80 px-4 pt-2 pb-[2px] gap-2 lg:gap-6 flex-nowrap scrollbar-hide">
              {['DATA', 'QR SHAPES', 'COLORS', 'PATTERNS', 'LOGOS', 'PRESETS'].map(t => (
                 <button 
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-5 py-3 text-[11px] lg:text-[12px] font-extrabold tracking-widest uppercase whitespace-nowrap transition-all duration-200 border-b-[2px] ${activeTab === t ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                 >
                    {t}
                 </button>
              ))}
           </div>
           
           {/* TAB CONTENT AREAS */}
           <div className="p-6 md:p-8 flex-1 overflow-y-auto scrollbar-hide">
              {activeTab === 'DATA' && (
                 <div className="space-y-8 max-w-2xl">
                    <div className="flex flex-wrap gap-3 mb-8">
                       {(['URL', 'Text', 'Email', 'SMS', 'Phone', 'WiFi', 'vCard'] as QrType[]).map(t => (
                         <button key={t} onClick={() => setQrType(t)} className={`px-5 py-3 rounded-2xl text-[13px] font-bold transition-all border ${qrType === t ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/30 ring-offset-1 dark:ring-offset-[#1A1A1A] scale-[1.02]' : 'bg-white border-slate-200 text-slate-600 dark:bg-[#1A1A1A] dark:border-[#2A2A2A] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#222] hover:scale-105'}`}>
                           {t === 'URL' && <Link className="w-4 h-4 inline mr-2 opacity-80" />}
                           {t === 'Text' && <TypeIcon className="w-4 h-4 inline mr-2 opacity-80" />}
                           {t === 'Email' && <Mail className="w-4 h-4 inline mr-2 opacity-80" />}
                           {t === 'SMS' && <MessageSquare className="w-4 h-4 inline mr-2 opacity-80" />}
                           {t === 'Phone' && <Phone className="w-4 h-4 inline mr-2 opacity-80" />}
                           {t === 'WiFi' && <Wifi className="w-4 h-4 inline mr-2 opacity-80" />}
                           {t === 'vCard' && <Contact className="w-4 h-4 inline mr-2 opacity-80" />}
                           {t}
                         </button>
                       ))}
                    </div>

                    <div className="bg-slate-50 dark:bg-[#1A1A1A] p-6 rounded-[2rem] border border-slate-100 dark:border-[#2A2A2A]">
                    {qrType === 'URL' && (
                      <div className="animate-in fade-in zoom-in-95 duration-300">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 ml-1">Website URL</label>
                        <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#333] px-5 py-4 rounded-2xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                      </div>
                    )}
                    {qrType === 'Text' && (
                      <div className="animate-in fade-in zoom-in-95 duration-300">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 ml-1">Plain Text</label>
                        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter any text you want to encode..." className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#333] px-5 py-4 rounded-2xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm min-h-[160px] placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                      </div>
                    )}
                    </div>
                 </div>
              )}

                  {activeTab === 'QR SHAPES' && (
                 <div className="animate-in fade-in zoom-in-95 duration-400 space-y-8">
                    {/* High-end Segmented Switch */}
                    <div className="flex bg-slate-100 dark:bg-[#111111] p-1.5 rounded-full max-w-lg shadow-inner border border-slate-200/50 dark:border-[#2A2A2A]">
                      <button
                        onClick={() => setStickerMode('sticker')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-bold tracking-wide uppercase rounded-full transition-all duration-300 ${stickerMode === 'sticker' ? 'bg-white dark:bg-[#222] text-indigo-600 dark:text-indigo-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                      >
                         ✨ Graphic Sticker Frames
                      </button>
                      <button
                        onClick={() => setStickerMode('silhouette')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-bold tracking-wide uppercase rounded-full transition-all duration-300 ${stickerMode === 'silhouette' ? 'bg-white dark:bg-[#222] text-indigo-600 dark:text-indigo-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                      >
                         👤 Silhouette Cut Masks
                      </button>
                    </div>

                    {stickerMode === 'sticker' ? (
                       <div className="space-y-8 animate-in fade-in duration-300">
                          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 px-6 py-5 rounded-[2rem] flex items-start md:items-center gap-4 text-amber-900 dark:text-amber-200 shadow-sm">
                             <div className="bg-amber-100 dark:bg-amber-500/20 p-2.5 rounded-2xl flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                             </div>
                             <span className="text-sm leading-relaxed font-medium">Embed your complete QR code safely inside creative, themed sticker frame vector silhouettes! This ensures 100% data preservation and professional physical print quality.</span>
                          </div>

                          {/* Grid of Sticker types */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                             {[
                               { id: 'polaroid', label: 'Vintage Polaroid', icon: ImageIcon, desc: 'Classic retro card featuring an elegant serif caption label' },
                               { id: 'balloon', label: 'Heart Balloon', icon: Heart, desc: 'Puffy pink heart balloon with gloss cartoon highlights and string' },
                               { id: 'speech', label: 'Chat Dialog Box', icon: MessageSquare, desc: 'Sleek communication bubble complete with dialogue tip' },
                               { id: 'computer', label: 'Retro Computer', icon: Tv, desc: 'Classic vintage PC terminal monitor enclosing the QR code' },
                               { id: 'shield', label: 'Golden Shield', icon: Shield, desc: 'Premium verified protection badge with golden sashes' },
                               { id: 'cat', label: 'Cute Kitty Cat', icon: Sparkles, desc: 'Playful orange feline template with whiskers and ears' },
                               { id: 'music', label: 'Vinyl Track Player', icon: Music, desc: 'Modern audio layout with linear scrubber line and media controllers' }
                             ].map(t => {
                                const IconComp = t.icon;
                                const isSelected = stickerTemplate === t.id;
                                return (
                                   <button
                                     key={t.id}
                                     onClick={() => { setStickerTemplate(t.id as any); if (t.id === 'balloon') { setStickerCaption('TAP ME!'); } else if (t.id === 'cat') { setStickerCaption('MEOW!'); } else if (t.id === 'music') { setStickerCaption('PLAY MUSIC!'); } }}
                                     className={`p-5 rounded-[2rem] border-[2px] text-left flex flex-col justify-between transition-all duration-300 outline-none hover:-translate-y-1 ${isSelected ? 'border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-500/10 dark:border-indigo-500 dark:bg-[#111111]' : 'border-slate-100 dark:border-[#2A2A2A] bg-[#FAFAFA] hover:bg-white hover:border-slate-300 hover:shadow-md dark:bg-[#161616] dark:hover:bg-[#1A1A1A] dark:hover:border-[#333]'}`}
                                   >
                                      <div className="flex items-center gap-4 mb-3">
                                         <div className={`p-3 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'bg-slate-200 text-slate-600 dark:bg-[#2A2A2A] dark:text-slate-400'}`}>
                                            <IconComp className="w-5 h-5" />
                                         </div>
                                         <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{t.label}</span>
                                      </div>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{t.desc}</p>
                                   </button>
                                );
                             })}
                          </div>

                          {/* Dynamic Custom parameters for Stickers */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                             <div className="bg-[#FAFAFA] dark:bg-[#161616] border border-slate-100 dark:border-[#2A2A2A] p-6 rounded-[2rem] shadow-sm">
                                <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-3 tracking-wider">Sticker Caption Text</label>
                                <input
                                  type="text"
                                  value={stickerCaption}
                                  onChange={e => setStickerCaption(e.target.value)}
                                  placeholder="SCAN ME!"
                                  className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#333] px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white font-bold text-[13px] shadow-sm transition-all text-center tracking-wide uppercase"
                                  maxLength={22}
                                />
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-medium">Personalize the text written on the sticker plate template.</p>
                             </div>

                             <div className="bg-[#FAFAFA] dark:bg-[#161616] border border-slate-100 dark:border-[#2A2A2A] p-6 rounded-[2rem] shadow-sm flex flex-col justify-center">
                                <label className="flex items-center gap-4 cursor-pointer select-none group">
                                   <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 transition duration-300 ease-in-out shrink-0">
                                      <input type="checkbox" checked={sticker3D} onChange={e => setSticker3D(e.target.checked)} className="peer absolute left-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                                      <span className={`absolute left-0 w-full h-full rounded-full transition-colors duration-300 ${sticker3D ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-[#333]'}`}></span>
                                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 cubic-bezier(0.4,0.0,0.2,1) shadow-sm ${sticker3D ? 'transform translate-x-6' : ''}`}></span>
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Enable 3D Silhouette Outline</span>
                                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Adds a sleek, physical die-cut white contour border and drop shadow.</span>
                                   </div>
                                </label>
                             </div>
                          </div>
                       </div>
                    ) : (
                       <div className="space-y-8 animate-in fade-in duration-300">
                          <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-500/20 px-6 py-5 rounded-[2rem] flex items-start md:items-center gap-4 text-indigo-900 dark:text-indigo-200 shadow-sm">
                             <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2.5 rounded-2xl flex-shrink-0">
                                <Shapes className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                             </div>
                             <span className="text-sm leading-relaxed font-medium">Shape your QR code's actual pixel grid into a unique silhouette profile. Sets the ECL level to Maximum (H-30%) and shields finder squares for optimal scans.</span>
                          </div>

                          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-4">
                            {SHAPE_KEYS.map(s => (
                               <button 
                                 key={s} 
                                 title={s}
                                 onClick={() => setShapeMode(s as any)}
                                 className={`aspect-square rounded-[1.5rem] border-2 flex items-center justify-center p-3 sm:p-4 transition-all duration-300 outline-none hover:-translate-y-1 ${shapeMode === s ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-500/20 scale-[1.05] dark:bg-[#111111] dark:border-indigo-500' : 'border-slate-100 dark:border-[#2A2A2A] hover:border-slate-300 dark:hover:border-[#333] bg-[#FAFAFA] dark:bg-[#161616] hover:bg-white hover:shadow-md'}`}
                               >
                                  <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-sm transition-colors ${shapeMode === s ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-300'}`}>
                                    <defs>{MOCK_QR_PATTERN}</defs>
                                    {s === 'default' && <rect x="5" y="5" width="90" height="90" fill="url(#qr-pattern)" stroke="currentColor" strokeWidth="4" rx="4" />}
                                    {s === 'circle' && <circle cx="50" cy="50" r="45" fill="url(#qr-pattern)" stroke="currentColor" strokeWidth="4" />}
                                    {s !== 'default' && s !== 'circle' && paths[s] && (
                                       <path d={paths[s]} fill="url(#qr-pattern)" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                                    )}
                                  </svg>
                               </button>
                            ))}
                          </div>

                          {shapeMode !== 'default' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                               <div className="bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-slate-100 dark:border-[#2A2A2A] p-6 rounded-[2rem] shadow-sm">
                                 <label className="flex justify-between items-center text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-4 tracking-wider">
                                   <span>Shape Outer Margin</span>
                                   <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-[#111111] px-3 py-1 rounded-full">{shapePadding}px</span>
                                 </label>
                                 <input type="range" min="0" max="40" step="1" value={shapePadding} onChange={e => setShapePadding(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                 <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium">Adjust space around the outer silhouette boundary.</p>
                               </div>

                               <div className="bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-slate-100 dark:border-[#2A2A2A] p-6 rounded-[2rem] shadow-sm">
                                 <label className="flex justify-between items-center text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 mb-4 tracking-wider">
                                   <span>ECL Max Masking Budget</span>
                                   <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-[#111111] px-3 py-1 rounded-full">H-{eclPercent}%</span>
                                 </label>
                                 <input type="range" min="1" max="30" step="1" value={eclPercent} onChange={e => setEclPercent(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                 <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium">Allows you to scale error correction level from 1% to 30% for ultimate mask detail control.</p>
                               </div>
                             </div>
                          )}
                       </div>
                    )}
                 </div>
              )}

              {activeTab === 'COLORS' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl animate-in fade-in zoom-in-95 duration-400">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 ml-1">Export Resolution Limit</label>
                      <div className="flex bg-white dark:bg-[#1A1A1A] rounded-3xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden outline-none focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all shadow-sm">
                         <div className="px-6 py-4 bg-slate-50 dark:bg-[#111111] border-r border-slate-200 dark:border-[#2A2A2A] text-sm font-bold text-slate-500 dark:text-slate-400 min-w-[80px] text-center shrink-0 flex items-center justify-center">{size}px</div>
                         <div className="flex-1 px-6 flex items-center relative py-4">
                            <input type="range" min="100" max="2000" step="10" value={size} onChange={e => setSize(Number(e.target.value))} className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 relative z-10" />
                         </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-[#1A1A1A] p-6 rounded-[2rem] border border-slate-100 dark:border-[#2A2A2A]">
                       <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 ml-1">Foreground Color</label>
                       <div className="flex bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#333] overflow-hidden outline-none focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all shadow-sm p-1">
                         <input type="color" value={dotsColor} onChange={e => { setDotsColor(e.target.value); setGradient(null); setCornersColor(e.target.value); }} className="w-12 h-12 rounded-xl border-2 border-white dark:border-[#111111] shadow-sm cursor-pointer p-0" style={{minWidth: "48px"}} />
                         <input type="text" value={dotsColor} onChange={e => { setDotsColor(e.target.value); setGradient(null); setCornersColor(e.target.value); }} className="w-full bg-transparent px-4 text-sm font-bold uppercase tracking-wider outline-none text-slate-700 dark:text-slate-200" />
                       </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1A1A1A] p-6 rounded-[2rem] border border-slate-100 dark:border-[#2A2A2A]">
                       <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 ml-1">Canvas Background</label>
                       <div className="flex bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#333] overflow-hidden outline-none focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all shadow-sm p-1">
                         <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-12 h-12 rounded-xl border-2 border-white dark:border-[#111111] shadow-sm cursor-pointer p-0" style={{minWidth: "48px"}} />
                         <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full bg-transparent px-4 text-sm font-bold uppercase tracking-wider outline-none text-slate-700 dark:text-slate-200" />
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'PATTERNS' && (
                 <div className="space-y-10 max-w-4xl animate-in fade-in zoom-in-95 duration-400">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 ml-1">Data Pixel Matrix Style</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                         {[
                           { id: 'square', icon: <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor"/>, label: 'Square' },
                           { id: 'dots', icon: <circle cx="12" cy="12" r="8" fill="currentColor"/>, label: 'Dots' },
                           { id: 'rounded', icon: <rect x="3" y="3" width="18" height="18" rx="6" fill="currentColor"/>, label: 'Rounded' },
                           { id: 'extra-rounded', icon: <rect x="3" y="3" width="18" height="18" rx="9" fill="currentColor"/>, label: 'Smooth' },
                           { id: 'classy', icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>, label: 'Classy' },
                           { id: 'classy-rounded', icon: <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 15a5 5 0 1 1 5-5 5 5 0 0 1-5 5z" fill="currentColor"/>, label: 'Classy Round' },
                           { id: 'vertical', icon: <rect x="6" y="2" width="12" height="20" rx="3" fill="currentColor"/>, label: 'Vertical' },
                           { id: 'horizontal', icon: <rect x="2" y="6" width="20" height="12" rx="3" fill="currentColor"/>, label: 'Horizontal' },
                           { id: 'cross', icon: <path d="M16 8h-2V6c0-1.1-.9-2-2-2s-2 .9-2 2v2H8c-1.1 0-2 .9-2 2s.9 2 2 2h2v2c0 1.1.9 2 2 2s2-.9 2-2v-2h2c1.1 0 2-.9 2-2s-.9-2-2-2z" fill="currentColor"/>, label: 'Cross' },
                           { id: 'diamond', icon: <path d="M12 2L2 12l10 10 10-10L12 2z" fill="currentColor"/>, label: 'Diamond' },
                           { id: 'heart', icon: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>, label: 'Heart' },
                           { id: 'leaf', icon: <path d="M17 3H7c-1.1 0-2 .9-2 2v14l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"/>, label: 'Leaf' },
                           { id: 'circle-clusters', icon: <g fill="currentColor"><circle cx="7" cy="7" r="3.5"/><circle cx="17" cy="7" r="3.5"/><circle cx="7" cy="17" r="3.5"/><circle cx="17" cy="17" r="3.5"/></g>, label: 'Clusters' },
                           { id: 'target', icon: <g fill="currentColor"><circle cx="12" cy="12" r="10" fillOpacity="0.3"/><circle cx="12" cy="12" r="5"/></g>, label: 'Target' },
                           { id: 'ninja', icon: <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor"/>, label: 'Ninja' }
                         ].map(pat => (
                            <button
                               key={pat.id}
                               onClick={() => setCustomPattern(pat.id as any)}
                               className={`flex flex-col items-center justify-center p-4 md:p-5 rounded-[1.5rem] border-[2px] transition-all duration-300 group outline-none hover:-translate-y-1 hover:shadow-lg ${customPattern === pat.id ? 'border-indigo-600 bg-indigo-50 shadow-indigo-500/20 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400 scale-[1.05]' : 'border-slate-100 dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#161616] hover:border-slate-300 dark:hover:border-[#444] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >
                               <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 mb-3 drop-shadow-sm transition-transform group-hover:scale-110">
                                  {pat.icon}
                               </svg>
                               <span className="text-[11px] font-bold uppercase tracking-widest">{pat.label}</span>
                            </button>
                         ))}
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[13px] font-extrabold uppercase text-slate-800 dark:text-slate-200 mb-5 tracking-widest pl-2">Outer Eye Frame Border</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                         {[
                           { id: 'square', icon: <path d="M3 3h18v18H3V3zm4 4v10h10V7H7z" fill="currentColor"/>, label: 'Square' },
                           { id: 'dot', icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="currentColor"/>, label: 'Circle' },
                           { id: 'extra-rounded', icon: <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm0 4v10h10V7H7z" fill="currentColor"/>, label: 'Rounded' },
                           { id: 'leaf', icon: <path d="M3 12c0-4.97 4.03-9 9-9 0 0 9 0 9 9s-4.03 9-9 9c0 0-9 0-9-9zM7 12c0 2.76 2.24 5 5 5h5c0-2.76-2.24-5-5-5H7z" fill="currentColor"/>, label: 'Leaf' },
                           { id: 'shield', icon: <path d="M3 3h18v9c0 4.97-4.03 9-9 9s-9-4.03-9-9V3zm4 4v5c0 2.76 2.24 5 5 5s5-2.24 5-5V7H7z" fill="currentColor"/>, label: 'Shield' },
                           { id: 'octagon', icon: <path d="M8 2h8l6 6v8l-6 6H8l-6-6V8l6-6zm1.66 4L6 9.66v4.68L9.66 18h4.68L18 14.34V9.66L14.34 6H9.66z" fill="currentColor"/>, label: 'Octagon' },
                           { id: 'rotate-square', icon: <path d="M12 2L2 12l10 10 10-10L12 2zm0 5.66L18.34 12 12 18.34 5.66 12 12 7.66z" fill="currentColor"/>, label: 'Diamond' },
                           { id: 'double-ring', icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm0 2c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="currentColor"/>, label: 'Double Ring' },
                           { id: 'stitched', icon: <path d="M3 3h4v4H3V3zm7 0h4v4h-4V3zm7 0h4v4h-4V3zM3 10h4v4H3v-4zm14 0h4v4h-4v-4zM3 17h4v4H3v-4zm7 0h4v4h-4v-4zm7 0h4v4h-4v-4z" fill="currentColor"/>, label: 'Stitched' },
                           { id: 'brackets', icon: <path d="M9 3H5v18h4v-4H7V7h2V3zm6 0h4v18h-4v-4h2V7h-2V3z" fill="currentColor"/>, label: 'Brackets' },
                           { id: 'fluid', icon: <path d="M12 2v20c-5.52 0-10-4.48-10-10S6.48 2 12 2zm-6 10c0 3.31 2.69 6 6 6V6c-3.31 0-6 2.69-6 6z" fill="currentColor"/>, label: 'Fluid' },
                           { id: 'minimalist', icon: <path d="M5 5h14v14H5V5zm2 2v10h10V7H7z" fill="currentColor"/>, label: 'Minimalist' },
                           { id: 'microwave', icon: <path d="M4 4h16v16H4V4zm4 4v8h8V8H8z" fill="currentColor"/>, label: 'Microwave' }
                         ].map(cor => (
                            <button
                               key={cor.id}
                               onClick={() => setCustomEyeFrame(cor.id)}
                               className={`flex items-center gap-3 p-4 md:p-5 rounded-[1.5rem] border-[2px] transition-all duration-300 group outline-none hover:-translate-y-1 hover:shadow-lg ${customEyeFrame === cor.id ? 'border-indigo-600 bg-indigo-50 shadow-indigo-500/20 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400 scale-[1.05]' : 'border-slate-100 dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#161616] hover:border-slate-300 dark:hover:border-[#444] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >
                               <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 drop-shadow-sm transition-transform group-hover:scale-110">
                                  {cor.icon}
                               </svg>
                               <span className="text-[11px] font-bold uppercase tracking-widest text-left leading-tight">{cor.label}</span>
                            </button>
                         ))}
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[13px] font-extrabold uppercase text-slate-800 dark:text-slate-200 mb-5 tracking-widest pl-2 mt-6">Inner Eye Ball Shape</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                         {[
                           { id: 'square', icon: <path d="M6 6h12v12H6z" fill="currentColor"/>, label: 'Square' },
                           { id: 'dot', icon: <circle cx="12" cy="12" r="6" fill="currentColor"/>, label: 'Circle' },
                           { id: 'rounded', icon: <rect x="6" y="6" width="12" height="12" rx="3" fill="currentColor"/>, label: 'Rounded' },
                           { id: 'diamond', icon: <path d="M12 4L4 12l8 8 8-8-8-8z" fill="currentColor"/>, label: 'Diamond' },
                           { id: 'leaf', icon: <path d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6c0 0-6 0-6-6z" fill="currentColor"/>, label: 'Leaf' },
                           { id: 'pillow', icon: <path d="M12 4c-1.1 2.2-2.8 3.9-5 5 2.2 1.1 3.9 2.8 5 5 1.1-2.2 2.8-3.9 5-5-2.2-1.1-3.9-2.8-5-5z" fill="currentColor"/>, label: 'Pillow' },
                           { id: 'vertical-capsule', icon: <rect x="8" y="4" width="8" height="16" rx="4" fill="currentColor"/>, label: 'Vertical' },
                           { id: 'horizontal-capsule', icon: <rect x="4" y="8" width="16" height="8" rx="4" fill="currentColor"/>, label: 'Horizontal' },
                           { id: 'right-triangle', icon: <path d="M8 5v14l11-7z" fill="currentColor"/>, label: 'Right Tri' },
                           { id: 'up-triangle', icon: <path d="M12 5l-7 11h14z" fill="currentColor"/>, label: 'Up Tri' },
                           { id: 'heart', icon: <path d="M12 20.1l-1.2-1.1C6.4 15.1 3.6 12.5 3.6 9.3 3.6 6.8 5.6 4.8 8.1 4.8c1.4 0 2.8.7 3.9 1.7 1-.9 2.4-1.7 3.9-1.7 2.5 0 4.5 2 4.5 4.5 0 3.2-2.8 5.8-7.2 9.7L12 20.1z" fill="currentColor"/>, label: 'Heart' },
                           { id: 'star', icon: <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>, label: 'Star' },
                           { id: 'cross', icon: <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" fill="currentColor"/>, label: 'Cross' },
                           { id: 'fluid', icon: <path d="M12 3S5 9 5 14.5C5 18.09 8.13 21 12 21s7-2.91 7-6.5C19 9 12 3 12 3z" fill="currentColor"/>, label: 'Drop' },
                           { id: 'target', icon: <g fill="currentColor"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="white"/></g>, label: 'Target' },
                           { id: 'sliced', icon: <path d="M12 4v7h7c0-3.87-3.13-7-7-7zM5 12h7v7c-3.87 0-7-3.13-7-7zM19 13h-6v6h6v-6zM11 5H5v6h6V5z" fill="currentColor"/>, label: 'Sliced' },
                           { id: 'ninja', icon: <path d="M12 4C9 8 8 9 4 12C8 15 9 16 12 20C15 16 16 15 20 12C16 9 15 8 12 4Z" fill="currentColor"/>, label: 'Ninja' },
                           { id: 'teardrop', icon: <path d="M12 4C12 4 6 10.36 6 14.5C6 17.54 8.69 20 12 20C15.31 20 18 17.54 18 14.5C18 10.36 12 4 12 4Z" fill="currentColor"/>, label: 'Teardrop' },
                           { id: 'heavy-plus', icon: <path d="M18 10h-4V6c0-1.1-.9-2-2-2s-2 .9-2 2v4H6c-1.1 0-2 .9-2 2s.9 2 2 2h4v4c0 1.1.9 2 2 2s2-.9 2-2v-4h4c1.1 0 2-.9 2-2s-.9-2-2-2z" fill="currentColor"/>, label: 'Heavy+' }
                         ].map(cor => (
                            <button
                               key={cor.id}
                               onClick={() => setCustomEyeBall(cor.id)}
                               className={`flex flex-col items-center justify-center p-4 md:p-5 rounded-[1.5rem] border-[2px] transition-all duration-300 group outline-none hover:-translate-y-1 hover:shadow-lg ${customEyeBall === cor.id ? 'border-indigo-600 bg-indigo-50 shadow-indigo-500/20 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400 scale-[1.05]' : 'border-slate-100 dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#161616] hover:border-slate-300 dark:hover:border-[#444] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >
                               <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 mb-3 drop-shadow-sm transition-transform group-hover:scale-110">
                                  {cor.icon}
                               </svg>
                               <span className="text-[11px] font-bold uppercase tracking-widest leading-tight">{cor.label}</span>
                            </button>
                         ))}
                      </div>
                    </div>
                 </div>
              )}

              {activeTab === 'PRESETS' && (
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-5 animate-in fade-in zoom-in-95 duration-400">
                   <button onClick={() => applyPreset('standard')} className="px-6 py-8 bg-[#FAFAFA] dark:bg-[#1A1A1A] rounded-[2rem] font-extrabold border-[2px] border-slate-100 dark:border-[#2A2A2A] hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 text-sm tracking-wide">Standard Light</button>
                   <button onClick={() => applyPreset('ocean')} className="px-6 py-8 rounded-[2rem] font-extrabold text-white shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all border-0 text-sm tracking-wide relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #2193b0, #6dd5ed)' }}>
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />Midnight Ocean
                   </button>
                   <button onClick={() => applyPreset('sunset')} className="px-6 py-8 rounded-[2rem] font-extrabold text-white shadow-lg hover:shadow-2xl hover:shadow-orange-500/30 hover:-translate-y-1 transition-all border-0 text-sm tracking-wide relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }}>
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />Sunset Vibes
                   </button>
                   <button onClick={() => applyPreset('cyberpunk')} className="px-6 py-8 rounded-[2rem] font-extrabold text-white shadow-lg hover:shadow-2xl hover:shadow-pink-500/30 hover:-translate-y-1 transition-all border-0 text-sm tracking-wide relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #f953c6, #0f0c29)' }}>
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />Cyberpunk
                   </button>
                   <button onClick={() => applyPreset('leafy')} className="px-6 py-8 rounded-[2rem] font-extrabold text-white shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all border-0 text-sm tracking-wide relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}>
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />Forest Canopy
                   </button>
                   <button onClick={() => applyPreset('cosmic')} className="px-6 py-8 rounded-[2rem] font-extrabold text-white shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-1 transition-all border-0 text-sm tracking-wide relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #8A2387, #E94057)' }}>
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />Cosmic Nova
                   </button>
                 </div>
              )}

              {activeTab === 'LOGOS' && (
                 <div className="max-w-2xl animate-in fade-in duration-300">
                   <div className="flex flex-col sm:flex-row gap-6 items-start">
                     {!logoImage ? (
                       <label className="flex flex-col items-center justify-center w-full sm:w-40 h-40 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#161616] rounded-3xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-[#1A1A1A] cursor-pointer transition-all hover:shadow-md">
                         <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-3">
                           <ImageIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                         </div>
                         <span className="text-xs text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest">Upload Logo</span>
                         <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                       </label>
                     ) : (
                       <div className="relative w-full sm:w-40 h-40 border border-slate-200 dark:border-[#2A2A2A] rounded-3xl overflow-hidden bg-white dark:bg-[#111111] flex items-center justify-center p-4 group shadow-sm">
                         <img src={logoImage} alt="Logo" className="max-w-full max-h-full object-contain" />
                         <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => setLogoImage(null)} className="bg-white text-slate-900 p-3 rounded-full mb-2 hover:bg-red-500 hover:text-white transition-colors shadow-lg">
                             <X className="w-6 h-6" />
                           </button>
                         </div>
                       </div>
                     )}

                     {logoImage && (
                       <div className="flex-1 w-full bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-slate-100 dark:border-[#2A2A2A] p-6 rounded-3xl shadow-sm">
                         <label className="flex justify-between items-center text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-5 tracking-wider">
                           <span>Logo Edge Margin</span>
                           <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-[#111111] px-3 py-1 rounded-full">{logoMargin}px</span>
                         </label>
                         <input type="range" min="0" max="40" value={logoMargin} onChange={e => setLogoMargin(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                         <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium">Adjust margin to cut a clear hole around your logo, ensuring that the QR matrix doesn't overlap and break scannability.</p>
                       </div>
                     )}
                   </div>
                 </div>
              )}
           </div>
        </div>

        {/* RIGHT PANEL: Live Preview */}
        <div className="w-full xl:w-[30%] bg-slate-100/50 dark:bg-black/40 flex flex-col items-center justify-center p-8 lg:p-12 border-l border-white dark:border-slate-800/50 shrink-0">
           {/* QR Output */}
           <div className="w-full max-w-[400px] aspect-square relative flex justify-center items-center rounded-3xl bg-white dark:bg-slate-900 p-4 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-slate-200/50 dark:border-slate-700/50 mb-8 transition-transform hover:scale-[1.02] duration-300">
              <div className="absolute inset-4 rounded-2xl z-0 opacity-5 dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }} />
              <div ref={qrRef} className="relative z-10 w-full h-full flex justify-center items-center pointer-events-none drop-shadow-xl [&>svg]:!w-full [&>svg]:!h-full [&>canvas]:!w-full [&>canvas]:!h-full" />
           </div>

           <div className="w-full max-w-[400px] flex flex-col gap-4">
               <label className="flex items-center gap-3 cursor-pointer select-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <input type="checkbox" checked={useTransparentBg} onChange={e => setUseTransparentBg(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-600" />
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Transparent Background</span>
                     <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">For PNG output</span>
                  </div>
               </label>

              <button 
                 onClick={onDownload}
                 disabled={!data}
                 className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 <Download className="w-5 h-5" /> Export QR Code
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
