import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/server/user-store";

export async function GET() {
  const users = await getLeaderboard();
  return NextResponse.json({ success: true, users });
}
