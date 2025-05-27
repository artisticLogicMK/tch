const isOnline = (lastActivity) => {
  const now = Math.floor(Date.now() / 1000)
  const tenMins = 10 * 60
  return lastActivity >= (now - tenMins)
}

export default isOnline