/// <reference types="node" />
/**
 * Seed script — creates a COMPLETED booking for the first provider account found
 * Run: npx ts-node prisma/seed-completed-booking.ts
 */

import { PrismaClient, BookingStatus, InvoiceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // ── 1. Find (or create) a provider ──────────────────────────────────────
    let provider = await prisma.user.findFirst({
        where: { role: 'PROVIDER' },
        include: {
            providerProfile: {
                include: { services: { take: 1 } },
            },
        },
    });

    if (!provider) {
        throw new Error('No provider account found. Run seed-providers.ts first.');
    }

    console.log(`Using provider: ${provider.name} (${provider.email})`);

    // Make sure the provider has a profile and at least one service
    if (!provider.providerProfile) {
        throw new Error(`Provider ${provider.email} has no profile yet.`);
    }

    let service = provider.providerProfile.services[0];

    if (!service) {
        // Create a placeholder service so we can reference it
        service = await prisma.providerService.create({
            data: {
                profileId: provider.providerProfile.id,
                name: 'General Service',
                price: 5000,
                description: 'General vehicle service',
                duration: 60,
            },
        });
        console.log('Created placeholder service for provider.');
    }

    // ── 2. Find (or create) an owner with a vehicle ──────────────────────────
    let owner = await prisma.user.findFirst({
        where: { role: 'OWNER' },
        include: { vehicles: { take: 1 } },
    });

    if (!owner) {
        const password = await bcrypt.hash('Test@1234', 10);
        owner = await prisma.user.create({
            data: {
                email: 'testowner@test.com',
                name: 'Test Owner',
                password,
                role: 'OWNER',
            },
            include: { vehicles: { take: 1 } },
        });
        console.log('Created test owner account: testowner@test.com / Test@1234');
    } else {
        console.log(`Using owner: ${owner.name} (${owner.email})`);
    }

    let vehicle = (owner as any).vehicles[0];

    if (!vehicle) {
        vehicle = await prisma.vehicle.create({
            data: {
                ownerId: owner.id,
                make: 'Toyota',
                model: 'Corolla',
                year: 2020,
                licensePlate: 'CAB-1234',
            },
        });
        console.log('Created test vehicle: Toyota Corolla (CAB-1234)');
    } else {
        console.log(`Using vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`);
    }

    // ── 3. Create the COMPLETED booking ─────────────────────────────────────
    const serviceDate = new Date('2026-03-10T09:00:00.000Z');

    const booking = await prisma.booking.create({
        data: {
            vehicleId: vehicle.id,
            providerId: provider.id,
            serviceId: service.id,
            timeSlot: '09:00 AM',
            description: 'Full vehicle service including oil change and brake inspection.',
            serviceDate,
            status: BookingStatus.COMPLETED,
        },
    });

    console.log(`✅ Created COMPLETED booking: ${booking.id}`);

    // ── 4. Create a PAID invoice for the booking ─────────────────────────────
    const invoice = await prisma.invoice.create({
        data: {
            bookingId: booking.id,
            amount: service.price,
            status: InvoiceStatus.PAID,
            items: [
                {
                    name: service.name,
                    price: Number(service.price),
                    quantity: 1,
                },
            ],
        },
    });

    console.log(`✅ Created PAID invoice: ${invoice.id} — LKR ${invoice.amount}`);
    console.log('\n📋 Summary:');
    console.log(`   Provider : ${provider.name} (${provider.email})`);
    console.log(`   Owner    : ${owner.name} (${owner.email})`);
    console.log(`   Vehicle  : ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`);
    console.log(`   Service  : ${service.name}`);
    console.log(`   Date     : ${serviceDate.toDateString()}`);
    console.log(`   Status   : COMPLETED`);
    console.log(`   Invoice  : PAID — LKR ${invoice.amount}`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
