const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.blogPost.findFirst().then(console.log).finally(() => prisma.$disconnect());
