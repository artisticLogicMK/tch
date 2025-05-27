import moment from "moment-timezone"
import { defineNuxtPlugin } from "#app"
import { useGlobalStore } from '~/store/globals'

export default defineNuxtPlugin((nuxtApp) => {
  
  const getUserTimezone = () => {
    //return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
    const store = useGlobalStore()
    return store.timezone || "UTC"
  }
  
  const getRelativeTime = (time, long = false) => {
    if (!time) return "Invalid time"
    
    const userTimezone = getUserTimezone()
    const now = moment()
    const targetTime = moment.tz(time, userTimezone)
    const diffInSeconds = now.diff(targetTime, "seconds")

    if (diffInSeconds < 60) return "now" // Less than a minute
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m` // Minutes
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h` // Hours
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d` // Days
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w` // Weeks
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mt` // Months
    return `${Math.floor(diffInSeconds / 31536000)}y` // Years
  }

  return {
    provide: {
      formatTime: (time: string) => {
        if (!time) return "Invalid time"
        
        const userTimezone = getUserTimezone()
        const formattedTime = moment.tz(time, userTimezone).format("D MMM, YYYY, hh:mm a")
        const relativeTime = getRelativeTime(time)

        return `${formattedTime} | ${relativeTime}`
      },
      
      formatTimeNoRelative: (time: string) => {
        if (!time) return "Invalid time"
        
        const userTimezone = getUserTimezone()
        const formattedTime = moment.tz(time, userTimezone).format("D MMM, YYYY, hh:mm a")

        return `${formattedTime}`
      },
      
      formatTimeSimpleNoTZ: (time: string) => {
        if (!time) return "Invalid time"
        return moment.tz(time, "UTC").format("D MMM, YYYY")
      },
      
      formatTimeNoTZ: (time: string) => {
        if (!time) return "Invalid time"

        const formattedTime = moment.tz(time, "UTC").format("D MMM, YYYY, hh:mm a")
        const relativeTime = getRelativeTime(time)

        return `${formattedTime} | ${relativeTime}`
      },
      
      convertTime(seconds) {
        const year = Math.floor(seconds / (365 * 24 * 3600))
        seconds %= (365 * 24 * 3600)
        const month = Math.floor(seconds / (30 * 24 * 3600))
        seconds %= (30 * 24 * 3600)
        const week = Math.floor(seconds / (7 * 24 * 3600))
        seconds %= (7 * 24 * 3600)
        const day = Math.floor(seconds / (24 * 3600))
        seconds %= (24 * 3600)
        const hour = Math.floor(seconds / 3600)
        seconds %= 3600
        const minute = Math.floor(seconds / 60)
    
        let result = []
        if (year > 0) result.push(`${year} Years`)
        if (month > 0) result.push(`${month} Months`)
        if (week > 0) result.push(`${week} Weeks`)
        if (day > 0) result.push(`${day} Days`)
        if (hour > 0) result.push(`${hour} Hours`)
        if (minute > 0) result.push(`${minute} Minutes`)
    
        return result.join(', ')
      },
      
      getRelative: (time) => {
        if (!time) return "Invalid time"
    
        const userTimezone = getUserTimezone()
        const now = moment()
        const targetTime = moment.tz(time, userTimezone)
        const diffInSeconds = now.diff(targetTime, "seconds")

        if (diffInSeconds < 60) return "now" // Less than a minute
        
        return targetTime.fromNow()
      },
      
      getRelativeShort: (time: string) => {
        if (!time) return "Invalid time"

        const relativeTime = getRelativeTime(time)

        return `${relativeTime}`
      },
    },
  }
})