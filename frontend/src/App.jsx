import { useEffect, useState } from "react";
import ShortenForm from "./components/ShortenForm";
import ResultCard from "./components/ResultCard";
import LinkTable from "./components/LinkTable";
import { getLinks } from "./hooks/useApi";

export default function App() {
  const [links, setLinks] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLinks()
      .then(setLinks)
      .finally(() => setLoading(false));
  }, []);

  const handleShortened = (result) => {
    setLastResult(result);
    setLinks((prev) => [
      {
        short_code: result.shortCode,
        long_url: result.longUrl,
        clicks: 0,
        expires_at: result.expiresAt,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleDeleted = (code) => {
    setLinks((prev) => prev.filter((l) => l.short_code !== code));
    if (lastResult?.shortCode === code) setLastResult(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] px-6 py-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-white"></div>
        <span className="font-mono text-sm font-medium tracking-tight">snip</span>
        <span className="text-[#333] text-xs ml-auto font-mono">url shortener</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Make long URLs short.
          </h1>
          <p className="text-[#555] text-sm">
            Paste any link and get a short one back. Track clicks, set expiry.
          </p>
        </div>

        {/* Shorten form */}
        <ShortenForm onShortened={handleShortened} />

        {/* Result */}
        {lastResult && (
          <div className="mt-4">
            <ResultCard result={lastResult} />
          </div>
        )}

        {/* Dashboard */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-[#888]">
              Your links{" "}
              <span className="font-mono text-[#444]">({links.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="text-[#444] text-sm py-8 text-center">Loading...</div>
          ) : (
            <LinkTable links={links} onDeleted={handleDeleted} />
          )}
        </div>
      </main>
    </div>
  );
}
