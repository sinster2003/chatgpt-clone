// server function
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function requireUser() {
  try {
    const { userId } = await auth.protect();
    
    if(!userId) {
      throw new Error("Unauthenticated User. Please sign in!");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerk_id: userId
      }
    });

    if(!user) {
      throw new Error("User not found.");
    }

    return user;
  }
  catch (error) {
    throw new Error("Failed to retrieve user");
  }
}