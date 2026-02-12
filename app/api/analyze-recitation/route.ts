// project: ttspro.vercel.app | file: app/api/analyze-recitation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;
    const targetText = formData.get('target_text') as string;
    const lang = formData.get('language') as string || 'id';

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // AI menganalisis audio vs teks asli
    const result = await model.generateContent([
      `Sebagai tutor ngaji, analisis audio rekaman ini berdasarkan teks asli: "${targetText}".
       Berikan feedback dalam bahasa ${lang}. 
       Format response JSON: { "score": 0-100, "feedback": "teks", "tajwid_notes": "teks" }`,
      { inlineData: { data: await blobToBase64(audioFile), mimeType: "audio/webm" } }
    ]);

    const responseText = result.response.text();
    // Membersihkan markdown jika AI mengembalikannya
    const cleanedJson = responseText.replace(/```json|```/g, "");

    return NextResponse.json(JSON.parse(cleanedJson), {
      headers: { 'Access-Control-Allow-Origin': '*' } // Izinkan akses dari mana saja
    });
  } catch (e) {
    return NextResponse.json({ error: "AI Processing Failed" }, { status: 500 });
  }
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return buffer.toString('base64');
}
