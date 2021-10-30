module.exports = {
    name: "Token",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        auth_token: {
            type: "varchar"
        },
        refresh_token: {
            type: "varchar"
        }
    }
};