import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling, { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';
import { Download, Image as ImageIcon, Link, Type as TypeIcon, Wifi, Mail, MessageSquare, Phone, Contact, Palette, Shapes, SlidersHorizontal, Sparkles, ImagePlus, X, Music, Shield, Tv, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { QrType, paths, SHAPE_KEYS, ShapeMode, MOCK_QR_PATTERN } from './qr-constants';
import { QrDataTab } from './components/QrDataTab';
import { QrColorsTab } from './components/QrColorsTab';

import { QrPatternsTab } from './components/QrPatternsTab';
import { QrPresetsTab } from './components/QrPresetsTab';
import { QrLogosTab } from './components/QrLogosTab';
import { QrShapesTab } from './components/QrShapesTab';

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
  const [stickerMode, setStickerMode] = useState<'sticker' | 'silhouette' | 'container'>('sticker');
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

  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      tabsScrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

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

            if (stickerMode === 'container') {
                ctx.save();
                ctx.scale(size / 500, size / 500);
                
                if (sticker3D) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.14)';
                    ctx.shadowBlur = 12;
                    ctx.shadowOffsetY = 8;
                }
                
                const getContainerPath = () => {
                    const p = new Path2D();
                    if (stickerTemplate === 'cat') {
                        p.arc(250, 250, 180, 0, 2*Math.PI);
                        p.moveTo(110, 160); p.lineTo(100, 40); p.lineTo(210, 130); p.closePath();
                        p.moveTo(390, 160); p.lineTo(400, 40); p.lineTo(290, 130); p.closePath();
                    } else if (stickerTemplate === 'shield') {
                        p.moveTo(250, 50);
                        p.lineTo(400, 90);
                        p.quadraticCurveTo(400, 270, 250, 430);
                        p.quadraticCurveTo(100, 270, 100, 90);
                        p.closePath();
                    } else {
                        p.arc(250, 250, 180, 0, 2*Math.PI);
                    }
                    return p;
                };
                
                const path = getContainerPath();

                // Drop shadow is drawn by filling the path once
                if (!useTransparentBg) {
                    // Fill with explicit background color
                    ctx.fillStyle = bgColor || '#ffffff';
                    ctx.fill(path);
                } else { // Transparent BG
                    // Fill with white so it acts as standard white container
                    ctx.fillStyle = '#ffffff';
                    ctx.fill(path);
                }
                
                // Clear shadow for subsequent drawing
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;

                // Clip all future drawing to our container shape
                ctx.clip(path);
                
                // Determine module context dynamically from original instance 
                // so sizes align perfectly natively.
                const qrInst = (qrCode as any)._qr;
                const moduleCount = qrInst ? (qrInst as any).getModuleCount() : 33;
                const dCell = 220 / moduleCount; 
                const dummyGridRows = Math.ceil(500 / dCell);
                const dummyGridCols = Math.ceil(500 / dCell);
                
                // Support gradient inside dummy patterns
                if (gradient) {
                    const g = ctx.createLinearGradient(0, 0, 500, 500); 
                    g.addColorStop(0, gradient.colorStops[0].color);
                    g.addColorStop(1, gradient.colorStops[1].color);
                    ctx.fillStyle = g;
                } else {
                    ctx.fillStyle = dotsColor || '#000000';
                }

                const drawPatternDot = (targetCtx: CanvasRenderingContext2D, px: number, py: number, s: number) => {
                    const cx = px + s/2;
                    const cy = py + s/2;
                    const NATIVE_PATTERNS = ['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'];
                    const isCustom = !NATIVE_PATTERNS.includes(customPattern);
                    
                    if (isCustom) {
                        targetCtx.beginPath();
                        if (customPattern === 'vertical') {
                            targetCtx.fillRect(px + s*0.1, py, s*0.8, s + 0.5);
                        } else if (customPattern === 'horizontal') {
                            targetCtx.fillRect(px, py + s*0.1, s + 0.5, s*0.8);
                        } else if (customPattern === 'cross') {
                            targetCtx.fillRect(px + s*0.2, py + s*0.4, s*0.6, s*0.2);
                            targetCtx.fillRect(px + s*0.4, py + s*0.2, s*0.2, s*0.6);
                        } else if (customPattern === 'diamond') {
                            targetCtx.moveTo(cx, py + s*0.1); targetCtx.lineTo(px + s*0.9, cy); targetCtx.lineTo(cx, py + s*0.9); targetCtx.lineTo(px + s*0.1, cy);
                        } else if (customPattern === 'heart') {
                            const hs = s * 0.9; const hx = px + s * 0.05; const hy = py + s * 0.15;
                            targetCtx.moveTo(hx + hs/2, hy + hs*0.25);
                            targetCtx.bezierCurveTo(hx + hs/2, hy, hx, hy, hx, hy + hs*0.25);
                            targetCtx.bezierCurveTo(hx, hy + hs*0.5, hx + hs/2, hy + hs*0.75, hx + hs/2, hy + hs);
                            targetCtx.bezierCurveTo(hx + hs/2, hy + hs*0.75, hx + hs, hy + hs*0.5, hx + hs, hy + hs*0.25);
                            targetCtx.bezierCurveTo(hx + hs, hy, hx + hs/2, hy, hx + hs/2, hy + hs*0.25);
                        } else if (customPattern === 'leaf') {
                            targetCtx.moveTo(px, cy);
                            targetCtx.bezierCurveTo(px + s*0.1, py, px + s*0.9, py, px + s, cy);
                            targetCtx.bezierCurveTo(px + s*0.9, py + s, px + s*0.1, py + s, px, cy);
                        } else if (customPattern === 'circle-clusters') {
                            targetCtx.moveTo(px + s*0.25 + s*0.15, py + s*0.25); targetCtx.arc(px + s*0.25, py + s*0.25, s*0.15, 0, Math.PI*2);
                            targetCtx.moveTo(px + s*0.75 + s*0.15, py + s*0.25); targetCtx.arc(px + s*0.75, py + s*0.25, s*0.15, 0, Math.PI*2);
                            targetCtx.moveTo(px + s*0.25 + s*0.15, py + s*0.75); targetCtx.arc(px + s*0.25, py + s*0.75, s*0.15, 0, Math.PI*2);
                            targetCtx.moveTo(px + s*0.75 + s*0.15, py + s*0.75); targetCtx.arc(px + s*0.75, py + s*0.75, s*0.15, 0, Math.PI*2);
                        } else if (customPattern === 'target') {
                            targetCtx.moveTo(cx + s*0.4, cy); targetCtx.arc(cx, cy, s*0.4, 0, Math.PI*2);
                            targetCtx.moveTo(cx + s*0.15, cy); targetCtx.arc(cx, cy, s*0.15, 0, Math.PI*2);
                        } else if (customPattern === 'ninja') {
                            targetCtx.moveTo(cx, py); targetCtx.quadraticCurveTo(px + s*0.6, py + s*0.4, px + s, cy); targetCtx.quadraticCurveTo(px + s*0.6, py + s*0.6, cx, py + s); targetCtx.quadraticCurveTo(px + s*0.4, py + s*0.6, px, cy); targetCtx.quadraticCurveTo(px + s*0.4, py + s*0.4, cx, py);
                        }
                        targetCtx.fill();
                    } else {
                        targetCtx.beginPath();
                        if (dotsType === 'rounded' || dotsType === 'extra-rounded') {
                            if (targetCtx.roundRect) { targetCtx.roundRect(px, py, s, s, s*0.5); targetCtx.fill(); }
                            else { targetCtx.arc(px+s/2, py+s/2, s/2, 0, 2*Math.PI); targetCtx.fill(); }
                        } else if (dotsType === 'dots') {
                            targetCtx.arc(px+s/2, py+s/2, s/2 * 0.8, 0, 2*Math.PI); targetCtx.fill();
                        } else if (dotsType === 'classy' || dotsType === 'classy-rounded') {
                            if (targetCtx.roundRect) { targetCtx.roundRect(px, py, s, s, s*0.3); targetCtx.fill(); }
                            else { targetCtx.fillRect(px,py, s, s); }
                        } else {
                            targetCtx.fillRect(px, py, s, s);
                        }
                    }
                }

                // Draw condensed dummy dots
                for(let r=0; r<dummyGridRows; r++) {
                    for(let c=0; c<dummyGridCols; c++) {
                        const px = c * dCell;
                        const py = r * dCell;
                        
                        // Protect middle QR area (which is at 120->380, but give some breathing room: 105->395)
                        if (px > 105 && px < 400 && py > 105 && py < 400) continue;
                        
                        // Fake locators mask (avoid drawing dots inside the fake top-left, top-right, bottom-left finders)
                        const isFakeFinder1 = px < dCell * 10 && py < dCell * 10;
                        const isFakeFinder2 = px > 500 - dCell * 10 && py < dCell * 10;
                        const isFakeFinder3 = px < dCell * 10 && py > 500 - dCell * 10;
                        if (isFakeFinder1 || isFakeFinder2 || isFakeFinder3) continue;

                        // Density check: 85% filled instead of just 55%
                        if ((Math.sin(r * 12.345 + c * 67.89) * 10000) % 1 > 0.15) {
                            // Slight variation to make dummy dots less rigid
                            drawPatternDot(ctx, px, py, dCell);
                        }
                    }
                }
                
                // Fake Locator Eyes for dramatic effect
                // They need to be snapped to grid using the proper modular sizing
                const drawFakeFinder = (fCol: number, fRow: number) => {
                    const fx = fCol * dCell;
                    const fy = fRow * dCell;
                    const fSize = dCell * 7;
                    ctx.fillStyle = cornersColor || dotsColor || '#000000';
                    if (ctx.roundRect) {
                        ctx.beginPath(); ctx.roundRect(fx, fy, fSize, fSize, dCell); ctx.fill();
                        ctx.fillStyle = useTransparentBg ? '#ffffff' : (bgColor || '#ffffff');
                        ctx.beginPath(); ctx.roundRect(fx+dCell, fy+dCell, fSize-dCell*2, fSize-dCell*2, dCell*0.5); ctx.fill();
                        ctx.fillStyle = customEyeBall || cornersColor || dotsColor || '#000000';
                        ctx.beginPath(); ctx.roundRect(fx+dCell*2, fy+dCell*2, fSize-dCell*4, fSize-dCell*4, dCell*0.3); ctx.fill();
                    } else {
                        ctx.fillRect(fx, fy, fSize, fSize);
                        ctx.fillStyle = useTransparentBg ? '#ffffff' : (bgColor || '#ffffff');
                        ctx.fillRect(fx+dCell, fy+dCell, fSize-dCell*2, fSize-dCell*2);
                        ctx.fillStyle = customEyeBall || cornersColor || dotsColor || '#000000';
                        ctx.fillRect(fx+dCell*2, fy+dCell*2, fSize-dCell*4, fSize-dCell*4);
                    }
                };
                
                drawFakeFinder(2, 2);
                drawFakeFinder(dummyGridCols - 9, 2);
                drawFakeFinder(2, dummyGridRows - 9);

                ctx.restore();

                // Draw Real QR with white padding
                ctx.save();
                ctx.scale(size / 500, size / 500);
                ctx.fillStyle = '#ffffff';
                if (sticker3D) {
                    ctx.shadowColor = 'rgba(0,0,0,0.1)';
                    ctx.shadowBlur = 10;
                    ctx.shadowOffsetY = 4;
                }
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(120, 120, 260, 260, 24);
                    ctx.fill();
                } else {
                    ctx.fillRect(120, 120, 260, 260);
                }
                
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;
                
                ctx.drawImage(sourceImg, 140, 140, 220, 220);

                ctx.restore();
            } else if (stickerMode === 'sticker') {
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
                        // Reduce padding for a larger container silhouette
                        const computedPadding = (30 - eclPercent) * (size / 300);
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
                    const computedPadding = (30 - eclPercent) * (size / 300);
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
            canvas.style.maxWidth = '100%';
            canvas.style.height = 'auto';
            canvas.style.maxHeight = '550px';
            canvas.style.objectFit = 'contain';
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
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] p-2 md:p-6 lg:p-10 flex flex-col font-sans transition-colors duration-500 selection:bg-indigo-500/30">
      
      <div className="w-full max-w-[1800px] w-[95vw] mx-auto bg-white dark:bg-[#121212] rounded-[3rem] shadow-[0_12px_60px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-[#222] flex flex-col xl:flex-row overflow-hidden relative backdrop-blur-xl">
        
        {/* LEFT PANEL: Customize Options */}
        <div className="w-full xl:w-[70%] flex flex-col border-b xl:border-b-0 xl:border-r border-slate-100 dark:border-[#222] bg-white/50 dark:bg-transparent z-10 relative">
           
           {/* HEADER / BRANDING */}
           <div className="px-6 md:px-12 pt-10 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                 <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                    <Sparkles className="w-8 h-8 text-indigo-500 drop-shadow-sm" /> Matrix QR Studio
                 </h1>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium tracking-wide">Design stunning, highly scannable QR widgets tailored for your brand.</p>
              </div>
           </div>

           {/* SCROLLABLE PILL TABS */}
           <div className="px-6 md:px-12 py-3 border-b border-slate-100 dark:border-[#222] bg-slate-50/50 dark:bg-[#0c0c0c]/50">
              <div className="flex items-center gap-2">
                 <button onClick={() => scrollTabs('left')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#222] text-slate-500 dark:text-slate-400 transition-colors shrink-0">
                    <ChevronLeft className="w-5 h-5" />
                 </button>
                 <div ref={tabsScrollRef} className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide items-center flex-1">
                    {['DATA', 'PRESETS', 'COLORS', 'PATTERNS', 'QR SHAPES', 'LOGOS'].map(t => (
                       <button 
                          key={t}
                          onClick={() => setActiveTab(t)}
                          className={`px-6 py-2.5 text-[13px] font-bold rounded-full whitespace-nowrap transition-all duration-300 tracking-wide border ${activeTab === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25 scale-105' : 'bg-white dark:bg-[#1A1A1A] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#2A2A2A] hover:bg-slate-50 dark:hover:bg-[#222] hover:scale-105'}`}
                       >
                          {t}
                       </button>
                    ))}
                 </div>
                 <button onClick={() => scrollTabs('right')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#222] text-slate-500 dark:text-slate-400 transition-colors shrink-0">
                    <ChevronRight className="w-5 h-5" />
                 </button>
              </div>
           </div>
           
           {/* TAB CONTENT AREAS */}
           <div className="p-6 md:p-12 flex-1 overflow-y-auto scrollbar-hide min-h-[500px]">
              {activeTab === 'DATA' && (
                 <QrDataTab 
                   state={{ qrType, url, text, emailTo, emailSub, emailBody, smsPhone, smsMsg, telPhone, wifiSsid, wifiPass, wifiEnc, wifiHidden, vcFirst, vcLast, vcPhone, vcEmail, vcOrg, vcTitle, vcUrl }}
                   setters={{ setQrType, setUrl, setText, setEmailTo, setEmailSub, setEmailBody, setSmsPhone, setSmsMsg, setTelPhone, setWifiSsid, setWifiPass, setWifiEnc, setWifiHidden, setVcFirst, setVcLast, setVcPhone, setVcEmail, setVcOrg, setVcTitle, setVcUrl }}
                 />
              )}

                  {activeTab === 'QR SHAPES' && (
                 <QrShapesTab 
                   state={{ stickerMode, stickerTemplate, stickerCaption, sticker3D, shapeMode, shapePadding, eclPercent }}
                   setters={{ setStickerMode, setStickerTemplate, setStickerCaption, setSticker3D, setShapeMode, setShapePadding, setEclPercent }}
                 />
              )}

              {activeTab === 'COLORS' && (
                 <QrColorsTab 
                   state={{ size, dotsColor, bgColor }}
                   setters={{ setSize, setDotsColor, setGradient, setCornersColor, setBgColor }}
                 />
              )}

              {activeTab === 'PATTERNS' && (
                 <QrPatternsTab 
                   state={{ customPattern, customEyeFrame, customEyeBall }}
                   setters={{ setCustomPattern, setCustomEyeFrame, setCustomEyeBall }}
                 />
              )}

              {activeTab === 'PRESETS' && (
                 <QrPresetsTab handlers={{ applyPreset }} />
              )}

              {activeTab === 'LOGOS' && (
                 <QrLogosTab 
                   state={{ logoImage, logoMargin }}
                   setters={{ setLogoImage, setLogoMargin }}
                   handlers={{ handleLogoUpload }}
                 />
              )}
           </div>
        </div>

        {/* RIGHT PANEL: Live Preview */}
        <div className="w-full xl:w-[30%] bg-slate-50/80 dark:bg-[#0A0A0A] border-l border-slate-100 dark:border-[#222] p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
           
           {/* Decorative background grid and gradients */}
           <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_100%_100%_at_50%_-20%,rgba(99,102,241,0.15),transparent)] z-0 pointer-events-none" />
           <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] pointer-events-none" />

           <div className="sticky top-12 w-full flex flex-col items-center z-10 space-y-8 overflow-y-auto pb-4 max-h-screen">
              
              {/* STAGE & QR CANVAS */}
              <div className="w-fit h-fit relative flex justify-center items-center rounded-[3rem] bg-white dark:bg-[#161616] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-[#333] transition-transform duration-500 hover:scale-[1.03] group mx-auto max-w-full">
                 {/* Internal grid to show transparency clearly */}
                 <div className="absolute inset-6 rounded-[2.5rem] z-0 opacity-[0.04] dark:opacity-[0.08] overflow-hidden pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)', backgroundSize: '24px 24px', backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px' }} />
                 <div className="max-w-full max-h-[600px] overflow-auto relative z-10 rounded-[2rem] bg-transparent">
                    <div ref={qrRef} className="relative flex justify-center items-center pointer-events-none drop-shadow-2xl transition-all duration-300 group-hover:drop-shadow-[0_20px_30px_rgba(79,70,229,0.2)]" />
                 </div>
              </div>
              
              {/* Controls */}
              <div className="w-full max-w-[420px] space-y-4 pt-2">
                 {/* Transparency Toggle */}
                 <label className="group relative flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-[#161616] border border-slate-100 dark:border-[#222] cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all shadow-sm">
                    <div className="flex flex-col text-left mr-4 relative z-10">
                       <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Transparent Base</span>
                       <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">Remove solid canvas fill for die-cut assets.</span>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 transition duration-300 ease-in-out shrink-0">
                       <input type="checkbox" checked={useTransparentBg} onChange={e => setUseTransparentBg(e.target.checked)} className="peer absolute left-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                       <span className={`absolute left-0 w-full h-full rounded-full transition-colors duration-300 ${useTransparentBg ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-[#333]'}`}></span>
                       <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${useTransparentBg ? 'transform translate-x-6' : ''}`}></span>
                    </div>
                 </label>

                 {/* Download Action */}
                 <button 
                    onClick={onDownload}
                    disabled={!data}
                    className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold py-4 md:py-5 px-6 rounded-3xl transition-all shadow-xl shadow-slate-900/10 dark:shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm overflow-hidden relative group"
                 >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                    <Download className="w-5 h-5 flex-shrink-0 relative z-10 stroke-[2.5]" /> 
                    <span className="relative z-10 tracking-widest text-[13px]">EXPORT QUALITY ASSET</span>
                 </button>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
