import React from 'react';
import { Metadata } from 'next';
import PropertiesPage from '../properties/page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Buy Property in Noida & Delhi NCR | Luxury Flats, Villas & Society Apartments',
  description:
    'Browse 100% verified properties for sale in Noida, Greater Noida, Ghaziabad, Gurgaon, and Delhi NCR. Direct owner listings, RERA approved projects, and home loan assistance.',
};

export default function BuyPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const mergedParams = {
    ...searchParams,
    listingType: 'FOR_SALE',
  };

  return <PropertiesPage searchParams={mergedParams} />;
}
