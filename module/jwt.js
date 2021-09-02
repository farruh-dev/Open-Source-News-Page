const { sign, verify } = require('jsonwebtoken')

require('dotenv').config()

module.exports.createToken = (data) =>{
    return sign(data, process.env.SECRET_WORD)
}

module.exports.checkToken = (token) =>{
    try {
        return verify(token, process.env.SECRET_WORD)
    } catch (error) {
        return false
    }
}
