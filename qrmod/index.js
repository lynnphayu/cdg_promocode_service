const qr = require('qrcode')

exports.generateQr = (path, token) => new Promise(
    (resolve, reject) => qr.toFile(path + token + '.png', token, (err) => {
        if (err) reject(err)
        resolve(path + token + '.png')
    }))