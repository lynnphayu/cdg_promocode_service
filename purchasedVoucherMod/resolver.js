const { Router } = require('express');
const { getPurchasedEvoucherByPhone, getPurchasedEvoucherByEvoucherId, getPurchasedEvoucherByPromocode } = require('./service');

const router = Router();

router.get('/getby_phone/:phone', async (req, res) => {
    const { phone } = req.params;
    getPurchasedEvoucherByPhone(phone).then((e) => res.send(e))
})

router.get('/getby_voucherid/:id', async (req, res) => {
    const { id } = req.params;
    getPurchasedEvoucherByEvoucherId(id).then((e) => res.send(e))
})

router.get('/getby_promocode/:code', async (req, res) => {
    const { code } = req.params;
    getPurchasedEvoucherByPromocode(code).then((e) => res.send(e))
})

module.exports = router;