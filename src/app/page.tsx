import { ShieldAlert, Activity, ShieldCheck, Database } from "lucide-react";
import ThreatFeed from "@/components/ThreatFeed";
import SeverityChart from "@/components/SeverityChart";

export default function Home() {
  return (
    <main className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
            Threat Intelligence Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Live CVE Monitoring & Security Analytics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-slate-300">System Online</span>
        </div>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Active Threats", value: "1,248", icon: Activity, color: "text-cyan-400" },
          { title: "Critical Severity", value: "84", icon: ShieldAlert, color: "text-red-400" },
          { title: "Systems Patched", value: "9,203", icon: ShieldCheck, color: "text-green-400" },
          { title: "Sources Monitored", value: "12", icon: Database, color: "text-purple-400" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 flex flex-col gap-4 hover:border-cyan-500/50 transition-colors cursor-default">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-400 font-medium">{stat.title}</h3>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live Feed (Takes up 2 cols on large screens) */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-100">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            Recent Vulnerabilities (CVEs)
          </h2>
          <ThreatFeed />
        </div>

        {/* Right Column: Charts */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-100">
            <Activity className="w-5 h-5 text-green-400" />
            Severity Breakdown
          </h2>
          <SeverityChart />
        </div>
      </div>
    </main>
  );
}
