'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __HantaUpdatesMonetagLoaded?: boolean;
  }
}

type MonetagZoneKind = 'data-zone' | 'query-zone';

type MonetagZone = {
  id: string;
  zone?: string;
  src: string;
  kind: MonetagZoneKind;
};

/**
 * Active Monetag formats:
 * - In-Page Push
 * - Push Notifications
 *
 * Disabled intentionally:
 * - Multitag
 * - Golden tag
 *
 * Reason:
 * Multitag and Golden tag can trigger click/popunder behavior that is harder
 * to control from the website code.
 */
const MONETAG_ZONES = [
  {
    id: 'monetag-in-page-push',
    zone: '10982926',
    src: 'https://nap5k.com/tag.min.js',
    kind: 'data-zone',
  },
  {
    id: 'monetag-push-notifications',
    src: 'https://5gvci.com/act/files/tag.min.js?z=10982931',
    kind: 'query-zone',
  },
] satisfies MonetagZone[];

function canAppendScript(item: MonetagZone): boolean {
  if (!item.src) {
    return false;
  }

  if (item.kind === 'data-zone' && !item.zone) {
    return false;
  }

  if (document.getElementById(item.id)) {
    return false;
  }

  return true;
}

function appendMonetagScript(item: MonetagZone): void {
  if (!canAppendScript(item)) {
    return;
  }

  const script = document.createElement('script');

  script.id = item.id;
  script.async = true;
  script.type = 'text/javascript';
  script.dataset.cfasync = 'false';
  script.src = item.src;

  if (item.kind === 'data-zone' && item.zone) {
    script.dataset.zone = item.zone;
  }

  document.body.appendChild(script);
}

export function MonetagScripts() {
  useEffect(() => {
    if (typeof window === 'undefined') {
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