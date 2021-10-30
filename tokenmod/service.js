const jwt = require('jsonwebtoken')
const { getConnection } = require("typeorm");
const { createToken, updateToken, checkExist } = require('./repo');

exports.verifyToken = (token) => {
    // To add additional security concern like verify and extract some valid informations or throw error
    return jwt.verify(token, process.env.JWT_SECRET,)
};

exports.generateToken = async (info) => {
    const auth_token = await jwt.sign(info, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
    const refresh_token = await jwt.sign(info, process.env.JWT_SECRET)
    const token = await createToken({ auth_token, refresh_token })
    return token
}

exports.refreshToken = async (refresh_token) => {
    try {
        const [currentToken, count] = await checkExist(refresh_token)
        if (count < 1) {
            throw new Error("Invalid refresh token")
        }
        const info = this.verifyToken(currentToken[0].auth_token)

        const auth_token = jwt.sign({ secret: info.secret }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
        await updateToken({ refresh_token }, { auth_token })
        return {
            auth_token, refresh_token
        }
    } catch (e) {
        throw e
    }
}
