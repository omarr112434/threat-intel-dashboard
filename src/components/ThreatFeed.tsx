"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock, ShieldAlert, Search, Bookmark, BookmarkCheck } from "lucide-react";

interface CVE {
  id: string;
  summary: string;
  cvss: number | null;
  Published: string;
}

interface ThreatFeedProps {
  onStatsUpdate?: (stats: { total: number; critical: number; high: number; medium: number; low: number; unknown: number }) => void;
}

export default function ThreatFeed({ onStatsUpdate }: ThreatFeedProps) {
  const [threats, setThreats] = useState<CVE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("threat-bookmarks");
    if (saved) {
      setBookmarks(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("threat-bookmarks", JSON.stringify([...bookmarks]));
  }, [bookmarks]);

  useEffect(() => {
    async function fetchThreats() {
      try {
        const res = await fetch("https://cve.circl.lu/api/last");
        if (!res.ok) throw new Error("Failed to fetch API");
        const data = await res.json();
        const sliced = data.slice(0, 30);
        setThreats(sliced);

        // Calculate live stats
        if (onStatsUpdate) {
          const critical = sliced.filter((c: CVE) => c.cvss !== null && c.cvss >= 9).length;
          const high = sliced.filter((c: CVE) => c.cvss !== null && c.cvss >= 7 && c.cvss < 9).length;
          const medium = sliced.filter((c: CVE) => c.cvss !== null && c.cvss >= 4 && c.cvss < 7).length;
          const low = sliced.filter((c: CVE) => c.cvss !== null && c.cvss < 4).length;
          const unknown = sliced.filter((c: CVE) => c.cvss === null).length;
          onStatsUpdate({ total: sliced.length, critical, high, medium, low, unknown });
        }
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
  }, [onStatsUpdate]);

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter threats based on search query and bookmark filter
  const filteredThreats = threats.filter(cve => {
    const matchesSearch = searchQuery === "" || 
      (cve.id && cve.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cve.summary && cve.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBookmark = !showBookmarksOnly || bookmarks.has(cve.id);
    return matchesSearch && matchesBookmark;
  });

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
      {/* Search Bar and Bookmark Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search CVEs, keywords, vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all text-sm"
          />
        </div>
        <button
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
            showBookmarksOnly 
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
              : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:border-slate-600'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="hidden sm:inline">Watchlist</span>
          {bookmarks.size > 0 && (
            <span className="bg-cyan-500/30 text-cyan-300 text-xs px-1.5 py-0.5 rounded-full">
              {bookmarks.size}
            </span>
          )}
        </button>
      </div>

      {/* Results count */}
      <div className="text-xs text-slate-500">
        Showing {filteredThreats.length} of {threats.length} threats
        {searchQuery && <span> matching {"\u201C"}<span className="text-cyan-400">{searchQuery}</span>{"\u201D"}</span>}
        {showBookmarksOnly && <span> in your watchlist</span>}
      </div>

      {/* Threat Cards */}
      {filteredThreats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-500">
          <Search className="w-8 h-8 mb-2" />
          <p>{showBookmarksOnly ? "No bookmarked threats yet. Click the bookmark icon on a threat to save it." : "No threats match your search."}</p>
        </div>
      ) : (
        filteredThreats.map((cve, index) => (
          <div 
            key={`${cve.id}-${index}`} 
            className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                {cve.id}
              </h3>
              <div className="flex items-center gap-2">
                {cve.cvss && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    cve.cvss >= 9 ? 'bg-red-500/20 text-red-400' :
                    cve.cvss >= 7 ? 'bg-orange-500/20 text-orange-400' :
                    cve.cvss >= 4 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    CVSS {cve.cvss}
                  </span>
                )}
                <button
                  onClick={() => toggleBookmark(cve.id)}
                  className="p-1 rounded hover:bg-slate-700/50 transition-colors"
                  title={bookmarks.has(cve.id) ? "Remove from watchlist" : "Add to watchlist"}
                >
                  {bookmarks.has(cve.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-400 line-clamp-2 group-hover:line-clamp-none transition-all">
              {cve.summary}
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>{new Date(cve.Published).toLocaleString()}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
