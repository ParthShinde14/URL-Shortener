import { useState } from "react";
import toast from "react-hot-toast";
import { shortenUrl } from "../hooks/useApi";

export default function ShortenForm({ onShortened }) {
  const [url, setUrl] = useState("");
  const [expires, setExpires] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    try {
      const result = await shortenUrl(url.trim(), expires || null);
      onShortened(result);
      setUrl("");
      setExpires("");
      toast.success("Link shortened!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a long URL..."
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-[#555] focus:outline-none focus:border-[#555] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-5 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "..." : "Shorten"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#555]">Expires in</span>
          <select
            value={expires}
            onChange={(e) => setExpires(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-3 py-1.5 text-xs text-[#aaa] focus:outline-none focus:border-[#555] transition-colors"
          >
            <option value="">Never</option>
            <option value="1">1 day</option>
            <option value="7">7 days</option>
            <option value="30">30 days</option>
          </select>
        </div>
      </div>
    </form>
  );
}
