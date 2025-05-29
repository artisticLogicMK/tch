import CryptoJS from 'crypto-js'

/*  ? process.env.VITE_CRYPTO_KEY
  : import.meta.env.VITE_CRYPTO_KEY*/
  
const SECRET_KEY = "626300_torchlight_artisticlogic0123"

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