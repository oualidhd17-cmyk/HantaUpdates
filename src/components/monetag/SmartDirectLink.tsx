'use client';

import { useEffect } from 'react';

const DIRECT_LINK_URL = process.env.NEXT_PUBLIC_DIRECT_LINK_URL || '';
const STORAGE_KEY = 'HantaUpdates_direct_link_last_clicked';
const COOLDOWN_HOURS = Number(
  process.env.NEXT_PUBLIC_DIRECT_LINK_COOLDOWN_HOURS || 24,
);

function getCooldownMilliseconds(): number {
  const safeHours = Number.isFinite(COOLDOWN_HOURS) && COOLDOWN_HOURS > 0
    ? COOLDOWN_HOURS
    : 24;

  return safeHours * 60 * 60 * 1000;
}

function shouldOpenDirectLink(): boolean {
  try {
    const lastClickedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!lastClickedValue) {
      return true;
    }

    const lastClickedAt = Number(lastClickedValue);

    if (!Number.isFinite(lastClickedAt)) {
      return true;
    }

    return Date.now() - lastClickedAt >= getCooldownMilliseconds();
  } catch {
    return false;
  }
}

function saveDirectLinkClick(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, Date.now().toString());
  } catch {
    // Ignore storage errors.
  }
}

export function SmartDirectLink() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!DIRECT_LINK_URL) {
      return;
    }

    const handleClick = () => {
      if (!shouldOpenDirectLink()) {
        return;
      }

      const popup = window.open(DIRECT_LINK_URL, '_blank', 'noopener,noreferrer');

      if (popup) {
        saveDirectLinkClick();
        document.removeEventListener('click', handleClick);
      }
    };

    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}