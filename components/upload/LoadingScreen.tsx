// components/common/LoadingScreen.tsx
import React from 'react';

const medicalTips = [
    "🧠 Did you know? Your brain uses 20% of your body’s oxygen supply!",
    "😂 Medical joke: Why did the doctor carry a red pen? In case they needed to draw blood!",
    "💉 Fun fact: The human body has 60,000 miles of blood vessels!",
    "🦴 Tip: Calcium keeps your bones strong! Don't forget your daily dose.",
    "🩺 Health Tip: Laughter truly is the best medicine — it boosts immunity too!"
];

const LoadingScreen = () => {
    const randomTip = medicalTips[Math.floor(Math.random() * medicalTips.length)];

    return (
        <div className="flex flex-col items-center justify-center h-64 w-full text-center p-4 border rounded-lg animate-pulse">
            <div className="text-xl font-semibold mb-4">Analyzing your report...</div>
            <div className="text-base text-gray-600">{randomTip}</div>
        </div>
    );
};

export default LoadingScreen;
