module.exports = {
    name: "PurchasedEvoucher",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        phone: {
            type: "varchar"
        },
        name: {
            type: "varchar"
        },
        status: {
            type: "varchar"
        },
        qr: {
            type: "varchar"
        },
        evoucher: {
            type: "varchar"
        },
        promoCode: {
            type: "varchar"
        },
    }
};