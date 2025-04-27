// lib/parseSummary.ts

export interface TestResult {
    name: string;
    nickname: string | null;
    icon: string;
    importance: string;
    result: string;
    status: 'low' | 'normal' | 'high';
    explanation: string;
    tip: string;
    verdict: string;
    referenceRange?: string; // New!
}

export interface ParsedSummary {
    tests: TestResult[];
    finalTip: string;
}

export function parseAISummary(summaryText: string): ParsedSummary {
    const tests: TestResult[] = [];
    let finalTip: string = "";

    // Split by test sections (starts with ## 🧪)
    const testSections = summaryText.split(/#{2}\s+🧪\s+\*\*Test\*\*:/i).filter(Boolean);

    // Extract final tip separately (starts with 👉)
    const finalTipMatch = summaryText.match(/👉\s+"([^"]+)"/);
    if (finalTipMatch) {
        finalTip = finalTipMatch[1];
    }

    // Process each test section
    testSections.forEach(section => {
        // Basic structure to populate
        const test: TestResult = {
            name: "",
            nickname: null,
            icon: "🧪", // Default icon
            importance: "",
            result: "",
            status: "normal", // Default status
            explanation: "",
            tip: "",
            verdict: ""
        };

        // Extract test name and nickname
        const nameMatch = section.match(/^([^(]+)(?:\(aka\s+"([^"]+)"\))?/);
        if (nameMatch) {
            test.name = nameMatch[1].trim();
            test.nickname = nameMatch[2] ? nameMatch[2].trim() : null;
        }

        // Extract importance (Why this test matters)
        const importanceMatch = section.match(/🧠\s+\*\*Why this test matters\*\*:\s+([^\n]+)/);
        if (importanceMatch) {
            test.importance = importanceMatch[1].trim();
        }


        // Extract results
        const resultsMatch = section.match(/📊\s+\*\*Results\*\*:\s+([^—\n]+)(?:—\s+([^\n]+))?/);
        if (resultsMatch) {
            test.result = resultsMatch[1]?.trim() || "Not specified";
            test.explanation = resultsMatch[2]?.trim() || "";

            // Determine status based on result text or explicit markers
            if (section.toLowerCase().includes("(low)") || test.result.toLowerCase().includes("low") || test.result.toLowerCase().includes(" slightly low")) {
                test.status = "low";
            } else if (section.toLowerCase().includes("(high)") || test.result.toLowerCase().includes("high") || test.result.toLowerCase().includes("slightly high")) {
                test.status = "high";
            } else {
                test.status = "normal";
            }
        } else {
            // Fallback if no specific result is found
            test.result = "No reading available";

            // Try to still determine status from keywords
            if (section.toLowerCase().includes("low")) {
                test.status = "low";
            } else if (section.toLowerCase().includes("high")) {
                test.status = "high";
            } else {
                test.status = "normal";
            }
        }


        // Extract tiny tip
        const tipMatch = section.match(/🩺\s+\*\*Tiny Tip\*\*:\s+([^\n]+)/);
        if (tipMatch) {
            test.tip = tipMatch[1].trim();
        }

        // Extract verdict
        const verdictMatch = section.match(/🎯\s+\*\*Verdict & Vibes\*\*:\s+([^\n]+)/);
        if (verdictMatch) {
            test.verdict = verdictMatch[1].trim();
        }

        tests.push(test);
    });

    return { tests, finalTip };
}