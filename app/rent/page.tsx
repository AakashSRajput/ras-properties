import React from 'react';
import { Metadata } from 'next';
import PropertiesPage from '../properties/page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Rent Property in Noida & Delhi NCR | Furnished Society Flats & Homes',
  description:
    'Find verified rental flats, studio apartments, independent floors, and homes for rent in Noida Expressway, Sector 150, Indirapuram, Gurgaon, and Delhi NCR.',
};

export default function RentPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const mergedParams = {
    ...searchParams,
    listingType: 'FOR_RENT',
  };

  return <PropertiesPage searchParams={mergedParams} />;
}
