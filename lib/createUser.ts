import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function createOrGetUser() {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        throw new Error("No authenticated user");
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            clerkId: clerkUser.id,  // Matches schema
            // OR 
            email: clerkUser.emailAddresses[0]?.emailAddress
        },
    });

    if (existingUser) return existingUser;

    return prisma.user.create({
        data: {
            clerkId: clerkUser.id,  // Matches schema
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            fullName: clerkUser.fullName || clerkUser.firstName || "",
            status: "inactive",  // Matches your default
        },
    });
}


// lollabs@129