'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function UIDDetailsPage({ params, searchParams}) {
    const resolvedParams = React.use(params);
    const { uid } = resolvedParams;

    const { date } = React.use(searchParams);

  const router = useRouter();

  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!uid || !date) return;

    const path = `/charts/${date}/${uid}.json`;
    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(setChartData)
      .catch(() => setError(true));
  }, [uid, date]);

  if (!chartData && !error) {
    return <div className="p-10 text-center text-gray-500">Loading charts for {uid}...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        ⚠️ Charts for UID: <strong>{uid}</strong> on <strong>{date}</strong> not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => router.push(`/?date=${date}`)}
          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Charts for UID: <span className="text-blue-600">{uid}</span>
          </h1>
          <p className="text-sm text-gray-500">Date: {date}</p>
        </div>

        {/* Chart display */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="value" stroke="#3b82f6" />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
