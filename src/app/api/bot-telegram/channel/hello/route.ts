import { NextResponse } from "next/server";
import { serverEnvs } from "@/core/config/envs.server";
import { sendTextToConfiguredChannel } from "@/services/telegram/bot18-automation1/bot-telegram";

export async function POST(request: Request) {
  const adminSecret = request.headers.get("x-bot-admin-secret");

  if (!adminSecret || adminSecret !== serverEnvs.API_KEY) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const text = typeof body?.text === "string" ? body.text.trim() : "ola";

    if (!text) {
      return NextResponse.json(
        { ok: false, error: "Message text is required" },
        { status: 400 },
      );
    }

    await sendTextToConfiguredChannel(text);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "[bot-telegram:channel:hello] Failed to send message:",
      error,
    );

    return NextResponse.json(
      { ok: false, error: "Failed to send message" },
      { status: 500 },
    );
  }
}
