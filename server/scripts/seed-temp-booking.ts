import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const providers = await prisma.user.findMany({
    where: { role: 'PROVIDER' },
    include: { providerProfile: true }
  });

  console.log("Providers found:", providers.map(p => p.email));

  const provider = providers[providers.length - 1]; // Pick the latest one

  if (!provider) {
    throw new Error("No provider found");
  }

  let owner = await prisma.user.findFirst({
    where: { role: 'OWNER' },
    include: { vehicles: true }
  });

  if (!owner) {
    // Create an owner
    owner = await prisma.user.create({
      data: {
        email: "testowner@example.com",
        name: "Test Owner",
        password: "hashedpassword",
        role: "OWNER",
        vehicles: {
          create: {
            make: "Toyota",
            model: "Corolla",
            year: 2020,
            licensePlate: `ABC-${Math.floor(Math.random() * 10000)}`
          }
        }
      },
      include: { vehicles: true }
    });
  }

  if (owner.vehicles.length === 0) {
    await prisma.vehicle.create({
      data: {
        ownerId: owner.id,
        make: "Toyota",
        model: "Corolla",
        year: 2020,
        licensePlate: `ABC-${Math.floor(Math.random() * 10000)}`
      }
    });
    owner = await prisma.user.findUnique({ where: { id: owner.id }, include: { vehicles: true } }) as any;
  }

  const service = await prisma.providerService.findFirst({
    where: { profileId: provider.providerProfile?.id }
  });

  // Create one booking for tomorrow 11 AM, ACCEPTED
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const booking = await prisma.booking.create({
    data: {
        vehicleId: owner!.vehicles[0].id,
        providerId: provider.id,
        serviceId: service?.id,
        timeSlot: "04:00 PM",
        description: "Test pending booking request",
        serviceDate: tomorrow, 
        status: BookingStatus.PENDING
    }
  });

  console.log("Success! Created booking:", booking.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
