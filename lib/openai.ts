import OpenAI from "openai";
import { SUMMARY_SYSTEM_PROMPT } from "./promt";

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
})

export async function generatePdfSummaryFromOpenAI(pdfText: string) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
                {
                    role: 'user',
                    content: `Here is the medical PDF text to summarize:\n\n${pdfText}`
                },
            ],
            temperature: 0.7,
            max_tokens: 2500
            // store: true,
        });

        return completion.choices[0].message.content;
    } catch (error: any) {
        if (error?.status === 429) {
            throw new Error('RATE_LIMIT_EXCEEDED')
        }
        throw error
    }
}



// console.log(completion.choices[0].message);
