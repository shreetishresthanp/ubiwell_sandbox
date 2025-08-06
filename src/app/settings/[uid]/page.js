'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function ModelSettings({ params, searchParams }) {
  const resolvedParams = React.use(params);
  const { uid } = resolvedParams;
const { date } = React.use(searchParams);
  
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  // Load JSON settings
  useEffect(() => {
    if (!uid) return;

    setLoading(true);
    fetch(`/settings/${uid}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
  if (!data || typeof data !== 'object') {
    setForm({});
    setOriginal({});
    return;
  }

        const emptyForm = {};
for (const [k, v] of Object.entries(data)) {
  emptyForm[k] = '';  // start empty so placeholder shows
}
setForm(emptyForm);
        setOriginal(data);
})
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [uid]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
    setSubmitted(false);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
      const merged = {};
Object.keys(original).forEach((key) => {
  merged[key] = form[key] !== '' ? Number(form[key]) : original[key];
});
  try {
    const res = await fetch(`/api/settings/${uid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    });

    if (!res.ok) throw new Error('Failed to update');

    setSubmitted(true);
  } catch (err) {
    console.error(err);
    setSubmitted(false);
    alert('Failed to save settings');
  }
};

const resetAll = () => {
  const cleared = {};
  Object.keys(form).forEach((key) => {
    cleared[key] = '';  // empty string to clear input
  });
  setForm(cleared);
};

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading settings for <strong>{uid}</strong>...
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="p-10 text-center text-red-600">
        ⚠️ Could not load settings for UID: <strong>{uid}</strong>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back Button */}
        <button
  onClick={() => router.push(`/?date=${date}`)}
  className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
>
  <ArrowLeft size={16} className="mr-2" />
  Back to Dashboard
</button>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Model Settings for UID: <span className="text-blue-600">{uid}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Modify LSTM and Isolation Forest configuration
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-6 border"
        >
          {Object.entries(form).map(([key, value]) => {
  const isChanged = value !== '' && Number(value) !== original[key];

  return (
    <div key={key} className="flex flex-col gap-1">
      <label
        htmlFor={key}
        className="text-sm text-gray-700 font-medium capitalize"
      >
        {key.replace(/_/g, ' ')}
      </label>

      <div className="flex items-center gap-2">
        <input
          type="number"
          id={key}
          name={key}
          placeholder={String(original[key])}
          value={value}
          onChange={handleChange}
          className="flex-1 px-4 py-2 text-black placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {isChanged && (
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, [key]: '' }))
            }
            className="text-sm text-gray-600 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
})}

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={resetAll}
              disabled={JSON.stringify(form) === JSON.stringify(original)}
              className={`px-6 py-2 rounded-md border ${
                JSON.stringify(form) === JSON.stringify(original)
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-gray-600 text-gray-700 hover:bg-gray-100'
              } transition`}
            >
              Reset All
            </button>
          </div>

          {submitted && (
            <p className="text-green-600 text-sm text-right">Settings saved! ✅</p>
          )}
        </form>
      </div>
    </div>
  );
}
