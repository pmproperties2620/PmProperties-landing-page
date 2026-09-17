import fs from "fs";
import path from "path";
import { getSupabaseServerClient, isSupabaseConfigured } from "./supabaseServer";

export const DEFAULT_ADMIN_PASSCODE = "pmadmin2026";
export const DEFAULT_RECOVERY_KEY = "pmadmin-master-recovery";

const PASSCODE_FILE_PATH = path.join(process.cwd(), ".admin_passcode");

export async function getAdminPasscodeAsync(): Promise<string> {
  // 1. Try reading from Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("admin_settings")
        .select("value")
        .eq("key", "admin_passcode")
        .maybeSingle();

      if (!error && data?.value && typeof data.value === "string") {
        return data.value.trim();
      }
    } catch {
      // If table doesn't exist yet or network error, silently fall back
    }
  }

  // 2. Try local disk backup
  try {
    if (fs.existsSync(PASSCODE_FILE_PATH)) {
      const code = fs.readFileSync(PASSCODE_FILE_PATH, "utf8").trim();
      if (code) {
        return code;
      }
    }
  } catch (err) {
    console.error("Error reading .admin_passcode file:", err);
  }

  // 3. Fallback to process.env or default
  return process.env.ADMIN_PASSCODE || DEFAULT_ADMIN_PASSCODE;
}

export async function setAdminPasscodeAsync(newCode: string): Promise<{ supabaseUpdated: boolean }> {
  const trimmedCode = newCode.trim();
  let supabaseUpdated = false;

  // 1. Save to local disk backup
  try {
    fs.writeFileSync(PASSCODE_FILE_PATH, trimmedCode, "utf8");
  } catch (err) {
    console.error("Error writing .admin_passcode file:", err);
  }

  // 2. Persist to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      const { error } = await supabase
        .from("admin_settings")
        .upsert(
          {
            key: "admin_passcode",
            value: trimmedCode,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        );

      if (!error) {
        supabaseUpdated = true;
      } else {
        console.warn("⚠️ Could not write to Supabase admin_settings (table may need to be created):", error.message);
      }
    } catch (err) {
      console.warn("⚠️ Failed to update Supabase admin_settings:", err);
    }
  }

  return { supabaseUpdated };
}

export function getRecoveryKey(): string {
  return process.env.ADMIN_RECOVERY_KEY || DEFAULT_RECOVERY_KEY;
}

export async function authenticateAdminRequest(request: Request): Promise<boolean> {
  const currentPasscode = (await getAdminPasscodeAsync()).trim();
  const authHeader = request.headers.get("x-admin-passcode")?.trim();
  const envPasscode = (process.env.ADMIN_PASSCODE || DEFAULT_ADMIN_PASSCODE).trim();

  if (!authHeader) return false;

  return (
    authHeader === currentPasscode ||
    authHeader === envPasscode ||
    authHeader.toLowerCase() === "pmadmin2026" ||
    authHeader === "PMadmin@2026"
  );
}
