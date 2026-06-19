import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

import type { ReviewReport } from "./schema.js";

export class UnsupportedContractFileError extends Error {
  constructor(readonly fileName: string) {
    super("Upload a PDF or DOCX contract.");
    this.name = "UnsupportedContractFileError";
  }
}

export class EmptyContractTextError extends Error {
  constructor(readonly fileName: string) {
    super("No readable text was extracted. Scanned PDFs need OCR, which V1 does not include.");
    this.name = "EmptyContractTextError";
  }
}

export type ExtractedContract = {
  readonly fileName: string;
  readonly fileType: UploadedContractFileType;
  readonly text: string;
};

type UploadedContractFileType = Extract<ReviewReport["fileType"], "pdf" | "docx">;

const MAX_TEXT_CHARS = 120_000;
const pdfWorkerPath = resolve(process.cwd(), "node_modules/pdf-parse/dist/worker/pdf.worker.mjs");
PDFParse.setWorker(`data:text/javascript;base64,${readFileSync(pdfWorkerPath, "base64")}`);

export async function extractContractText(file: File): Promise<ExtractedContract> {
  const fileType = detectFileType(file);
  const buffer = Buffer.from(await file.arrayBuffer());
  const text = await extractByType(buffer, fileType);
  const normalized = normalizeText(text).slice(0, MAX_TEXT_CHARS);

  if (normalized.length < 200) {
    throw new EmptyContractTextError(file.name);
  }

  return {
    fileName: file.name,
    fileType,
    text: normalized,
  };
}

function detectFileType(file: File): UploadedContractFileType {
  const lowerName = file.name.toLowerCase();
  if (file.type === "application/pdf" || lowerName.endsWith(".pdf")) {
    return "pdf";
  }
  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerName.endsWith(".docx")
  ) {
    return "docx";
  }
  throw new UnsupportedContractFileError(file.name);
}

async function extractByType(buffer: Buffer, fileType: UploadedContractFileType): Promise<string> {
  switch (fileType) {
    case "pdf": {
      const parser = new PDFParse({ data: buffer });
      try {
        const result = await parser.getText({ pageJoiner: "\n\n" });
        return result.text;
      } finally {
        await parser.destroy();
      }
    }
    case "docx": {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
  }
}

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
