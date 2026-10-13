import React from 'react';
import { Metadata } from 'next';
import PropertiesPage from '../properties/page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search Properties | RAS Properties',
  description: 'Instant property search results across Noida, Greater Noida, Ghaziabad, Gurgaon, and Delhi NCR.',
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return <PropertiesPage searchParams={searchParams} />;
}
