"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock, ShieldAlert } from "lucide-react";

interface CVE {
  id: string;
  summary: string;
  cvss: number | null;
  Published: string;
}

export default function ThreatFeed() {
  const [threats, setThreats] = useState<CVE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThreats() {
      try {
        const res = await fetch("https://cve.circl.lu/api/last");
        if (!res.ok) throw new Error("Failed to fetch API");
        const data = await res.json();
        // Take only the first 10 for the feed
        setThreats(data.slice(0, 10));
      } catch (err) {
        console.error(err);
        setError("Unable to reach CVE database. Retrying...");
      } finally {
        setLoading(false);
      }
    }
    fetchThreats();
    
    // Poll every 60 seconds
    const interval = setInterval(fetchThreats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-cyan-400">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Intercepting Live Threat Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-10 text-red-400 gap-2">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {threats.map((cve, index) => (
        <div 
          key={`${cve.id}-${index}`} 
          className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/50 transition-colors group cursor-pointer"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              {cve.id}
            </h3>
            {cve.cvss && (
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                cve.cvss >= 9 ? 'bg-red-500/20 text-red-400' :
                cve.cvss >= 7 ? 'bg-orange-500/20 text-orange-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                CVSS {cve.cvss}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 line-clamp-2 group-hover:line-clamp-none transition-all">
            {cve.summary}
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{new Date(cve.Published).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
