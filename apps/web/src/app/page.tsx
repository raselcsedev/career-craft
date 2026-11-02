"use client";

import { useEffect, useState } from "react";

interface HealthResponse {
  status: string;
  timestamp: string;
}

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/v1/health")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: HealthResponse) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🚀 CareerCraft
        </h1>
        <p className="text-gray-500 mb-8">
          Full-Stack CV Builder &amp; Portfolio Platform
        </p>

        <div className="border rounded-lg p-6 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Backend Health Check
          </h2>

          {loading && (
            <p className="text-blue-600 animate-pulse">
              Connecting to API...
            </p>
          )}

          {error && (
            <div className="text-red-600">
              <p className="font-medium">❌ Connection Failed</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-xs text-gray-400 mt-2">
                Make sure the backend is running on port 3001
              </p>
            </div>
          )}

          {health && (
            <div className="text-green-600">
              <p className="font-medium text-lg">✅ {health.status}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(health.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Phase 1 — Project Setup Complete
        </p>
      </div>
    </div>
  );
}
