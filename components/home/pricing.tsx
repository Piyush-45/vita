import { cn } from "@/lib/utils";
import { ArrowRight, CheckIcon } from "lucide-react";
import Link from "next/link";

type PriceType = {
    name: string;
    price: number;
    duration: 'month' | 'year'; // <-- added duration
    description?: string;
    items: string[];
    id: string;
    paymentLink: string;
    priceId: string;
};

const plans: PriceType[] = [
    {
        id: 'basic',
        name: 'Basic',
        price: 99,
        duration: 'month',
        items: [
            '5 PDF summaries per month',
            'Standard processing speed',
            'Email support',
        ],
        paymentLink: process.env.STRIPE_MONTHLY_PLAN_LINK || '#',
        priceId: process.env.STRIPE_MONTHLY_PRICEID || '',
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 299,
        duration: 'year',
        items: [
            'Unlimited PDF summaries',
            'Priority processing',
            '24/7 priority support',
        ],
        paymentLink: process.env.STRIPE_YEARLY_PLAN_LINK || '#',
        priceId: process.env.STRIPE_YEARLY_PRICEID || '',
    },
];

const PricingCard = ({
    name,
    price,
    duration,
    description,
    items,
    id,
    paymentLink,
    priceId,
}: PriceType) => {
    return (
        <div className="relative w-full max-w-lg hover:scale-105 hover:transition-all duration-300">
            <div
                className={cn(
                    "relative flex flex-col h-fit gap-4 lg:gap-8 z-10 p-8 rounded-xl border-[1px] border-gray-500/20",
                    id === "pro" && "border-[#088972] gap-5 border-2"
                )}
            >
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
                        <p className="text-base-content/80 mt-2">{description}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <p className="text-5xl tracking-tight font-extrabold">Rs.{price}</p>
                    <div className="flex flex-col justify-end mb-[4px]">
                        <p className="text-xs uppercase font-semibold">INR</p>
                        <p className="text-xs">/{duration}</p>
                    </div>
                </div>

                <div className="space-y-2.5 leading-relaxed text-base flex-1">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            <CheckIcon size={18} />
                            <span>{item}</span>
                        </li>
                    ))}
                </div>

                <div className="space-y-2 flex justify-center w-full">
                    <Link
                        href={paymentLink}
                        className="w-full rounded-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#088972] to-[#01624e]
                            hover:from-[#01624e] hover:to-[#088972]
                            text-white border-2 py-2"
                    >
                        Buy Now <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function PricingSection() {
    return (
        <section className="relative overflow-hidden" id="pricing">
            <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
                <div className="flex items-center justify-center w-full pb-12">
                    <h2 className="uppercase font-bold text-xl mb-8 text-[#1B3669]">
                        Pricing
                    </h2>
                </div>

                <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
                    {plans.map((plan) => (
                        <PricingCard key={plan.id} {...plan} />
                    ))}
                </div>
            </div>
        </section>
    );
}


