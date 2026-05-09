'use client';

import { useEffect } from 'react';

const DIRECT_LINK_URL = 'https://omg10.com/4/10982932';
const SESSION_KEY = 'HantaUpdates_direct_link_opened_this_session';

function wasDirectLinkOpenedThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return true;
  }
}

function markDirectLinkOpenedThisSession(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // Ignore storage errors.
  }
}

function isBlockedClickTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      [
        'input',
        'select',
        'textarea',
        'label',
        'summary',
        '[data-no-direct-link]',
      ].join(','),
    ),
  );
}

export function SmartDirectLink() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!DIRECT_LINK_URL) {
      return;
    }

    if (wasDirectLinkOpenedThisSession()) {
      return;
    }

    const handleFirstUserClick = (event: MouseEvent | TouchEvent) => {
      if (wasDirectLinkOpenedThisSession()) {
        return;
      }

      if (isBlockedClickTarget(event.target)) {
        return;
      }

      markDirectLinkOpenedThisSession();

      window.open(DIRECT_LINK_URL, '_blank', 'noopener,noreferrer');

      document.removeEventListener('click', handleFirstUserClick);
      document.removeEventListener('touchstart', handleFirstUserClick);
    };

    document.addEventListener('click', handleFirstUserClick, {
      passive: true,
    });

    document.addEventListener('touchstart', handleFirstUserClick, {
      passive: true,
    });

    return () => {
      document.removeEventListener('click', handleFirstUserClick);
      document.removeEventListener('touchstart', handleFirstUserClick);
    };
  }, []);

  return null;
}