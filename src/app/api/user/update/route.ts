import { NextResponse } from "next/server";
import { updateUserProgress } from "@/lib/server/user-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email?.trim()) {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    const user = await updateUserProgress(body);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to update progress." },
      { status: 400 }
    );
  }
}
