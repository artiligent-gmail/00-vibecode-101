'use server'

import { prisma } from "@/lib/prisma";

export async function getAssetStats() {
    const [total, available, inUse, maintenance] = await Promise.all([
        prisma.asset.count(),
        prisma.asset.count({ where: { status: "AVAILABLE" } }),
        prisma.asset.count({ where: { status: "IN_USE" } }),
        prisma.asset.count({ where: { status: "MAINTENANCE" } }),
    ]);

    return {
        total,
        available,
        inUse,
        maintenance
    };
}

export async function getRecentActivity() {
    return await prisma.transaction.findMany({
        take: 5,
        orderBy: { date: 'desc' },
        include: {
            asset: {
                select: { name: true, code: true }
            },
            employee: {
                select: { firstName: true, lastName: true }
            }
        }
    });
}
