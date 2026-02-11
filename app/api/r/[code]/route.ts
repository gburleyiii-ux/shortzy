import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

function parseUserAgent(ua: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  // Browser
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Safari/")) browser = "Safari";

  // OS
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  // Device
  if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone"))
    device = "Mobile";
  else if (ua.includes("Tablet") || ua.includes("iPad")) device = "Tablet";

  return { browser, os, device };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const supabase = createClient();
  const { code } = params;

  // Increment clicks and get link id
  const { data: linkId } = await supabase.rpc("increment_clicks", {
    link_short_code: code,
  });

  if (!linkId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Get the original URL
  const { data: link } = await supabase
    .from("links")
    .select("original_url, expires_at, is_active")
    .eq("short_code", code)
    .single();

  if (!link || !link.is_active) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check expiration
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Log click analytics (fire and forget)
  const ua = request.headers.get("user-agent") || "";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const referrer = request.headers.get("referer") || null;
  const { browser, os, device } = parseUserAgent(ua);

  await supabase.from("clicks").insert({
    link_id: linkId,
    ip_address: ip,
    device,
    browser,
    os,
    referrer,
  });

  return NextResponse.redirect(link.original_url, { status: 302 });
}
