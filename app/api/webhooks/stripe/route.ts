import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Configure this route to only run at runtime, not during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
    // Check for required environment variables
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        console.error("Missing required environment variables");
        return new NextResponse("Server configuration error", { status: 500 });
    }

    // Initialize Stripe inside the function
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    try {
        const payload = await req.text();
        const sig = req.headers.get("stripe-signature")!;
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        } catch (err: any) {
            console.error("Webhook signature verification failed:", err.message);
            return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            if (!session.customer_email || !session.amount_total || !session.id) {
                console.error("Missing required fields in Stripe session:", session);
                return new NextResponse("Invalid Stripe session data", { status: 400 });
            }

            const foundUser = await prisma.user.findUnique({
                where: { email: session.customer_email },
            });

            if (!foundUser) {
                console.error("User not found for email:", session.customer_email);
                return new NextResponse("User not found", { status: 404 });
            }

            // Store the payment record
            await prisma.payment.create({
                data: {
                    userEmail: foundUser.email, // Keeping userEmail instead of userId
                    amount: session.amount_total, // Amount in INR (paisa), ensure correct handling in UI
                    status: "paid",
                    stripePaymentId: session.id,
                    priceId: session.metadata?.priceId ?? "unknown",
                },
            });

            // Update user status to "active" and store priceId
            await prisma.user.update({
                where: { email: foundUser.email },
                data: { status: "active", priceId: session.metadata?.priceId ?? null },
            });
        }

        return new NextResponse("Webhook received", { status: 200 });
    } catch (error) {
        console.error("Error in Stripe webhook:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}