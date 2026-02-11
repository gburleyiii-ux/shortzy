"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ClickRow {
  id: string;
  clicked_at: string;
  country: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
}

interface LinkRow {
  id: string;
  short_code: string;
  original_url: string;
  title: string | null;
  clicks: number;
  created_at: string;
}

function countBy(arr: ClickRow[], key: keyof ClickRow) {
  const map: Record<string, number> = {};
  arr.forEach((item) => {
    const val = (item[key] as string) || "Unknown";
    map[val] = (map[val] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
}

function StatTable({ title, data }: { title: string; data: [string, number][] }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-black text-gray-900 mb-4">{title}</h3>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm">No data yet</p>
      ) : (
        <div className="space-y-2">
          {data.map(([label, count]) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-sm text-gray-700 truncate">{label}</span>
              <span className="text-sm font-bold text-indigo-600">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LinkAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [link, setLink] = useState<LinkRow | null>(null);
  const [clickRows, setClickRows] = useState<ClickRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: linkData } = await supabase
        .from("links")
        .select("*")
        .eq("id", id)
        .single();
      setLink(linkData);

      const { data: clicks } = await supabase
        .from("clicks")
        .select("*")
        .eq("link_id", id)
        .order("clicked_at", { ascending: true });
      setClickRows(clicks || []);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (!link) {
    return <div className="text-center py-12 text-gray-500">Link not found</div>;
  }

  // Build chart data: clicks per day
  const clicksByDay: Record<string, number> = {};
  clickRows.forEach((c) => {
    const day = new Date(c.clicked_at).toISOString().split("T")[0];
    clicksByDay[day] = (clicksByDay[day] || 0) + 1;
  });
  const chartData = Object.entries(clicksByDay).map(([date, count]) => ({
    date,
    clicks: count,
  }));

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Links
        </Link>
        <h1 className="text-3xl font-black text-gray-900">
          {link.title || link.short_code}
        </h1>
        <p className="text-gray-500 truncate mt-1">{link.original_url}</p>
      </div>

      {/* Click Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500">Total Clicks</div>
          <div className="text-4xl font-black text-gray-900">{link.clicks}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500">Unique Countries</div>
          <div className="text-4xl font-black text-gray-900">
            {new Set(clickRows.map((c) => c.country).filter(Boolean)).size}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500">Top Browser</div>
          <div className="text-2xl font-black text-gray-900">
            {countBy(clickRows, "browser")[0]?.[0] || "—"}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500">Top Device</div>
          <div className="text-2xl font-black text-gray-900">
            {countBy(clickRows, "device")[0]?.[0] || "—"}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Clicks Over Time
        </h3>
        {chartData.length === 0 ? (
          <p className="text-gray-400 text-sm py-12 text-center">No clicks yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: "#4f46e5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Breakdown Tables */}
      <div className="grid md:grid-cols-2 gap-4">
        <StatTable title="Countries" data={countBy(clickRows, "country")} />
        <StatTable title="Devices" data={countBy(clickRows, "device")} />
        <StatTable title="Browsers" data={countBy(clickRows, "browser")} />
        <StatTable title="Referrers" data={countBy(clickRows, "referrer")} />
      </div>
    </div>
  );
}
