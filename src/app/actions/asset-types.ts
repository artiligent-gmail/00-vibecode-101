'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const assetTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
});

export async function getAssetTypes() {
    return await prisma.assetType.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { assets: true }
            }
        }
    });
}

export async function createAssetType(prevState: any, formData: FormData) {
    const data = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
    };

    const result = assetTypeSchema.safeParse(data);
    if (!result.success) {
        return { success: false, error: "Validation failed", fields: result.error.flatten().fieldErrors };
    }

    try {
        await prisma.assetType.create({
            data: result.data,
        });
        revalidatePath("/dashboard/settings");
        return { success: true, message: "Asset type created successfully" };
    } catch (error) {
        return { success: false, error: "Failed to create asset type. Name might be duplicate." };
    }
}

export async function deleteAssetType(id: number) {
    try {
        // Check for existing assets
        const count = await prisma.asset.count({
            where: { typeId: id }
        });

        if (count > 0) {
            return { success: false, error: "Cannot delete: Type is in use by assets." };
        }

        await prisma.assetType.delete({
            where: { id }
        });
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete asset type." };
    }
}
