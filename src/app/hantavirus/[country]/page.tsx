import { notFound } from 'next/navigation';

import { CountryPageClient } from './CountryPageClient';
import countries from '../../../../public/data/countries.json';
import type { OutbreakCountry } from '@/types/outbreak';

type CountryPageProps = {
  params: Promise<{
    country: string;
  }>;
};

function slugifyCountry(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateStaticParams() {
  return (countries as OutbreakCountry[]).map((country) => ({
    country: slugifyCountry(country.country),
  }));
}

export async function generateMetadata({ params }: CountryPageProps) {
  const resolvedParams = await params;
  const countrySlug = resolvedParams.country;

  const country = (countries as OutbreakCountry[]).find(
    (item) => slugifyCountry(item.country) === countrySlug,
  );

  if (!country) {
    return {
      title: 'Country not found | HantaUpdates',
    };
  }

  return {
    title: `${country.country} Hantavirus Updates | HantaUpdates`,
    description: `Track public hantavirus outbreak data for ${country.country}, including confirmed cases, deaths, and risk level from official-source data.`,
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const resolvedParams = await params;
  const countrySlug = resolvedParams.country;

  const country = (countries as OutbreakCountry[]).find(
    (item) => slugifyCountry(item.country) === countrySlug,
  );

  if (!country) {
    notFound();
  }

  return <CountryPageClient country={country} />;
}