// project: ttspro.vercel.app | file: app/api/tts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { char, latin, mode, language } = await req.json();

    // 1. GUNAKAN GEMINI: Membuat teks instruksi yang cerdas berdasarkan jilid Iqro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Anda adalah guru ngaji. Berikan instruksi cara membaca huruf hijaiyah "${char}" (${latin}) 
                    untuk level Iqro jilid ${mode}. Gunakan bahasa ${language} yang singkat dan jelas.`;
    
    const geminiResult = await model.generateContent(prompt);
    const instructionText = geminiResult.response.text();

    // 2. GUNAKAN ELEVENLABS: Mengubah teks dari Gemini menjadi suara MP3
    const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: instructionText,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.6, similarity_boost: 0.75 }
      }),
    });

    if (!elevenLabsResponse.ok) throw new Error("ElevenLabs API Error");

    const audioBuffer = await elevenLabsResponse.arrayBuffer();

    // 3. RETURN: Kirim audio kembali ke WebApp IQRO
    return new Response(audioBuffer, {
      headers: { 
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': 'https://iqroquran.vercel.app' 
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal memproses suara" }, { status: 500 });
  }
}
