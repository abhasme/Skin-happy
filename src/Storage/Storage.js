import { data_decrypt, data_encrypt } from './crypto'
export class Storage {
    static set(key, value) {
        localStorage.setItem(key, data_encrypt(value))
    }

    static get(key) {

        let item = localStorage.getItem(key)
        if (item) {
            return data_decrypt(item)
        } else {
            return false
        }
    }
    static remove(key) {
        localStorage.removeItem(key)
        if (key === 'user-token') {
            window.location.href = "/login";
        }
    }

}