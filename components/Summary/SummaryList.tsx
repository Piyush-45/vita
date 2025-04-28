'use client';

import React from 'react';
import { Button } from '@/components/ui/button'; // Your custom button
import Link from 'next/link';

interface PdfSummary {
    id: string;
    title: string | null;
    fileName: string | null;
    originalFileUrl: string;
    createdAt: string | Date;
}

interface SummariesListProps {
    summaries: PdfSummary[];
}

const SummariesList: React.FC<SummariesListProps> = ({ summaries }) => {
    if (summaries.length === 0) {
        return (
            <div className="text-center mt-10 text-muted-foreground">
                You haven't uploaded any PDFs yet.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {summaries.map((summary) => (
                <div
                    key={summary.id}
                    className="border rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition"
                >
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-semibold">
                            {summary.fileName || "Untitled Summary"}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            File: {summary.fileName || "Unknown"}
                        </p>
                        <p className="text-muted-foreground text-xs">
                            Uploaded on: {new Date(summary.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button asChild variant="outline" size="sm">
                            <Link href={summary.originalFileUrl} target="_blank" rel="noopener noreferrer">
                                Download PDF
                            </Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link href={`/summary/${summary.id}`}>
                                View Summary
                            </Link>
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummariesList;

// http://localhost:3000/summary/7904f7b6-0664-44c1-82ed-0401f52874ac
// http://localhost:3000/summary/fe3a5e9f-8371-4cc9-ba8b-0589b9bbfdc7