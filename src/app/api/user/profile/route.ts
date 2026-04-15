import { NextResponse } from "next/server";
import { getUserProfile } from "@/lib/server/user-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    const user = await getUserProfile(email);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to load profile." },
      { status: 404 }
    );
  }
}
