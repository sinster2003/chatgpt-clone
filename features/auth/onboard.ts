"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

const onboardUser = async () => {
    try {
        const user = await currentUser();
        
        if(!user) {
            throw new Error("Unauthenticated! Please sign in to the application.");
        }

        await prisma.user.upsert({
            where: {
                clerk_id: user.id
            },
            create: {
                clerk_id: user.id,
                email: user.emailAddresses[0].emailAddress ?? null,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl
            },
            update: {
                email: user.emailAddresses[0].emailAddress ?? null,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl
            }
        })
    }
    catch(error) {
        console.log(error);
        throw new Error("Onboarding user failed! Please sign in."); // handled in error.tsx (when created)
    }
}

export default onboardUser;