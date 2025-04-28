'use server';

import { generatePdfSummaryFromGemini } from "@/lib/gemini"; // Optional if you want to use Gemini
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { generatePdfSummaryFromGroq } from "@/lib/groq";

const prisma = new PrismaClient();

type PdfSummaryType = {
    userId?: string;
    fileUrl: string;
    summary: string;
    title: string;
    fileName: string;
};

// ✅ Generate summary from uploaded PDF
export async function generatePdfSummary(
    uploadResponse: [
        {
            serverData: {
                file: { url: string; name: string };
            };
        }
    ]
) {
    if (!uploadResponse || !uploadResponse[0]) {
        return { success: false, message: "File upload failed", data: null };
    }

    const {
        serverData: {
            file: { url: pdfUrl, name: fileName },
        },
    } = uploadResponse[0];

    if (!pdfUrl) {
        return { success: false, message: "Missing PDF URL", data: null };
    }

    try {
        // ✅ Extract text from PDF
        const pdfText = await fetchAndExtractPdfText(pdfUrl);

        // ✅ Generate summary using gemini AI
        let summaryText;
        try {
            summaryText = await generatePdfSummaryFromGemini(pdfText);
            console.log(summaryText);
        } catch (error) {
            console.error("Error generating summary:", error);
            return { success: false, message: "AI summary failed", data: null };
        }

        if (!summaryText) {
            return {
                success: false,
                message: "Failed to generate summary",
                data: null,
            };
        }

        // ✅ Return generated summary to be saved later
        return {
            success: true,
            message: "Summary generated successfully",
            data: {
                summary: summaryText,
                fileName,
                fileUrl: pdfUrl,
                title: "", // Optional: you can extract title from summary if needed
            },
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Error processing the file",
            data: null,
        };
    }
}

// ✅ Save summary to database after ensuring user exists
export async function savePdfSummary({
    fileUrl,
    summaryText,
    fileName,
    title,
    userId,
}: {
    userId: string;
    fileUrl: string;
    summaryText: string;
    fileName: string;
    title: string;
}) {
    // 🔐 Fetch user details from Clerk
    const userDetails = await clerkClient.users.getUser(userId);
    const userEmail = userDetails.emailAddresses[0]?.emailAddress || "";
    const userName = `${userDetails.firstName ?? ""} ${userDetails.lastName ?? ""}`.trim();


    // ✅ Ensure user exists in DB (via upsert)
    await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: userEmail,
            fullName: userName,
        },
    });

    // ✅ Save summary in DB
    const result = await prisma.pdfSummary.create({
        data: {
            userId,
            originalFileUrl: fileUrl,
            summaryText,
            title,
            fileName,
        },
    });

    return result;
}

// ✅ Server Action to handle saving the summary
export async function storePdfSummaryAction({
    fileUrl,
    summary,
    title,
    fileName,

}: PdfSummaryType) {
    console.log("[Action] storePdfSummaryAction called");

    try {
        const { userId } = await auth(); // 🔐 Get logged-in user
        console.log("user id from action", userId);

        if (!userId) {
            return {
                success: false,
                message: "User not authenticated",
            };
        }

        // ✅ Save summary to DB
        const savedSummary = await savePdfSummary({
            userId,
            fileUrl,
            summaryText: summary,
            title,
            fileName,
        });

        console.log("[Action] Saved Summary:", savedSummary);

        return {
            success: true,
            message: "PDF summary saved successfully",
            data: savedSummary,
        };
    } catch (error) {
        console.error("Error in storePdfSummaryAction:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Error saving PDF summary",
        };
    }
}