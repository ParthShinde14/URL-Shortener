import { useState } from "react";
import toast from "react-hot-toast";
import { deleteLink } from "../hooks/useApi";

export default function LinkTable({ links, onDeleted }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (code) => {
    setDeleting(code);
    try {
      await deleteLink(code);
      onDeleted(code);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const copy = (url) => {
    navigator.clipboard.writeText(`${window.location.origin}/${url}`);
    toast.success("Copied!");
  };

  if (!links.length) {
    return (
      <div className="text-center py-16 text-[#444] text-sm">
        No links yet — shorten one above.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[#555] text-xs border-b border-[#1f1f1f]">
            <th className="text-left py-3 pr-4 font-medium">Short link</th>
            <th className="text-left py-3 pr-4 font-medium">Original URL</th>
            <th className="text-left py-3 pr-4 font-medium">Clicks</th>
            <th className="text-left py-3 pr-4 font-medium">Expires</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.short_code} className="border-b border-[#1a1a1a] hover:bg-[#141414] transition-colors">
              <td className="py-3 pr-4">
                <button
                  onClick={() => copy(link.short_code)}
                  className="font-mono text-white hover:text-gray-300 transition-colors"
                >
                  /{link.short_code}
                </button>
              </td>
              <td className="py-3 pr-4 max-w-[200px]">
                <a
                  href={link.long_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#aaa] hover:text-white truncate block transition-colors"
                >
                  {link.long_url}
                </a>
              </td>
              <td className="py-3 pr-4 text-white font-mono">{link.clicks}</td>
              <td className="py-3 pr-4 text-[#555] text-xs">
                {link.expires_at
                  ? new Date(link.expires_at).toLocaleDateString()
                  : "Never"}
              </td>
              <td className="py-3">
                <button
                  onClick={() => handleDelete(link.short_code)}
                  disabled={deleting === link.short_code}
                  className="text-[#444] hover:text-red-400 transition-colors text-xs disabled:opacity-40"
                >
                  {deleting === link.short_code ? "..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
