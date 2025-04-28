
import Summary from '@/components/common/Summary'
import { parseAISummary } from '@/lib/parseSummary'
import { getSummaryById } from '@/lib/singleSummary'

import { notFound } from 'next/navigation'

interface PageProps {
    params: {
        id: string
    }
}

const Page = async ({ params }: PageProps) => {
    const summary = await getSummaryById(params.id)

    if (!summary) {
        return notFound() // If summary not found, show 404 page
    }

    // Parse the summary text
    const parsedSummary = parseAISummary(summary.summaryText)

    console.log(parsedSummary)

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Summary parsedSummary={parsedSummary} />
        </div>
    )
}

export default Page
