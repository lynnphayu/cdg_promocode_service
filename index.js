const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const bQueue = require('bee-queue');
const qr = require('qrcode')
const { initDB } = require('./adapters/db');
const { generatePromoCode } = require('./promocode_mod')
const { generateQr } = require('./qrmod');
const { createPurchasedEvoucher } = require('./purchasedVoucherMod/repo');
const PurchasedEVServiceRouter = require('./purchasedVoucherMod/resolver');
const { generateToken, refreshToken, verifyToken } = require('./tokenmod/service');

require('reflect-metadata');

const queue = new bQueue('evoucher_order_payment_success_pipe', {
	removeOnSuccess: true,
	redis: {
		host: process.env.REDIS_SERVER_ADDR,
		port: process.env.REDIS_SERVER_PORT
	},
});


const app = express();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/auth/generate_token', (req, res) => {
	if (req.body.secret === process.env.AUTHENTICATION_PASSWORD && req.body.identifier) {
		generateToken({ secret: req.body.identifier }).then((e) => res.send(e)).catch((er) => res.status(500).send(er))
	}
	else res.sendStatus(401)
})
app.get('/auth/refresh_token', async (req, res) => {
	if (req.body.refresh_token) {
		try {
			const refreshed = await refreshToken(req.body.refresh_token)
			res.send(refreshed)
		} catch (e) {
			console.log(e)
			res.status(500).send(e)
		}
	} else res.sendStatus(401)
})
app.use('/personal_list', (req, res, next) => {
	const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1]
	try {
		const extract = verifyToken(token)
		if (extract) next()
	} catch (e) {
		console.log(e)
		res.sendStatus(401)
	}
}, PurchasedEVServiceRouter);


initDB().then(() => {
	queue.process((job, done) => {
		const {
			name, phone, evoucher,
		} = job.data;
		if (!phone || !evoucher) {
			done(null, { error: "incomplete request" })
		}
		generatePromoCode().then((promo) => {
			generateQr(process.env.QR_ASSET_ROOTPATH, promo).then((src) => {
				createPurchasedEvoucher({
					name, phone, evoucher, status: "active", qr: src, promoCode: promo
				}).then((e) => done(null, e)).catch(console.log)

			})
		}).catch(console.log)
		// qr.toFile(number + string + ".png", number + string, (err, src) => {
		// 	console.log("JOBBB")
		// 	if (err) done(null, err)
		// 	console.log(err)
		// 	return done(null, src);
		// });

	});
	app.listen(3040, () => console.log('SERVING QR&CODE GENERATOR.'));
})
