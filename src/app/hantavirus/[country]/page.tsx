import fs from 'node:fs';
import path from 'node:path';

import type { Metadata } from 'next';

import type { OutbreakCountry } from '@/types/outbreak';
import { CountryPageClient } from './CountryPageClient';

type CountryRouteParams = {
  country: string;
};

type CountryPageProps = {
  params: Promise<CountryRouteParams>;
};

export const dynamicParams = false;

function slugifyCountry(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCountriesFromPublicData(): OutbreakCountry[] {
  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'data',
      'countries.json',
    );

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(fileContent);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as OutbreakCountry[];
  } catch {
    return [];
  }
}

export function generateStaticParams(): CountryRouteParams[] {
  const countries = getCountriesFromPublicData();

  return countries
    .filter((country) => country.country)
    .map((country) => ({
      country: slugifyCountry(country.country),
    }));
}

export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const countries = getCountriesFromPublicData();

  const country = countries.find(
    (item) => slugifyCountry(item.country) === resolvedParams.country,
  );

  const countryName = country?.country ?? 'Country';

  return {
    title: `${countryName} Hantavirus Updates`,
    description: `Country-level hantavirus outbreak summary for ${countryName}, based on public-health dashboard data.`,
    alternates: {
      canonical: `/hantavirus/${resolvedParams.country}`,
    },
  };
}

export default async function HantavirusCountryPage({
  params,
}: CountryPageProps) {
  const resolvedParams = await params;

  return <CountryPageClient countrySlug={resolvedParams.country} />;
}