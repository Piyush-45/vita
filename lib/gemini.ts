import { FUNNY_SUMMARY_SYSTEM_PROMPT2, FUNNY_SUMMARY_SYSTEM_PROMPT_HINDI, GENZ_SUMMARY_PROMPT, SUMMARY_SYSTEM_PROMPT } from "./promt";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_API_KEY!)

export const generatePdfSummaryFromGemini = async (pdfText: string) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro-002", generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1500
            }
        });

        const prompt = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: FUNNY_SUMMARY_SYSTEM_PROMPT2 },
                        {
                            text: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
                        },
                    ],
                },
            ],
        };



        const result = await model.generateContent(prompt);
        const response = await result.response;


        if (!response.text) {
            throw new Error("empty response from gemini api")
        }
        return response.text();

    } catch (error: any) {
        if (error?.status === 429) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        console.error("Gemini API Error:", error);
        throw error;
    }
};


export const generatePdfSummaryFromGeminiHindi = async (pdfText: string) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro-002", generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1500
            }
        });

        const prompt = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: FUNNY_SUMMARY_SYSTEM_PROMPT_HINDI },
                        {
                            text: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
                        },
                    ],
                },
            ],
        };



        const result = await model.generateContent(prompt);
        const response = await result.response;


        if (!response.text) {
            throw new Error("empty response from gemini api")
        }
        return response.text();

    } catch (error: any) {
        if (error?.status === 429) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        console.error("Gemini API Error:", error);
        throw error;
    }
};


export const generatePdfSummaryFromGeminiGenz = async (pdfText: string) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro-002", generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1500
            }
        });

        const prompt = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: GENZ_SUMMARY_PROMPT },
                        {
                            text: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
                        },
                    ],
                },
            ],
        };



        const result = await model.generateContent(prompt);
        const response = await result.response;


        if (!response.text) {
            throw new Error("empty response from gemini api")
        }
        return response.text();

    } catch (error: any) {
        if (error?.status === 429) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        console.error("Gemini API Error:", error);
        throw error;
    }
};


