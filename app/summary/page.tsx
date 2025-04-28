import SummariesList from '@/components/Summary/SummaryList';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

const SummaryPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        // Optional: Handle unauthenticated users gracefully
        return (
            <div className="max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-8">Your Summaries</h1>
                <p className="text-muted-foreground">Please log in to view your summaries.</p>
            </div>
        );
    }

    const summaries = await prisma.pdfSummary.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
    });
    // console.log(summaries)

    return (
        <div className="w-[80%] mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Your Summaries</h1>
            <SummariesList summaries={summaries} />
        </div>
    );
};

export default SummaryPage;



// VitalWit
//ReportWit
// RideoReport