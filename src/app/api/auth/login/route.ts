import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/server/user-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email?.trim() || !body.password?.trim()) {
      return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
    }

    const user = await authenticateUser(body.email, body.password);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Login failed." },
      { status: 401 }
    );
  }
}
