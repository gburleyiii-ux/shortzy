import { NextResponse } from "next/server";
import { createClient } from "./supabase-server";

export async function getAuthUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function rateLimited() {
  return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
}
