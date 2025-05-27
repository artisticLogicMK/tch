import { decrypt } from '~/utils/crypto'

const getCookies = (event, name) => {
  return new Promise((resolve, reject) => {
    try {
      const cookie = getCookie(event, name) // Get the cookie value

      if (!cookie) {
        return reject(createError({ statusCode: 401, message: 'Unauthorized!' }))
      }

      const decryptedValue = decrypt(cookie); // Decrypt the cookie
      resolve(decryptedValue) // Resolve with the decrypted value
    } catch (error) {
      reject(error) // Reject the Promise if an error occurs
    }
  })
}

export default getCookies