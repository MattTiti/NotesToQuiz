import pdf from "pdf-parse/lib/pdf-parse";
import mammoth from "mammoth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }
    const fileType = file.type;
    let extractedText = "";

    try {
      if (fileType === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfData = await pdf(buffer);
        extractedText = pdfData.text;
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } else if (fileType === "text/plain") {
        extractedText = await file.text();
      } else {
        return NextResponse.json(
          { message: "Unsupported file type" },
          { status: 400 }
        );
      }

      return NextResponse.json({ text: extractedText }, { status: 200 });
    } catch (extractionError) {
      console.error("Error during text extraction:", extractionError);
      return NextResponse.json(
        {
          message: "Error extracting text from file",
          error: extractionError.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in /api/extract:", error);
    return NextResponse.json(
      {
        message: "Error processing request",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
