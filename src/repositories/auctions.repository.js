const prisma = require('../config/db');

exports.createAuction = async (data) => {
    return prisma.auctions.create({ data });
};

exports.getAllAuctions = async () => {
    return prisma.auctions.findMany();
};

exports.getAuctionById = async (id) => {
    return prisma.auctions.findUnique({ where: { Item_ID: id } });
};

exports.updateAuction = async (id, data) => {
    return prisma.auctions.update({ where: { Item_ID: id }, data });
};

exports.deleteAuction = async (id) => {
    return prisma.auctions.delete({ where: { Item_ID: id } });
};
