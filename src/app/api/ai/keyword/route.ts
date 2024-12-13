import { keywordPrompt } from "@/utils/prompt";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

interface InputData {
  apiKey: string;
  numberOfTag: number;
  images: string[];
}
export async function POST(request: Request) {
  const { apiKey, numberOfTag, images }: InputData = await request.json();
  const totalTag = parseInt(String(numberOfTag)) || 25;
  if (!apiKey || !images.length) {
    return Response.json({ message: "Missing API key or image !" });
  }
  try {
    const dataConfig = images.map((x) => {
      return {
        inlineData: {
          data: x.split(",")[1],
          mimeType: "image/webp",
        },
      };
    });
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      ...dataConfig,
      keywordPrompt({ tag: totalTag }),
    ]);
    const text = result.response.text();
    const cleanedData = text
      .replace("```json", "") // Remove the opening part
      .replace("```", ""); // Remove the closing part
    const data = JSON.parse(cleanedData);
    return Response.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Something want wrong !" },
      { status: 400 }
    );
  }
}
