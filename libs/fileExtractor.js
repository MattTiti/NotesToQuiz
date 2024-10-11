const pdfjsLib =
  typeof window !== "undefined" ? require("pdfjs-dist/webpack") : null;
const mammoth = typeof window !== "undefined" ? require("mammoth") : null;

export async function extractTextFromFile(file) {
  const fileType = file.type;

  if (fileType === "application/pdf") {
    return await extractTextFromPDF(file);
  } else if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await extractTextFromDocx(file);
  } else if (fileType === "text/plain") {
    return await extractTextFromTxt(file);
  } else {
    throw new Error("Unsupported file type");
  }
}

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let extractedText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    extractedText += pageText + "\n";
  }

  return extractedText;
}

async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractTextFromTxt(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (event) => reject(event.target.error);
    reader.readAsText(file);
  });
}
