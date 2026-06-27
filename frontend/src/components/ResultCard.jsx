import toast from "react-hot-toast";

export default function ResultCard({ result }) {
  const copy = () => {
    navigator.clipboard.writeText(result.shortUrl);
    toast.success("Copied!");
  };

  return (
    <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-white font-mono text-sm font-medium truncate">{result.shortUrl}</p>
        <p className="text-[#555] text-xs truncate mt-0.5">{result.longUrl}</p>
      </div>
      <button
        onClick={copy}
        className="shrink-0 border border-[#2a2a2a] text-[#aaa] hover:text-white hover:border-[#555] px-3 py-1.5 rounded-md text-xs transition-colors"
      >
        Copy
      </button>
    </div>
  );
}
