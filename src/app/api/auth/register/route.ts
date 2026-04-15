import { NextResponse } from "next/server";
import { createUser } from "@/lib/server/user-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; email?: string; password?: string };

    if (!body.name?.trim() || !body.email?.trim() || !body.password?.trim()) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    const user = await createUser(body.name, body.email, body.password);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Registration failed." },
      { status: 400 }
    );
  }
}
