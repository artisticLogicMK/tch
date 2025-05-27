const urlSlug = (value) => {
  return value.replace(/ /g, '_') // replace spaces first
  .replace(/[^a-zA-Z0-9_-]/g, '')  // remove anything not URL-safe
  .toLowerCase()
}

export default urlSlug