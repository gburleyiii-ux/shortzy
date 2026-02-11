import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { nanoid } from "nanoid";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url, title } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Check rate limit
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, links_today, links_today_reset")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const today = new Date().toISOString().split("T")[0];
    let linksToday = profile.links_today ?? 0;

    if (profile.links_today_reset !== today) {
      // Reset counter for new day
      linksToday = 0;
      await supabase
        .from("profiles")
        .update({ links_today: 0, links_today_reset: today })
        .eq("id", user.id);
    }

    if (profile.plan === "free" && linksToday >= 5) {
      return NextResponse.json(
        { error: "Daily limit reached. Upgrade for unlimited links." },
        { status: 429 }
      );
    }

    const shortCode = nanoid(8);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shortzy.netlify.app";
    const shortUrl = `${appUrl}/api/r/${shortCode}`;

    const { data: link, error } = await supabase
      .from("links")
      .insert({
        user_id: user.id,
        short_code: shortCode,
        original_url: url,
        title: title || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Increment daily counter
    await supabase
      .from("profiles")
      .update({ links_today: linksToday + 1 })
      .eq("id", user.id);

    // Generate QR code
    const qrDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 256,
      margin: 2,
      color: { dark: "#4f46e5" },
    });

    return NextResponse.json({
      id: link.id,
      short_code: shortCode,
      short_url: shortUrl,
      original_url: url,
      qr_code: qrDataUrl,
    });
  } catch (err) {
    console.error("Shorten error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
