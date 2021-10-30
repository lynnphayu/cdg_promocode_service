
const jwt = require("jsonwebtoken");

const { getPurchasedEvoucher } = require("./repo")

const getPurchasedEvoucherByPhone = (phone) => getPurchasedEvoucher({ phone })
const getPurchasedEvoucherByEvoucherId = (evoucher) => getPurchasedEvoucher({ evoucher })
const getPurchasedEvoucherByPromocode = (promoCode) => getPurchasedEvoucher({ promoCode })


exports.getPurchasedEvoucherByEvoucherId = getPurchasedEvoucherByEvoucherId
exports.getPurchasedEvoucherByPhone = getPurchasedEvoucherByPhone
exports.getPurchasedEvoucherByPromocode = getPurchasedEvoucherByPromocode