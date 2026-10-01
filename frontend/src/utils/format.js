/** Formats an API timestamp in the viewer's local time. */
export function formatDateTime(value) {
  if (!value) return ''
  // Treat timestamps without an explicit timezone as UTC.
  const iso = /[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

/** "Tomato_Early_blight" -> "Tomato early blight" */
export function prettyClass(name = '') {
  const s = name.replaceAll('_', ' ').trim()
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

export const percent = (v) => `${Math.round((v || 0) * 100)}%`
