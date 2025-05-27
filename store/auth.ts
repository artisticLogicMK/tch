import { defineStore } from 'pinia'
import { useCookie } from '#app'
import { decrypt } from '~/utils/crypto' // Import decryption helper

export const useAuthStore = defineStore('auth', {
  state: () => {
    const tokenCookie = useCookie('token')
    const userCookie = useCookie('user')

    return {
      token: tokenCookie.value ? decrypt(tokenCookie.value) : null, // Decrypt token
      user: userCookie.value ? JSON.parse(decrypt(userCookie.value)) : null, // Decrypt and parse user data
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setToken(token) {
      /*const encryptedToken = encrypt(token)
      const tokenCookie = useCookie('token')
      tokenCookie.value = encryptedToken*/
      this.token = token
    },
    setTokenState(token) {
      this.token = token
    },
    setUser(user) {
      /*const encryptedUser = encrypt(JSON.stringify(user))
      const userCookie = useCookie('user')
      userCookie.value = encryptedUser*/
      this.user = user
    },
    setUserState(user) {
      this.user = user
    },
    logout() {
      const tokenCookie = useCookie('token')
      const userCookie = useCookie('user')
      tokenCookie.value = null
      userCookie.value = null
      this.token = null
      this.user = null
    },
  },
})