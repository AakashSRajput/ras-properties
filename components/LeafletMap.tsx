'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';
import { PropertyDTO } from '@/types';

interface LeafletMapProps {
  properties?: PropertyDTO[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

export default function LeafletMap({
  properties = [],
  center = [28.5355, 77.3910], // Noida coordinates default
  zoom = 12,
  height = '420px',
  className = '',
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      // Dynamic import of Leaflet
      const L = (await import('leaflet')).default;

      // Import Leaflet CSS if not already injected
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current).setView(center, zoom);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom icon creator
      const createCustomIcon = (priceText: string) => {
        return L.divIcon({
          className: 'custom-property-pin',
          html: `
            <div style="
              background: #0A1E3F;
              color: #f59e0b;
              font-weight: bold;
              font-size: 11px;
              padding: 4px 8px;
              border-radius: 20px;
              border: 2px solid #f59e0b;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              white-space: nowrap;
              cursor: pointer;
              transform: translate(-50%, -50%);
            ">
              ${priceText}
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
      };

      // Add markers
      properties.forEach((p) => {
        const lat = p.latitude || 28.5355;
        const lng = p.longitude || 77.3910;
        const isRent = p.listingType === 'FOR_RENT' || p.listingType === 'FOR_LEASE';
        const priceFormatted = formatINR(p.price, isRent);
        const imgUrl = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80';

        const marker = L.marker([lat, lng], {
          icon: createCustomIcon(priceFormatted),
        }).addTo(map);

        const popupContent = `
          <div style="width: 220px; font-family: sans-serif; overflow: hidden; border-radius: 10px;">
            <img src="${imgUrl}" style="width: 100%; height: 120px; object-fit: cover; display: block;" />
            <div style="padding: 10px; background: #0f172a; color: #fff;">
              <div style="font-weight: 800; color: #fbbf24; font-size: 14px;">${priceFormatted}</div>
              <div style="font-size: 12px; font-weight: 600; color: #f8fafc; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">${p.locality}, ${p.city}</div>
              <a href="/properties/${p.slug}" style="display: block; text-align: center; background: #d97706; color: #000; font-weight: 700; font-size: 11px; padding: 6px 10px; border-radius: 6px; text-decoration: none; margin-top: 8px;">View Property</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 240 });
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [properties, center, zoom]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-md ${className}`}
      style={{ height }}
    >
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
