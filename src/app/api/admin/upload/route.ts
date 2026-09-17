import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabaseServer";
import { authenticateAdminRequest } from "@/lib/adminAuth";

const ALLOWED_FOLDERS = [
  "projects",
  "testimonials",
  "partners",
  "about",
  "banners",
  "hero",
  "general",
];

export async function POST(request: Request) {
  try {
    if (!(await authenticateAdminRequest(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid or missing Admin Passcode." },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const requestedFolder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded." },
        { status: 400 }
      );
    }

    // Validate mime type
    const validMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
      "image/svg+xml",
    ];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPEG, PNG, WEBP, AVIF, GIF, and SVG images are allowed." },
        { status: 400 }
      );
    }

    // Limit to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image file size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // Sanitize folder
    const targetFolder = ALLOWED_FOLDERS.includes(requestedFolder.toLowerCase())
      ? requestedFolder.toLowerCase()
      : "general";

    const supabase = getSupabaseServerClient();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = originalName.split(".").pop() || "webp";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const storagePath = `${targetFolder}/${timestamp}-${random}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Upload to project-images bucket
    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ [API /api/admin/upload] Supabase storage upload error:", uploadError);
      return NextResponse.json(
        {
          success: false,
          error: `Storage upload failed: ${uploadError.message}. Make sure the 'project-images' bucket exists in your Supabase storage dashboard.`,
        },
        { status: 500 }
      );
    }

    // Retrieve public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("project-images").getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      publicUrl,
      fileName: file.name,
      storagePath,
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/upload] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during image upload." },
      { status: 500 }
    );
  }
}
