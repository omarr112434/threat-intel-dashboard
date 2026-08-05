"use client";

import { useState, useCallback } from "react";
import { ShieldAlert, Activity, ShieldCheck, Database, Zap } from "lucide-react";
import ThreatFeed from "@/components/ThreatFeed";
import SeverityChart from "@/components/SeverityChart";

export default function Home() {
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, medium: 0, low: 0 });
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const handleStatsUpdate = useCallback((newStats: typeof stats) => {
    setStats(newStats);
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  return (
    <main className="p-4 sm:p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
            Threat Intelligence Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Live CVE Monitoring & Security Analytics</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-xs text-slate-500">
              Updated: {lastUpdated}
            </span>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-300">System Online</span>
          </div>
        </div>
      </header>

      {/* Top Stats Row — Now uses LIVE data */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-8">
        {[
          { title: "Total Threats", value: stats.total.toString(), icon: Activity, color: "text-cyan-400", bgGlow: "hover:shadow-cyan-500/10" },
          { title: "Critical", value: stats.critical.toString(), icon: ShieldAlert, color: "text-red-400", bgGlow: "hover:shadow-red-500/10" },
          { title: "High", value: stats.high.toString(), icon: Zap, color: "text-orange-400", bgGlow: "hover:shadow-orange-500/10" },
          { title: "Medium", value: stats.medium.toString(), icon: ShieldCheck, color: "text-yellow-400", bgGlow: "hover:shadow-yellow-500/10" },
          { title: "Low", value: stats.low.toString(), icon: Database, color: "text-green-400", bgGlow: "hover:shadow-green-500/10" },
        ].map((stat, i) => (
          <div key={i} className={`glass-card p-4 sm:p-6 flex flex-col gap-3 hover:border-cyan-500/50 transition-all cursor-default hover:shadow-lg ${stat.bgGlow}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-slate-400 font-medium text-xs sm:text-sm">{stat.title}</h3>
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live Feed */}
        <div className="lg:col-span-2 glass-card p-4 sm:p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-100">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            Recent Vulnerabilities (CVEs)
          </h2>
          <ThreatFeed onStatsUpdate={handleStatsUpdate} />
        </div>

        {/* Right Column: Charts */}
        <div className="glass-card p-4 sm:p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-100">
            <Activity className="w-5 h-5 text-green-400" />
            Severity Breakdown
          </h2>
          <SeverityChart stats={stats} />

          {/* Additional Info Card */}
          <div className="mt-6 p-4 rounded-lg bg-slate-800/40 border border-slate-700/50">
            <h3 className="text-sm font-bold text-slate-300 mb-2">About This Dashboard</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This dashboard monitors the latest CVE (Common Vulnerabilities and Exposures) 
              published by CIRCL (Computer Incident Response Center Luxembourg). Data refreshes 
              automatically every 60 seconds. Use the search bar to filter by CVE ID, vendor, 
              or keyword. Bookmark critical threats to your watchlist for tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-slate-800/50 text-center">
        <p className="text-xs text-slate-600">
          Built by Omar Hany &middot; Powered by CIRCL CVE API &middot; Next.js + React + TypeScript
        </p>
      </footer>
    </main>
  );
}
