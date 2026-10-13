'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AdminChartsProps {
  propertyTypes: { name: string; value: number }[];
  listingTypes: { name: string; value: number }[];
}

const COLORS = ['#f59e0b', '#0284c7', '#10b981', '#a855f7', '#f43f5e', '#64748b'];

export default function AdminCharts({ propertyTypes, listingTypes }: AdminChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Chart 1: Property Type Distribution */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 shadow-md">
        <h3 className="font-bold text-white text-sm mb-1">Listings by Property Type</h3>
        <p className="text-xs text-slate-400 mb-6">Distribution of apartments, villas, builder floors & offices</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={propertyTypes} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                angle={-20}
                textAnchor="end"
              />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Buy vs Rent vs Lease Breakdown */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 shadow-md">
        <h3 className="font-bold text-white text-sm mb-1">Listing Intent (Buy vs Rent vs Lease)</h3>
        <p className="text-xs text-slate-400 mb-6">Breakdown of inventory by transaction model</p>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={listingTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {listingTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-4 text-xs mt-2">
          {listingTypes.map((item, idx) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span className="text-slate-300 font-medium">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
