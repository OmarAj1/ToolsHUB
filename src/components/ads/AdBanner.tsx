import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
  adSlot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
}

export function AdBanner({ className = '', adSlot, format = 'auto', responsive = true }: AdBannerProps) {
  const adClient = (import.meta as any).env.VITE_GOOGLE_ADSENSE_CLIENT || "ca-pub-8230840732478158";
  const isDev = (import.meta as any).env.DEV;
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Only push if we have a client ID and the element hasn't been initialized by AdSense yet
    if (adClient && insRef.current && !insRef.current.hasAttribute('data-adsbygoogle-status')) {
      const timeoutId = setTimeout(() => {
        if (insRef.current && !insRef.current.hasAttribute('data-adsbygoogle-status')) {
          try {
            if (insRef.current.clientWidth > 0) {
              const adsbygoogle = (window as any).adsbygoogle || [];
              adsbygoogle.push({});
            }
          } catch (err: any) {
            // Ignore expected errors due to React Strict Mode or fast re-renders
            if (err.message && !err.message.includes('already have ads') && !err.message.includes('No slot size')) {
              console.warn('Google AdSense banner issue:', err.message);
            }
          }
        }
      }, 150); // Short delay to allow layout calculations avoiding "availableWidth=0" error
      return () => clearTimeout(timeoutId);
    }
  }, [adClient, adSlot]);

  if (!adClient) {
    if (isDev) {
      return (
        <div className={`flex items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-400 dark:text-slate-500 text-sm ${className}`}>
          [Google Ad Banner Placeholder - Configure VITE_GOOGLE_ADSENSE_CLIENT]
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`overflow-hidden rounded-xl flex justify-center ${className} min-h-[90px] min-w-[250px]`}>
      <ins
        ref={insRef}
        className="adsbygoogle block w-full"
        style={{ display: 'block', minWidth: '250px' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
