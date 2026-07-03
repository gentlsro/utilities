export const datetimeFormats: Record<string, Intl.DateTimeFormatOptions> = {
  default: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
  short: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
  monthShort: {
    month: 'short',
  },
  month: {
    month: 'long',
  },
  year: {
    year: 'numeric',
  },
  yearMonth: {
    year: 'numeric',
    month: 'long',
  },
  dayShort: {
    weekday: 'short',
  },
  day: {
    weekday: 'long',
  },
  time: {
    hour: '2-digit',
    minute: '2-digit',
  },
  long: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
  shortLong: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
  shortLongWithSeconds: {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
  timestamp: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  },
  utc: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  },
  utcShort: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  },
  utcLong: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  },
  utcShortLong: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  },
  utcShortLongWithSeconds: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
  },
  utcMonth: {
    month: '2-digit',
    timeZone: 'UTC',
  },
  utcMonthShort: {
    month: 'short',
    timeZone: 'UTC',
  },
  utcYear: {
    year: 'numeric',
    timeZone: 'UTC',
  },
  utcYearMonth: {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  },
  utcDayShort: {
    weekday: 'short',
    timeZone: 'UTC',
  },
}
