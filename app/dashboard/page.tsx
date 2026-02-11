"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  Link as LinkIcon,
  Copy,
  Check,
  Trash2,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  Plus,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface LinkRow {
  id: string;
  short_code: string;
  original_url: string;
  title: string | null;
  is_active: boolean;
  clicks: number;
  created_at: string;
}

export default function DashboardPage() {
  const supabase = createClient();
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shortzy.netlify.app";

  const fetchLinks = async () => {
    const { data } = await supabase
      .from("links")
      .select("*")
      .order("created_at", { ascending: false });
    setLinks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);

  const createLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setCreating(true);
    setError("");

    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title: title || undefined }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setCreating(false);
      return;
    }

    setUrl("");
    setTitle("");
    setCreating(false);
    fetchLinks();
  };

  const copyLink = (shortCode: string) => {
    navigator.clipboard.writeText(`${appUrl}/api/r/${shortCode}`);
    setCopiedId(shortCode);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("links").update({ is_active: !current }).eq("id", id);
    fetchLinks();
  };

  const deleteLink = async (id: string) => {
    if (!confirm("Delete this link?")) return;
    await supabase.from("links").delete().eq("id", id);
    fetchLinks();
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 font-medium">Total Links</div>
          <div className="text-4xl font-black text-gray-900">{links.length}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 font-medium">Total Clicks</div>
          <div className="text-4xl font-black text-gray-900">{totalClicks}</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-3xl p-6 text-white hidden md:block">
          <div className="text-sm opacity-90 font-medium">Avg Clicks/Link</div>
          <div className="text-4xl font-black">
            {links.length > 0 ? (totalClicks / links.length).toFixed(1) : "0"}
          </div>
        </div>
      </div>

      {/* Create Link */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Shorten a Link
        </h2>
        <form onSubmit={createLink} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
              required
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-48 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none hidden md:block"
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50"
            >
              {creating ? "..." : "Shorten"}
            </button>
          </div>
        </form>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : links.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No links yet. Create your first one above!
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-600 truncate">
                    {appUrl.replace("https://", "")}/api/r/{link.short_code}
                  </span>
                  {!link.is_active && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 truncate mt-1">
                  {link.title && <span className="font-medium mr-2">{link.title}</span>}
                  {link.original_url}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <BarChart3 className="w-4 h-4" />
                {link.clicks}
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href={`/dashboard/${link.id}`}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Analytics"
                >
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </Link>
                <button
                  onClick={() => copyLink(link.short_code)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy"
                >
                  {copiedId === link.short_code ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                <button
                  onClick={() => toggleActive(link.id, link.is_active)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={link.is_active ? "Deactivate" : "Activate"}
                >
                  {link.is_active ? (
                    <ToggleRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
