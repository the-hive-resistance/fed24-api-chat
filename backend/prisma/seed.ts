import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	// Here be all your seeds 🌱
	await prisma.room.upsert({
		where: {
			name: "Private",
		},
		update: {},
		create: {
			name: "Private",
		},
	});

	await prisma.room.upsert({
		where: {
			name: "General",
		},
		update: {},
		create: {
			name: "General",
		},
	});

	await prisma.room.upsert({
		where: {
			name: "Major",
		},
		update: {},
		create: {
			name: "Major",
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e: unknown) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
