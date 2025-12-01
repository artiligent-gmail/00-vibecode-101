'use server'

import { prisma } from "@/lib/prisma";

export async function getEmployees() {
    return await prisma.employee.findMany({
        orderBy: { firstName: 'asc' }
    });
}
