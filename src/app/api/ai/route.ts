import { imageToPrompt } from "@/utils/prompt";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
interface InputData {
  apiKey: string;
  numberOfTags: number;
  image: string;
}

export async function POST(request: Request) {
  const { apiKey, numberOfTags, image }: InputData = await request.json();
  const totalTag = parseInt(String(numberOfTags)) || 25;
  if (!apiKey || !image) {
    return Response.json({ message: "Missing apikey or image !" });
  }
  try {
    const prompt = imageToPrompt({ tag: totalTag });
    const imageConfig = {
      inlineData: {
        // data: Buffer.from(fs.readFileSync("demo.png")).toString("base64"),
        data: image.split(",")[1],
        mimeType: "image/*",
      },
    };
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt, imageConfig]);

    const splitRes = result.response.text().split("\n\n");
    const title = splitRes[0].split("**Title:**")[1].trim();
    const description = splitRes[1].split("**Description:**")[1].trim();
    const tags = splitRes[2].split("**Tags:**")[1].trim().split(",");
    const data = { title, description, tags };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Something want wrong !" },
      { status: 400 }
    );
  }
}
