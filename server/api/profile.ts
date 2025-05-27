export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  console.log(event.context.user)

  return { success: true, user: event.context.user }
})