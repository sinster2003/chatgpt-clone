import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

/*
    Another approach: assign globalThis to a variable
    
    const globalPrisma = globalThis as unknown as {
        prisma: PrismaClient | undefined
    }
*/

declare global {
    var prisma: PrismaClient | undefined;
}

function getPrismaClient() {
    const dbUrl = process.env.DATABASE_URL;

    if(!dbUrl) {
        throw new Error("Database URL not found");
    }

    /*
        Neon provides connection pooling using pgBouncer => not needed for our use case

        const pool = new Pool({
            connectionString: dbUrl
        });

        const adapter = new PrismaPg(pool);
    */

    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL
    });

    return new PrismaClient({ adapter });
}

export const prisma = globalThis.prisma ?? getPrismaClient();

if(process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}