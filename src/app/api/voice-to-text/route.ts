import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");



    if (!file) {
      throw new Error("No file uploaded");
    }

    const blob = new Blob([file], { type: "audio/mpeg" });

    const formDataForOpenAI = new FormData();
    formDataForOpenAI.append("file", blob);
    formDataForOpenAI.append("model", "whisper-1");

    const { data } = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formDataForOpenAI,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_OPENAI_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return NextResponse.json({ text: data.text, status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: "An error occurred in voice to text",
      status: 400,
    });
  }
}
