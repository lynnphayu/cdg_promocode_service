const { getConnection } = require("typeorm")

exports.createToken = ({
    auth_token, refresh_token
}) => getConnection().getRepository("Token").save({
    auth_token, refresh_token
})

exports.updateToken = (filter, update) => getConnection().getRepository("Token").update(filter, update)

exports.checkExist = (refresh_token) => getConnection().getRepository("Token").findAndCount({ refresh_token })