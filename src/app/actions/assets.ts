'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

const assetSchema = z.object({
    code: z.string().min(1, "Asset Code is required"),
    name: z.string().min(1, "Name is required"),
    typeId: z.coerce.number().min(1, "Type is required"),
    serialNumber: z.string().optional(),
    status: z.enum(["AVAILABLE", "IN_USE", "MAINTENANCE", "RETIRED"]).default("AVAILABLE"),
    purchaseDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
    price: z.coerce.number().optional(),
});

export async function createAsset(prevState: any, formData: FormData) {
    const data = {
        code: formData.get("code"),
        name: formData.get("name"),
        typeId: formData.get("typeId"),
        serialNumber: formData.get("serialNumber"),
        status: formData.get("status") || "AVAILABLE",
        purchaseDate: formData.get("purchaseDate"),
        price: formData.get("price"),
    };

    const result = assetSchema.safeParse(data);

    if (!result.success) {
        return { success: false, error: "Validation failed", fields: result.error.flatten().fieldErrors };
    }

    try {
        await prisma.asset.create({
            data: result.data,
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: "Asset code must be unique." };
        }
        return { success: false, error: "Failed to create asset." };
    }

    revalidatePath("/dashboard/assets");
    redirect("/dashboard/assets");
}

export async function getAssets(query?: string, status?: string) {
    const where: any = {};

    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { code: { contains: query, mode: 'insensitive' } },
            { serialNumber: { contains: query, mode: 'insensitive' } },
        ];
    }

    if (status && status !== 'ALL') {
        where.status = status as any;
    }

    return await prisma.asset.findMany({
        where,
        include: {
            type: true,
            transactions: {
                orderBy: { date: 'desc' },
                take: 1,
                include: { employee: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getAssetById(id: number) {
    return await prisma.asset.findUnique({
        where: { id },
        include: {
            type: true,
            transactions: {
                include: { employee: true },
                orderBy: { date: 'desc' }
            }
        }
    });
}
