import { AuditAction, PrismaClient, Role, TaskStatus } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEFAULT_PASSWORD = 'Admin@1234'
const BCRYPT_ROUNDS = 12

async function main() {
    console.log('Seeding database...')

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS)

    // Upsert users by unique email to keep seed idempotent.
    const admin = await prisma.user.upsert({
        where: { email: 'admin@techan.com' },
        update: {
            name: 'System Admin',
            password: hashedPassword,
            role: Role.ADMIN,
        },
        create: {
            name: 'System Admin',
            email: 'admin@techan.com',
            password: hashedPassword,
            role: Role.ADMIN,
        },
    })

    const userOne = await prisma.user.upsert({
        where: { email: 'anika@techan.com' },
        update: {
            name: 'Anika Rahman',
            password: hashedPassword,
            role: Role.USER,
        },
        create: {
            name: 'Anika Rahman',
            email: 'anika@techan.com',
            password: hashedPassword,
            role: Role.USER,
        },
    })

    const userTwo = await prisma.user.upsert({
        where: { email: 'rifat@techan.com' },
        update: {
            name: 'Rifat Hasan',
            password: hashedPassword,
            role: Role.USER,
        },
        create: {
            name: 'Rifat Hasan',
            email: 'rifat@techan.com',
            password: hashedPassword,
            role: Role.USER,
        },
    })

    const userThree = await prisma.user.upsert({
        where: { email: 'sadia@techan.com' },
        update: {
            name: 'Sadia Akter',
            password: hashedPassword,
            role: Role.USER,
        },
        create: {
            name: 'Sadia Akter',
            email: 'sadia@techan.com',
            password: hashedPassword,
            role: Role.USER,
        },
    })

    await prisma.auditLog.deleteMany()
    await prisma.task.deleteMany()

    const taskOne = await prisma.task.create({
        data: {
            title: 'Set up role-based dashboard widgets',
            description: 'Implement dashboard sections based on user role permissions.',
            status: TaskStatus.PENDING,
            assignedById: admin.id,
            assignedToId: userOne.id,
        },
    })

    const taskTwo = await prisma.task.create({
        data: {
            title: 'Optimize task list query performance',
            description: 'Improve query speed and pagination consistency for task list API.',
            status: TaskStatus.PROCESSING,
            assignedById: admin.id,
            assignedToId: userTwo.id,
        },
    })

    const taskThree = await prisma.task.create({
        data: {
            title: 'Document API auth flow',
            description: 'Prepare onboarding documentation for login and token handling.',
            status: TaskStatus.DONE,
            assignedById: admin.id,
            assignedToId: userThree.id,
        },
    })

    await prisma.auditLog.create({
        data: {
            actorId: admin.id,
            action: AuditAction.CREATE_TASK,
            entity: 'TASK',
            entityId: taskOne.id,
            taskId: taskOne.id,
            summary: 'Created a new dashboard task and assigned to Anika.',
            after: {
                title: taskOne.title,
                status: taskOne.status,
                assignedToId: userOne.id,
            },
        },
    })

    await prisma.auditLog.create({
        data: {
            actorId: admin.id,
            action: AuditAction.ASSIGN_TASK,
            entity: 'TASK',
            entityId: taskTwo.id,
            taskId: taskTwo.id,
            summary: 'Assigned optimization task to Rifat.',
            after: {
                title: taskTwo.title,
                status: taskTwo.status,
                assignedToId: userTwo.id,
            },
        },
    })

    await prisma.auditLog.create({
        data: {
            actorId: admin.id,
            action: AuditAction.CHANGE_STATUS,
            entity: 'TASK',
            entityId: taskThree.id,
            taskId: taskThree.id,
            summary: 'Marked API auth documentation task as done.',
            before: {
                status: TaskStatus.PROCESSING,
            },
            after: {
                status: TaskStatus.DONE,
            },
        },
    })

    console.log('Seed complete.')
    console.log('Credentials for all seeded users:')
    console.log(`Password: ${DEFAULT_PASSWORD}`)
    console.log(`Admin: ${admin.email}`)
    console.log(`Users: ${userOne.email}, ${userTwo.email}, ${userThree.email}`)
}

main()
    .catch((error) => {
        console.error('Seed failed:', error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
