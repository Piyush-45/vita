// components/UploadForm.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { z } from 'zod';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { generatePdfSummary, storePdfSummaryAction } from '@/actions/upload-action';
import Summary from '../common/Summary';
import { parseAISummary, ParsedSummary } from '@/lib/parseSummary';
import { ClientUploadedFileData } from 'uploadthing/types';
import LoadingScreen from './LoadingScreen';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

import HindiSummary from '../common/HindiSummary';
import { parseAISummaryHindi } from '@/lib/ParseHindiSummary';


// Zod schema for file validation
const schema = z.object({
    file: z
        .custom<File>((file) => file instanceof File, { message: 'Invalid file' })
        .refine((file) => file.size <= 20 * 1024 * 1024, {
            message: 'File size must be less than 20MB',
        })
        .refine((file) => file.type.startsWith('application/pdf'), 'File must be a PDF')
});

const UploadForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [parsedSummary, setParsedSummary] = useState<ParsedSummary | null>(null);

    const [language, setLanguage] = useState<'en' | 'hi'>('en');

    const { startUpload } = useUploadThing('pdfUploader', {
        onClientUploadComplete: () => { toast.success("Your PDF has been uploaded successfully") },
        onUploadError: (error: any) => {
            toast.error('Error occurred while uploading');
            console.error('Upload error:', error);
        },
        onUploadBegin: (fileName) => toast(`Uploading ${fileName}...`)
    });

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const file = formData.get('file');

        if (!(file instanceof File)) {
            toast.error('Invalid file');
            return;
        }

        const validatedFields = schema.safeParse({ file });
        if (!validatedFields.success) {
            toast.error(validatedFields.error.flatten().fieldErrors.file?.[0] ?? 'Invalid file');
            return;
        }

        setIsLoading(true);
        setParsedSummary(null);


        // Start upload process
        const uploadToastId = toast.loading('Uploading PDF...');
        const resp = await startUpload([file]) as [ClientUploadedFileData<{ uploadedBy: string; file: { url: string; name: string; } }>];

        // now resp[0] is guaranteed


        if (!resp) {
            toast.error('Upload Failed', { id: uploadToastId });
            setIsLoading(false);
            return;
        }

        toast.success('PDF uploaded successfully!', { id: uploadToastId });

        // Generate summary
        const summaryToastId = toast.loading('Generating summary...');
        const summary = await generatePdfSummary(resp, language);

        if (!summary.success || !summary.data?.summary) {
            toast.error(summary.message ?? "Summary failed", { id: summaryToastId });
        } else {
            toast.success("Summary generated successfully", { id: summaryToastId });

            // Save the raw summary text
            const summaryText = summary.data.summary;


            // Save summary to DB using correct fields

            // Parse the summary text into structured data
            try {
                if (language === "hi") {
                    const parsed = parseAISummaryHindi(summaryText);
                    setParsedSummary(parsed);
                } else {
                    const parsed = parseAISummary(summaryText);
                    setParsedSummary(parsed);
                }

                await storePdfSummaryAction({
                    summary: summaryText,
                    fileUrl: resp[0].serverData.file.url,
                    fileName: resp[0].serverData.file.name,
                    title: summary.data.title ?? "Untitled",

                });
            } catch (error) {
                console.error("Error parsing summary:", error);
                toast.error("Error formatting summary. Displaying raw version.");

                // If parsing fails, still save raw summary?
                await storePdfSummaryAction({
                    summary: summaryText,
                    fileUrl: resp[0].serverData.file.url,
                    fileName: resp[0].serverData.file.name,
                    title: summary.data.title ?? "Untitled",
                });
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
            <UploadFormInput
                onSubmit={onSubmit}
                isLoading={isLoading}
                language={language}
                setLanguage={setLanguage}
            />

            {isLoading ? (
                <LoadingScreen />
            ) : parsedSummary ? (
                language === 'en' ? (
                    <Summary parsedSummary={parsedSummary} />
                ) : (
                    <HindiSummary parsedSummary={parsedSummary} />
                )
            ) : null}
        </div>

    );
};

export default UploadForm;

interface UploadFormInputProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    language: 'en' | 'hi';
    setLanguage: React.Dispatch<React.SetStateAction<'en' | 'hi'>>;
}


// Reusable input form component
const UploadFormInput: React.FC<UploadFormInputProps> = ({ onSubmit, isLoading, language, setLanguage }) => {
    return (
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>

            <div className="flex justify-end items-center gap-1.5">
                <Input
                    type="file"
                    id="file"
                    name="file"
                    accept="application/pdf"
                    required
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Upload your PDF"}
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                <Label className="text-base font-semibold">Select Language</Label>

                <div className="flex gap-4">
                    {[
                        { id: 'en', label: 'English' },
                        { id: 'hi', label: 'Hindi' }
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setLanguage(id as 'en' | 'hi')}
                            className={`
      px-6 py-2 rounded-lg border text-sm font-medium transition-all
      ${language === id
                                    ? 'bg-primary text-white border-primary shadow-sm'
                                    : 'bg-muted hover:bg-muted/70 border-muted-foreground/20'}
    `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

        </form>
    );
};