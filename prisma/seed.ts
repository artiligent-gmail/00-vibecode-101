import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const employees = [
        { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', department: 'IT' },
        { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', department: 'HR' },
        { firstName: 'Alice', lastName: 'Johnson', email: 'alice.j@example.com', department: 'Sales' },
        { firstName: 'Bob', lastName: 'Brown', email: 'bob.b@example.com', department: 'Marketing' },
    ]

    console.log('Start seeding employees...')
    for (const emp of employees) {
        const user = await prisma.employee.upsert({
            where: { email: emp.email },
            update: {},
            create: emp,
        })
        console.log(`Created employee with id: ${user.id}`)
    }
    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
