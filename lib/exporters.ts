"use client";

import { Document, Packer, Paragraph, TextRun } from "docx";
import { jsPDF } from "jspdf";

export async function exportAsDocx(title: string, text: string) {
  const document = new Document({
    sections: [
      {
        children: text
          .split("\n")
          .filter(Boolean)
          .map((line) => new Paragraph({ children: [new TextRun(line)] }))
      }
    ]
  });

  const blob = await Packer.toBlob(document);
  downloadBlob(blob, `${slugify(title)}.docx`);
}

export function exportAsPdf(title: string, text: string) {
  const pdf = new jsPDF();
  const lines = pdf.splitTextToSize(text, 180);
  pdf.text(lines, 15, 20);
  pdf.save(`${slugify(title)}.pdf`);
}

export function exportAsTxt(title: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${slugify(title)}.txt`);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
