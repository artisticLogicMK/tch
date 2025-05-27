// server/utils/globalStore.ts
const globalStore: Record<string, any> = {}

export const setGlobalData = (key: string, value: any) => {
  globalStore[key] = value
}

export const getGlobalData = (key: string) => {
  return globalStore[key] || null
}

export const removeGlobalData = (key: string) => {
  delete globalStore[key]
}