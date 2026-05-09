'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __HantaUpdatesMonetagLoaded?: boolean;
  }
}

type MonetagZone = {
  id: string;
  zone: string;
  src: string;
};

const MONETAG_ZONES: MonetagZone[] = [
  {
    id: 'monetag-in-page-push-banner',
    zone: process.env.NEXT_PUBLIC_MONETAG_IN_PAGE_ZONE || '',
    src: process.env.NEXT_PUBLIC_MONETAG_IN_PAGE_SRC || '',
  },
  {
    id: 'monetag-good-tag-onclick-popunder',
    zone: process.env.NEXT_PUBLIC_MONETAG_POPUNDER_ZONE || '',
    src: process.env.NEXT_PUBLIC_MONETAG_POPUNDER_SRC || '',
  },
  {
    id: 'monetag-pungent-vignette',
    zone: process.env.NEXT_PUBLIC_MONETAG_VIGNETTE_ZONE || '',
    src: process.env.NEXT_PUBLIC_MONETAG_VIGNETTE_SRC || '',
  },
].filter((item) => item.zone && item.src);

function appendMonetagScript(item: MonetagZone): void {
  if (document.getElementById(item.id)) {
    return;
  }

  const script = document.createElement('script');

  script.id = item.id;
  script.async = true;
  script.dataset.zone = item.zone;
  script.dataset.cfasync = 'false';
  script.src = item.src;

  document.body.appendChild(script);
}

export function MonetagScripts() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (MONETAG_ZONES.length === 0) {
      return;
    }

    if (window.__HantaUpdatesMonetagLoaded) {
      return;
    }

    window.__HantaUpdatesMonetagLoaded = true;

    for (const item of MONETAG_ZONES) {
      appendMonetagScript(item);
    }
  }, []);

  return null;
}