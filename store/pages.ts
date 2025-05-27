import { defineStore } from 'pinia'

export const usePagesStore = defineStore('pages', {
  state: () => ({
    profilePages: [],
    profilePagesData: {},

    trendPages: [],
    trendPagesData: {},

    forumPages: [],
    forumPagesData: {},

    threadPages: [],
    threadPagesData: {},

    userthreadPages: [],
    userthreadPagesData: {},

    userPostPages: [],
    userPostPagesData: {},

    bkThreadPages: [],
    bkThreadPagesData: {},

    bkPostPages: [],
    bkPostPagesData: {},

    reportPages: [],
    reportPagesData: {},

    usersPages: [],
    usersPagesData: {},

    searchPages: [],
    searchPagesData: {},

    chatPages: [],
    chatPagesData: {},
  }),

  actions: {
    setProfilePage(key, data) {
      if (this.profilePages.length >= 6) {
        const oldestKey = this.profilePages.shift()
        delete this.profilePagesData[oldestKey]
      }
      this.profilePages.push(key)
      this.profilePagesData[key] = data
    },

    setTrendPage(key, data) {
      if (this.trendPages.length >= 3) {
        const oldestKey = this.trendPages.shift()
        delete this.trendPagesData[oldestKey]
      }
      this.trendPages.push(key)
      this.trendPagesData[key] = data
    },

    setForumPage(key, data) {
      if (this.forumPages.length >= 5) {
        const oldestKey = this.forumPages.shift()
        delete this.forumPagesData[oldestKey]
      }
      this.forumPages.push(key)
      this.forumPagesData[key] = data
    },

    removeForumPage(key) {
      this.forumPages = this.forumPages.filter(item => item !== key)
      delete this.forumPagesData[key]
    },

    setThreadPage(key, data) {
      if (this.threadPages.length >= 5) {
        const oldestKey = this.threadPages.shift()
        delete this.threadPagesData[oldestKey]
      }
      this.threadPages.push(key)
      this.threadPagesData[key] = data
    },

    removeThreadPage(key) {
      this.threadPages = this.threadPages.filter(item => item !== key)
      delete this.threadPagesData[key]
    },

    setUserthreadPage(key, data) {
      if (this.userthreadPages.length >= 1) {
        const oldestKey = this.userthreadPages.shift()
        delete this.userthreadPagesData[oldestKey]
      }
      this.userthreadPages.push(key)
      this.userthreadPagesData[key] = data
    },

    setUserPostPage(page, data) {
      if (this.userPostPages.length >= 1) {
        const oldestPage = this.userPostPages.shift()
        delete this.userPostPagesData[oldestPage]
      }
      this.userPostPages.push(page)
      this.userPostPagesData[page] = data
    },

    setBkThreadPage(page, data) {
      if (this.bkThreadPages.length >= 1) {
        const oldestPage = this.bkThreadPages.shift()
        delete this.bkThreadPagesData[oldestPage]
      }
      this.bkThreadPages.push(page)
      this.bkThreadPagesData[page] = data
    },

    setBkPostPage(page, data) {
      if (this.bkPostPages.length >= 1) {
        const oldestPage = this.bkPostPages.shift()
        delete this.bkPostPagesData[oldestPage]
      }
      this.bkPostPages.push(page)
      this.bkPostPagesData[page] = data
    },

    setReportPage(page, data) {
      if (this.reportPages.length >= 1) {
        const oldestPage = this.reportPages.shift()
        delete this.reportPagesData[oldestPage]
      }
      this.reportPages.push(page)
      this.reportPagesData[page] = data
    },

    setUsersPage(page, data) {
      if (this.usersPages.length >= 1) {
        const oldestPage = this.usersPages.shift()
        delete this.usersPagesData[oldestPage]
      }
      this.usersPages.push(page)
      this.usersPagesData[page] = data
    },

    setSearchPage(page, data) {
      if (this.searchPages.length >= 1) {
        const oldestPage = this.searchPages.shift()
        delete this.searchPagesData[oldestPage]
      }
      this.searchPages.push(page)
      this.searchPagesData[page] = data
    },

    setChatPage(key, data) {
      if (this.chatPages.length >= 5) {
        const oldestKey = this.chatPages.shift()
        delete this.chatPagesData[oldestKey]
      }
      this.chatPages.push(key)
      this.chatPagesData[key] = data
    },

    removeChatPage(key) {
      this.chatPages = this.chatPages.filter(item => item !== key)
      delete this.chatPagesData[key]
    }
  }
})