import { NextResponse } from "next/server";
import {
  getAdminPasscodeAsync,
  setAdminPasscodeAsync,
  getRecoveryKey,
  authenticateAdminRequest,
} from "@/lib/adminAuth";

export async function GET(request: Request) {
  const isAuth = await authenticateAdminRequest(request);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Invalid passcode." },
      { status: 401 }
    );
  }
  return NextResponse.json({ success: true, authenticated: true });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, currentPasscode, newPasscode, recoveryKey } = body;

    // 1. Reset passcode using Master Recovery Key (Login page flow)
    if (action === "reset") {
      if (!recoveryKey || typeof recoveryKey !== "string") {
        return NextResponse.json(
          { success: false, error: "Please provide the Master Recovery Key." },
          { status: 400 }
        );
      }

      const expectedKey = getRecoveryKey();
      if (recoveryKey.trim() !== expectedKey) {
        return NextResponse.json(
          { success: false, error: "Invalid Recovery Key. Please check and try again." },
          { status: 403 }
        );
      }

      if (!newPasscode || typeof newPasscode !== "string" || newPasscode.trim().length < 6) {
        return NextResponse.json(
          { success: false, error: "New passcode must be at least 6 characters long." },
          { status: 400 }
        );
      }

      const { supabaseUpdated } = await setAdminPasscodeAsync(newPasscode.trim());
      return NextResponse.json({
        success: true,
        supabaseUpdated,
        message: "Admin passcode has been successfully reset. Please log in with your new passcode.",
      });
    }

    // 2. Change passcode from Settings page (Authenticated flow)
    if (action === "change") {
      const activePasscode = await getAdminPasscodeAsync();

      if (!currentPasscode || currentPasscode.trim() !== activePasscode) {
        return NextResponse.json(
          { success: false, error: "Current passcode is incorrect." },
          { status: 401 }
        );
      }

      if (!newPasscode || typeof newPasscode !== "string" || newPasscode.trim().length < 6) {
        return NextResponse.json(
          { success: false, error: "New passcode must be at least 6 characters long." },
          { status: 400 }
        );
      }

      const { supabaseUpdated } = await setAdminPasscodeAsync(newPasscode.trim());
      return NextResponse.json({
        success: true,
        supabaseUpdated,
        message: "Admin passcode has been successfully updated.",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified." },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error("Passcode route error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error processing auth request." },
      { status: 500 }
    );
  }
}
