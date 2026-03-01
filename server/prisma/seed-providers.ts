/// <reference types="node" />
/**
 * Seed script — inserts 3 test provider accounts
 * Run: npx ts-node prisma/seed-providers.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('Test@1234', 10);

    const providers = [
        {
            email: 'speedgarage@test.com',
            name: 'Speed Garage Colombo',
            profile: {
                businessName: 'Speed Garage Colombo',
                category: 'GARAGE' as const,
                streetAddress: '45 Duplication Rd',
                district: 'Colombo',
                city: 'Colombo',
                businessDescription: 'Full-service auto garage specialising in engine overhauls and diagnostics.',
                registrationNumber: 'BR-20241001',
            },
            services: [
                { name: 'Engine Overhaul', price: 35000 },
                { name: 'Oil Change', price: 2500 },
                { name: 'Brake Service', price: 8000 },
                { name: 'AC Repair', price: 12000 },
                { name: 'Tyre Rotation', price: 1500 },
            ],
        },
        {
            email: 'pearldetail@test.com',
            name: 'Pearl Auto Detailers',
            profile: {
                businessName: 'Pearl Auto Detailers',
                category: 'DETAILER' as const,
                streetAddress: '12 Galle Rd',
                district: 'Galle',
                city: 'Galle',
                businessDescription: 'Premium ceramic coating and interior detailing studio for all vehicles.',
            },
            services: [
                { name: 'Ceramic Coating', price: 45000 },
                { name: 'Interior Detailing', price: 9000 },
                { name: 'Paint Correction', price: 25000 },
            ],
        },
        {
            email: 'kandicarrier@test.com',
            name: 'Kandy Transport Solutions',
            profile: {
                businessName: 'Kandy Transport Solutions',
                category: 'CARRIER' as const,
                streetAddress: '78 Colombo St',
                district: 'Kandy',
                city: 'Kandy',
                businessDescription: 'Licensed vehicle carrier and recovery service operating island-wide.',
                registrationNumber: 'BR-20230512',
            },
            services: [
                { name: 'Island-wide Towing', price: 15000 },
                { name: 'Recovery Service', price: 20000 },
            ],
        },
    ];

    for (const p of providers) {
        // Upsert user
        const user = await prisma.user.upsert({
            where: { email: p.email },
            update: {},
            create: {
                email: p.email,
                name: p.name,
                password,
                role: 'PROVIDER',
            },
        });

        // Upsert provider profile
        const profile = await prisma.providerProfile.upsert({
            where: { userId: user.id },
            update: {},
            create: { userId: user.id, ...p.profile },
        });

        // Add services (only if none exist)
        const existing = await prisma.providerService.count({ where: { profileId: profile.id } });
        if (existing === 0) {
            await prisma.providerService.createMany({
                data: p.services.map((s) => ({ ...s, profileId: profile.id })),
            });
        }

        console.log(`✅ Seeded: ${p.profile.businessName}`);
    }
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
