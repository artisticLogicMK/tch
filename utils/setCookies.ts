import { encrypt } from '~/utils/crypto'

const setCookies = (event, name, data) => {
  const encryptedData = encrypt(JSON.stringify(data))
  
  // Define cookie options
  const cookieOptions = {
    path: '/',
    maxAge: 60 * 60 * 24 * 14, // 14 days in seconds
    expires: new Date(Date.now() + 60 * 60 * 24 * 14 * 1000), // Explicit expiration date
  }
  
  // Set cookies
  setCookie(event, name, encryptedData, cookieOptions)
}

export default setCookies