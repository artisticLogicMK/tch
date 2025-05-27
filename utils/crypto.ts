import CryptoJS from 'crypto-js'

const SECRET_KEY = process.server
  ? process.env.VITE_CRYPTO_KEY
  : import.meta.env.VITE_CRYPTO_KEY
  
 // Encryption 
 export function encrypt(text) { 
     const ciphertext = CryptoJS.AES.encrypt(text, SECRET_KEY).toString() 
     return ciphertext 
 } 
  
 // Decryption 
 export function decrypt(ciphertext) { 
     const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY) 
     const decryptedText = bytes.toString(CryptoJS.enc.Utf8) 
     return decryptedText 
 }