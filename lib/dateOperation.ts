import moment from 'moment-timezone'

export const dateUtc = (date) => {
  const localDate = moment(date, "YYYY-MM-DD")
  const utcDate = localDate.utc()
  return utcDate
}