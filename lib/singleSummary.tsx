import { prisma } from "./prisma";


export const getSummaryById = async (summaryId: string) => {
    try {
        const summary = await prisma.pdfSummary.findUnique({
            where: {
                id: summaryId,
            },
            // include: {
            //     user: true, // optional, if you also want user info
            // },
        });
        console.log(summary)
        return summary;
    } catch (error) {
        console.error("Error fetching summary:", error);
        return null;
    }
};
