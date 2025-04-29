import { ParsedSummary, TestResult } from "./parseSummary";

export function parseAISummaryHindi(summaryText: string): ParsedSummary {
    const tests: TestResult[] = [];
    let finalTip: string = "";

    // Split each test section by: ## 🧪 **Test**:
    const testSections = summaryText.split(/#{2}\s+🧪\s+\*\*Test\*\*:\s*/i).filter(Boolean);

    // Extract final tip separately (👉 "Tip Text")
    const finalTipMatch = summaryText.match(/👉\s+\*\*"([^"]+)"\*\*/);
    if (finalTipMatch) {
        finalTip = finalTipMatch[1].trim();
    }

    testSections.forEach(section => {
        const test: TestResult = {
            name: "",
            nickname: null,
            icon: "🧪",
            importance: "",
            result: "",
            status: "normal",
            explanation: "",
            tip: "",
            verdict: ""
        };

        // Test name (with optional nickname in parentheses)
        const nameMatch = section.match(/^([^\n(]+)(?:\s+\(aka\s+"([^"]+)"\))?/i);
        if (nameMatch) {
            test.name = nameMatch[1].trim();
            test.nickname = nameMatch[2]?.trim() || null;
        }

        // Importance (🧠 Iska kya kaam hai)
        const importanceMatch = section.match(/🧠\s+\*\*Iska kya kaam hai\*\*:\s+([\s\S]*?)\n\n|📊/);
        if (importanceMatch) {
            test.importance = importanceMatch[1].trim();
        }

        // Result (📊 Results)
        const resultMatch = section.match(/📊\s+\*\*Results\*\*:\s+([^\n]+)\s*—?\s*(.*)/);
        if (resultMatch) {
            test.result = resultMatch[1].trim();
            test.explanation = resultMatch[2].trim();

            // Determine status - check for both English and Hindi/Hinglish markers
            const resultLower = section.toLowerCase();
            if (resultLower.includes("(low)") || resultLower.includes("(kam)") || resultLower.includes("kam hai") || resultLower.includes("कम")) {
                test.status = "low";
            } else if (resultLower.includes("(high)") || resultLower.includes("(zyada)") || resultLower.includes("zyada hai") || resultLower.includes("अधिक")) {
                test.status = "high";
            } else if (resultLower.includes("(normal)") || resultLower.includes("(sahi)") || resultLower.includes("sahi hai") || resultLower.includes("सामान्य")) {
                test.status = "normal";
            } else {
                test.status = "normal"; // default fallback
            }
        }

        // Tiny Tip (🩺 Tiny Tip)
        const tipMatch = section.match(/🩺\s+\*\*Tiny Tip\*\*:\s+([^\n]+)/);
        if (tipMatch) {
            test.tip = tipMatch[1].trim();
        }

        // Verdict (🎯 Verdict & Vibes)
        const verdictMatch = section.match(/🎯\s+\*\*Verdict & Vibes\*\*:\s+([^\n]+)/);
        if (verdictMatch) {
            test.verdict = verdictMatch[1].trim();
        }

        tests.push(test);
    });

    return { tests, finalTip };
}
