"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { User, Crown } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single();
        if (profile) setPlan(profile.plan);
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-black text-gray-900">Settings</h1>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div>
          <h2 className="font-black text-gray-900 flex items-center gap-2 mb-4">
            <User className="w-5 h-5" />
            Account
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <div className="text-gray-900 font-medium">{email}</div>
          </div>
        </div>

        <hr />

        <div>
          <h2 className="font-black text-gray-900 flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5" />
            Plan
          </h2>
          <div className="flex items-center gap-4">
            <span
              className={`px-4 py-2 rounded-full font-bold text-sm ${
                plan === "free"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
              }`}
            >
              {planLabel}
            </span>
            {plan === "free" && (
              <Link
                href="/pricing"
                className="text-indigo-600 font-bold hover:underline text-sm"
              >
                Upgrade →
              </Link>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {plan === "free"
              ? "5 links per day. Upgrade for unlimited."
              : "Unlimited links and advanced analytics."}
          </p>
        </div>
      </div>
    </div>
  );
}
