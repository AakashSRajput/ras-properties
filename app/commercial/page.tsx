import React from 'react';
import { Metadata } from 'next';
import PropertiesPage from '../properties/page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Commercial Properties in Noida & Gurgaon | Grade-A Offices, Retail Shops & Warehouses',
  description:
    'Invest in high rental yield commercial real estate across Noida Sector 62, Cyber City Gurgaon, and Expressway corridors. Verified Grade-A IT offices and retail showrooms.',
};

export default function CommercialPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const mergedParams = {
    ...searchParams,
    commercialOnly: 'true',
  };

  return <PropertiesPage searchParams={mergedParams} />;
}
