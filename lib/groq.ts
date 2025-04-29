// lib/groq.ts
import { OpenAI } from "openai";
import { FUNNY_SUMMARY_SYSTEM_PROMPT2, FUNNY_SUMMARY_SYSTEM_PROMPT_HINDI, } from "./promt";

export const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY, // 🔑 Get from Groq Console
    baseURL: "https://api.groq.com/openai/v1", // ✅ Groq's base URL
});



export const generatePdfSummaryFromGroq = async (pdfText: string) => {
    try {
        const completion = await groq.chat.completions.create({
            model: "gemma2-9b-it", // or "llama2-70b-4096"
            messages: [
                {
                    role: "system",
                    content: FUNNY_SUMMARY_SYSTEM_PROMPT_HINDI,
                },
                {
                    role: "user",
                    content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
                },
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });

        return completion.choices[0].message.content;
    } catch (error: any) {
        if (error?.status === 429) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        console.error("Groq API Error:", error);
        throw error;
    }
};
