'use client'
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const AnimatedButton = ({ href, children }: any) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div className="inline-block">
            <Link href={href}>
                <button
                    className="group relative overflow-hidden rounded-full px-10 py-5 font-bold text-white shadow-lg"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* Base background layer */}
                    <div className="absolute inset-0 bg-slate-900" />

                    {/* Animated gradient overlay */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-r from-[#088972] to-[#1B3669]/10 transition-transform duration-500 ease-out ${isHovering ? "translate-x-0" : "-translate-x-full"}`}
                    />

                    {/* Content with arrow animation */}
                    <div className="relative flex items-center gap-2">
                        <span>{children}</span>
                        <ArrowRight className={`transition-transform duration-300 ${isHovering ? "translate-x-1" : ""
                            }`} />
                    </div>
                </button>
            </Link>
        </div>
    );
};

export default function CTA() {
    return (
        <div className="mt-6 lg:mt-16">
            <AnimatedButton href="#pricing">
                Try LOL Labs
            </AnimatedButton>
        </div>
    );
}