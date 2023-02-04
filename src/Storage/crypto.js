const AES = require('crypto-js/aes');
const ENC = require('crypto-js/enc-utf8');
const SECRET_KEY = 'SkinHappy'
export const data_encrypt = (text) => {
    const encrypted = AES.encrypt(JSON.stringify(text), SECRET_KEY)
    return encrypted.toString()
}

export const data_decrypt = (text) => {
    let decryptedStr = null
    if (text) {
        decryptedStr = AES.decrypt(text, SECRET_KEY).toString(ENC)
    }
    try {
        return JSON.parse(decryptedStr)
    } catch (error) {
        return null
    }
}