'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParsedSummary } from "@/lib/parseSummary";
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface HindiSummaryProps {
    parsedSummary: ParsedSummary;
}

const HindiSummary: React.FC<HindiSummaryProps> = ({ parsedSummary }) => {
    const [expandedTests, setExpandedTests] = useState<string[]>([]);

    const toggleExpand = (testName: string) => {
        setExpandedTests((prev) =>
            prev.includes(testName) ? prev.filter(name => name !== testName) : [...prev, testName]
        );
    };

    const getBorderColor = (status: string) => {
        switch (status) {
            case "normal":
                return "border-l-green-500";
            case "low":
                return "border-l-yellow-400";
            case "high":
                return "border-l-red-500";
            default:
                return "border-l-gray-300";
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto text-center">
            <motion.h2
                className="text-3xl font-bold mb-8 text-center text-teal-700"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                आपका स्वास्थ्य सारांश
            </motion.h2>

            <div className="space-y-8">
                {parsedSummary.tests.map((test, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(0,0,0,0.05)" }}
                        className={`transition-all duration-300 rounded-xl bg-white border ${getBorderColor(test.status)} border-l-4`}
                    >
                        <Card className="rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        {test.result && test.result !== "No reading available" && test.result !== "Not specified" && (
                                            <div className="text-3xl">{test.icon}</div>
                                        )}
                                        <div>
                                            <CardTitle className="text-lg text-gray-800">{test.name}</CardTitle>
                                            {test.nickname && (
                                                <CardDescription className="italic text-sm text-gray-500">"{test.nickname}"</CardDescription>
                                            )}
                                        </div>
                                    </div>
                                    {test.result && test.result !== "No reading available" && test.result !== "Not specified" && (
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${test.status === 'normal' ? 'border-green-500 text-green-600' :
                                                    test.status === 'low' ? 'border-yellow-400 text-yellow-500' :
                                                        test.status === 'high' ? 'border-red-500 text-red-600' :
                                                            'border-gray-300 text-gray-600'
                                                }`}
                                        >
                                            {test.status === 'normal' ? 'सामान्य' :
                                                test.status === 'low' ? 'कम' :
                                                    test.status === 'high' ? 'अधिक' :
                                                        'अज्ञात'}
                                        </Badge>


                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    {test.result && test.result !== "No reading available" && test.result !== "Not specified" && (
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-500 mb-1">परिणाम</h4>
                                            <p className="font-medium text-gray-800">
                                                {test.result} {test.explanation && `— ${test.explanation}`}
                                            </p>
                                        </div>
                                    )}

                                    {expandedTests.includes(test.name) && (
                                        <>
                                            {test.importance && (
                                                <div>
                                                    <h4 className="font-semibold text-sm text-gray-500 mb-1">इस टेस्ट का महत्व</h4>
                                                    <p className="text-gray-700">{test.importance}</p>
                                                </div>
                                            )}
                                            {test.tip && (
                                                <div>
                                                    <h4 className="font-semibold text-sm text-gray-500 mb-1">छोटा सुझाव</h4>
                                                    <p className="text-gray-700">{test.tip}</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col items-start gap-2 pt-0">
                                <p className="text-gray-800 font-medium">{test.verdict}</p>
                                {test.result && test.result !== "No reading available" && test.result !== "Not specified" && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleExpand(test.name)}
                                        className="text-sm bg-transparent text-teal-700 hover:text-teal-800 hover:bg-teal-50 flex items-center gap-1 p-0 h-auto"
                                    >
                                        {expandedTests.includes(test.name) ? 'कम देखें' : 'और जानें'}
                                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedTests.includes(test.name) ? 'rotate-180' : ''}`} />
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {parsedSummary.finalTip && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: parsedSummary.tests.length * 0.1 }}
                >
                    <Card className="mt-10 bg-blue-50 border-none rounded-xl shadow-inner">
                        <CardContent className="flex items-center gap-3 py-6">
                            <div className="text-3xl">🩺</div>
                            <p className="text-teal-900 font-semibold text-lg leading-relaxed">
                                {parsedSummary.finalTip}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default HindiSummary; 