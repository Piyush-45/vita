import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Test from '../common/test';
import CTA from '../common/cta-button';

export default async function HeroSection() {

    return (
        <>
            <section className="relative mx-auto flex flex-col z-0 items-center justify-center py-16 sm:py-20 lg:pb-28 transition-all animate-in lg:px-12 max-w-7xl">
                <div className="flex">
                    <div className="relative p-[1px] overflow-hidden rounded-full bg-linear-to-r from-rose-200 via-rose-500 to-rose-800 animate-gradient-x group">
                        <Badge
                            variant={'secondary'}
                            className="relative px-6 py-2 text-base font-medium bg-white rounded-full group-hover:bg-gray-50 transition-colors duration-200"
                        >
                            <Sparkles className="h-6 w-6 mr-2 text-rose-600 animate-pulse" />
                            <p className="text-base text-rose-600">Powered by AI</p>
                        </Badge>
                    </div>
                </div>


                <h1 className="font-bold py-6 text-center ">
                    Turn Boring Medical Reports into – {' '}
                    <span className="relative inline-block">
                        <span className="relative z-10 px-2">Mazedar</span>
                        <span
                            className="absolute inset-0 bg-[#088972]/20 -rotate-2 rounded-lg transform -skew-y-1"
                            aria-hidden="true"
                        ></span>
                    </span>
                    Health Summaries

                </h1>

                <h2 className="text-lg sm:text-xl lg:text-2xl text-center px-4 lg:px-0 lg:max-w-4xl text-gray-600">
                    Get a beautiful summary reel of the document in seconds Turn complex health checkups into hilarious, easy-to-digest summaries — no medical degree required.
                </h2>

                <div>
                    <CTA />

                </div>
            </section>
        </>
    );
}


