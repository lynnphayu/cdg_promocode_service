const voucherCodes = require("voucher-code-generator");
const { getConnection } = require("typeorm");

exports.generatePromoCode = async () => {
    const promoCodeAndQr = getConnection().getRepository("PurchasedEvoucher");
    var duplicate = true
    while (duplicate) {
        const nums = voucherCodes.generate({
            length: 6,
            count: 1,
            charset: voucherCodes.charset("numbers")
        });
        const chars = voucherCodes.generate({
            length: 5,
            count: 1,
            charset: voucherCodes.charset("alphabetic")
        });
        const count = await promoCodeAndQr.findAndCount({ promoCode: nums + chars })
        if (!count[1]) {
            return nums + chars
        }
    }
}
