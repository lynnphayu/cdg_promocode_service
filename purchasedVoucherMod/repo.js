const { getConnection } = require("typeorm");

exports.createPurchasedEvoucher = ({
    name, phone, evoucher, status, qr, promoCode
}) => {
    const voucherRepo = getConnection().getRepository("PurchasedEvoucher");
    return voucherRepo.save({ name, phone, evoucher, status, qr, promoCode })
}

exports.getPurchasedEvoucher = (filter) => {
    const voucherRepo = getConnection().getRepository("PurchasedEvoucher");
    return voucherRepo.find(filter)
}