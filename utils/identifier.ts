import { randomUUID } from "crypto"

const getUserIdentifier = (event) => {

  // Check if anonymous ID is stored in cookies
  let anonId = getCookie(event, "anon_id")

  if (!anonId) return null

  return anonId
}

export default getUserIdentifier