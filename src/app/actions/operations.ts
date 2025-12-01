'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const checkOutSchema = z.object({
    assetId: z.coerce.number().min(1, "Asset is required"),
    employeeId: z.coerce.number().min(1, "Employee is required"),
    notes: z.string().optional(),
});

const checkInSchema = z.object({
    assetId: z.coerce.number().min(1, "Asset is required"),
    status: z.enum(["AVAILABLE", "MAINTENANCE", "RETIRED"]),
    notes: z.string().optional(),
});

export async function checkOutAsset(prevState: any, formData: FormData) {
    const data = {
        assetId: formData.get("assetId"),
        employeeId: formData.get("employeeId"),
        notes: formData.get("notes"),
    };

    const result = checkOutSchema.safeParse(data);
    if (!result.success) {
        return { success: false, error: "Validation failed" };
    }

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Update Asset Status
            await tx.asset.update({
                where: { id: result.data.assetId },
                data: { status: "IN_USE" }
            });

            // 2. Create Transaction Log
            await tx.transaction.create({
                data: {
                    action: "CHECK_OUT",
                    assetId: result.data.assetId,
                    employeeId: result.data.employeeId,
                    notes: result.data.notes,
                }
            });
        });

        revalidatePath("/dashboard/assets");
        revalidatePath("/dashboard/operations");
        return { success: true, message: "Asset checked out successfully" };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to check out asset" };
    }
}

export async function checkInAsset(prevState: any, formData: FormData) {
    const data = {
        assetId: formData.get("assetId"),
        status: formData.get("status"),
        notes: formData.get("notes"),
    };

    const result = checkInSchema.safeParse(data);
    if (!result.success) {
        return { success: false, error: "Validation failed" };
    }

    try {
        // Find the last transaction to know who had it (for the record)
        const lastTx = await prisma.transaction.findFirst({
            where: { assetId: result.data.assetId, action: "CHECK_OUT" },
            orderBy: { date: 'desc' }
        });

        if (!lastTx) {
            return { success: false, error: "No previous check-out record found for this asset." };
        }

        await prisma.$transaction(async (tx) => {
            // 1. Update Asset Status
            await tx.asset.update({
                where: { id: result.data.assetId },
                data: { status: result.data.status }
            });

            // 2. Create Transaction Log
            await tx.transaction.create({
                data: {
                    action: "CHECK_IN",
                    assetId: result.data.assetId,
                    employeeId: lastTx.employeeId, // Use the employee from the last check-out
                    notes: result.data.notes,
                }
            });
        });

        revalidatePath("/dashboard/assets");
        revalidatePath("/dashboard/operations");
        return { success: true, message: "Asset returned successfully" };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to return asset" };
    }
}
