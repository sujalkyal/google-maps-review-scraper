const { PrismaClient } = require("@prisma/client");

const PrismaClientSingleton = () => {
    return new PrismaClient();
};

globalThis.prismaGlobal = globalThis.prismaGlobal || PrismaClientSingleton();

const prisma = globalThis.prismaGlobal;

module.exports = prisma;