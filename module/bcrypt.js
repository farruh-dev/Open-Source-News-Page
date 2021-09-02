const bcrypt = require('bcrypt')

module.exports.createCrypt = async (word) => {
    const salt = await bcrypt.genSalt(10)

    return await bcrypt.hash(word, salt)
}
module.exports.compareCrypt = async (crypt, word) => {
    return await bcrypt.compare(word, crypt)
}