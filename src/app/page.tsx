"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import { motion } from "framer-motion";

export default function Dashboard() {

  const searchParams = useSearchParams();
  const initialDate = searchParams.get('date') || dayjs().format('YYYY-MM-DD');

  const [date, setDate] = useState(initialDate);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (!date) return;
    fetch(`/api/stats?date=${date}`)
      .then((res) => res.json())
      .then(setStats);
  }, [date]);


  const changeDate = (delta) => {
    setDate(prev => dayjs(prev).add(delta, 'day').format('YYYY-MM-DD'));
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          {/* <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 tracking-tight text-center mb-6"> Daily Stats for {date}</h1> */}
          <motion.h1
  className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 tracking-tight text-center mb-6"
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  Daily Stats for {date}
          </motion.h1>
          
          <div className="space-x-2">
            <button
              onClick={() => changeDate(-1)}
              // className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200 transition"
            >
              ← Prev
            </button>
            <button
  onClick={() => setDate(dayjs().format('YYYY-MM-DD'))}
  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 hover:bg-gray-200 transition"
>
  📅 Today
</button>
            <button
              onClick={() => changeDate(1)}
              className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200 transition"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LSTM Anomaly Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Isolation Forest Anomaly Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Daily Prompts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Weekly Prompts (M-F) </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Settings </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.map((s, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.uid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.lstm_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.if_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.daily_prompted_num}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.weekly_prompted_num}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a href={`/details/${s.uid}`} className="text-blue-600 hover:underline font-medium">
                      Details
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a href={`/settings/${s.uid}?date=${date}`} className="text-blue-600 hover:underline font-medium">
                      Change Model Settings
                    </a>
                  </td>
                </tr>
              ))}
              {stats.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No data for this day.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
