import { NextResponse } from "next/server";

import {
  EmptyContractTextError,
  extractContractText,
  UnsupportedContractFileError,
} from "@/lib/contract-review/extract-text";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get("contract");

    if (!(file instanceof File)) {
      return problem("Upload a contract file in the `contract` field.", 400);
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return problem("Upload a PDF or DOCX under 10 MB.", 413);
    }

    const extracted = await extractContractText(file);
    return NextResponse.json({
      extractedText: extracted.text,
      fileName: extracted.fileName,
      fileType: extracted.fileType,
    });
  } catch (error) {
    if (error instanceof UnsupportedContractFileError || error instanceof EmptyContractTextError) {
      return problem(error.message, 400);
    }
    throw error;
  }
}

function problem(message: string, status: number): Response {
  return NextResponse.json({ message }, { status });
}
