import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabaseServer";
import { authenticateAdminRequest } from "@/lib/adminAuth";

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

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded." },
        { status: 400 }
      );
    }

    // Validate mime type
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const validImageMimes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
    if (!isPdf && !validImageMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only PDF brochures and JPEG, PNG, WEBP, and GIF images are allowed." },
        { status: 400 }
      );
    }

    // Limit to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      if (isPdf) {
        return NextResponse.json(
          {
            success: false,
            error: "Brochure must be under 10MB. Please compress the PDF first (try smallpdf.com or ilovepdf.com) and try again.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Image file size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = originalName.split(".").pop()?.toLowerCase() || (isPdf ? "pdf" : "jpg");
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const folder = isPdf ? "brochures" : "projects";
    const storagePath = `${folder}/${timestamp}-${random}.${ext}`;

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
      console.error("❌ [API /api/admin/projects/upload] Supabase storage upload error:", uploadError);
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
    });
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/projects/upload] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during image upload." },
      { status: 500 }
    );
  }
}
